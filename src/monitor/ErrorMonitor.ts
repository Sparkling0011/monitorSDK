import { hookMethod } from "../utils/index";
import { configInit, handleError } from "../sender/error";
import {
  formatFetchError,
  formatLoadError,
  formatPromiseError,
  formatRuntimerError,
  formatXHRError,
} from "../builder/errorBuilder";
import { JS_TRACKER_ERROR_DISPLAY_MAP } from "../constants/index";
import { debugLogger, detailAdapter, log } from "../sender/index";
import {
  ERROR_FETCH,
  ERROR_XHR,
  ERROR_AUDIO,
  ERROR_IMAGE,
  ERROR_SCRIPT,
  ERROR_STYLE,
} from "../constants/index";

type payloadType = RequestInit & ResponseInit & { url: string };

export function report(errorLogList = []) {
  for (let errorLog of errorLogList) {
    const { type, desc, stack, payload } = errorLog;

    let errorName = JS_TRACKER_ERROR_DISPLAY_MAP[type];

    let location = window.location;
    debugLogger("[自动]捕捉到页面错误, 发送打点数据, 上报内容 => ", {
      error_no: errorName,
      url: `${location.host}${location.pathname}`,
      desc,
      stack,
    });

    if (type === ERROR_FETCH || type === ERROR_XHR) {
      log("error", 1, {
        ...(payload || {}),
        error_no: errorName,
        url: `${location.host}${location.pathname}`,
      });
    } else if (
      type === ERROR_AUDIO ||
      type === ERROR_IMAGE ||
      type === ERROR_SCRIPT ||
      type === ERROR_STYLE
    ) {
      log(
        "error",
        2,
        {
          ...desc,
          error_name: errorName,
          url: `${location.host}${location.pathname}`,
        },
        {}
      );
    } else {
      log(
        "error",
        3,
        {
          error_no: errorName,
          url: `${location.host}${location.pathname}`,
        },
        {
          // ...(payload || {}),
          desc,
          stack,
        }
      );
    }
  }
}
const opts = {
  concat: true,
  report: report,
};

export function InjectErrorMonitor() {
  function start() {
    configInit(opts);
    //JavaScript运行时错误
    window.addEventListener("error", (e) => {
      // 只有 error 属性不为空的 ErrorEvent 才是一个合法的 js 错误
      if (e.error) {
        let { message, filename, lineno, colno, error } = e;
        handleError(
          formatRuntimerError(message, filename, lineno, colno, error)
        );
      }
    });
    //Promise错误
    window.addEventListener("unhandledrejection", (e) => {
      handleError(formatPromiseError(e));
    });

    //资源加载错误
    window.addEventListener(
      "error",
      (e) => {
        let target = e.target || e.srcElement;
        let isElementTarget = target instanceof HTMLElement;
        if (!isElementTarget) return false;
        handleError(formatLoadError(target));
      },
      true
    );

    //网络请求错误
    //XHR ERROR
    hookMethod(
      XMLHttpRequest.prototype,
      "open",
      (origin: Function) =>
        function (method: string, url: string) {
          this.payload = {
            method,
            url,
          };
          origin.apply(this, [method, url]);
        }
    )();

    hookMethod(
      XMLHttpRequest.prototype,
      "send",
      (origin: Function) =>
        function (...params: any[]) {
          this.addEventListener("readystatechange", () => {
            this.payload.status = this.status;
            handleError(formatXHRError(this.payload));
          });
          origin.apply(this, params);
        }
    )();

    //fetch ERROR
    hookMethod(
      window,
      "fetch",
      (origin: Function) =>
        function (input: RequestInfo, init?: RequestInit): Promise<Response> {
          const url =
            typeof input === "string" ? input : input.url || "Unknown URL";
          const method = (init && init.method) || "GET";
          const payload: payloadType = {
            method,
            url,
            headers: (init && init.headers) || {},
            body: (init && init.body) || "",
          };
          return origin
            .apply(this, [input, init])
            .then((response: Response) => {
              if (!response.ok) {
                payload.status = response.status;
                payload.statusText = response.statusText;
                handleError(formatFetchError(payload));
              }
              return response;
            })
            .catch((error: any) => {
              payload.status = 0;
              payload.statusText = error.message;
              handleError(formatFetchError(payload));
              throw error;
            });
        }
    )();
  }
  return { start };
}

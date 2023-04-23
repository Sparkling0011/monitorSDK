import { configManager } from "../ConfigManager/index";
import rule from "./rule";

/**
 *
 * @param {类型} type
 * @param {code码} code
 * @param {消费数据} detail
 * @param {展示数据} extra
 */
export const log = (type = "", code, detail = {}, extra = {}) => {
  let config = configManager.getConfig();

  // 调用自定义函数, 计算pageType
  let getPageTypeFunc = config.getPageType;
  let location = window.location;
  let pageType = location.href;
  try {
    pageType = "" + getPageTypeFunc(location);
  } catch (e) {
    debugLogger(`config.getPageType执行时发生异常, 请注意, 错误信息=>`, {
      e,
      location,
    });
    pageType = `${location.host}${location.pathname}`;
  }

  const logInfo = {
    type,
    code,
    detail,
    extra: extra,
    common: {
      ...config,
      timestamp: Date.now(),
      page_type: pageType,
    },
  };
  // 上报数据
  let path;
  if (type === "error") {
    path = "/error";
  } else if (type === "perf") {
    path = "/perf";
  }
  try {
    const img = new Image();
    if (config.is_test) config.url = "http://localhost:8000/api/log";
    img.src = ""
      .concat(config.url + path, "?d=")
      .concat(encodeURIComponent(JSON.stringify(logInfo)));
  } catch (e) {
    console.log(e);
  }
  // navigator.sendBeacon(config.url + "/error", JSON.stringify(logInfo));
};

export function debugLogger(...arg) {
  let config = configManager.getConfig();
  // 只有在测试时才打印log
  if (config.is_test) {
    console.info(...arg);
  }
}

log.product = (code, detail, extra?) => {
  log("product", code, detail, extra);
};

export const detailAdapter = (code, detail = {}) => {
  const dbDetail = {
    error_no: "",
    http_code: "",
    during_ms: "",
    url: "",
    request_size_b: "",
    response_size_b: "",
  };
  // 查找rule
  const ruleItem = rule[code];
  if (ruleItem) {
    const d = { ...dbDetail };
    const fields = Object.keys(detail);
    fields.forEach((field) => {
      const transferField = ruleItem.dft[field];
      // 需要字段转换
      if (transferField) {
        // 需要字段转换
        d[transferField] = detail[field];
        delete detail[field];
      } else {
        d[field] = detail[field];
      }
    });
    return d;
  } else {
    return detail;
  }
};

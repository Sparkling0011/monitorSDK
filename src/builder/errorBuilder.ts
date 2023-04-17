import {
  ERROR_FETCH,
  ERROR_RUNTIME,
  ERROR_TRY_CATCH,
  ERROR_XHR,
  LOAD_ERROR_TYPE,
} from "../constants";

/**
 * 生成 runtime 错误日志
 *
 * @param  {String} message 错误信息
 * @param  {String} source  发生错误的脚本 URL
 * @param  {Number} lineno  发生错误的行号
 * @param  {Number} colno   发生错误的列号
 * @param  {Object} error   error 对象
 * @return {Object}
 */
export function formatRuntimerError(
  message: string,
  source: string,
  lineno: number,
  colno: number,
  error: Error
) {
  return {
    type: ERROR_RUNTIME,
    desc: message + " at " + source + ":" + lineno + ":" + colno,
    stack: error && error.stack ? error.stack : "no stack", // IE <9, has no error stack
  };
}

/**
 * 生成 laod 错误日志
 *
 * @param  {Object} errorTarget
 * @return {Object}
 */
export function formatLoadError(errorTarget) {
  return {
    type: LOAD_ERROR_TYPE[errorTarget.nodeName.toUpperCase()],
    desc: errorTarget.baseURI + "@" + (errorTarget.src || errorTarget.href),
    stack: "no stack",
  };
}

export function formatPromiseError(event) {
  return {
    // type: event.type,
    type: ERROR_RUNTIME,
    desc: event.reason,
    stack: "no stack",
  };
}

// body: "",
//     headers: {},
//     method: "GET",
//     status: 0,
//     statusText: "Failed to fetch",
//     url: "http://non-existing-url.com",
export function formatFetchError(payload) {
  return {
    type: ERROR_FETCH,
    payload,
  };
}

// method: "GET",
// status: 0,
// url: "https://example.com/api/data",
export function formatXHRError(payload) {
  return {
    type: ERROR_XHR,
    payload,
  };
}

/**
 * 生成 try..catch 错误日志
 *
 * @param  {Object} error error 对象
 * @return {Object} 格式化后的对象
 */
export function formatTryCatchError(error: Error) {
  return {
    type: ERROR_TRY_CATCH,
    desc: error.message,
    stack: error.stack,
  };
}

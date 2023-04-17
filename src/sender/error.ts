import { errorConfig as config } from "../ConfigManager";
import { debounce, merge } from "../utils";

const { maxError, sampling, concat } = config;

// 错误日志列表
export let errorList = [];

let report;

export function configInit(opts) {
  merge(opts, config);

  report = debounce(config.report, config.delay, function () {
    errorList = [];
  });
}

/**
 * 往异常信息数组里面添加一条记录
 *
 * @param  {Object} errorLog 错误日志
 */
function pushError(errorLog) {
  if (needReport(sampling) && errorList.length < maxError) {
    errorList.push(errorLog);
  }
}

export function handleError(errorLog) {
  //是否延时处理
  if (!concat) {
    !needReport(sampling) || config.report([errorLog]);
  } else {
    pushError(errorLog);
    report(errorList);
  }
}

/**
 * 设置一个采样率，决定是否上报
 *
 * @param  {Number} sampling 0 - 1
 * @return {Boolean}
 */
function needReport(sampling: number) {
  return Math.random() < (sampling || 1);
}

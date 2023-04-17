import { debugLogger, log } from "../sender";

export function InjectPerfMonitor() {
  function start() {
    //检查perfemance是否兼容
    const performance = window.performance;
    if (!performance) {
      // 当前浏览器不支持
      console.log("你的浏览器不支持 performance 接口");
      return;
    }
    let times = performance.getEntriesByType("navigation")[0].toJSON();

    debugLogger("发送页面性能指标数据, 上报内容 => ", {
      ...times,
      url: `${window.location.host}${window.location.pathname}`,
    });

    log("perf", 4, {
      ...times,
      url: `${window.location.host}${window.location.pathname}`,
    });
  }
  return { start };
}

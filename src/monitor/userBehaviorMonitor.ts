import { debugLogger, log } from "../sender";

// 用户在线时长统计
const OFFLINE_MILL = 15 * 60 * 1000; // 15分钟不操作认为不在线
const SEND_MILL = 5 * 1000; // 每5s打点一次

let lastTime = Date.now();

export function InjectUserBehaviorMonitor() {
  function start() {
    // 用户在线时长统计
    window.addEventListener("click", () => {
      const now = Date.now();
      const duration = now - lastTime;
      if (duration > OFFLINE_MILL) {
        lastTime = Date.now();
      } else if (duration > SEND_MILL) {
        lastTime = Date.now();
        debugLogger("发送用户留存时间埋点, 埋点内容 => ", {
          duration_ms: duration,
        });
        // 用户在线时长
        log.product(10001, { duration_ms: duration });
      }
    });
  }
  return { start };
}

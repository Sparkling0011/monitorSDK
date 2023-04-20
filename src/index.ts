import type { monitorType } from "./monitor/type";
import {
  InjectErrorMonitor,
  InjectUserBehaviorMonitor,
  InjectPerfMonitor,
} from "./monitor";
import { UserConfig, ConfigManger } from "./ConfigManager/type";
import { configManager } from "./ConfigManager";

function createSDK(configManager: ConfigManger) {
  const monitors: Array<monitorType> = [InjectErrorMonitor()];

  function init(userConfig: UserConfig) {
    configManager.mergeConfig(userConfig);
    let config = configManager.getConfig();

    if (config.pid) {
      console.log(config);
      if (config.enablePerformance) monitors.push(InjectPerfMonitor());
      if (config.enableBehavior) monitors.push(InjectUserBehaviorMonitor());
      monitors.forEach((monitor) => monitor.start());
    } else {
      console.log("请输入必要的配置pid");
    }
  }
  return {
    init,
  };
}

const SDK = createSDK(configManager);

export default SDK;

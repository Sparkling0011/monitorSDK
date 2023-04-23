import {
  Config,
  ConfigManger,
  ErrorConfig,
  InitConfig,
  UserConfig,
} from "./type";

export const initConfig: InitConfig = {
  url: "http://www.nebulanimble.site:8000/api/log",
};

export const errorConfig: ErrorConfig = {
  concat: true,
  delay: 2000, // 错误处理间隔时间
  maxError: 16, // 异常报错数量限制
  sampling: 1, // 采样率
};

let config: Config = {
  ...initConfig,
  pid: undefined,
  is_test: true,
  getPageType: (location = window.location) => {
    return `${location.host}${location.pathname}`;
  },
};

export function createConfigManager() {
  function mergeConfig(userConfig: UserConfig) {
    config = { ...config, ...userConfig };
  }

  function getConfig() {
    return config;
  }

  return {
    mergeConfig,
    getConfig,
  };
}

export const configManager: ConfigManger = createConfigManager();

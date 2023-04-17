export interface InitConfig {
  url: string;
}

export interface ErrorConfig {
  concat?: boolean;
  delay: number; // 错误处理间隔时间
  maxError: number; // 异常报错数量限制
  sampling: number; // 采样率
  report?: (errorList: any[]) => void;
}

export interface UserConfig {
  pid: string;
  is_test?: boolean;
  getPageType?: (location: Location) => string;
  enableBehavior?: boolean;
  enablePerformance?: boolean;
}

export type Config = InitConfig & UserConfig;

export type ConfigManger = {
  mergeConfig: (config: UserConfig) => void;
  getConfig: () => Config;
};

export interface UserConfig {
  pid: string;
  is_test?: boolean;
  getPageType?: (location: Location) => string;
  enableBehavior?: boolean;
  enablePerformance?: boolean;
}

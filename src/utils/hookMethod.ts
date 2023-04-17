export function hookMethod(obj: any, key: string, hookFunc: Function) {
  return (...params: any[]) => {
    obj[key] = hookFunc(obj[key], ...params);
  };
}

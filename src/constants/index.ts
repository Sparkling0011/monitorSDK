export const ERROR_RUNTIME = 1;

export const ERROR_SCRIPT = 2;
export const ERROR_STYLE = 3;
export const ERROR_IMAGE = 4;
export const ERROR_AUDIO = 5;
export const ERROR_VIDEO = 6;

export const ERROR_CONSOLE = 7;
export const ERROR_TRY_CATCH = 8;
export const ERROR_FETCH = 9;
export const ERROR_XHR = 10;

export enum LOAD_ERROR_TYPE {
  SCRIPT = ERROR_SCRIPT,
  LINK = ERROR_STYLE,
  IMG = ERROR_IMAGE,
  AUDIO = ERROR_AUDIO,
  VIDEO = ERROR_VIDEO,
}

export const JS_TRACKER_ERROR_CONSTANT_MAP: Record<number, string> = {
  1: "ERROR_RUNTIME",
  2: "ERROR_SCRIPT",
  3: "ERROR_STYLE",
  4: "ERROR_IMAGE",
  5: "ERROR_AUDIO",
  6: "ERROR_VIDEO",
  7: "ERROR_CONSOLE",
  8: "ERROR_TRY_CATCH",
  9: "ERROR_FETCH",
  10: "ERROR_XHR",
};

export const JS_TRACKER_ERROR_DISPLAY_MAP: Record<number, string> = {
  1: "JS_RUNTIME_ERROR",
  2: "SCRIPT_LOAD_ERROR",
  3: "CSS_LOAD_ERROR",
  4: "IMAGE_LOAD_ERROR",
  5: "AUDIO_LOAD_ERROR",
  6: "VIDEO_LOAD_ERROR",
  7: "CONSOLE_ERROR",
  8: "TRY_CATCH_ERROR",
  9: "ERROR_FETCH",
  10: "ERROR_XHR",
};

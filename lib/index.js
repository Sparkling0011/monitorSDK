function hookMethod(obj, key, hookFunc) {
    return (...params) => {
        obj[key] = hookFunc(obj[key], ...params);
    };
}

/**
 * merge
 *
 * @param  {Object} src
 * @param  {Object} dest
 * @return {Object}
 */
function merge(src, dest) {
    for (var item in src) {
        dest[item] = src[item];
    }
    return dest;
}
/**
 * debounce
 *
 * @param {Function} func 实际要执行的函数
 * @param {Number} delay 延迟时间，单位是 ms
 * @param {Function} callback 在 func 执行后的回调
 *
 * @return {Function}
 */
function debounce(func, delay, callback) {
    var timer;
    return function () {
        var context = this;
        var args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            func.apply(context, args);
            !callback || callback();
        }, delay);
    };
}

const initConfig = {
    url: "http://www.nebulanimble.site:8000/api/log",
};
const errorConfig = {
    concat: true,
    delay: 2000,
    maxError: 16,
    sampling: 1, // 采样率
};
let config = {
    ...initConfig,
    pid: undefined,
    is_test: true,
    getPageType: (location = window.location) => {
        return `${location.host}${location.pathname}`;
    },
};
function createConfigManager() {
    function mergeConfig(userConfig) {
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
const configManager = createConfigManager();

const { maxError, sampling, concat } = errorConfig;
// 错误日志列表
let errorList = [];
let report$1;
function configInit(opts) {
    merge(opts, errorConfig);
    report$1 = debounce(errorConfig.report, errorConfig.delay, function () {
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
function handleError(errorLog) {
    //是否延时处理
    if (!concat) {
        !needReport(sampling) || errorConfig.report([errorLog]);
    }
    else {
        pushError(errorLog);
        report$1(errorList);
    }
}
/**
 * 设置一个采样率，决定是否上报
 *
 * @param  {Number} sampling 0 - 1
 * @return {Boolean}
 */
function needReport(sampling) {
    return Math.random() < (sampling || 1);
}

const ERROR_RUNTIME = 1;
const ERROR_SCRIPT = 2;
const ERROR_STYLE = 3;
const ERROR_IMAGE = 4;
const ERROR_AUDIO = 5;
const ERROR_VIDEO = 6;
const ERROR_FETCH = 9;
const ERROR_XHR = 10;
var LOAD_ERROR_TYPE;
(function (LOAD_ERROR_TYPE) {
    LOAD_ERROR_TYPE[LOAD_ERROR_TYPE["SCRIPT"] = ERROR_SCRIPT] = "SCRIPT";
    LOAD_ERROR_TYPE[LOAD_ERROR_TYPE["LINK"] = ERROR_STYLE] = "LINK";
    LOAD_ERROR_TYPE[LOAD_ERROR_TYPE["IMG"] = ERROR_IMAGE] = "IMG";
    LOAD_ERROR_TYPE[LOAD_ERROR_TYPE["AUDIO"] = ERROR_AUDIO] = "AUDIO";
    LOAD_ERROR_TYPE[LOAD_ERROR_TYPE["VIDEO"] = ERROR_VIDEO] = "VIDEO";
})(LOAD_ERROR_TYPE || (LOAD_ERROR_TYPE = {}));
const JS_TRACKER_ERROR_DISPLAY_MAP = {
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
function formatRuntimerError(message, source, lineno, colno, error) {
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
function formatLoadError(errorTarget) {
    return {
        type: LOAD_ERROR_TYPE[errorTarget.nodeName.toUpperCase()],
        desc: {
            baseURI: errorTarget.baseURI,
            url: errorTarget.src,
            statusCode: errorTarget.naturalWidth === 0 ? 404 : 200, // 判断资源是否存在
        },
    };
}
function formatPromiseError(event) {
    return {
        // type: event.type,
        type: ERROR_RUNTIME,
        desc: event.reason.message,
        stack: event.reason.stack,
    };
}
// body: "",
//     headers: {},
//     method: "GET",
//     status: 0,
//     statusText: "Failed to fetch",
//     url: "http://non-existing-url.com",
function formatFetchError(payload) {
    return {
        type: ERROR_FETCH,
        payload,
    };
}
// method: "GET",
// status: 0,
// url: "https://example.com/api/data",
function formatXHRError(payload) {
    return {
        type: ERROR_XHR,
        payload,
    };
}

// df detail field
// ef extra field
// dft detail field transfer dbfield
const CODE_DETAIL_RULE = [];
CODE_DETAIL_RULE[1] = {
    df: ["url", "http_code", "during_ms", "size"],
    ef: ["params", "response"],
    dft: {
        size: "response_size_b",
    },
};
CODE_DETAIL_RULE[2] = {
    df: ["url"],
    ef: ["params", "response"],
    dft: {},
};
CODE_DETAIL_RULE[3] = {
    df: ["url", "reason"],
    ef: ["code"],
    dft: {
        reason: "error_no",
    },
};
CODE_DETAIL_RULE[4] = {
    df: ["step"],
    ef: ["desc"],
    dft: {
        step: "error_no",
    },
};
CODE_DETAIL_RULE[5] = {
    df: ["url", "step"],
    ef: ["params"],
    dft: {
        step: "error_no",
    },
};
CODE_DETAIL_RULE[8] = {
    df: [],
    dft: {
        error_name: "error_no",
        http_code: "http_code",
        during_ms: "during_ms",
        url: "url",
        request_size_b: "request_size_b",
        response_size_b: "response_size_b", // 响应值体积, 单位b
    }, //选填字段
};

/**
 *
 * @param {类型} type
 * @param {code码} code
 * @param {消费数据} detail
 * @param {展示数据} extra
 */
const log = (type = "", code, detail = {}, extra = {}) => {
    let config = configManager.getConfig();
    // 调用自定义函数, 计算pageType
    let getPageTypeFunc = config.getPageType;
    let location = window.location;
    let pageType = location.href;
    try {
        pageType = "" + getPageTypeFunc(location);
    }
    catch (e) {
        debugLogger(`config.getPageType执行时发生异常, 请注意, 错误信息=>`, {
            e,
            location,
        });
        pageType = `${location.host}${location.pathname}`;
    }
    const logInfo = {
        type,
        code,
        detail,
        extra: extra,
        common: {
            ...config,
            timestamp: Date.now(),
            page_type: pageType,
        },
    };
    // 上报数据
    let path;
    if (type === "error") {
        path = "/error";
    }
    else if (type === "perf") {
        path = "/perf";
    }
    try {
        const img = new Image();
        if (config.is_test)
            config.url = "http://localhost:8000/api/log";
        img.src = ""
            .concat(config.url + path, "?d=")
            .concat(encodeURIComponent(JSON.stringify(logInfo)));
    }
    catch (e) {
        console.log(e);
    }
    // navigator.sendBeacon(config.url + "/error", JSON.stringify(logInfo));
};
function debugLogger(...arg) {
    let config = configManager.getConfig();
    // 只有在测试时才打印log
    if (config.is_test) {
        console.info(...arg);
    }
}
log.product = (code, detail, extra) => {
    log("product", code, detail, extra);
};
const detailAdapter = (code, detail = {}) => {
    const dbDetail = {
        error_no: "",
        http_code: "",
        during_ms: "",
        url: "",
        request_size_b: "",
        response_size_b: "",
    };
    // 查找rule
    const ruleItem = CODE_DETAIL_RULE[code];
    if (ruleItem) {
        const d = { ...dbDetail };
        const fields = Object.keys(detail);
        fields.forEach((field) => {
            const transferField = ruleItem.dft[field];
            // 需要字段转换
            if (transferField) {
                // 需要字段转换
                d[transferField] = detail[field];
                delete detail[field];
            }
            else {
                d[field] = detail[field];
            }
        });
        return d;
    }
    else {
        return detail;
    }
};

function report(errorLogList = []) {
    for (let errorLog of errorLogList) {
        const { type, desc, stack, payload } = errorLog;
        let errorName = JS_TRACKER_ERROR_DISPLAY_MAP[type];
        let location = window.location;
        debugLogger("[自动]捕捉到页面错误, 发送打点数据, 上报内容 => ", {
            error_no: errorName,
            url: `${location.host}${location.pathname}`,
            desc,
            stack,
        });
        if (type === ERROR_FETCH || type === ERROR_XHR) {
            log("error", 1, {
                ...(payload || {}),
                error_no: errorName,
                url: `${location.host}${location.pathname}`,
            });
        }
        else if (type === ERROR_AUDIO ||
            type === ERROR_IMAGE ||
            type === ERROR_SCRIPT ||
            type === ERROR_STYLE) {
            log("error", 2, detailAdapter(type, {
                error_no: errorName,
                url: `${location.host}${location.pathname}`,
            }), {
                desc,
            });
        }
        else {
            log("error", 3, {
                error_no: errorName,
                url: `${location.host}${location.pathname}`,
            }, {
                // ...(payload || {}),
                desc,
                stack,
            });
        }
    }
}
const opts = {
    concat: true,
    report: report,
};
function InjectErrorMonitor() {
    function start() {
        configInit(opts);
        //JavaScript运行时错误
        window.addEventListener("error", (e) => {
            // 只有 error 属性不为空的 ErrorEvent 才是一个合法的 js 错误
            if (e.error) {
                let { message, filename, lineno, colno, error } = e;
                handleError(formatRuntimerError(message, filename, lineno, colno, error));
            }
        });
        //Promise错误
        window.addEventListener("unhandledrejection", (e) => {
            handleError(formatPromiseError(e));
        });
        //资源加载错误
        window.addEventListener("error", (e) => {
            console.log("resource error");
            let target = e.target || e.srcElement;
            let isElementTarget = target instanceof HTMLElement;
            if (!isElementTarget)
                return false;
            handleError(formatLoadError(target));
        }, true);
        //网络请求错误
        //XHR ERROR
        hookMethod(XMLHttpRequest.prototype, "open", (origin) => function (method, url) {
            this.payload = {
                method,
                url,
            };
            origin.apply(this, [method, url]);
        })();
        hookMethod(XMLHttpRequest.prototype, "send", (origin) => function (...params) {
            this.addEventListener("readystatechange", () => {
                this.payload.status = this.status;
                handleError(formatXHRError(this.payload));
            });
            origin.apply(this, params);
        })();
        //fetch ERROR
        hookMethod(window, "fetch", (origin) => function (input, init) {
            const url = typeof input === "string" ? input : input.url || "Unknown URL";
            const method = (init && init.method) || "GET";
            const payload = {
                method,
                url,
                headers: (init && init.headers) || {},
                body: (init && init.body) || "",
            };
            return origin
                .apply(this, [input, init])
                .then((response) => {
                if (!response.ok) {
                    payload.status = response.status;
                    payload.statusText = response.statusText;
                    handleError(formatFetchError(payload));
                }
                return response;
            })
                .catch((error) => {
                payload.status = 0;
                payload.statusText = error.message;
                handleError(formatFetchError(payload));
                throw error;
            });
        })();
    }
    return { start };
}

function InjectPerfMonitor() {
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

// 用户在线时长统计
const OFFLINE_MILL = 15 * 60 * 1000; // 15分钟不操作认为不在线
const SEND_MILL = 5 * 1000; // 每5s打点一次
let lastTime = Date.now();
function InjectUserBehaviorMonitor() {
    function start() {
        // 用户在线时长统计
        window.addEventListener("click", () => {
            const now = Date.now();
            const duration = now - lastTime;
            if (duration > OFFLINE_MILL) {
                lastTime = Date.now();
            }
            else if (duration > SEND_MILL) {
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

function createSDK(configManager) {
    const monitors = [InjectErrorMonitor()];
    function init(userConfig) {
        configManager.mergeConfig(userConfig);
        let config = configManager.getConfig();
        if (config.pid) {
            if (config.enablePerformance)
                monitors.push(InjectPerfMonitor());
            if (config.enableBehavior)
                monitors.push(InjectUserBehaviorMonitor());
            monitors.forEach((monitor) => monitor.start());
        }
        else {
            console.log("请输入必要的配置pid");
        }
    }
    return {
        init,
    };
}
const SDK = createSDK(configManager);

export { SDK as default };

## Installation

```bash
npm install synthetical-monitor
```

## Quick Usage

```javascript
import Monitor from "synthetical-monitor";

Monitor.init({
  pid: "", //your project id
  enablePerfError: true, //是否开启性能监控
  enableBehavior: true, //是否开启用户行为监控
});
```

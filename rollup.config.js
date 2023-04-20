import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
export default defineConfig({
  input: "./src/index.ts",
  output: {
    file: "lib/index.js",
    format: "es"
  },
  plugins: [typescript()],
});

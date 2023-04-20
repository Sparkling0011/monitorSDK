import { defineConfig } from "rollup";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
export default defineConfig({
  input: "./src/index.ts",
  output: {
    file: "lib/index.js",
    format: "es"
  },
  plugins: [typescript(), terser()],
});

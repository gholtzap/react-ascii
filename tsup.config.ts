import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/button.ts",
    "src/command-palette.ts",
    "src/data-table.ts",
    "src/log-viewer.ts",
    "src/terminal.ts",
    "src/theme.ts",
  ],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  injectStyle: true,
});

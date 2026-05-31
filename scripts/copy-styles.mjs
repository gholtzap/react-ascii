import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const distDir = path.join(root, "dist");

fs.mkdirSync(distDir, { recursive: true });
fs.copyFileSync(path.join(root, "src/ascii.css"), path.join(distDir, "styles.css"));
console.log("Copied src/ascii.css to dist/styles.css");

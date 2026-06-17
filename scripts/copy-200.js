const fs = require("fs");
const path = require("path");

const distDir = path.resolve(__dirname, "..", "dist");
const indexFile = path.join(distDir, "index.html");
const destFile = path.join(distDir, "200.html");

if (!fs.existsSync(distDir)) {
  console.error("dist directory not found. Run `npm run build` first.");
  process.exit(1);
}

if (!fs.existsSync(indexFile)) {
  console.error("index.html not found in dist. Build may have failed.");
  process.exit(1);
}

fs.copyFileSync(indexFile, destFile);
console.log("Copied index.html -> 200.html");

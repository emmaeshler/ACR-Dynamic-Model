import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, rmSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { build } from "esbuild";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = join(ROOT, "out");
const DEST = join(ROOT, "public", "Inside Your Dynamic Model - INSIGHT2PROFIT.html");

// ── Step 1: Bundle JS with esbuild (React + Framer Motion + all components) ──
console.log("Bundling JS with esbuild...");
const jsResult = await build({
  entryPoints: [join(ROOT, "scripts", "export-entry.tsx")],
  bundle: true,
  write: false,
  format: "esm",
  target: "es2020",
  jsx: "automatic",
  minify: true,
  alias: {
    "@/*": "./src/*",
  },
  resolveExtensions: [".tsx", ".ts", ".jsx", ".js"],
  plugins: [{
    name: "resolve-at-alias",
    setup(b) {
      b.onResolve({ filter: /^@\// }, (args) => {
        const base = resolve(ROOT, "src", args.path.slice(2));
        for (const ext of [".tsx", ".ts", ".jsx", ".js", ""]) {
          const full = base + ext;
          if (existsSync(full)) return { path: full };
        }
        return { path: base };
      });
    },
  }],
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});
const bundledJs = jsResult.outputFiles[0].text;
console.log(`  JS bundle: ${(bundledJs.length / 1024).toFixed(0)} KB`);

// ── Step 2: Build static export for CSS + fonts ──
console.log("Building static export for CSS...");
execSync("npx next build", {
  cwd: ROOT,
  stdio: "inherit",
  env: { ...process.env, STATIC_EXPORT: "1" },
});

// ── Step 3: Collect CSS + fonts by scanning the filesystem ──
// (Vercel's modifyConfig can strip <link> tags from index.html, so we find files directly)

function findFiles(dir, ext) {
  const results = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...findFiles(full, ext));
    } else if (entry.endsWith(ext)) {
      results.push(full);
    }
  }
  return results;
}

function inlineFontUrl(match, rawUrl, cssFileDir) {
  const url = rawUrl.replace(/["']/g, "");
  if (url.startsWith("data:")) return match;
  const fontPath = url.startsWith("/") ? join(OUT, url) : resolve(cssFileDir, url);
  if (!existsSync(fontPath)) return match;
  const ext = fontPath.split(".").pop();
  const mime =
    ext === "woff2" ? "font/woff2" :
    ext === "woff" ? "font/woff" :
    ext === "ttf" ? "font/ttf" :
    "application/octet-stream";
  const b64 = readFileSync(fontPath).toString("base64");
  return `url(data:${mime};base64,${b64})`;
}

// Find all CSS files in the static export output
const cssFiles = findFiles(OUT, ".css");
console.log(`  Found ${cssFiles.length} CSS file(s):`);
cssFiles.forEach(f => console.log("    ", f));

const cssBlocks = [];
for (const filePath of cssFiles) {
  const cssDir = dirname(filePath);
  let css = readFileSync(filePath, "utf-8");
  css = css.replace(/url\(([^)]+)\)/g, (mt, u) => inlineFontUrl(mt, u, cssDir));
  cssBlocks.push(css);
}

// Also inline font-face declarations from index.html <style> blocks if present
const indexHtml = existsSync(join(OUT, "index.html"))
  ? readFileSync(join(OUT, "index.html"), "utf-8")
  : "";
const inlineStyleRe = /<style[^>]*>([\s\S]*?)<\/style>/g;
let m;
while ((m = inlineStyleRe.exec(indexHtml)) !== null) {
  const mediaDir = join(OUT, "_next", "static", "media");
  let css = m[1];
  if (css.trim()) {
    css = css.replace(/url\(([^)]+)\)/g, (mt, u) => inlineFontUrl(mt, u, mediaDir));
    cssBlocks.push(css);
  }
}

const allCss = cssBlocks.join("\n");
console.log(`  CSS total: ${(allCss.length / 1024).toFixed(0)} KB`);

// Extract html class from index.html (font variable classes)
const htmlClassMatch = indexHtml.match(/<html[^>]*class="([^"]*)"/);
const htmlClass = htmlClassMatch ? htmlClassMatch[1] : "";

// ── Step 4: Build the standalone HTML ──
const html = `<!DOCTYPE html>
<html lang="en" class="${htmlClass}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Inside Your Dynamic Model | INSIGHT2PROFIT</title>
<style>${allCss}</style>
</head>
<body class="flex min-h-full flex-col" style="font-family:Raleway,ui-sans-serif,system-ui,sans-serif">
<div id="__export_root"></div>
<script type="module">${bundledJs}</script>
</body>
</html>`;

writeFileSync(DEST, html, "utf-8");
const sizeMB = (Buffer.byteLength(html) / 1024 / 1024).toFixed(2);
console.log(`\nWrote ${DEST} (${sizeMB} MB)`);

// ── Step 5: Clean up ──
rmSync(OUT, { recursive: true, force: true });
rmSync(join(ROOT, ".next"), { recursive: true, force: true });
console.log("Cleaned up out/ and .next/ directories");

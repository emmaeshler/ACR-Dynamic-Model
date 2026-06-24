import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { build } from "esbuild";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = join(ROOT, "out");
const DEST = join(ROOT, "public", "presentation.html");

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

// ── Step 3: Collect and inline CSS with fonts ──
const indexHtml = readFileSync(join(OUT, "index.html"), "utf-8");

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

// Extract CSS from link tags
const cssBlocks = [];
const cssLinkRe = /<link\s+rel="stylesheet"\s+href="([^"]+)"[^>]*\/?>/g;
let m;
while ((m = cssLinkRe.exec(indexHtml)) !== null) {
  const filePath = join(OUT, m[1]);
  if (!existsSync(filePath)) continue;
  const cssDir = dirname(filePath);
  let css = readFileSync(filePath, "utf-8");
  css = css.replace(/url\(([^)]+)\)/g, (mt, u) => inlineFontUrl(mt, u, cssDir));
  cssBlocks.push(css);
}

// Extract inline styles from the HTML head (font-face declarations)
const inlineStyleRe = /<style[^>]*>([\s\S]*?)<\/style>/g;
while ((m = inlineStyleRe.exec(indexHtml)) !== null) {
  const mediaDir = join(OUT, "_next", "static", "media");
  let css = m[1];
  css = css.replace(/url\(([^)]+)\)/g, (mt, u) => inlineFontUrl(mt, u, mediaDir));
  cssBlocks.push(css);
}

// Also resolve preloaded font files
const preloadFontRe = /<link\s+rel="preload"\s+href="([^"]+)"\s+as="font"[^>]*\/?>/g;
while ((m = preloadFontRe.exec(indexHtml)) !== null) {
  const fontPath = join(OUT, m[1]);
  if (!existsSync(fontPath)) continue;
  const ext = m[1].split(".").pop();
  const mime = ext === "woff2" ? "font/woff2" : ext === "woff" ? "font/woff" : "font/ttf";
  const b64 = readFileSync(fontPath).toString("base64");
  cssBlocks.push(`@font-face { src: url(data:${mime};base64,${b64}); }`);
}

const allCss = cssBlocks.join("\n");
console.log(`  CSS: ${(allCss.length / 1024).toFixed(0)} KB`);

// Extract html class (font variable classes)
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

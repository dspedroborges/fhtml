// html.js — Functional HTML builder + static file generator for Bun
import { mkdir, writeFile, cp, access, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { html_beautify } from "js-beautify";

// ─── Escaping ────────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value) {
  return String(value).replace(/"/g, "&quot;");
}

// ─── RawHtml wrapper ─────────────────────────────────────────────────────────

class RawHtml {
  constructor(html) { this.html = html; }
  toString() { return this.html; }
  toJSON()   { return this.html; }
}

// ─── Render ──────────────────────────────────────────────────────────────────

function render(node) {
  if (node == null || node === false) return "";
  if (node instanceof RawHtml) return node.html;
  if (Array.isArray(node)) return node.map(render).join("");
  return escapeHtml(node);
}

// ─── Core tag factory ────────────────────────────────────────────────────────

const SELF_CLOSING = new Set([
  "area", "base", "br", "col", "embed", "hr", "img",
  "input", "link", "meta", "param", "source", "track", "wbr",
]);

function buildAttrs(props) {
  return Object.entries(props)
    .map(([k, v]) => {
      if (v === true)               return ` ${k}`;
      if (v === false || v == null) return "";
      return ` ${k}="${escapeAttr(v)}"`;
    })
    .join("");
}

function isProps(v) {
  return v !== null &&
    typeof v === "object" &&
    !Array.isArray(v) &&
    !(v instanceof RawHtml);
}

function tag(name, ...args) {
  const props    = isProps(args[0]) ? args[0]       : {};
  const children = isProps(args[0]) ? args.slice(1) : args;
  const attrs    = buildAttrs(props);

  if (SELF_CLOSING.has(name)) {
    return new RawHtml(`<${name}${attrs} />`);
  }

  const inner = children.flat(Infinity).map(render).join("");
  return new RawHtml(`<${name}${attrs}>${inner}</${name}>`);
}

// ─── All HTML tags ────────────────────────────────────────────────────────────

const HTML_TAGS = [
  // Document metadata
  "html", "head", "body", "title", "base", "link", "meta", "style",
  // Sectioning
  "article", "aside", "footer", "header",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "main", "nav", "section", "address",
  // Text content
  "blockquote", "dd", "details", "dialog", "div", "dl", "dt",
  "figcaption", "figure", "hr", "li", "menu", "ol", "p", "pre",
  "summary", "ul",
  // Inline text
  "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data",
  "dfn", "em", "i", "kbd", "mark", "q", "rp", "rt", "ruby", "s",
  "samp", "small", "span", "strong", "sub", "sup", "time", "u",
  "var", "wbr",
  // Embedded content
  "area", "audio", "col", "colgroup", "embed", "iframe", "img",
  "map", "object", "picture", "source", "track", "video",
  // Table
  "caption", "table", "tbody", "td", "tfoot", "th", "thead", "tr",
  // Forms
  "button", "datalist", "fieldset", "form", "input", "label",
  "legend", "meter", "optgroup", "option", "output", "progress",
  "select", "textarea",
  // Other
  "canvas", "noscript", "template",
];

const tags = Object.fromEntries(
  HTML_TAGS.map((name) => [name, (...args) => tag(name, ...args)])
);

// ─── Script accumulator ───────────────────────────────────────────────────────

// All script() calls accumulate here; page() flushes them into a single <script>
let _scripts = [];

function extractBody(fn) {
  const src = fn.toString();
  const body = src.slice(src.indexOf('{') + 1, src.lastIndexOf('}'));
  return body.replace(/^\n|\n\s*$/g, '').replace(/^    /gm, '');
}

/**
 * Accumulates inline JS to be flushed as a single <script> at the end of page().
 * External scripts (src) are returned immediately as a RawHtml tag.
 *
 *   script({ src: "/app.js", defer: true })   → immediate <script src> tag
 *   script({ data: obj }, () => { ... })       → accumulated, data injected first
 *   script(() => { ... })                      → accumulated
 */
function script(propsOrFn, ...rest) {
  const props    = isProps(propsOrFn) ? propsOrFn : {};
  const children = isProps(propsOrFn) ? rest      : [propsOrFn, ...rest];

  const { data, as: varName = "__data__", ...attrs } = props;

  // External script — emit immediately, don't accumulate
  if (attrs.src && children.length === 0) {
    return new RawHtml(`<script${buildAttrs(attrs)}></script>`);
  }

  let chunk = "";
  if (data !== undefined) {
    chunk += `window["${varName}"] = ${JSON.stringify(data)};\n`;
  }

  chunk += children.flat(Infinity).map((c) => {
    if (typeof c === "function") return extractBody(c);
    if (c instanceof RawHtml)   return c.html;
    return String(c ?? "");
  }).join("");

  _scripts.push(chunk);
  return new RawHtml(""); // placeholder — nothing emitted here
}

// ─── page() + generate() ─────────────────────────────────────────────────────

/**
 * Stringify a root node with DOCTYPE.
 * Flushes all accumulated script() calls as a single <script> before </body>.
 */
function page(rootNode) {
  const html = render(rootNode);
  const flushed = _scripts.join("\n");
  _scripts = []; // reset for next page

  const withScripts = flushed
    ? html.replace("</body>", `<script>\n${flushed}</script>\n</body>`)
    : html;

  return `<!DOCTYPE html>\n${withScripts}`;
}

/**
 * Smart <head> builder.
 *
 * Config fields:
 *   title       — <title> + og:title
 *   description — <meta name="description"> + og:description
 *   author      — <meta name="author">
 *   thumbnail   — og:image + twitter:card
 *   url         — og:url + canonical link
 *   icon        — <link rel="icon">
 *   imports     — array of .css / .js paths → <link> or <script defer>
 *   charset     — defaults to "UTF-8"
 *   viewport    — defaults to "width=device-width, initial-scale=1"
 *   ...rest     — any extra keys become <meta name=key content=value>
 *
 * Extra children (manual tags) can be appended as additional arguments:
 *   createHead({ title: "Hi" }, meta({ name: "theme-color", content: "#fff" }))
 */
function createHead(config, ...manualChildren) {
  const {
    title: t,
    description: d,
    author,
    thumbnail,
    url,
    icon,
    imports = [],
    charset = "UTF-8",
    viewport = "width=device-width, initial-scale=1",
    ...rest
  } = config;

  const children = [];

  // Always-present basics
  children.push(tags.meta({ charset }));
  children.push(tags.meta({ name: "viewport", content: viewport }));

  if (t) {
    children.push(tags.title(t));
    children.push(tags.meta({ property: "og:title", content: t }));
  }
  if (d) {
    children.push(tags.meta({ name: "description", content: d }));
    children.push(tags.meta({ property: "og:description", content: d }));
  }
  if (author)    children.push(tags.meta({ name: "author", content: author }));
  if (icon)      children.push(tags.link({ rel: "icon", href: icon }));
  if (thumbnail) {
    children.push(tags.meta({ property: "og:image", content: thumbnail }));
    children.push(tags.meta({ name: "twitter:card", content: "summary_large_image" }));
  }
  if (url) {
    children.push(tags.meta({ property: "og:url", content: url }));
    children.push(tags.link({ rel: "canonical", href: url }));
  }

  // .css → <link rel="stylesheet">, .js → <script> (append "defer" to the name to defer)
  // e.g. "action.js" or "action.defer.js"
  for (const p of imports) {
    const cp = p.toLowerCase();
    if (cp.endsWith(".css")) {
      children.push(tags.link({ rel: "stylesheet", href: p }));
    } else if (cp.includes(".js")) {
      children.push(script({ src: p.replaceAll("defer", ""), defer: p.includes("defer") }));
    }
  }

  // Remaining config keys → arbitrary <meta> tags
  for (const [name, content] of Object.entries(rest)) {
    children.push(tags.meta({ name, content }));
  }

  return tag("head", ...children, ...manualChildren);
}

// ─── generate() ──────────────────────────────────────────────────────────────
/**
 * Generate a static HTML file into dist/.
 *
 * On the very first call, copies the root-level `imports/` folder into
 * `dist/imports/` (if the folder exists), so your scripts and assets are
 * always available alongside the generated pages.
 *
 * Usage:
 *   await generate("index.html", page(html(...)))
 *   await generate("about/index.html", page(html(...)))
 */
let distCleaned   = false;
let importsCopied = false;

async function copyImports() {
  try {
    await access("imports");
  } catch {
    return;
  }
  await cp("imports", "dist/imports", { recursive: true });
  console.log("  ✓ dist/imports/");
}

async function generate(filename, content) {
  if (!distCleaned) {
    distCleaned = true;
    await rm("dist", { recursive: true, force: true });
  }

  if (!importsCopied) {
    importsCopied = true;
    await copyImports();
  }

  const outPath = join("dist", filename);
  await mkdir(dirname(outPath), { recursive: true });

  const pretty = html_beautify(content, {
    indent_size: 2,
    wrap_line_length: 120,
    preserve_newlines: false,
    extra_liners: [],
    unformatted: ["script", "style"],
  });

  await Bun.write(outPath, pretty);
  console.log(`  ✓ dist/${filename}`);
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export const {
  html, head, body, title, base, link, meta, style,
  article, aside, footer, header, h1, h2, h3, h4, h5, h6, main, nav, section, address,
  blockquote, dd, details, dialog, div, dl, dt, figcaption, figure, hr,
  li, menu, ol, p, pre, summary, ul,
  a, abbr, b, bdi, bdo, br, cite, code, data, dfn, em, i, kbd, mark, q,
  rp, rt, ruby, s, samp, small, span, strong, sub, sup, time, u, wbr,
  area, audio, col, colgroup, embed, iframe, img, map, object, picture, source, track, video,
  caption, table, tbody, td, tfoot, th, thead, tr,
  button, datalist, fieldset, form, input, label, legend, meter,
  optgroup, option, output, progress, select, textarea,
  canvas, noscript, template,
} = tags;

export const $var = tags["var"];

function raw(str) { return new RawHtml(str); }

export { tag, raw, render, page, generate, script, createHead };
export { chart } from "./utils/chart.js";
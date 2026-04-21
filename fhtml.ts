// fhtml - Functional HTML builder + static file generator for Bun
import { mkdir, cp, access, rm } from "node:fs/promises";
import { dirname, join } from "node:path";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Child = RawHtml | string | number | boolean | null | undefined | Child[];

export type Props = Record<string, string | number | boolean | null | undefined>;

export interface StyleEntry {
    css: string;
    attrs: Record<string, string | number | boolean | null | undefined>;
}

export interface HeadConfig {
    title?: string;
    description?: string;
    author?: string;
    thumbnail?: string;
    url?: string;
    icon?: string;
    imports?: string[];
    charset?: string;
    viewport?: string;
    [key: string]: string | string[] | undefined;
}

// ─── Escaping ────────────────────────────────────────────────────────────────

function escapeHtml(str: unknown): string {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function escapeAttr(value: unknown): string {
    return String(value).replace(/"/g, "&quot;");
}

// ─── RawHtml wrapper ─────────────────────────────────────────────────────────

export class RawHtml {
    html: string;
    constructor(html: string) {
        this.html = html;
    }
    toString(): string {
        return this.html;
    }
    toJSON(): string {
        return this.html;
    }
}

// ─── Render ──────────────────────────────────────────────────────────────────

export function render(node: Child): string {
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

function buildAttrs(props: Props): string {
    return Object.entries(props)
        .map(([k, v]) => {
            if (v === true) return ` ${k}`;
            if (v === false || v == null) return "";
            return ` ${k}="${escapeAttr(v)}"`;
        })
        .join("");
}

function isProps(v: unknown): v is Props {
    return v !== null &&
        typeof v === "object" &&
        !Array.isArray(v) &&
        !(v instanceof RawHtml);
}

export function tag(name: string, ...args: (Props | Child)[]): RawHtml {
    const props = isProps(args[0]) ? (args[0] as Props) : {};
    const children = isProps(args[0]) ? args.slice(1) : args;
    const attrs = buildAttrs(props);

    if (SELF_CLOSING.has(name)) {
        return new RawHtml(`<${name}${attrs} />`);
    }

    const inner = (children as Child[]).flat(Infinity as 10).map(render).join("");
    return new RawHtml(`<${name}${attrs}>${inner}</${name}>`);
}

// ─── All HTML tags ────────────────────────────────────────────────────────────

const HTML_TAGS = [
    // Document metadata
    "html", "head", "body", "title", "base", "link", "meta",
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
] as const;

type HtmlTagName = typeof HTML_TAGS[number];

type TagFn = (...args: (Props | Child)[]) => RawHtml;

const tags: Record<HtmlTagName, TagFn> = Object.fromEntries(
    HTML_TAGS.map((name) => [name, (...args: (Props | Child)[]) => tag(name, ...args)])
) as Record<HtmlTagName, TagFn>;

// ─── Script accumulator ───────────────────────────────────────────────────────

let _scripts: string[] = [];

export interface ScriptProps extends Props {
    data?: unknown;
    as?: string;
    src?: string;
    defer?: boolean;
}

/**
 * Accumulates inline JS to be flushed as a single <script> at the end of page().
 * External scripts (src) are returned immediately as a RawHtml tag.
 *
 *   script({ src: "/app.js", defer: true })   → immediate <script src> tag
 *   script({ data: obj }, "console.log(1)")   → accumulated, data injected first
 *   script("console.log(1)")                  → accumulated
 */
export function script(propsOrStr: ScriptProps | string, ...rest: Child[]): RawHtml {
    const props: ScriptProps = isProps(propsOrStr) ? (propsOrStr as ScriptProps) : {};
    const children: Child[] = isProps(propsOrStr) ? rest : [propsOrStr as string, ...rest];

    const { data, as: varName = "__data__", ...attrs } = props;

    // External script — emit immediately, don't accumulate
    if (attrs.src && children.length === 0) {
        return new RawHtml(`<script${buildAttrs(attrs as Props)}></script>`);
    }

    let chunk = "";
    if (data !== undefined) {
        chunk += `window["${varName}"] = ${JSON.stringify(data)};\n`;
    }

    chunk += (children as Child[]).flat(Infinity as 10).map((c) => {
        if (c instanceof RawHtml) return c.html;
        return String(c ?? "");
    }).join("");

    _scripts.push(chunk);
    return new RawHtml(""); // placeholder — nothing emitted here
}

// ─── Style accumulator ────────────────────────────────────────────────────────

let _styles: StyleEntry[] = [];

export interface StyleProps extends Props {
    href?: string;
    media?: string;
}

/**
 * Accumulates inline CSS to be flushed as a single <style> in <head> by page().
 * External stylesheets (href) are returned immediately as a <link> tag.
 *
 *   style({ href: "/app.css" })               → immediate <link rel="stylesheet"> tag
 *   style({ media: "print" }, `body { ... }`) → accumulated with media attr preserved
 *   style(`body { margin: 0; }`)              → accumulated
 */
export function style(propsOrCss: StyleProps | string, ...rest: Child[]): RawHtml {
    const props: StyleProps = isProps(propsOrCss) ? (propsOrCss as StyleProps) : {};
    const children: Child[] = isProps(propsOrCss) ? rest : [propsOrCss as string, ...rest];

    const { href, ...attrs } = props;

    // External stylesheet — emit immediately as <link>, don't accumulate
    if (href) {
        return new RawHtml(`<link rel="stylesheet"${buildAttrs({ href, ...attrs } as Props)} />`);
    }

    const chunk = (children as Child[]).flat(Infinity as 10).map((c) => {
        if (c instanceof RawHtml) return c.html;
        return String(c ?? "");
    }).join("");

    _styles.push({ css: chunk, attrs: attrs as Props });
    return new RawHtml(""); // placeholder — nothing emitted here
}

// ─── page() + generate() ─────────────────────────────────────────────────────

/**
 * Stringify a root node with DOCTYPE.
 * Flushes all accumulated style() calls as a single <style> before </head>.
 * Flushes all accumulated script() calls as a single <script> before </body>.
 */
export function page(rootNode: Child): string {
    const html = render(rootNode);

    // Flush styles — group chunks by serialized attrs so distinct media queries
    // each get their own <style> block, while plain styles merge into one.
    const stylesByAttrs = new Map<string, { attrs: Props; chunks: string[] }>();
    for (const { css, attrs } of _styles) {
        const key = JSON.stringify(attrs);
        if (!stylesByAttrs.has(key)) stylesByAttrs.set(key, { attrs, chunks: [] });
        stylesByAttrs.get(key)!.chunks.push(css);
    }
    _styles = []; // reset for next page

    let withStyles = html;
    if (stylesByAttrs.size > 0) {
        const styleTags = [...stylesByAttrs.values()]
            .map(({ attrs, chunks }) => {
                const attrStr = buildAttrs(attrs);
                return `<style${attrStr}>\n${chunks.join("\n")}</style>`;
            })
            .join("\n");
        withStyles = withStyles.replace(/<\/head>/i, `${styleTags}\n</head>`);
    }

    // Flush scripts
    const flushed = _scripts.join("\n");
    _scripts = []; // reset for next page

    const withScripts = flushed
        ? withStyles.replace(/<\/body>/i, `<script>\n${flushed}</script>\n</body>`)
        : withStyles;

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
export function createHead(config: HeadConfig, ...manualChildren: Child[]): RawHtml {
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

    const children: RawHtml[] = [];

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
    if (author) children.push(tags.meta({ name: "author", content: author }));
    if (icon) children.push(tags.link({ rel: "icon", href: icon }));
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
        if (typeof content === "string") {
            children.push(tags.meta({ name, content }));
        }
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
let distCleaned = false;
let importsCopied = false;

async function copyImports(): Promise<void> {
    try {
        await access("imports");
    } catch {
        return;
    }
    await cp("imports", "dist/imports", { recursive: true });
    console.log("  ✓ dist/imports/");
}

export async function generate(filename: string, content: string): Promise<void> {
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

    await Bun.write(outPath, content);
    console.log(`  ✓ dist/${filename}`);
}

// ─── SEO file generators ──────────────────────────────────────────────────────

export type RobotsRule =
    | { userAgent: string; allow?: string | string[]; disallow?: string | string[]; crawlDelay?: number }

export interface RobotsConfig {
    rules: RobotsRule[];
    /** Full URL to your sitemap, e.g. "https://example.com/sitemap.xml" */
    sitemap?: string;
    /** Full URL to your host, e.g. "https://example.com" */
    host?: string;
}

/**
 * Build and write a robots.txt into dist/.
 *
 *   await generateRobots({
 *     rules: [
 *       { userAgent: "*", allow: "/", disallow: ["/admin", "/private"] },
 *       { userAgent: "GPTBot", disallow: "/" },
 *     ],
 *     sitemap: "https://example.com/sitemap.xml",
 *   });
 */
export async function generateRobots(config: RobotsConfig): Promise<void> {
    const lines: string[] = [];

    for (const rule of config.rules) {
        lines.push(`User-agent: ${rule.userAgent}`);

        const allows = rule.allow == null ? [] : Array.isArray(rule.allow) ? rule.allow : [rule.allow];
        const disallows = rule.disallow == null ? [] : Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow];

        for (const path of allows) lines.push(`Allow: ${path}`);
        for (const path of disallows) lines.push(`Disallow: ${path}`);
        if (rule.crawlDelay != null) lines.push(`Crawl-delay: ${rule.crawlDelay}`);

        lines.push(""); // blank line between rule blocks
    }

    if (config.sitemap) lines.push(`Sitemap: ${config.sitemap}`);
    if (config.host) lines.push(`Host: ${config.host}`);

    await generate("robots.txt", lines.join("\n").trimEnd() + "\n");
}

// ─────────────────────────────────────────────────────────────────────────────

export type SitemapChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

export interface SitemapEntry {
    /** Absolute URL, e.g. "https://example.com/about" */
    url: string;
    /** ISO 8601 date string, e.g. "2024-01-15" or new Date().toISOString() */
    lastmod?: string;
    changefreq?: SitemapChangeFreq;
    /** Priority between 0.0 and 1.0 */
    priority?: number;
}

/**
 * Build and write a sitemap.xml into dist/.
 *
 *   await generateSitemap([
 *     { url: "https://example.com/",     changefreq: "weekly", priority: 1.0 },
 *     { url: "https://example.com/about", changefreq: "monthly", priority: 0.8 },
 *   ]);
 */
export async function generateSitemap(entries: SitemapEntry[]): Promise<void> {
    const urlTags = entries.map(({ url, lastmod, changefreq, priority }) => {
        const parts = [`    <loc>${escapeHtml(url)}</loc>`];
        if (lastmod) parts.push(`    <lastmod>${escapeHtml(lastmod)}</lastmod>`);
        if (changefreq) parts.push(`    <changefreq>${changefreq}</changefreq>`);
        if (priority != null) parts.push(`    <priority>${priority.toFixed(1)}</priority>`);
        return `  <url>\n${parts.join("\n")}\n  </url>`;
    });

    const xml = [
        `<?xml version="1.0" encoding="UTF-8"?>`,
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
        ...urlTags,
        `</urlset>`,
    ].join("\n") + "\n";

    await generate("sitemap.xml", xml);
}

// ─────────────────────────────────────────────────────────────────────────────

export interface LlmsSection {
    /** Section heading, e.g. "Docs", "Blog", "API Reference" */
    title: string;
    /** Optional short description of what this section contains */
    description?: string;
    links: Array<{
        /** Human-readable label */
        label: string;
        /** Absolute URL */
        url: string;
        /** Optional one-line description */
        description?: string;
    }>;
}

export interface LlmsConfig {
    /** Site name */
    name: string;
    /** One-paragraph description of the site for LLM context */
    description: string;
    /** Optional canonical base URL */
    url?: string;
    sections: LlmsSection[];
    /** Optional footer / additional notes for the LLM */
    notes?: string;
}

/**
 * Build and write an llms.txt into dist/ following the llmstxt.org spec.
 * https://llmstxt.org/
 *
 *   await generateLlms({
 *     name: "My Site",
 *     description: "A toolkit for building static sites with Bun.",
 *     url: "https://example.com",
 *     sections: [
 *       {
 *         title: "Docs",
 *         links: [
 *           { label: "Getting Started", url: "https://example.com/docs/start", description: "Installation and first steps" },
 *         ],
 *       },
 *     ],
 *   });
 */
export async function generateLlms(config: LlmsConfig): Promise<void> {
    const lines: string[] = [];

    // H1 — site name
    lines.push(`# ${config.name}`);
    lines.push("");

    // Optional base URL as blockquote
    if (config.url) lines.push(`> ${config.url}`);

    // Description paragraph
    lines.push("");
    lines.push(config.description);
    lines.push("");

    // Sections
    for (const section of config.sections) {
        lines.push(`## ${section.title}`);
        if (section.description) {
            lines.push("");
            lines.push(section.description);
        }
        lines.push("");

        for (const link of section.links) {
            const desc = link.description ? `: ${link.description}` : "";
            lines.push(`- [${link.label}](${link.url})${desc}`);
        }
        lines.push("");
    }

    // Optional notes
    if (config.notes) {
        lines.push("## Notes");
        lines.push("");
        lines.push(config.notes);
        lines.push("");
    }

    await generate("llms.txt", lines.join("\n").trimEnd() + "\n");
}

/**
 * Convenience: generate robots.txt, sitemap.xml, and llms.txt in one call.
 *
 *   await generateSeo({
 *     robots: { rules: [{ userAgent: "*", allow: "/" }], sitemap: "https://example.com/sitemap.xml" },
 *     sitemap: [{ url: "https://example.com/" }],
 *     llms: { name: "My Site", description: "...", sections: [] },
 *   });
 */
export async function generateSeo(config: {
    robots?: RobotsConfig;
    sitemap?: SitemapEntry[];
    llms?: LlmsConfig;
}): Promise<void> {
    const tasks: Promise<void>[] = [];
    if (config.robots) tasks.push(generateRobots(config.robots));
    if (config.sitemap) tasks.push(generateSitemap(config.sitemap));
    if (config.llms) tasks.push(generateLlms(config.llms));
    await Promise.all(tasks);
}

// ─── Responsive style helpers ─────────────────────────────────────────────────

const screens = {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
} as const;

export const sm = (css: string): RawHtml => style(`@media (min-width: ${screens.sm}) { ${css} }`);
export const md = (css: string): RawHtml => style(`@media (min-width: ${screens.md}) { ${css} }`);
export const lg = (css: string): RawHtml => style(`@media (min-width: ${screens.lg}) { ${css} }`);
export const xl = (css: string): RawHtml => style(`@media (min-width: ${screens.xl}) { ${css} }`);

// ─── Tag exports ──────────────────────────────────────────────────────────────

export const {
    html, head, body, title, base, link, meta,
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

export function raw(str: string): RawHtml {
    return new RawHtml(str);
}


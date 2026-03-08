import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { html as beautify } from "js-beautify";
import { mapTemplate, actionInit, action } from "./utils/api.js";
export { chart } from "./utils/chart.js";
export const api = { mapTemplate, actionInit, action };

const libsDir = join(__dirname, "utils", "libs");

async function loadLibs(names = []) {
    const scripts = [];
    for (const name of names) {
        try {
            const content = await readFile(join(libsDir, `${name}.txt`), "utf-8");
            scripts.push(content.trim());
        } catch (e) {
            console.warn(`Library '${name}' not found in utils/libs/`);
        }
    }
    return scripts;
}

export const js = (...fns) => fns.map(fn => {
    const src = fn.toString();
    const body = src.slice(src.indexOf('{') + 1, src.lastIndexOf('}'));
    return body.replace(/^\n|\n\s*$/g, '').replace(/^    /gm, '');
}).join('\n');

const escapeAttr = (str) =>
    String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

function el(tag, props = {}, ...children) {
    const { children: propChildren, ...attrs } = props || {};

    const attrString = Object.entries(attrs)
        .filter(([_, v]) => v != null && v !== false)
        .map(([k, v]) => {
            if (v === true) return k;
            if (k === "style" && typeof v === "object") {
                const style = Object.entries(v)
                    .map(([p, val]) => `${p.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}:${val}`)
                    .join(";");
                return `style="${escapeAttr(style)}"`;
            }
            return `${k}="${escapeAttr(v)}"`;
        })
        .join(" ");

    const flatChildren = [children, propChildren]
        .flat(Infinity)
        .filter(c => c != null && c !== false)
        .map(c => String(c))
        .join("");

    const openTag = `<${tag}${attrString ? " " + attrString : ""}>`;
    return voidTags.has(tag) ? openTag : `${openTag}${flatChildren}</${tag}>`;
}

const tags = [
    "html", "head", "title", "base", "link", "meta", "style", "script",
    "noscript", "body", "section", "nav", "article", "aside", "h1", "h2",
    "h3", "h4", "h5", "h6", "header", "footer", "address", "main", "p",
    "hr", "pre", "blockquote", "ol", "ul", "li", "dl", "dt", "dd",
    "figure", "figcaption", "div", "a", "em", "strong", "small", "s",
    "cite", "q", "dfn", "abbr", "ruby", "rt", "rp", "data", "time",
    "code", "var", "samp", "kbd", "sub", "sup", "i", "b", "u", "mark",
    "bdi", "bdo", "span", "br", "wbr", "ins", "del", "picture", "source",
    "img", "iframe", "embed", "object", "param", "video", "audio",
    "track", "map", "area", "table", "caption", "colgroup", "col",
    "tbody", "thead", "tfoot", "tr", "td", "th", "form", "label",
    "input", "button", "select", "datalist", "optgroup", "option",
    "textarea", "output", "progress", "meter", "fieldset", "legend",
    "details", "summary", "dialog", "canvas", "svg", "slot", "template",
    "text", "rect", "line", "path", "circle", "linearGradient", "radialGradient", "stop", "defs", "g", "polyline", "polygon"
];

const voidTags = new Set([
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
    "rect", "circle", "ellipse", "line"
]);

export const h = Object.fromEntries(
    tags.map(tag => [
        tag,
        (props, ...children) => {
            const isProps = props?.constructor === Object && !Array.isArray(props);
            const finalProps = isProps ? props : {};
            const finalChildren = isProps ? children : [props, ...children];

            if (tag === "head" && isProps && !finalProps.tag) {
                return createSmartHead(finalProps, ...finalChildren);
            }

            return el(tag, finalProps, ...finalChildren);
        }
    ])
);

export { modal, openModal } from "./utils/modal.js";

function createSmartHead(config, ...manualChildren) {
    const { title, meta, link, script } = h;
    const { title: t, description: d, author, thumbnail, url, icon, imports = [], ...rest } = config;
    const headChildren = [];

    if (t) {
        headChildren.push(title(t));
        headChildren.push(meta({ property: "og:title", content: t }));
    }
    if (d) {
        headChildren.push(meta({ name: "description", content: d }));
        headChildren.push(meta({ property: "og:description", content: d }));
    }
    if (author) headChildren.push(meta({ name: "author", content: author }));
    if (thumbnail) {
        headChildren.push(meta({ property: "og:image", content: thumbnail }));
        headChildren.push(meta({ name: "twitter:card", content: "summary_large_image" }));
    }
    if (url) {
        headChildren.push(meta({ property: "og:url", content: url }));
        headChildren.push(link({ rel: "canonical", href: url }));
    }
    if (icon) headChildren.push(link({ rel: "icon", href: icon }));

    imports.forEach(p => {
        const cp = p.toLowerCase();
        if (cp.endsWith(".css")) headChildren.push(link({ rel: "stylesheet", href: p }));
        else if (cp.endsWith(".js")) headChildren.push(script({ src: p, defer: true }));
    });

    Object.entries(rest).forEach(([n, c]) => headChildren.push(meta({ name: n, content: c })));

    return el("head", {}, ...headChildren, ...manualChildren);
}

export const render = async ({ filename }, content, plugins = []) => {
    const basename = filename.split("/").pop();
    filename = "dist/" + basename;
    const outputDir = join(dirname(filename), "libs");
    const scriptTags = [];

    if (plugins.includes("api")) {
        const apiCode = `${mapTemplate()}\n\n${actionInit()}`;
        await mkdir(outputDir, { recursive: true });
        await writeFile(join(outputDir, "api.js"), apiCode);
        scriptTags.push(`<script src="libs/api.js"></script>`);
    }

    const libs = plugins.filter(p => p !== "api");
    if (libs.length) {
        await mkdir(outputDir, { recursive: true });
        const libScripts = await loadLibs(libs);
        for (let i = 0; i < libs.length; i++) {
            const libName = libs[i];
            const libCode = libScripts[i];
            if (libCode) {
                await writeFile(join(outputDir, `${libName}.js`), libCode);
                scriptTags.push(`<script src="libs/${libName}.js" defer></script>`);
            }
        }
    }

    const html = scriptTags.length
        ? content.replace("</head>", `${scriptTags.join("\n")}</head>`)
        : content;
    const pretty = beautify(html, {
        indent_size: 2,
        wrap_line_length: 120,
        preserve_newlines: false,
        extra_liners: [],
    });
    await Bun.write(filename, pretty);
};

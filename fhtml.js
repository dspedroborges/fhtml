import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { html as beautify } from "js-beautify";

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
    // SVG void/self-closing tags
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

const parseFunction = () => `const parse = (tpl, data) => {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return tpl;
  }

  const resolve = (obj, path) => {
    return path
      .replace(/\\[(\\w+)\\]/g, ".$1")
      .split(".")
      .reduce((acc, key) => {
        if (acc == null || typeof acc !== "object") return "";
        return acc[key];
      }, obj);
  };

  return tpl.replace(/\\{([^}]+)\\}/g, (_, expr) => {
    const value = resolve(data, expr.trim());
    return value == null || typeof value === "object" ? "" : value;
  });
};`;

export const fetchInit = () => {
    return `
  window.fetchData = (config = {}) => {
    const {
      url,
      targets = [],
      templates = [],
      keys = [],
      loading = "",
      cache = 0,
      onSuccess = (data) => {},
      onError = (err) => console.error(err),
      refetchInterval = 0
    } = config;

    const targetEls = targets.map(t => document.querySelector(t));
    const loadingEl = loading ? document.querySelector(loading) : null;

    const cacheKey = "fetchCache:" + url;

    const resolvePath = (obj, path) => {
      if (!path) return obj;
      return path
        .replace(/\\[(\\w+)\\]/g, ".$1")
        .split(".")
        .reduce((acc, key) => acc?.[key], obj);
    };

    const render = (data) => {
      targets.forEach((_, i) => {
        const targetEl = targetEls[i];
        const template = templates[i];
        const key = keys[i];

        if (!targetEl || !template) return;

        const content = resolvePath(data, key);
        const items = Array.isArray(content) ? content : [content];
        const html = items.map(item => parse(template, item)).join("");

        targetEl.innerHTML = html;
      });
    };

    const getCache = () => {
      if (!cache) return null;
      const raw = localStorage.getItem(cacheKey);
      if (!raw) return null;

      try {
        const parsed = JSON.parse(raw);
        if (Date.now() > parsed.expire) {
          localStorage.removeItem(cacheKey);
          return null;
        }
        return parsed.data;
      } catch {
        return null;
      }
    };

    const setCache = (data) => {
      if (!cache) return;
      const payload = {
        expire: Date.now() + cache,
        data
      };
      localStorage.setItem(cacheKey, JSON.stringify(payload));
    };

    const doFetch = async () => {
      try {
        if (loadingEl) loadingEl.style.display = "";

        const cached = getCache();
        if (cached) {
          render(cached);
          if (loadingEl) loadingEl.style.display = "none";
          onSuccess(cached);
          if (refetchInterval > 0) setTimeout(doFetch, refetchInterval);
          return;
        }

        const res = await window.fetch(url);
        if (!res.ok) throw new Error("HTTP " + res.status);

        const data = await res.json();

        setCache(data);

        render(data);

        if (loadingEl) loadingEl.style.display = "none";

        onSuccess(data);
      } catch (e) {
        if (loadingEl) loadingEl.style.display = "none";
        onError(e);
      } finally {
        if (refetchInterval > 0) setTimeout(doFetch, refetchInterval);
      }
    };

    doFetch();
  };
  `;
};

export const actionInit = () => {
    return `
  window.action = (selector, config = {}) => {
    const {
      on = "submit",
      url,
      method = "POST",
      targets = [],
      templates = [],
      keys = [],
      loading = "",
      cache = 0,
      onSuccess = (data) => {},
      onError = (err) => {}
    } = config;

    const el = document.querySelector(selector);
    if (!el) return;

    const targetEls = targets.map(t => document.querySelector(t));
    const loadingEl = loading ? document.querySelector(loading) : null;

    const resolvePath = (obj, path) => {
      if (!path) return obj;
      return path
        .replace(/\\[(\\w+)\\]/g, ".$1")
        .split(".")
        .reduce((acc, key) => acc?.[key], obj);
    };

    const render = (data) => {
      targets.forEach((_, i) => {
        const targetEl = targetEls[i];
        const template = templates[i];
        const key = keys[i];

        if (!targetEl || !template) return;

        const content = resolvePath(data, key);
        const items = Array.isArray(content) ? content : [content];
        const html = items.map(item => parse(template, item)).join("");

        targetEl.innerHTML = html;
      });
    };

    el.addEventListener(on, async (e) => {
      if (on === "submit") e.preventDefault();

      if (loadingEl) loadingEl.style.display = "";

      try {
        const formData = {};

        if (el.tagName === "FORM") {
          new FormData(el).forEach((v, k) => { formData[k] = v; });
        } else {
          formData[el.name || "value"] = el.value;
        }

        let finalUrl = url;
        const bodyData = { ...formData };

        Object.keys(formData).forEach(key => {
          const placeholder = ":" + key;
          if (finalUrl.includes(placeholder)) {
            finalUrl = finalUrl.replace(placeholder, encodeURIComponent(formData[key]));
            delete bodyData[key];
          }
        });

        const isGet = method.toUpperCase() === "GET";

        if (isGet) {
          const params = new URLSearchParams(bodyData).toString();
          if (params) finalUrl += (finalUrl.includes("?") ? "&" : "?") + params;
        }

        const cacheKey = "actionCache:" + finalUrl;

        if (cache) {
          const raw = localStorage.getItem(cacheKey);
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              if (Date.now() < parsed.expire) {
                render(parsed.data);
                if (loadingEl) loadingEl.style.display = "none";
                onSuccess(parsed.data);
                return;
              } else {
                localStorage.removeItem(cacheKey);
              }
            } catch {}
          }
        }

        const res = await window.fetch(finalUrl, {
          method: method.toUpperCase(),
          headers: !isGet ? { "Content-Type": "application/json" } : {},
          body: !isGet ? JSON.stringify(bodyData) : null
        });

        if (!res.ok) throw new Error("Status: " + res.status);

        const result = await res.json();

        if (cache) {
          const payload = {
            expire: Date.now() + cache,
            data: result
          };
          localStorage.setItem(cacheKey, JSON.stringify(payload));
        }

        render(result);

        if (loadingEl) loadingEl.style.display = "none";

        onSuccess(result);
      } catch (err) {
        if (loadingEl) loadingEl.style.display = "none";
        onError(err);
      }
    });
  };
  `;
};

export const fetch = (config = {}) => {
    return `window.fetchData(${JSON.stringify(config)});`;
};

export const action = (selector, config = {}) => {
    return `window.action(${JSON.stringify(selector)}, ${JSON.stringify(config)});`;
};

export const chart = {
    bar({
        labels = [],
        data = [],
        colors = {}
    }) {
        if (!labels.length || labels.length !== data.length) return "";

        const {
            background = "white",
            text = "black",
            axis = "black",
            grid = "#ddd",
            bar = "steelblue"
        } = colors;

        const minBarWidth = 40;
        const pad = 50;
        const height = 400;
        const width = Math.max(600, pad * 2 + labels.length * minBarWidth);
        const barWidth = (width - pad * 2) / data.length;
        const maxY = Math.max(...data);
        const scaleY = v => height - pad - (v / (maxY || 1)) * (height - pad * 2);

        let svg = `<svg viewBox="0 0 ${width} ${height}" width="100%" height="auto" preserveAspectRatio="xMinYMid meet" xmlns="http://www.w3.org/2000/svg">`;

        svg += `<rect width="${width}" height="${height}" fill="${background}"/>`;

        svg += `
      <line x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${height - pad}" stroke="${axis}"/>
      <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${height - pad}" stroke="${axis}"/>
    `;

        for (let i = 0; i <= 5; i++) {
            const val = (maxY / 5) * i;
            const yPos = scaleY(val);
            svg += `
        <line x1="${pad}" y1="${yPos}" x2="${width - pad}" y2="${yPos}" stroke="${grid}"/>
        <text x="${pad - 8}" y="${yPos + 4}" font-size="12" fill="${text}" text-anchor="end">${val.toFixed(0)}</text>
      `;
        }

        labels.forEach((label, i) => {
            const barHeight = (data[i] / (maxY || 1)) * (height - pad * 2);
            const yPos = height - pad - barHeight;
            const xPos = pad + i * barWidth;
            const truncated = label.length > 8 ? label.slice(0, 7) + "…" : label;

            svg += `
        <rect x="${xPos + 2}" y="${yPos}" width="${barWidth - 8}" height="${barHeight}" fill="${bar}"/>
        <text x="${xPos + barWidth / 2}" y="${height - pad + 18}" font-size="11" fill="${text}" text-anchor="middle">${truncated}</text>
      `;
        });

        svg += `</svg>`;
        return svg;
    },

    line({
        labels = [],
        data = [],
        colors = {}
    }) {
        if (!labels.length || !Array.isArray(data) || !data.length) return "";

        const {
            background = "white",
            text = "black",
            axis = "black",
            grid = "#ddd",
            lines = ["steelblue", "tomato", "seagreen", "orange", "purple", "brown"],
            points
        } = colors;

        const datasets = Array.isArray(data[0]) ? data : [data];
        const length = labels.length;
        if (!datasets.every(arr => arr.length === length)) return "";

        const minStepX = 50;
        const pad = 50;
        const height = 400;
        const width = Math.max(600, pad * 2 + (length - 1) * minStepX);
        const flat = datasets.flat();
        const maxY = Math.max(...flat);
        const stepX = length > 1 ? (width - pad * 2) / (length - 1) : 0;
        const scaleY = v => height - pad - (v / (maxY || 1)) * (height - pad * 2);

        let svg = `<svg viewBox="0 0 ${width} ${height}" width="100%" height="auto" preserveAspectRatio="xMinYMid meet" xmlns="http://www.w3.org/2000/svg">`;

        svg += `<rect width="${width}" height="${height}" fill="${background}"/>`;

        svg += `
      <line x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${height - pad}" stroke="${axis}"/>
      <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${height - pad}" stroke="${axis}"/>
    `;

        for (let i = 0; i <= 5; i++) {
            const val = (maxY / 5) * i;
            const yPos = scaleY(val);
            svg += `
        <line x1="${pad}" y1="${yPos}" x2="${width - pad}" y2="${yPos}" stroke="${grid}"/>
        <text x="${pad - 8}" y="${yPos + 4}" font-size="12" fill="${text}" text-anchor="end">${val.toFixed(0)}</text>
      `;
        }

        const labelStep = Math.ceil(length / Math.floor((width - pad * 2) / 50));
        labels.forEach((label, i) => {
            if (i % labelStep !== 0 && i !== length - 1) return;
            const xPos = pad + i * stepX;
            const truncated = label.length > 8 ? label.slice(0, 7) + "…" : label;
            svg += `<text x="${xPos}" y="${height - pad + 18}" font-size="11" fill="${text}" text-anchor="middle">${truncated}</text>`;
        });

        datasets.forEach((dataset, di) => {
            let path = "";
            const color = lines[di % lines.length];

            dataset.forEach((val, i) => {
                const xPos = pad + i * stepX;
                const yPos = scaleY(val);
                path += i === 0 ? `M ${xPos} ${yPos}` : ` L ${xPos} ${yPos}`;
                svg += `<circle cx="${xPos}" cy="${yPos}" r="3" fill="${points || color}"/>`;
            });

            svg += `<path d="${path}" fill="none" stroke="${color}" stroke-width="2"/>`;
        });

        svg += `</svg>`;
        return svg;
    },

    pie({
        labels = [],
        data = [],
        colors = {}
    }) {
        if (!labels.length || labels.length !== data.length) return "";

        const {
            background = "white",
            text = "black",
            lines = "#666",
            slices = [
                "#4e79a7",
                "#f28e2b",
                "#e15759",
                "#76b7b2",
                "#59a14f",
                "#edc948",
                "#b07aa1",
                "#ff9da7"
            ]
        } = colors;

        const width = 700;
        const height = 500;
        const radius = Math.min(width, height) / 3.5;
        const cx = width / 2;
        const cy = height / 2;
        const total = data.reduce((a, b) => a + b, 0);

        let startAngle = 0;

        let svg = `<svg viewBox="0 0 ${width} ${height}" width="100%" height="auto" preserveAspectRatio="xMinYMid meet" xmlns="http://www.w3.org/2000/svg">`;

        svg += `<rect width="${width}" height="${height}" fill="${background}"/>`;

        data.forEach((val, i) => {
            const sliceAngle = (val / total) * 2 * Math.PI;
            const endAngle = startAngle + sliceAngle;

            const x1 = cx + radius * Math.cos(startAngle);
            const y1 = cy + radius * Math.sin(startAngle);
            const x2 = cx + radius * Math.cos(endAngle);
            const y2 = cy + radius * Math.sin(endAngle);
            const largeArc = sliceAngle > Math.PI ? 1 : 0;

            const color = slices[i % slices.length];

            svg += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${color}"/>`;

            if (sliceAngle > 0.15) {
                const mid = startAngle + sliceAngle / 2;
                const lineStartX = cx + radius * Math.cos(mid);
                const lineStartY = cy + radius * Math.sin(mid);
                const lineEndX = cx + (radius + 40) * Math.cos(mid);
                const lineEndY = cy + (radius + 40) * Math.sin(mid);

                const percent = ((val / total) * 100).toFixed(1);
                const anchor = Math.cos(mid) >= 0 ? "start" : "end";
                const textX = lineEndX + (anchor === "start" ? 5 : -5);

                svg += `
          <line x1="${lineStartX}" y1="${lineStartY}" x2="${lineEndX}" y2="${lineEndY}" stroke="${lines}"/>
          <text x="${textX}" y="${lineEndY}" font-size="11" fill="${text}" text-anchor="${anchor}">
            ${labels[i]} (${percent}%)
          </text>
        `;
            }

            startAngle = endAngle;
        });

        svg += `</svg>`;
        return svg;
    }
};

const { div, button, span, h2, p } = h;

export function modal({
    id = "modal",
    title = "Modal Title",
    size = "md",
    content = "",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
} = {}) {
    const sizeMap = { sm: "360px", md: "520px", lg: "720px" };
    const maxWidth = sizeMap[size] ?? sizeMap.md;

    return div(
        {
            id,
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": `${id}-title`,
            style: {
                display: "none",
                position: "fixed",
                inset: "0",
                "z-index": "9999",
                "align-items": "center",
                "justify-content": "center",
                background: "rgba(10,10,20,0.55)",
                "backdrop-filter": "blur(4px)",
            },
        },
        div(
            {
                role: "document",
                style: {
                    position: "relative",
                    width: `min(${maxWidth}, calc(100vw - 2rem))`,
                    background: "#ffffff",
                    "border-radius": "16px",
                    "box-shadow": "0 24px 60px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                },
            },
            div({
                style: {
                    height: "4px",
                    background: "linear-gradient(90deg,#6366f1,#a78bfa,#38bdf8)",
                },
            }),
            div(
                {
                    style: {
                        display: "flex",
                        "align-items": "center",
                        "justify-content": "space-between",
                        padding: "1.25rem 1.5rem 0",
                    },
                },
                h2(
                    {
                        id: `${id}-title`,
                        style: {
                            margin: "0",
                            "font-size": "1.125rem",
                            "font-weight": "700",
                            color: "#0f0f1a",
                            "letter-spacing": "-0.01em",
                        },
                    },
                    title
                ),
                button(
                    {
                        onclick: `document.getElementById('${id}').style.display='none'`,
                        "aria-label": "Close modal",
                        style: {
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px",
                            "border-radius": "6px",
                            color: "#6b7280",
                            "line-height": "1",
                        },
                    },
                    `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>`
                )
            ),
            div(
                {
                    id: `${id}-body`,
                    style: {
                        padding: "1rem 1.5rem 0",
                        color: "#374151",
                        "font-size": "0.9375rem",
                        "line-height": "1.65",
                    },
                },
                content
                    ? p({ style: { margin: "0" } }, content)
                    : span({ style: { display: "none" } })
            ),
            div(
                {
                    style: {
                        display: "flex",
                        "justify-content": "flex-end",
                        gap: "0.625rem",
                        padding: "1.25rem 1.5rem",
                    },
                },
                button(
                    {
                        onclick: `document.getElementById('${id}').style.display='none'`,
                        style: {
                            padding: "0.5rem 1.125rem",
                            "border-radius": "8px",
                            border: "1.5px solid #e5e7eb",
                            background: "#ffffff",
                            color: "#374151",
                            "font-size": "0.875rem",
                            "font-weight": "500",
                            cursor: "pointer",
                        },
                    },
                    cancelLabel
                ),
                button(
                    {
                        id: `${id}-confirm`,
                        style: {
                            padding: "0.5rem 1.125rem",
                            "border-radius": "8px",
                            border: "none",
                            background: "linear-gradient(135deg,#6366f1,#818cf8)",
                            color: "#ffffff",
                            "font-size": "0.875rem",
                            "font-weight": "600",
                            cursor: "pointer",
                            "box-shadow": "0 2px 8px rgba(99,102,241,0.35)",
                        },
                    },
                    confirmLabel
                )
            )
        )
    );
}

export function openModal(id = "modal", bodyHTML = null) {
    return `
    (function(){
      var m = document.getElementById(${JSON.stringify(id)});
      if (!m) return;
      ${bodyHTML != null ? `document.getElementById(${JSON.stringify(id + "-body")}).innerHTML = ${JSON.stringify(bodyHTML)};` : ""}
      m.style.display = 'flex';
      m.querySelector('[id$="-confirm"]')?.focus();
      m.onclick = function(e){ if(e.target === m) m.style.display='none'; };
      document.onkeydown = function(e){ if(e.key==='Escape') m.style.display='none'; };
    })();
  `;
}

export const render = async ({ filename }, content, config = {}) => {
    const basename = filename.split("/").pop();
    filename = "dist/" + basename;
    const outputDir = join(dirname(filename), "libs");
    const scriptTags = [];
    if (config.api) {
        const apiCode = `${parseFunction()}\n\n${fetchInit()}\n\n${actionInit()}`;
        await mkdir(outputDir, { recursive: true });
        await writeFile(join(outputDir, "api.js"), apiCode);
        scriptTags.push(`<script src="libs/api.js"></script>`);
    }
    if (config.libs?.length) {
        await mkdir(outputDir, { recursive: true });
        const libScripts = await loadLibs(config.libs);
        for (let i = 0; i < config.libs.length; i++) {
            const libName = config.libs[i];
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

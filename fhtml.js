import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const voidTags = new Set([
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr"
]);

const escape = (str) =>
    String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

function el(tag, props = {}, ...children) {
    if (typeof tag === "function") {
        return tag({ ...props, children });
    }

    const { children: propChildren, ...attrs } = props || {};

    const attrString = Object.entries(attrs)
        .filter(([_, v]) => v != null && v !== false)
        .map(([k, v]) => {
            if (v === true) return k;
            if (k === "style" && typeof v === "object") {
                const style = Object.entries(v)
                    .map(([p, val]) => `${p.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}:${val}`)
                    .join(";");
                return `style="${escape(style)}"`;
            }
            return `${k}="${escape(v)}"`;
        })
        .join(" ");

    const flatChildren = [children, propChildren]
        .flat(Infinity)
        .filter(c => c != null && c !== false)
        .map(c => {
            const s = String(c);
            if (tag === "script" || tag === "style") return s;
            if (s.startsWith("<") && s.endsWith(">")) return s;
            return escape(s);
        })
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
    "details", "summary", "dialog", "canvas", "svg", "slot", "template"
];

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
      onSuccess = (data) => {},
      onError = (err) => console.error(err),
      refetchInterval = 0
    } = config;

    const targetEls = targets.map(t => document.querySelector(t));
    const loadingEl = loading ? document.querySelector(loading) : null;

    const resolvePath = (obj, path) => {
      if (!path) return obj;
      return path
        .replace(/\\[(\\w+)\\]/g, ".$1")
        .split(".")
        .reduce((acc, key) => acc?.[key], obj);
    };

    const doFetch = async () => {
      try {
        if (loadingEl) loadingEl.style.display = "";

        const res = await window.fetch(url);
        if (!res.ok) throw new Error("HTTP " + res.status);

        const data = await res.json();

        if (loadingEl) loadingEl.style.display = "none";

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

        const res = await window.fetch(finalUrl, {
          method: method.toUpperCase(),
          headers: !isGet ? { "Content-Type": "application/json" } : {},
          body: !isGet ? JSON.stringify(bodyData) : null
        });

        if (!res.ok) throw new Error("Status: " + res.status);

        const result = await res.json();

        if (loadingEl) loadingEl.style.display = "none";

        targets.forEach((_, i) => {
          const targetEl = targetEls[i];
          const template = templates[i];
          const key = keys[i];

          if (!targetEl || !template) return;

          const content = resolvePath(result, key);
          const items = Array.isArray(content) ? content : [content];

          const html = items.map(item => parse(template, item)).join("");
          targetEl.innerHTML = html;
        });

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

export const render = async ({ filename }, content) => {
  const inits = `
  <script>
    ${parseFunction()}
    ${fetchInit()}
    ${actionInit()}
  </script>
  `;

  const html = content.replace("<body>", `<body>${inits}`);

  await Bun.write(filename, html);
};
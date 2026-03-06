import { Glob } from "bun";
import { watch } from "node:fs"; // Use the node:fs watcher for better stability
import { join, basename, extname } from "path";

function el(tag, props = {}, ...children) {
    const voidTags = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);

    const escape = (str) =>
        String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");

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
                    .map(([p, val]) =>
                        `${p.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}:${val}`
                    )
                    .join(";");
                return `style="${escape(style)}"`;
            }

            return `${k}="${escape(v)}"`;
        })
        .join(" ");

    const flatChildren = [...children, propChildren]
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

    if (voidTags.has(tag)) return openTag;

    return `${openTag}${flatChildren}</${tag}>`;
}

const tags = ["html", "head", "title", "base", "link", "meta", "style", "script", "noscript", "body", "section", "nav", "article", "aside", "h1", "h2", "h3", "h4", "h5", "h6", "header", "footer", "address", "main", "p", "hr", "pre", "blockquote", "ol", "ul", "li", "dl", "dt", "dd", "figure", "figcaption", "div", "a", "em", "strong", "small", "s", "cite", "q", "dfn", "abbr", "ruby", "rt", "rp", "data", "time", "code", "var", "samp", "kbd", "sub", "sup", "i", "b", "u", "mark", "bdi", "bdo", "span", "br", "wbr", "ins", "del", "picture", "source", "img", "iframe", "embed", "object", "param", "video", "audio", "track", "map", "area", "table", "caption", "colgroup", "col", "tbody", "thead", "tfoot", "tr", "td", "th", "form", "label", "input", "button", "select", "datalist", "optgroup", "option", "textarea", "output", "progress", "meter", "fieldset", "legend", "details", "summary", "dialog", "canvas", "svg", "slot", "template"];

tags.forEach(tag => {
    globalThis[tag] = (...args) => {
        let mergedProps = {};
        let childrenStart = 0;
        while (childrenStart < args.length && Object.prototype.toString.call(args[childrenStart]) === "[object Object]") {
            Object.assign(mergedProps, args[childrenStart]);
            childrenStart++;
        }
        return el(tag, mergedProps, ...args.slice(childrenStart));
    };
});

// BETTER HEAD
globalThis._head = (config, ...children) => {
    const isConfig = typeof config === "object" && !config.tag && config !== null;
    const { 
        title: t, 
        description: desc, 
        author, 
        thumbnail, 
        url, 
        icon, 
        imports = [], 
        ...rest 
    } = isConfig ? config : {};

    const headChildren = [];
    const manualChildren = isConfig ? children : [config, ...children];

    if (t) {
        const titleText = typeof t === "string" ? t : ""; 
        headChildren.push(typeof t === "string" ? title(t) : t);
        if (titleText) {
            headChildren.push(meta({ property: "og:title", content: titleText }));
            headChildren.push(meta({ name: "twitter:title", content: titleText }));
        }
    }

    if (desc) {
        headChildren.push(meta({ name: "description", content: desc }));
        headChildren.push(meta({ property: "og:description", content: desc }));
        headChildren.push(meta({ name: "twitter:description", content: desc }));
    }

    if (author) headChildren.push(meta({ name: "author", content: author }));

    if (thumbnail) {
        headChildren.push(meta({ property: "og:image", content: thumbnail }));
        headChildren.push(meta({ name: "twitter:image", content: thumbnail }));
        headChildren.push(meta({ name: "twitter:card", content: "summary_large_image" }));
    }

    if (url) {
        headChildren.push(meta({ property: "og:url", content: url }));
        headChildren.push(link({ rel: "canonical", href: url }));
    }

    if (icon) {
        const ext = icon.split('.').pop().split('?')[0];
        const type = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`;
        headChildren.push(link({ rel: "icon", type, href: icon }));
    }

    imports.forEach(path => {
        const cleanPath = path.split('?')[0].toLowerCase();
        const isCSS = cleanPath.endsWith(".css") || path.includes("(css)");
        const isJS = cleanPath.endsWith(".js") || cleanPath.endsWith(".mjs") || path.includes("(js)");

        if (isCSS) {
            headChildren.push(link({ rel: "stylesheet", href: path.replace("(css)", "") }));
        } else if (isJS) {
            headChildren.push(script({ src: path.replace("(js)", ""), defer: true }));
        }
    });

    Object.entries(rest).forEach(([name, content]) => {
        if (name !== "children") headChildren.push(meta({ name, content }));
    });

    return head(...headChildren, ...manualChildren);
};

// GENERAL ATTR HELPERS
globalThis.id = (val) => ({ id: val });
globalThis.name = (val) => ({ name: val });
globalThis.click = (val) => ({ onclick: val });
globalThis.cls = (...classes) => ({ class: classes.filter(Boolean).join(" ") });
globalThis.css = (obj) => ({ style: obj });
globalThis.observe = (selector, className, { once = false } = {}) => `
  (() => {
    const elements = document.querySelectorAll("${selector}");
    if (elements.length === 0) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("${className}");
          if (${!!once}) observer.unobserve(entry.target);
        } else {
          entry.target.classList.remove("${className}");
        }
      });
    }, { threshold: 0.1 });
    elements.forEach(el => observer.observe(el));
  })();
`;

// FETCH AND FORM ACTIONS
globalThis.fetch = (url, selector, template, {
    loading = "Loading...",
    onSuccess = "",
    onError = "Error loading data.",
    refetchInterval = 0
} = {}) => {
    return script(
        `
  (async () => {
    const target = document.querySelector("${selector}");
    if (!target) return;
    
const parse = (tpl, item) => {
      // Split by '{', then for each part, find the '}' and resolve the path
      return tpl.split('{').map((part, i) => {
        if (i === 0) return part;
        const [path, ...rest] = part.split('}');
        const value = path.split('.').reduce((obj, key) => obj?.[key], item);
        return (value !== undefined && value !== null ? value : "") + rest.join('}');
      }).join('');
    };

    const fetchData = async () => {
      try {
        const res = await fetch("${url}");
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        const rawHTML = \`${template}\`;
        
        // Handle both single objects and arrays
        const items = Array.isArray(data) ? data : [data];
        target.innerHTML = items.map(item => parse(rawHTML, item)).join("");
        
        ${onSuccess}
      } catch (e) {
        console.error("Fetch error:", e);
        target.innerHTML = \`${onError}\`;
      } finally {
        if (${refetchInterval} > 0) setTimeout(fetchData, ${refetchInterval});
      }
    };
    target.innerHTML = \`${loading}\`;
    fetchData();
  })();
  `
    );
};

globalThis.action = (
    selector,
    {
        on = "submit",
        url,
        method = "POST",
        type = "json",
        loading = "",
        onSuccess = () => { },
        onError = () => { },
        template = "",
        target = ""
    } = {}
) => `
(() => {
  const el = document.querySelector("${selector}");
  if (!el) return;

  const loadingEl = "${loading}" ? document.querySelector("${loading}") : null;
  if (loadingEl) loadingEl.style.display = "none";

  el.addEventListener("${on}", async (e) => {
    if ("${on}" === "submit") e.preventDefault();

    const targetSelector = "${target}";
    const targetEl = targetSelector ? document.querySelector(targetSelector) : null;

    if (loadingEl) loadingEl.style.display = "";

    try {
      const data = {};

      if (el.tagName === "FORM") {
        new FormData(el).forEach((v, k) => { data[k] = v; });
      } else if (el.name || (el.value !== undefined && el.value !== null)) {
        data[el.name || "value"] = el.value;
      }

      let finalUrl = "${url}";
      Object.keys(data).forEach(key => {
        const regex = new RegExp(":" + key, "g");
        if (regex.test(finalUrl)) {
          finalUrl = finalUrl.replace(regex, encodeURIComponent(data[key]));
          if ("${type}" === "param") delete data[key];
        }
      });

      const options = {
        method: "${method.toUpperCase()}",
        headers: { "Content-Type": "application/json" }
      };

      if (options.method !== "GET") {
        options.body = JSON.stringify(data);
      }

      const res = await fetch(finalUrl, options);
      if (!res.ok) throw new Error("Server Error: " + res.status);

      const resultData = await res.json();

      const parse = (tpl, item) => {
        return tpl.split("{").map((part, i) => {
          if (i === 0) return part;
          const [path, ...rest] = part.split("}");
          const value = path.split(".").reduce((obj, key) => obj?.[key], item);
          return (value !== undefined && value !== null ? value : "") + rest.join("}");
        }).join("");
      };

      if (targetEl && \`${template}\`.trim() !== "") {
        targetEl.innerHTML = parse(\`${template}\`, resultData);
      }

      if (loadingEl && loadingEl !== targetEl) {
        loadingEl.style.display = "none";
      }

      (${onSuccess})(resultData);

    } catch (err) {
      if (loadingEl && loadingEl !== targetEl) {
        loadingEl.style.display = "none";
      }

      (${onError})({ message: err.message });
    }
  });
})();
`;

// COMPONENTS 
// import * as Brutalist from "./templates/brutalist";
// import * as Material from "./templates/material";
// import * as Default from "./templates/default";

const build = async () => {
    const glob = new Glob("**/*.fhtml");

    for await (const file of glob.scan(".")) {
        try {
            const content = await Bun.file(file).text();
            const result = await eval(content);

            if (result) {
                const outPath = file.replace(".fhtml", ".html");
                await Bun.write(outPath, `<!DOCTYPE html>\n${result}`);
                console.log(`✅ Compiled: ${file} -> ${outPath}`);
            }
        } catch (err) {
            console.error(`❌ Error in ${file}:`, err.message);
        }
    }
};

await build();

console.log("👀 Watching for changes...");
watch("./", { recursive: true }, (event, filename) => {
    if (filename?.endsWith(".fhtml")) build();
});

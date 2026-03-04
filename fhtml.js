import { Glob } from "bun";
import { watch } from "node:fs"; // Use the node:fs watcher for better stability
import { join, basename, extname } from "path";

function el(tag, props = {}, ...children) {
  const voidTags = new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);
  const escape = (str) => String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  if (typeof tag === "function") return tag({ ...props, children });
  const { children: propChildren, ...attrs } = props;
  const attrString = Object.entries(attrs)
    .filter(([_, v]) => v != null && v !== false)
    .map(([k, v]) => {
      if (v === true) return k;
      if (k === "style" && typeof v === "object") {
        const style = Object.entries(v).map(([p, val]) => `${p.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}:${val}`).join(";");
        return `style="${escape(style)}"`;
      }
      return `${k}="${escape(v)}"`;
    }).join(" ");

  const flatChildren = [...children, propChildren].flat(Infinity).filter(c => c != null && c !== false)
    .map(c => {
      const s = String(c);
      if (tag === "script" || tag === "style") return s;
      if (s.startsWith("<") && s.endsWith(">")) return s;
      return escape(s);
    }).join("");

  const openTag = `<${tag}${attrString ? " " + attrString : ""}>`;
  if (voidTags.has(tag)) return openTag;
  return `${openTag}${flatChildren}</${tag}>`;
}

const tags = ["html","head","title","base","link","meta","style","script","noscript","body","section","nav","article","aside","h1","h2","h3","h4","h5","h6","header","footer","address","main","p","hr","pre","blockquote","ol","ul","li","dl","dt","dd","figure","figcaption","div","a","em","strong","small","s","cite","q","dfn","abbr","ruby","rt","rp","data","time","code","var","samp","kbd","sub","sup","i","b","u","mark","bdi","bdo","span","br","wbr","ins","del","picture","source","img","iframe","embed","object","param","video","audio","track","map","area","table","caption","colgroup","col","tbody","thead","tfoot","tr","td","th","form","label","input","button","select","datalist","optgroup","option","textarea","output","progress","meter","fieldset","legend","details","summary","dialog","canvas","svg","slot","template"];

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

globalThis.action = (selector, {
  url,
  method = "POST",
  type = "json",
  loading = "Sending...",
  onSuccess = "",
  onError = "Action failed.",
  template = "" 
} = {}) => script(
`
  (() => {
    const form = document.querySelector("${selector}");
    if (!form) return;

    form.onsubmit = async (e) => {
      e.preventDefault();
      const target = form.querySelector("[data-result]") || form.querySelector(".result");
      if (target) {
        target.innerHTML = \`${loading}\`;
      } else {
        // Fallback: Create a temporary status message if no target exists
        let status = form.querySelector(".form-status");
        if (!status) {
          status = document.createElement("div");
          status.className = "form-status";
          form.appendChild(status);
        }
        status.innerHTML = \`${loading}\`;
      }

      try {
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => { data[key] = value; });
        
        let finalUrl = "${url}";
        
        // Improved replacement logic
        Object.keys(data).forEach(key => {
          const regex = new RegExp(":" + key, "g");
          if (regex.test(finalUrl)) {
            finalUrl = finalUrl.replace(regex, encodeURIComponent(data[key]));
            if ("${type}" === "param") delete data[key];
          }
        });

        let options = { 
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
          return tpl.split('{').map((part, i) => {
            if (i === 0) return part;
            const [path, ...rest] = part.split('}');
            const value = path.split('.').reduce((obj, key) => obj?.[key], item);
            return (value !== undefined && value !== null ? value : "") + rest.join('}');
          }).join('');
        };

        if (target) {
          target.innerHTML = \`${template}\` ? parse(\`${template}\`, resultData) : "Success!";
        } else {
          alert("Success!");
        }

        ${onSuccess}
      } catch (e) {
        console.error("FormAction Error:", e.message);
        if (target) {
          // Restore the original UI on error so the form doesn't vanish
          target.innerHTML = \`<div style="color:red">\${e.message}</div>\` + (originalHTML || "");
        } else {
          alert(\`${onError}\`);
        }
      }
    };
  })();
`
);

// COMPONENTS 
import * as Brutalist from "./brutalist";
import * as Material from "./material";
import * as Default from "./default";

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
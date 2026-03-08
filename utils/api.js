export const mapTemplate = () => `function mapTemplate(tpl, data) {
  const resolve = (obj, path) => {
    return path
      .replace(/\\[(\\w+)\\]/g, ".$1")
      .split(".")
      .reduce((acc, key) => {
        if (acc == null || typeof acc !== "object") return "";
        return acc[key];
      }, obj);
  };

  const parse = (template, obj) => {
    return template.replace(/\\{([^}]+)\\}/g, (_, expr) => {
      const value = resolve(obj, expr.trim());
      return value == null || typeof value === "object" ? "" : value;
    });
  };

  if (Array.isArray(data)) {
    return data.map(item => parse(tpl, item)).join("");
  }

  if (typeof data === "object" && data !== null) {
    return parse(tpl, data);
  }

  return tpl;
}`;

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

    const hasRender = targets.length && templates.length;

    const targetEls = hasRender
      ? targets.map(t => document.querySelector(t))
      : [];

    const loadingEl = loading ? document.querySelector(loading) : null;

    const resolvePath = (obj, path) => {
      if (!path) return obj;
      return path
        .replace(/\\[(\\w+)\\]/g, ".$1")
        .split(".")
        .reduce((acc, key) => acc?.[key], obj);
    };

    const render = (data) => {
      if (!hasRender) return;

      targets.forEach((_, i) => {
        const targetEl = targetEls[i];
        const template = templates[i];
        const key = keys[i];

        if (!targetEl || !template) return;

        const content = resolvePath(data, key);
        targetEl.innerHTML = mapTemplate(template, content);
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

export const action = (selector, config = {}) => {
    return `window.action(${JSON.stringify(selector)}, ${JSON.stringify(config)});`;
};

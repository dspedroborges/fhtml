function mapTemplate(tpl, data) {
    const resolve = (obj, path) => {
        return path
            .replace(/\[(\w+)\]/g, ".$1")
            .split(".")
            .reduce((acc, key) => {
                if (acc == null || typeof acc !== "object") return "";
                return acc[key];
            }, obj);
    };
    const parse = (template, obj) => {
        return template.replace(/\{\{([^}]+)\}\}/g, (_, expr) => {
            const value = resolve(obj, expr.trim());
            return value == null || typeof value === "object" ? "" : value;
        });
    };
    if (Array.isArray(data)) return data.map(item => parse(tpl, item)).join("");
    if (typeof data === "object" && data !== null) return parse(tpl, data);
    return tpl;
}

function action(selector, config = {}) {
    const {
        on = "submit",
        url,
        method = "POST",
        targets = [],
        templates = [],
        keys = [],
        loading = "",
        cache = 0,
        // Bearer auth: pass token string or a JS expression to evaluate at runtime
        // e.g. auth: "mytoken" or auth: "localStorage.getItem('token')"
        auth = null,
        // Where to source :var placeholders in the URL.
        // "input" (default) — find <input name="var"> in the DOM
        // "query"           — read from current URL search params
        // "param"           — same as query
        varSource = "input",
        // Re-run the action every N ms (0 = disabled)
        refetchInterval = 0,
        onSuccess = () => { },
        onError = () => { },
    } = config;

    const el = document.querySelector(selector);
    if (!el) return;

    const hasRender = targets.length && templates.length;
    const targetEls = hasRender ? targets.map(t => document.querySelector(t)) : [];
    const loadingEl = loading ? document.querySelector(loading) : null;

    const resolvePath = (obj, path) => {
        if (!path) return obj;
        return path
            .replace(/\[(\w+)\]/g, ".$1")
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

    // Resolve bearer token — either a literal string or an expression to eval
    const getToken = () => {
        if (!auth) return null;
        try { return eval(auth); } catch { return auth; }
    };

    // Resolve :var placeholders from different sources
    const resolveVars = (rawUrl, formData) => {
        const urlParams = new URLSearchParams(window.location.search);
        const bodyData = { ...formData };
        let finalUrl = rawUrl;

        const placeholders = [...rawUrl.matchAll(/:(\w+)/g)].map(m => m[1]);
        for (const key of placeholders) {
            let value;
            if (varSource === "query" || varSource === "param") {
                value = urlParams.get(key);
            } else {
                // "input" — from form data, falling back to a named input in the DOM
                value = formData[key] ?? document.querySelector(`[name="${key}"]`)?.value;
            }
            if (value != null) {
                finalUrl = finalUrl.replace(":" + key, encodeURIComponent(value));
                delete bodyData[key];
            }
        }
        return { finalUrl, bodyData };
    };

    const execute = async () => {
        if (loadingEl) loadingEl.style.display = "";

        try {
            const formData = {};
            if (el.tagName === "FORM") {
                new FormData(el).forEach((v, k) => { formData[k] = v; });
            } else {
                formData[el.name || "value"] = el.value;
            }

            const { finalUrl, bodyData } = resolveVars(url, formData);

            const isGet = method.toUpperCase() === "GET";
            let fetchUrl = finalUrl;
            if (isGet) {
                const params = new URLSearchParams(bodyData).toString();
                if (params) fetchUrl += (fetchUrl.includes("?") ? "&" : "?") + params;
            }

            const cacheKey = "actionCache:" + fetchUrl;
            if (cache) {
                const stored = localStorage.getItem(cacheKey);
                if (stored) {
                    try {
                        const parsed = JSON.parse(stored);
                        if (Date.now() < parsed.expire) {
                            render(parsed.data);
                            if (loadingEl) loadingEl.style.display = "none";
                            onSuccess(parsed.data);
                            return;
                        } else {
                            localStorage.removeItem(cacheKey);
                        }
                    } catch { }
                }
            }

            const headers = {};
            if (!isGet) headers["Content-Type"] = "application/json";
            const token = getToken();
            if (token) headers["Authorization"] = "Bearer " + token;

            const res = await fetch(fetchUrl, {
                method: method.toUpperCase(),
                headers,
                body: !isGet ? JSON.stringify(bodyData) : null,
            });

            if (!res.ok) throw new Error("Status: " + res.status);
            const result = await res.json();

            if (cache) {
                localStorage.setItem(cacheKey, JSON.stringify({
                    expire: Date.now() + cache,
                    data: result,
                }));
            }

            render(result);
            if (loadingEl) loadingEl.style.display = "none";
            onSuccess(result);
        } catch (err) {
            if (loadingEl) loadingEl.style.display = "none";
            onError(err);
        }
    };

    el.addEventListener(on, (e) => {
        if (on === "submit") e.preventDefault();
        execute();
    });

    if (refetchInterval > 0) {
        setInterval(execute, refetchInterval);
    }
}

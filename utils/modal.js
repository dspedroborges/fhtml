import { h } from "../fhtml.js";

export function modal({
    id = "modal",
    title = "Modal Title",
    size = "md",
    content = "",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
} = {}) {
    const { div, button, span, h2, p } = h;
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

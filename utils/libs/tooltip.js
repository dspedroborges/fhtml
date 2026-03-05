(function () {
  const gap = 6;

  const tip = document.createElement("div");
  Object.assign(tip.style, {
    position: "fixed",
    padding: "4px 8px",
    fontSize: "12px",
    background: "#111",
    color: "#fff",
    borderRadius: "4px",
    pointerEvents: "none",
    whiteSpace: "nowrap",
    zIndex: 9999,
    opacity: 0,
    transition: "opacity .1s"
  });
  document.body.appendChild(tip);

  function show(el, pos, content) {
    tip.textContent = content;
    tip.style.opacity = 1;

    const r = el.getBoundingClientRect();
    const t = tip.getBoundingClientRect();

    let top = 0, left = 0;

    switch (pos) {
      case "t":
        top = r.top - t.height - gap;
        left = r.left + (r.width - t.width) / 2;
        break;
      case "tl":
        top = r.top - t.height - gap;
        left = r.left;
        break;
      case "tr":
        top = r.top - t.height - gap;
        left = r.right - t.width;
        break;
      case "b":
        top = r.bottom + gap;
        left = r.left + (r.width - t.width) / 2;
        break;
      case "bl":
        top = r.bottom + gap;
        left = r.left;
        break;
      case "br":
        top = r.bottom + gap;
        left = r.right - t.width;
        break;
      case "l":
        top = r.top + (r.height - t.height) / 2;
        left = r.left - t.width - gap;
        break;
      case "r":
        top = r.top + (r.height - t.height) / 2;
        left = r.right + gap;
        break;
    }

    tip.style.top = top + "px";
    tip.style.left = left + "px";
  }

  function hide() {
    tip.style.opacity = 0;
  }

  document.addEventListener("mouseover", e => {
    const el = e.target;
    const attrs = el.attributes;
    for (let i = 0; i < attrs.length; i++) {
      const a = attrs[i].name;
      if (a.startsWith("tooltip-")) {
        const pos = a.split("-")[1];
        return show(el, pos, el.getAttribute(a));
      }
    }
  });

  document.addEventListener("mouseout", hide);
})();
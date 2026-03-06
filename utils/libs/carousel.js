(function () {
  function initCarousel(root) {
    const parts          = (root.getAttribute("carousel") || "1").split(";")
    const desktopVisible = parseInt(parts[0]) || 1
    const autoDelay      = parseInt((parts.find(p => p.startsWith("auto=")) || "=0").split("=")[1])
    const controls       = parts.find(p => ["bullets","carets","bullets-carets"].includes(p)) || ""
    const showBullets    = controls.includes("bullets")
    const showCarets     = controls.includes("carets")

    const items = Array.from(root.children)
    if (!items.length) return

    let current = 0, startX = 0, deltaX = 0, dragging = false, timer = null

    const visible = () => window.innerWidth <= 768 ? 1 : desktopVisible
    const maxIdx  = () => Math.max(0, items.length - visible())
    const mkEl    = (tag, css) => { const e = document.createElement(tag); Object.assign(e.style, css); return e }

    const track    = mkEl("div", { display:"flex", transition:"transform .3s ease" })
    const viewport = mkEl("div", { overflow:"hidden", width:"100%", position:"relative", cursor:"grab" })
    const dotsWrap = mkEl("div", { display: showBullets ? "flex" : "none", justifyContent:"center", gap:"8px", position:"absolute", bottom:"12px", left:"0", right:"0", zIndex:"10" })

    items.forEach(i => { i.style.flex = "0 0 auto"; track.appendChild(i) })
    viewport.appendChild(track)

    const mkArrow = (d, side) => {
      const b = mkEl("button", { position:"absolute", top:"50%", transform:"translateY(-50%)", zIndex:"10",
        background:"rgba(0,0,0,.6)", color:"#fff", border:"none", width:"44px", height:"44px",
        display: showCarets ? "flex" : "none", alignItems:"center", justifyContent:"center",
        cursor:"pointer", borderRadius:"50%", padding:"0", [side]:"10px" })
      b.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width:22px;height:22px;display:block"><path stroke-linecap="round" stroke-linejoin="round" d="${d}"/></svg>`
      return b
    }
    const prev = mkArrow("M15.75 19.5 8.25 12l7.5-7.5", "left")
    const next = mkArrow("m8.25 4.5 7.5 7.5-7.5 7.5",  "right")
    viewport.append(prev, next, dotsWrap)

    Object.assign(root.style, { position:"relative", width:"100%" })
    root.appendChild(viewport)

    function goTo(i) {
      current = i > maxIdx() ? 0 : i < 0 ? maxIdx() : i
      track.style.transition = "transform .3s ease"
      track.style.transform  = `translateX(${-(current * 100 / visible())}%)`
      Array.from(dotsWrap.children).forEach((d, i) => d.style.background = i === current ? "#333" : "#ccc")
    }

    function updateSizes() {
      items.forEach(i => i.style.width = 100 / visible() + "%")
      if (current > maxIdx()) current = maxIdx()
      goTo(current)
      if (showBullets) {
        dotsWrap.innerHTML = ""
        Array.from({ length: maxIdx() + 1 }, (_, i) => {
          const d = mkEl("button", { width:"10px", height:"10px", borderRadius:"50%", border:"none", cursor:"pointer", background: i === current ? "#333" : "#ccc" })
          d.onclick = () => goTo(i)
          dotsWrap.appendChild(d)
        })
      }
    }

    const startAuto = () => { if (autoDelay) { clearInterval(timer); timer = setInterval(() => goTo(current + 1), autoDelay) } }

    const dragStart = x  => { clearInterval(timer); dragging = true; startX = x; deltaX = 0; track.style.transition = "none" }
    const dragMove  = x  => { if (!dragging) return; deltaX = x - startX; track.style.transform = `translateX(${-(current * 100 / visible()) + deltaX / viewport.offsetWidth * 100}%)` }
    const dragEnd   = () => { if (!dragging) return; dragging = false; goTo(current + (Math.abs(deltaX) > 50 ? (deltaX < 0 ? 1 : -1) : 0)); deltaX = 0; startAuto() }

    prev.onclick = () => goTo(current - 1)
    next.onclick = () => goTo(current + 1)

    viewport.addEventListener("mousedown",  e => { dragStart(e.clientX); viewport.style.cursor = "grabbing" })
    viewport.addEventListener("touchstart", e => dragStart(e.touches[0].clientX))
    viewport.addEventListener("dragstart",  e => e.preventDefault())
    window.addEventListener("mousemove",    e => dragMove(e.clientX))
    window.addEventListener("touchmove",    e => dragMove(e.touches[0].clientX))
    window.addEventListener("mouseup",      () => { dragEnd(); viewport.style.cursor = "grab" })
    window.addEventListener("touchend",     dragEnd)
    window.addEventListener("resize",       updateSizes)

    updateSizes()
    startAuto()
  }
  document.addEventListener("DOMContentLoaded", () => document.querySelectorAll("[carousel]").forEach(initCarousel))
})()
function aos(el, effect = 'fade', duration = 300, once = true, easing = 'ease-out') {
  if (!el) return;

  // ── scroll-based special effects ──────────────────────────────────────────
  if (effect === 'hide-scroll-down' || effect === 'show-scroll-down') {
    const isHide = effect === 'hide-scroll-down';
    const THRESHOLD = 30; // % for show-scroll-down

    // initial state
    el.style.transition = `opacity ${duration}ms ${easing}`;
    el.style.opacity = isHide ? '1' : '0';          // hide-scroll-down starts visible
    el.style.pointerEvents = isHide ? '' : 'none';

    const applyState = (visible) => {
      el.style.opacity = visible ? '1' : '0';
      el.style.pointerEvents = visible ? '' : 'none';
    };

    window.addEventListener('scroll', () => {
      const pct  = window.scroll_percentual;
      const dir  = window.scroll_direction;

      if (isHide) {
        // visible when scrolling UP (or at top), hidden when scrolling DOWN
        applyState(dir === 'up' || pct === 0);
      } else {
        // visible only when scroll >= 30% AND direction is down
        applyState(pct >= THRESHOLD && dir === 'down');
      }
    }, false);

    return; // skip the IntersectionObserver path
  }
  // ─────────────────────────────────────────────────────────────────────────

  const parseEffect = (eff) => {
    const [type, dirPart = 'top=20px'] = eff.split(';');
    const [dir, dist = '20px'] = dirPart.split('=');
    return { type, dir, dist };
  };
  const getTransforms = (type, dir, dist) => {
    const translate = {
      'top':        `translateY(-${dist})`,
      'down':       `translateY(${dist})`,
      'left':       `translateX(-${dist})`,
      'right':      `translateX(${dist})`,
      'top-left':   `translate(-${dist}, -${dist})`,
      'top-right':  `translate(${dist}, -${dist})`,
      'down-left':  `translate(-${dist}, ${dist})`,
      'down-right': `translate(${dist}, ${dist})`
    };
    const flip = {
      'top':        'rotateX(90deg)',
      'down':       'rotateX(-90deg)',
      'left':       'rotateY(90deg)',
      'right':      'rotateY(-90deg)',
      'top-left':   'rotateX(90deg) rotateY(90deg)',
      'top-right':  'rotateX(90deg) rotateY(-90deg)',
      'down-left':  'rotateX(-90deg) rotateY(90deg)',
      'down-right': 'rotateX(-90deg) rotateY(-90deg)'
    };
    return type === 'flip' ? flip[dir] :
           type === 'zoom' ? `${translate[dir]} scale(0.5)` :
           translate[dir];
  };

  const effectInfo    = parseEffect(effect);
  const resetTransform = getTransforms(effectInfo.type, effectInfo.dir, effectInfo.dist);

  const wrapper = document.createElement('div');
  wrapper.className  = 'aos-wrapper';
  wrapper.style.perspective = '1000px';
  wrapper.style.display = getComputedStyle(el).display === 'inline' ? 'inline-block' : 'block';
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);

  el.style.opacity          = '0';
  el.style.transform        = resetTransform;
  el.style.transition       = 'none';
  el.style.backfaceVisibility = 'hidden';

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const show = entry.isIntersecting;
      el.style.transition = show
        ? `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`
        : 'none';
      el.style.opacity   = show ? '1' : '0';
      el.style.transform = show
        ? 'translate(0,0) rotateX(0) rotateY(0) scale(1)'
        : resetTransform;
      if (once && show) observer.unobserve(wrapper);
    });
  }, { threshold: 0.1 });

  observer.observe(wrapper);
}

// ── auto-init ────────────────────────────────────────────────────────────────
document.querySelectorAll('[aos]').forEach(el => {
  const data = el.getAttribute('aos');
  if (!data) return;
  const parts    = data.split(';');
  const duration = parseInt(parts[2]) || 300;
  const once     = parts.includes('once');
  const easing   = parts.find(p =>
    p.startsWith('cubic') ||
    ['linear','ease','ease-in','ease-out','ease-in-out'].includes(p)
  ) || 'ease-out';
  aos(el, data, duration, once, easing);
});

// ── scroll tracker ───────────────────────────────────────────────────────────
window.scroll_percentual = 0;
window.scroll_direction  = '';
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  window.scroll_percentual = (scrollTop / (docHeight || 1)) * 100;
  window.scroll_direction  = scrollTop > lastScrollTop ? 'down'
                           : scrollTop < lastScrollTop ? 'up'
                           : window.scroll_direction;
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, false);
const toast = (() => {
  const POSITIONS = {
    'top-right':  { top: '0', right: '0' },
    'top-left':   { top: '0', left: '0' },
    'bottom-right': { bottom: '0', right: '0' },
    'bottom-left':  { bottom: '0', left: '0' },
    'top-center': {
      top: '0',
      left: '50%',
      transform: 'translateX(-50%)'
    },
    'bottom-center': {
      bottom: '0',
      left: '50%',
      transform: 'translateX(-50%)'
    },
    'center': {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }
  };

  const TYPES = {
    success: {
      color: '#28a745',
      icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
               <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
             </svg>`
    },
    error: {
      color: '#dc3545',
      icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
               <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M6 18L18 6"/>
             </svg>`
    },
    info: {
      color: '#17a2b8',
      icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
               <circle cx="12" cy="12" r="10"/>
               <path stroke-linecap="round" stroke-linejoin="round" d="M12 16v-4M12 8h.01"/>
             </svg>`
    }
  };

  function getContainer(position) {
    let el = document.querySelector(`.toast-container[data-position="${position}"]`);
    if (el) return el;

    el = document.createElement('div');
    el.className = 'toast-container';
    el.dataset.position = position;

    Object.assign(el.style, {
      position: 'fixed',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5em',
      padding: '0.5em',
      pointerEvents: 'none',
      ...POSITIONS[position]
    });

    document.body.appendChild(el);
    return el;
  }

  function create(type, message) {
    const { color, icon } = TYPES[type] || TYPES.info;

    const el = document.createElement('div');

    Object.assign(el.style, {
      pointerEvents: 'auto',
      minWidth: '280px',
      maxWidth: '420px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '14px 20px',
      borderRadius: '8px',
      fontFamily: 'Roboto, system-ui, sans-serif',
      fontSize: '0.95rem',
      color: '#fff',
      background: color,
      boxShadow:
        '0 3px 5px rgba(0,0,0,0.2), 0 6px 10px rgba(0,0,0,0.1), 0 1px 18px rgba(0,0,0,0.1)',
      transform: 'translateY(8px)',
      opacity: '0',
      transition: 'opacity 200ms ease, transform 200ms ease'
    });

    el.innerHTML = icon + `<span>${message}</span>`;
    return el;
  }

  function show(type, message, { position = 'top-right', duration = 3000 } = {}) {
    const container = getContainer(position);
    const el = create(type, message);

    container.appendChild(el);

    while (container.children.length > 3)
      container.removeChild(container.firstChild);

    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      setTimeout(() => el.remove(), 200);
    }, duration);
  }

  return {
    success(message, options) {
      show('success', message, options);
    },
    error(message, options) {
      show('error', message, options);
    },
    info(message, options) {
      show('info', message, options);
    }
  };
})();
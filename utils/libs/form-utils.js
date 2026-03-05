function initMasks() {
  document.querySelectorAll('input[mask]').forEach(input => {
    const pattern = input.getAttribute('mask');
    input.addEventListener('input', e => {
      const raw = e.target.value;
      let result = '', valueIndex = 0;
      for (let i = 0; i < pattern.length && valueIndex < raw.length; i++) {
        const p = pattern[i], c = raw[valueIndex];
        if (p === '9') { if (/\d/.test(c)) result += c; else i--; valueIndex++; }
        else if (p === 'A') { if (/[a-zA-Z]/.test(c)) result += c; else i--; valueIndex++; }
        else if (p === '*') { result += c; valueIndex++; }
        else { result += p; if (c === p) valueIndex++; }
      }
      e.target.value = result;
    });
  });
}

function initCaseTransform() {
  const transforms = {
    lowercase: v => v.toLowerCase(),
    uppercase: v => v.toUpperCase(),
    capitalize: v => v.replace(/\b\w/g, c => c.toUpperCase()),
  };
  Object.entries(transforms).forEach(([attr, fn]) => {
    document.querySelectorAll(`input[${attr}],textarea[${attr}]`).forEach(el => {
      el.addEventListener('input', () => { el.value = fn(el.value); });
    });
  });
}

function initFloatFields() {
  document.querySelectorAll('input[float]:not([data-float-initialized])').forEach(el => {
    const min = el.hasAttribute('min') ? parseFloat(el.getAttribute('min')) : null;
    const max = el.hasAttribute('max') ? parseFloat(el.getAttribute('max')) : null;
    const fmt = n => n.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    el.type = 'text';
    el.addEventListener('input', e => {
      const v = e.target.value.replace(/\D/g, '');
      if (!v) { e.target.value = ''; return; }
      let num = parseFloat(v) / 100;
      if (max !== null && num > max) num = max;
      e.target.value = fmt(num);
    });
    el.addEventListener('blur', e => {
      if (!e.target.value) return;
      const val = parseFloat(e.target.value.replace(/\./g, '').replace(',', '.')) || 0;
      if (min !== null && val < min) e.target.value = fmt(min);
    });
    el.dataset.floatInitialized = "true";
  });
}

function initAutoTrim() {
  document.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('blur', () => { el.value = el.value.trim(); });
  });
}

const EYE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>`;
const EYE_SLASH_ICON = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>`;

function initFilePreview() {
    document.querySelectorAll('[file-preview]').forEach(el => {
        const inputName = el.getAttribute('file-preview');
        const input = document.querySelector(`[name="${inputName}"], #${inputName}`);
        if (!input || input.type !== 'file') return;
        input.addEventListener('change', () => {
            el.innerHTML = '';
            [...input.files].forEach(file => {
                const wrap = document.createElement('div');
                wrap.setAttribute('data-file', file.name);
                if (file.type.startsWith('image/')) {
                    const img = document.createElement('img');
                    img.src = URL.createObjectURL(file);
                    img.onload = () => URL.revokeObjectURL(img.src);
                    wrap.appendChild(img);
                } else {
                    const name = document.createElement('span');
                    name.textContent = file.name;
                    const size = document.createElement('small');
                    size.textContent = file.size > 1024 * 1024
                        ? (file.size / 1024 / 1024).toFixed(1) + ' MB'
                        : (file.size / 1024).toFixed(1) + ' KB';
                    wrap.appendChild(name);
                    wrap.appendChild(size);
                }
                el.appendChild(wrap);
            });
        });
    });
}

function initCopyInput() {
    document.querySelectorAll('[copy-input]').forEach(el => {
        const inputName = el.getAttribute('copy-input');
        const updateText = el.getAttribute('copy-input-update');
        const original = el.innerHTML;
        const input = document.querySelector(`[name="${inputName}"], #${inputName}`);
        if (!input) return;
        el.addEventListener('click', () => {
            navigator.clipboard.writeText(input.value).then(() => {
                if (!updateText) return;
                el.innerHTML = updateText;
                setTimeout(() => el.innerHTML = original, 2000);
            });
        });
    });
}

function initStrength() {
    document.querySelectorAll('[strength]').forEach(el => {
        const inputName = el.getAttribute('strength');
        const messages = (el.getAttribute('strength-messages') || 'Weak;Fair;Strong;Very strong').split(';');
        const input = document.querySelector(`[name="${inputName}"], #${inputName}`);
        if (!input) return;
        input.addEventListener('input', () => {
            const val = input.value;
            if (val.length === 0) {
                el.textContent = '';
                el.removeAttribute('data-strength');
                return;
            }
            let score = 0;
            if (val.length >= 8)           score++;
            if (/[A-Z]/.test(val))         score++;
            if (/[0-9]/.test(val))         score++;
            if (/[^A-Za-z0-9]/.test(val))  score++;
            const index = Math.min(score, messages.length - 1);
            el.textContent = messages[index];
            el.setAttribute('data-strength', score + 1);
        });
    });
}

function initShowPassword() {
    document.querySelectorAll('[show-password]').forEach(el => {
        const inputName = el.getAttribute('show-password');
        const input = document.querySelector(`[name="${inputName}"], #${inputName}`);
        if (!input) return;
        el.innerHTML = EYE_ICON;
        let visible = false;
        el.addEventListener('click', () => {
            visible = !visible;
            input.type = visible ? 'text' : 'password';
            el.innerHTML = visible ? EYE_SLASH_ICON : EYE_ICON;
        });
    });
}

function initCountdown() {
    document.querySelectorAll('[countdown]').forEach(el => {
        const raw = el.getAttribute('countdown');
        const [date, time = '00:00:00'] = raw.split('T');
        const [year, month, day] = date.split('-').map(Number);
        const [hour = 0, minute = 0, second = 0] = time.split(':').map(Number);
        const target = new Date(year, month - 1, day, hour, minute, second);

        const labelDays    = el.getAttribute('countdown-days')    || 'days';
        const labelHours   = el.getAttribute('countdown-hours')   || 'hours';
        const labelMinutes = el.getAttribute('countdown-minutes') || 'minutes';
        const labelSeconds = el.getAttribute('countdown-seconds') || 'seconds';

        const tick = () => {
            const diff = target - Date.now();
            if (diff <= 0) {
                el.textContent = el.getAttribute('countdown-done') || '00:00:00:00';
                return;
            }
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            const pad = n => String(n).padStart(2, '0');
            el.innerHTML =
                `<span>${pad(d)}<small>${labelDays}</small></span>` +
                `<span>${pad(h)}<small>${labelHours}</small></span>` +
                `<span>${pad(m)}<small>${labelMinutes}</small></span>` +
                `<span>${pad(s)}<small>${labelSeconds}</small></span>`;
        };
        tick();
        setInterval(tick, 1000);
    });
}

function initClearInput() {
    document.querySelectorAll('[clear-input]').forEach(btn => {
        const inputName = btn.getAttribute('clear-input');
        const input = document.querySelector(`[name="${inputName}"], #${inputName}`);
        if (!input) return;
        btn.addEventListener('click', () => {
            input.value = '';
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            input.focus();
        });
    });
}

function initCountChar() {
    document.querySelectorAll('[count-char]').forEach(el => {
        const inputName = el.getAttribute('count-char');
        const max       = el.getAttribute('count-char-max');
        const input     = document.querySelector(`[name="${inputName}"], #${inputName}`);
        if (!input) return;

        const update = () => {
            const len = input.value.length;
            el.textContent = max ? `${len} / ${max}` : len;
            if (max) el.setAttribute('data-over', len > parseInt(max));
        };

        update();
        input.addEventListener('input', update);
    });
}

function initAutosave() {
    document.querySelectorAll('form[autosave]').forEach(form => {
        const key = 'autosave:' + form.getAttribute('autosave');
        const fields = () => form.querySelectorAll('input, textarea, select');

        const save = () => {
            const data = {};
            fields().forEach(el => { if (el.name) data[el.name] = el.value; });
            localStorage.setItem(key, JSON.stringify(data));
        };

        const restore = () => {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                if (!data) return;
                fields().forEach(el => { if (el.name && data[el.name] !== undefined) el.value = data[el.name]; });
            } catch {}
        };

        restore();
        form.addEventListener('input', save);
        form.addEventListener('change', save);
        form.addEventListener('reset', () => { localStorage.removeItem(key); });
        form.addEventListener('submit', () => { localStorage.removeItem(key); });
    });
}

function initDirtyWarning() {
    document.querySelectorAll('form[dirty-warning]').forEach(form => {
        const message = form.getAttribute('dirty-warning') || 'You have unsaved changes. Are you sure you want to leave?';
        let dirty = false;

        form.addEventListener('input', () => { dirty = true; });
        form.addEventListener('change', () => { dirty = true; });
        form.addEventListener('submit', () => { dirty = false; });
        form.addEventListener('reset', () => { dirty = false; });

        window.addEventListener('beforeunload', e => {
            if (!dirty) return;
            e.preventDefault();
            e.returnValue = message;
        });
    });
}

function initOnlyLetters() {
    document.querySelectorAll('input[only-letters]').forEach(input => {
        input.addEventListener('keypress', e => {
            if (!/[a-zA-ZÀ-ÿ\s]/.test(e.key)) e.preventDefault();
        });
        input.addEventListener('input', () => {
            input.value = input.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
        });
    });
}

function initOnlyNumbers() {
    document.querySelectorAll('input[only-numbers]').forEach(input => {
        input.addEventListener('keypress', e => {
            if (!/[0-9]/.test(e.key)) e.preventDefault();
        });
        input.addEventListener('input', () => {
            input.value = input.value.replace(/[^0-9]/g, '');
        });
    });
}

const ALERT_ICON = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
</svg>`;

function error(name, message) {
    const input = document.querySelector(`[name="${name}"], #${name}`);
    if (!input) return;

    input.style.borderColor = '#e53e3e';
    input.style.outline = 'none';
    input.style.boxShadow = '0 0 0 3px rgba(229,62,62,0.15)';
    input.setAttribute('aria-invalid', 'true');

    const existingMsg = input.parentElement.querySelector(`[data-error-for="${name}"]`);
    if (existingMsg) existingMsg.remove();

    const msg = document.createElement('div');
    msg.setAttribute('data-error-for', name);
    msg.setAttribute('role', 'alert');
    msg.style.cssText = 'display:flex;align-items:center;gap:0.3rem;color:#e53e3e;font-size:0.82rem;margin-top:0.35rem;font-family:sans-serif;';
    msg.innerHTML = ALERT_ICON + `<span>${message}</span>`;
    input.insertAdjacentElement('afterend', msg);

    const clear = () => {
        input.style.borderColor = '';
        input.style.boxShadow = '';
        input.removeAttribute('aria-invalid');
        msg.remove();
        input.removeEventListener('input', clear);
    };

    input.addEventListener('input', clear);
}

initCountdown();
initClearInput();
initCountChar();
initFilePreview();
initCopyInput();
initStrength();
initShowPassword();
initMasks();
initCaseTransform();
initFloatFields();
initAutoTrim();
initAutosave();
initDirtyWarning();
initOnlyLetters();
initOnlyNumbers();
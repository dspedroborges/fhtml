(function () {
  function createModalString(options = {}) {
    const {
      title = "System Notification",
      content = "",
      id = `modal_${Math.random().toString(36).slice(2, 7)}`
    } = options;

    return `
  <div class="m-scope">
    <style>
      .m-scope {
        --font-stack: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        --bg: #ffffff;
        --fg: #1a1a1a;
        --muted: #666666;
        --border: #eeeeee;
        position: fixed;
        inset: 0;
        z-index: 9999;
        font-family: var(--font-stack);
      }

      .m-scope dialog {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin: 0;
        padding: 0;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: var(--bg);
        color: var(--fg);
        max-width: 440px;
        width: 90%;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      .m-scope dialog::backdrop {
        background: rgba(0, 0, 0, 0.4);
      }

      .m-scope .m-content {
        padding: 24px;
      }

      .m-scope .m-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      }

      .m-scope h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }

      .m-scope .m-close-x {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        color: var(--muted);
        font-size: 20px;
        line-height: 1;
      }

      .m-scope .m-close-x:hover {
        color: var(--fg);
      }

      .m-scope .m-body {
        font-size: 15px;
        line-height: 1.5;
        color: var(--muted);
      }
    </style>

    <dialog id="${id}"
            onclick="event.target === this && this.close()"
            onclose="this.closest('.m-scope').remove()">
      <div class="m-content">
        <div class="m-header">
          <h2>${title}</h2>
          <button class="m-close-x" onclick="this.closest('dialog').close()">&times;</button>
        </div>
        <div class="m-body">
          ${content}
        </div>
      </div>
    </dialog>
  </div>
`;
  }

  window.createModalString = createModalString;
})();
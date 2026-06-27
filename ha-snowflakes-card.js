/**
 * snowflakes-card — a Lovelace custom card that renders animated snowflakes.
 *
 * Config options:
 *   color   {string}  Hex color or CSS color value (default: "#ffffff")
 *   count   {number}  Number of snowflakes (default: 50, max: 100)
 *   speed   {string}  "slow" | "normal" | "fast" (default: "normal")
 *   opacity {number}  Global opacity multiplier 0–1 (default: 1)
 */

const SPEED_MULTIPLIERS = { slow: 1.8, normal: 1.0, fast: 0.5 };

const SNOWFLAKE_DEFAULTS = [
  { left:  2, size:  9, sx:   0, ex: -25, dur: 20, delay: 0.02, op: 0.5, rs:   0, re:  360 },
  { left:  6, size: 15, sx:   0, ex:  30, dur: 28, delay: 0.13, op: 0.8, rs: 360, re: -360 },
  { left: 10, size: 11, sx:   0, ex: -20, dur: 18, delay: 0.21, op: 0.6, rs:  45, re: -405 },
  { left: 14, size: 17, sx:   0, ex:  35, dur: 26, delay: 0.34, op: 0.9, rs: -30, re:  330 },
  { left: 18, size: 13, sx:   0, ex: -28, dur: 24, delay: 0.40, op: 0.4, rs:-360, re:  360 },
  { left: 22, size: 19, sx:   0, ex:  24, dur: 22, delay: 0.47, op: 0.7, rs:  90, re: -270 },
  { left: 26, size:  7, sx:   0, ex: -35, dur: 32, delay: 0.51, op: 0.3, rs: -90, re:  270 },
  { left: 30, size: 14, sx:   0, ex:  24, dur: 20, delay: 0.62, op: 0.6, rs: 180, re: -180 },
  { left: 34, size: 21, sx:   0, ex: -15, dur: 30, delay: 0.68, op: 0.5, rs:-120, re:  240 },
  { left: 38, size: 12, sx:   0, ex:  18, dur: 24, delay: 0.70, op: 0.8, rs:  60, re: -300 },
  { left: 42, size: 10, sx:   0, ex: -22, dur: 26, delay: 0.73, op: 0.4, rs: -45, re:  315 },
  { left: 46, size: 16, sx:   0, ex:  24, dur: 18, delay: 0.79, op: 0.7, rs:   0, re:  360 },
  { left: 50, size:  8, sx:   0, ex: -30, dur: 22, delay: 0.82, op: 0.6, rs: 180, re: -180 },
  { left: 54, size: 18, sx:   0, ex:  25, dur: 20, delay: 0.87, op: 0.5, rs: -60, re:  300 },
  { left: 58, size: 13, sx:   0, ex: -28, dur: 28, delay: 0.91, op: 0.9, rs:  90, re: -270 },
  { left: 62, size: 20, sx:   0, ex:  15, dur: 30, delay: 0.95, op: 0.8, rs: -90, re:  270 },
  { left: 66, size: 14, sx:   0, ex: -18, dur: 24, delay: 0.98, op: 0.6, rs:-180, re:  180 },
  { left: 70, size: 10, sx:   0, ex:  23, dur: 20, delay: 0.12, op: 0.4, rs:  30, re: -330 },
  { left: 74, size: 18, sx:   0, ex: -19, dur: 26, delay: 0.18, op: 0.5, rs:-270, re:   90 },
  { left: 78, size: 12, sx:   0, ex:  20, dur: 22, delay: 0.26, op: 0.7, rs: 120, re: -240 },
  { left: 82, size:  9, sx:   0, ex: -24, dur: 28, delay: 0.33, op: 0.3, rs: -60, re:  300 },
  { left: 86, size: 17, sx:   0, ex:  34, dur: 24, delay: 0.39, op: 0.9, rs:   0, re:  360 },
  { left: 90, size: 15, sx:   0, ex: -26, dur: 20, delay: 0.44, op: 0.6, rs: 180, re: -180 },
  { left: 94, size: 11, sx:   0, ex:  17, dur: 28, delay: 0.50, op: 0.5, rs: -90, re:  270 },
  { left: 98, size:  7, sx:   0, ex: -23, dur: 32, delay: 0.57, op: 0.7, rs:  60, re: -300 },
  { left:  4, size: 19, sx:   0, ex:   8, dur: 28, delay: 0.61, op: 0.8, rs:-120, re:  240 },
  { left:  9, size: 14, sx:   0, ex:  -7, dur: 20, delay: 0.66, op: 0.6, rs:   0, re:  360 },
  { left: 13, size: 16, sx:   0, ex:  20, dur: 26, delay: 0.72, op: 0.4, rs: 180, re: -180 },
  { left: 17, size: 20, sx:   0, ex: -11, dur: 24, delay: 0.76, op: 0.7, rs: -90, re:  270 },
  { left: 21, size:  9, sx:   0, ex:  16, dur: 20, delay: 0.81, op: 0.5, rs:  45, re: -315 },
  { left: 25, size: 18, sx:   0, ex: -14, dur: 28, delay: 0.85, op: 0.8, rs:-180, re:  180 },
  { left: 29, size: 10, sx:   0, ex:  18, dur: 24, delay: 0.89, op: 0.6, rs: -60, re:  300 },
  { left: 33, size: 17, sx:   0, ex:  -9, dur: 22, delay: 0.92, op: 0.7, rs:  30, re: -330 },
  { left: 37, size: 13, sx:   0, ex:  13, dur: 24, delay: 0.96, op: 0.4, rs: -45, re:  315 },
  { left: 41, size: 19, sx:   0, ex: -17, dur: 20, delay: 0.99, op: 0.9, rs:   0, re:  360 },
  { left: 45, size: 11, sx:   0, ex:  10, dur: 28, delay: 0.14, op: 0.6, rs: 180, re: -180 },
  { left: 49, size: 15, sx:   0, ex: -11, dur: 24, delay: 0.19, op: 0.7, rs: -90, re:  270 },
  { left: 53, size: 20, sx:   0, ex:   7, dur: 30, delay: 0.27, op: 0.5, rs: -30, re:  330 },
  { left: 57, size:  8, sx:   0, ex: -19, dur: 22, delay: 0.36, op: 0.8, rs:  60, re: -300 },
  { left: 61, size: 17, sx:   0, ex:  23, dur: 20, delay: 0.43, op: 0.6, rs:   0, re:  360 },
  { left: 67, size: 13, sx:   0, ex: -12, dur: 24, delay: 0.48, op: 0.9, rs: 180, re: -180 },
  { left: 71, size: 18, sx:   0, ex:  19, dur: 26, delay: 0.52, op: 0.5, rs: -60, re:  300 },
  { left: 75, size: 10, sx:   0, ex: -20, dur: 20, delay: 0.58, op: 0.7, rs:  30, re: -330 },
  { left: 79, size: 14, sx:   0, ex:  14, dur: 30, delay: 0.64, op: 0.6, rs: -45, re:  315 },
  { left: 83, size: 20, sx:   0, ex: -16, dur: 24, delay: 0.69, op: 0.8, rs:   0, re:  360 },
  { left:  8, size: 16, sx:   0, ex:  22, dur: 25, delay: 0.23, op: 0.5, rs: -30, re:  330 },
  { left: 32, size: 11, sx:   0, ex: -18, dur: 19, delay: 0.55, op: 0.6, rs:  90, re: -270 },
  { left: 64, size:  9, sx:   0, ex:  12, dur: 23, delay: 0.77, op: 0.4, rs: -90, re:  270 },
  { left: 88, size: 22, sx:   0, ex: -10, dur: 27, delay: 0.88, op: 0.7, rs: 120, re: -240 },
  { left: 43, size: 15, sx:   0, ex:  28, dur: 21, delay: 0.35, op: 0.8, rs: -45, re:  315 },
];

class SnowflakesCard extends HTMLElement {
  static get properties() {
    return {};
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
  }

  setConfig(config) {
    this._config = {
      color: config.color || "#ffffff",
      count: Math.min(parseInt(config.count) || 50, 100),
      speed: config.speed || "normal",
      opacity: parseFloat(config.opacity) ?? 1,
    };
    this._render();
  }

  // HA calls this when states update — not needed but required by the interface
  set hass(_hass) {}

  getCardSize() {
    return 0;
  }

  _render() {
    const { color, count, speed, opacity } = this._config;
    const speedMult = SPEED_MULTIPLIERS[speed] || 1.0;

    const flakes = SNOWFLAKE_DEFAULTS.slice(0, count);

    const flakeHTML = flakes
      .map((f) => {
        const dur = (f.dur * speedMult).toFixed(1);
        const delay = (-20 * f.delay).toFixed(2);
        const op = (f.op * opacity).toFixed(2);
        return `<i style="left:${f.left}%;font-size:${f.size}px;--sx:${f.sx}px;--ex:${f.ex}px;animation-duration:${dur}s;animation-delay:${delay}s;opacity:${op};--rs:${f.rs}deg;--re:${f.re}deg;">❄</i>`;
      })
      .join("\n");

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: absolute;
          top: -20px;
          left: 0;
          width: 0;
          height: 0;
          overflow: visible;
          pointer-events: none;
          background: none !important;
        }

        .snowflakes {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 999;
        }

        .snowflakes i {
          color: ${color};
          position: absolute;
          top: -10%;
          font-style: normal;
          animation: snowfall linear infinite;
          font-size: inherit;
        }

        @keyframes snowfall {
          0%   { transform: translate(var(--sx), -10%)   rotate(var(--rs)); }
          25%  { transform: translate(calc(var(--sx) + calc(var(--ex) / 4)),  30vh) rotate(calc(var(--rs) + var(--re) / 4)); }
          50%  { transform: translate(calc(var(--sx) - calc(var(--ex) / 4)),  60vh) rotate(calc(var(--rs) + var(--re) / 2)); }
          75%  { transform: translate(calc(var(--sx) + calc(var(--ex) / 4)),  90vh) rotate(calc(var(--rs) + var(--re) * 3 / 4)); }
          100% { transform: translate(var(--ex), 120vh)  rotate(var(--re)); }
        }

        @media (prefers-reduced-motion: reduce) {
          .snowflakes i {
            animation: none;
            display: none;
          }
        }
      </style>
      <div class="snowflakes">
        ${flakeHTML}
      </div>
    `;
  }
}

customElements.define("snowflakes-card", SnowflakesCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "snowflakes-card",
  name: "Snowflakes Card",
  description: "Animated snowflakes overlay for your Lovelace dashboard.",
  preview: false,
  documentationURL: "https://github.com/Xornop/ha-snowflakes-card",
});

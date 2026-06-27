/**
 * ha-snowflakes-card
 * Lovelace custom card — animated snowflakes overlay.
 *
 * Config:
 *   color   {string}  CSS color or hex (default: "#ffffff")
 *   count   {number}  1–50 (default: 50)
 *   opacity {number}  0–1 global multiplier (default: 1)
 */

const FLAKES = [
  { l:  2, s:  9, ex: -25, dur: 20, d: 0.02, op: 0.5, rs:   0, re:  360 },
  { l:  6, s: 15, ex:  30, dur: 28, d: 0.13, op: 0.8, rs: 360, re: -360 },
  { l: 10, s: 11, ex: -20, dur: 18, d: 0.21, op: 0.6, rs:  45, re: -405 },
  { l: 14, s: 17, ex:  35, dur: 26, d: 0.34, op: 0.9, rs: -30, re:  330 },
  { l: 18, s: 13, ex: -28, dur: 24, d: 0.40, op: 0.4, rs:-360, re:  360 },
  { l: 22, s: 19, ex:  24, dur: 22, d: 0.47, op: 0.7, rs:  90, re: -270 },
  { l: 26, s:  7, ex: -35, dur: 32, d: 0.51, op: 0.3, rs: -90, re:  270 },
  { l: 30, s: 14, ex:  24, dur: 20, d: 0.62, op: 0.6, rs: 180, re: -180 },
  { l: 34, s: 21, ex: -15, dur: 30, d: 0.68, op: 0.5, rs:-120, re:  240 },
  { l: 38, s: 12, ex:  18, dur: 24, d: 0.70, op: 0.8, rs:  60, re: -300 },
  { l: 42, s: 10, ex: -22, dur: 26, d: 0.73, op: 0.4, rs: -45, re:  315 },
  { l: 46, s: 16, ex:  24, dur: 18, d: 0.79, op: 0.7, rs:   0, re:  360 },
  { l: 50, s:  8, ex: -30, dur: 22, d: 0.82, op: 0.6, rs: 180, re: -180 },
  { l: 54, s: 18, ex:  25, dur: 20, d: 0.87, op: 0.5, rs: -60, re:  300 },
  { l: 58, s: 13, ex: -28, dur: 28, d: 0.91, op: 0.9, rs:  90, re: -270 },
  { l: 62, s: 20, ex:  15, dur: 30, d: 0.95, op: 0.8, rs: -90, re:  270 },
  { l: 66, s: 14, ex: -18, dur: 24, d: 0.98, op: 0.6, rs:-180, re:  180 },
  { l: 70, s: 10, ex:  23, dur: 20, d: 0.12, op: 0.4, rs:  30, re: -330 },
  { l: 74, s: 18, ex: -19, dur: 26, d: 0.18, op: 0.5, rs:-270, re:   90 },
  { l: 78, s: 12, ex:  20, dur: 22, d: 0.26, op: 0.7, rs: 120, re: -240 },
  { l: 82, s:  9, ex: -24, dur: 28, d: 0.33, op: 0.3, rs: -60, re:  300 },
  { l: 86, s: 17, ex:  34, dur: 24, d: 0.39, op: 0.9, rs:   0, re:  360 },
  { l: 90, s: 15, ex: -26, dur: 20, d: 0.44, op: 0.6, rs: 180, re: -180 },
  { l: 94, s: 11, ex:  17, dur: 28, d: 0.50, op: 0.5, rs: -90, re:  270 },
  { l: 98, s:  7, ex: -23, dur: 32, d: 0.57, op: 0.7, rs:  60, re: -300 },
  { l:  4, s: 19, ex:   8, dur: 28, d: 0.61, op: 0.8, rs:-120, re:  240 },
  { l:  9, s: 14, ex:  -7, dur: 20, d: 0.66, op: 0.6, rs:   0, re:  360 },
  { l: 13, s: 16, ex:  20, dur: 26, d: 0.72, op: 0.4, rs: 180, re: -180 },
  { l: 17, s: 20, ex: -11, dur: 24, d: 0.76, op: 0.7, rs: -90, re:  270 },
  { l: 21, s:  9, ex:  16, dur: 20, d: 0.81, op: 0.5, rs:  45, re: -315 },
  { l: 25, s: 18, ex: -14, dur: 28, d: 0.85, op: 0.8, rs:-180, re:  180 },
  { l: 29, s: 10, ex:  18, dur: 24, d: 0.89, op: 0.6, rs: -60, re:  300 },
  { l: 33, s: 17, ex:  -9, dur: 22, d: 0.92, op: 0.7, rs:  30, re: -330 },
  { l: 37, s: 13, ex:  13, dur: 24, d: 0.96, op: 0.4, rs: -45, re:  315 },
  { l: 41, s: 19, ex: -17, dur: 20, d: 0.99, op: 0.9, rs:   0, re:  360 },
  { l: 45, s: 11, ex:  10, dur: 28, d: 0.14, op: 0.6, rs: 180, re: -180 },
  { l: 49, s: 15, ex: -11, dur: 24, d: 0.19, op: 0.7, rs: -90, re:  270 },
  { l: 53, s: 20, ex:   7, dur: 30, d: 0.27, op: 0.5, rs: -30, re:  330 },
  { l: 57, s:  8, ex: -19, dur: 22, d: 0.36, op: 0.8, rs:  60, re: -300 },
  { l: 61, s: 17, ex:  23, dur: 20, d: 0.43, op: 0.6, rs:   0, re:  360 },
  { l: 67, s: 13, ex: -12, dur: 24, d: 0.48, op: 0.9, rs: 180, re: -180 },
  { l: 71, s: 18, ex:  19, dur: 26, d: 0.52, op: 0.5, rs: -60, re:  300 },
  { l: 75, s: 10, ex: -20, dur: 20, d: 0.58, op: 0.7, rs:  30, re: -330 },
  { l: 79, s: 14, ex:  14, dur: 30, d: 0.64, op: 0.6, rs: -45, re:  315 },
  { l: 83, s: 20, ex: -16, dur: 24, d: 0.69, op: 0.8, rs:   0, re:  360 },
  { l:  8, s: 16, ex:  22, dur: 25, d: 0.23, op: 0.5, rs: -30, re:  330 },
  { l: 32, s: 11, ex: -18, dur: 19, d: 0.55, op: 0.6, rs:  90, re: -270 },
  { l: 64, s:  9, ex:  12, dur: 23, d: 0.77, op: 0.4, rs: -90, re:  270 },
  { l: 88, s: 22, ex: -10, dur: 27, d: 0.88, op: 0.7, rs: 120, re: -240 },
  { l: 43, s: 15, ex:  28, dur: 21, d: 0.35, op: 0.8, rs: -45, re:  315 },
];

class HaSnowflakesCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  setConfig(config) {
    this._color   = config.color   || "#ffffff";
    this._count   = Math.min(Math.max(parseInt(config.count)     || 50, 1), 50);
    this._opacity = Math.min(Math.max(parseFloat(config.opacity) ?? 1,  0), 1);
    this._render();
  }

  set hass(_) {}
  getCardSize() { return 0; }

  _render() {
    const color   = this._color;
    const opacity = this._opacity;
    const flakes  = FLAKES.slice(0, this._count);

    // Build inline styles exactly like the original YAML —
    // delay always uses calc(-20s * factor) regardless of duration.
    const flakeHTML = flakes.map(f => {
      const op = (f.op * opacity).toFixed(2);
      return `<i style="left:${f.l}%; font-size:${f.s}px; --start-x:0px; --end-x:${f.ex}px; animation-duration:${f.dur}s; animation-delay:calc(-20s * ${f.d}); opacity:${op}; --rotate-start:${f.rs}deg; --rotate-end:${f.re}deg;">❄</i>`;
    }).join("\n");

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
        }

        @keyframes snowfall {
          0%   { transform: translate(var(--start-x), -10%) rotate(var(--rotate-start)); }
          25%  { transform: translate(calc(var(--start-x) + calc(var(--end-x)/4)), 30vh) rotate(calc(var(--rotate-start) + var(--rotate-end)/4)); }
          50%  { transform: translate(calc(var(--start-x) - calc(var(--end-x)/4)), 60vh) rotate(calc(var(--rotate-start) + var(--rotate-end)/2)); }
          75%  { transform: translate(calc(var(--start-x) + calc(var(--end-x)/4)), 90vh) rotate(calc(var(--rotate-start) + 3*var(--rotate-end)/4)); }
          100% { transform: translate(var(--end-x), 120vh) rotate(var(--rotate-end)); }
        }

        @media (prefers-reduced-motion: reduce) {
          .snowflakes i { animation: none; display: none; }
        }
      </style>
      <div class="snowflakes">
        ${flakeHTML}
      </div>
    `;
  }
}

customElements.define("snowflakes-card", HaSnowflakesCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "snowflakes-card",
  name: "HA Snowflakes Card",
  description: "Animated snowflakes overlay for your Lovelace dashboard.",
  preview: false,
  documentationURL: "https://github.com/Xornop/ha-snowflakes-card",
});

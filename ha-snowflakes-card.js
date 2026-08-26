/**
 * ha-snowflakes-card
 * Lovelace custom card — animated weather overlay (snow / leaves / rain).
 *
 * Config:
 *   snowflakes {boolean} show snow layer (default: true)
 *   color      {string}  snowflake CSS color or hex (default: "#ffffff")
 *   count      {number}  snowflake count, 1–50 (default: 50)
 *   opacity    {number}  snowflake opacity multiplier, 0–1 (default: 1)
 *
 *   leaves      {boolean}     show autumn leaves layer (default: false)
 *   leafColors  {string[3]}   3 CSS colors/hex used as gradient stops for random leaf colors
 *                             (default: ["#c9a227", "#a83232", "#d9812c"])
 *   leafCount   {number}      leaf count, 1–50 (default: 30)
 *   leafOpacity {number}      leaf opacity multiplier, 0–1 (default: 1)
 *
 *   rain        {boolean} show rain layer (default: false)
 *   rainColor   {string}  rain streak CSS color or hex (default: "#9aa5ad")
 *   rainCount   {number}  rain streak count, 1–80 (default: 40)
 *   rainOpacity {number}  rain opacity multiplier, 0–1 (default: 1)
 */

// Shared path data reused for both snowflakes and leaves (same wandering,
// zigzagging fall pattern). l = left%, s = size(px), ex = horizontal drift
// endpoint(px), dur = animation duration(s), d = delay factor (0-1, used
// with calc(-20s * d) so layers desync nicely), op = base opacity,
// rs/re = rotation start/end (deg).
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

// Path data for rain: falls at a slant but in a straight line (no
// zigzag). l = left%, len = streak length(px), thick = streak width(px),
// ex = total horizontal drift(px) over the whole fall, dur = duration(s),
// d = delay factor (0-1), op = base opacity.
const RAIN = [
  { l:  1, len: 18, thick: 1, ex:  14, dur: 0.7, d: 0.02, op: 0.35 },
  { l:  4, len: 24, thick: 2, ex:  18, dur: 0.9, d: 0.31, op: 0.55 },
  { l:  7, len: 16, thick: 1, ex:  12, dur: 0.6, d: 0.55, op: 0.25 },
  { l: 10, len: 22, thick: 2, ex:  16, dur: 0.8, d: 0.09, op: 0.5 },
  { l: 13, len: 20, thick: 1, ex:  15, dur: 0.75,d: 0.62, op: 0.3 },
  { l: 16, len: 26, thick: 2, ex:  20, dur: 1.0, d: 0.18, op: 0.6 },
  { l: 19, len: 17, thick: 1, ex:  13, dur: 0.65,d: 0.44, op: 0.4 },
  { l: 22, len: 23, thick: 2, ex:  17, dur: 0.85,d: 0.71, op: 0.45 },
  { l: 25, len: 19, thick: 1, ex:  14, dur: 0.7, d: 0.26, op: 0.35 },
  { l: 28, len: 25, thick: 2, ex:  19, dur: 0.95,d: 0.5,  op: 0.55 },
  { l: 31, len: 16, thick: 1, ex:  12, dur: 0.6, d: 0.83, op: 0.25 },
  { l: 34, len: 21, thick: 2, ex:  16, dur: 0.8, d: 0.15, op: 0.5 },
  { l: 37, len: 18, thick: 1, ex:  13, dur: 0.7, d: 0.66, op: 0.3 },
  { l: 40, len: 24, thick: 2, ex:  18, dur: 0.9, d: 0.38, op: 0.6 },
  { l: 43, len: 17, thick: 1, ex:  13, dur: 0.65,d: 0.92, op: 0.35 },
  { l: 46, len: 22, thick: 2, ex:  17, dur: 0.85,d: 0.05, op: 0.45 },
  { l: 49, len: 19, thick: 1, ex:  14, dur: 0.7, d: 0.59, op: 0.3 },
  { l: 52, len: 26, thick: 2, ex:  20, dur: 1.0, d: 0.22, op: 0.55 },
  { l: 55, len: 16, thick: 1, ex:  12, dur: 0.6, d: 0.78, op: 0.25 },
  { l: 58, len: 23, thick: 2, ex:  17, dur: 0.85,d: 0.34, op: 0.5 },
  { l: 61, len: 18, thick: 1, ex:  13, dur: 0.7, d: 0.87, op: 0.35 },
  { l: 64, len: 25, thick: 2, ex:  19, dur: 0.95,d: 0.11, op: 0.6 },
  { l: 67, len: 17, thick: 1, ex:  13, dur: 0.65,d: 0.63, op: 0.3 },
  { l: 70, len: 21, thick: 2, ex:  16, dur: 0.8, d: 0.29, op: 0.45 },
  { l: 73, len: 19, thick: 1, ex:  14, dur: 0.7, d: 0.95, op: 0.35 },
  { l: 76, len: 24, thick: 2, ex:  18, dur: 0.9, d: 0.47, op: 0.55 },
  { l: 79, len: 16, thick: 1, ex:  12, dur: 0.6, d: 0.7,  op: 0.25 },
  { l: 82, len: 22, thick: 2, ex:  17, dur: 0.85,d: 0.24, op: 0.5 },
  { l: 85, len: 18, thick: 1, ex:  13, dur: 0.7, d: 0.8,  op: 0.3 },
  { l: 88, len: 26, thick: 2, ex:  20, dur: 1.0, d: 0.42, op: 0.6 },
  { l: 91, len: 17, thick: 1, ex:  13, dur: 0.65,d: 0.06, op: 0.35 },
  { l: 94, len: 23, thick: 2, ex:  17, dur: 0.85,d: 0.53, op: 0.45 },
  { l: 97, len: 19, thick: 1, ex:  14, dur: 0.7, d: 0.16, op: 0.3 },
  { l:  3, len: 20, thick: 1, ex:  15, dur: 0.75,d: 0.68, op: 0.4 },
  { l: 12, len: 25, thick: 2, ex:  19, dur: 0.95,d: 0.36, op: 0.55 },
  { l: 21, len: 16, thick: 1, ex:  12, dur: 0.6, d: 0.9,  op: 0.25 },
  { l: 33, len: 22, thick: 2, ex:  17, dur: 0.85,d: 0.2,  op: 0.5 },
  { l: 45, len: 18, thick: 1, ex:  13, dur: 0.7, d: 0.75, op: 0.3 },
  { l: 60, len: 24, thick: 2, ex:  18, dur: 0.9, d: 0.4,  op: 0.55 },
  { l: 72, len: 17, thick: 1, ex:  13, dur: 0.65,d: 0.03, op: 0.35 },
  { l: 96, len: 21, thick: 2, ex:  16, dur: 0.8, d: 0.58, op: 0.45 },
];

// Default leaf silhouette: simple almond shape with a center vein,
// drawn with fill="currentColor" so the per-leaf gradient color actually
// shows (unlike full-color emoji, which ignore CSS color).
const DEFAULT_LEAF_SHAPE = `
  <path d="M50 4 C22 18, 10 55, 50 96 C90 55, 78 18, 50 4 Z" fill="currentColor"/>
  <path d="M50 10 L50 90" stroke="rgba(0,0,0,0.25)" stroke-width="3" stroke-linecap="round"/>
  <path d="M50 30 L34 20 M50 30 L66 20 M50 55 L30 45 M50 55 L70 45 M50 75 L36 68 M50 75 L64 68"
        stroke="rgba(0,0,0,0.18)" stroke-width="2" stroke-linecap="round"/>
`;

function hexToRgb(hex) {
  let h = hex.trim();
  if (h.startsWith("#")) h = h.slice(1);
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const num = parseInt(h, 16);
  if (h.length !== 6 || Number.isNaN(num)) return { r: 200, g: 160, b: 60 };
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToCss({ r, g, b }) {
  return `rgb(${r}, ${g}, ${b})`;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Interpolates across a 3-stop gradient (stop0 -> stop1 -> stop2) at t in [0,1].
function gradientColor(colors, t) {
  const [c0, c1, c2] = colors.map(hexToRgb);
  const seg = t < 0.5 ? [c0, c1, t * 2] : [c1, c2, (t - 0.5) * 2];
  const [from, to, localT] = seg;
  return rgbToCss({
    r: Math.round(lerp(from.r, to.r, localT)),
    g: Math.round(lerp(from.g, to.g, localT)),
    b: Math.round(lerp(from.b, to.b, localT)),
  });
}

class HaSnowflakesCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  setConfig(config) {
    // Snow
    this._snowflakes = config.snowflakes !== false; // default true
    this._color = config.color || "#ffffff";
    this._count = Math.min(Math.max(parseInt(config.count) || 50, 1), 50);
    this._opacity = Math.min(Math.max(parseFloat(config.opacity) ?? 1, 0), 1);

    // Leaves
    this._leaves = config.leaves === true; // default false
    this._leafColors =
      Array.isArray(config.leafColors) && config.leafColors.length === 3
        ? config.leafColors
        : ["#c9a227", "#a83232", "#d9812c"];
    this._leafCount = Math.min(Math.max(parseInt(config.leafCount) || 30, 1), 50);
    this._leafOpacity = Math.min(Math.max(parseFloat(config.leafOpacity) ?? 1, 0), 1);
    // Optional custom leaf artwork: raw SVG markup (viewBox "0 0 100 100"),
    // e.g. a single <path d="..." fill="currentColor"/>. Falls back to the
    // built-in leaf silhouette when not provided.
    this._leafShape =
      typeof config.leafShape === "string" && config.leafShape.trim()
        ? config.leafShape
        : DEFAULT_LEAF_SHAPE;

    // Rain
    this._rain = config.rain === true; // default false
    this._rainColor = config.rainColor || "#9aa5ad";
    this._rainCount = Math.min(Math.max(parseInt(config.rainCount) || 40, 1), 80);
    this._rainOpacity = Math.min(Math.max(parseFloat(config.rainOpacity) ?? 1, 0), 1);

    this._render();
  }

  set hass(_) {}
  getCardSize() {
    return 0;
  }

  _renderSnowLayer() {
    if (!this._snowflakes) return "";
    const flakes = FLAKES.slice(0, this._count);
    const html = flakes
      .map((f) => {
        const op = (f.op * this._opacity).toFixed(2);
        return `<i class="flake" style="left:${f.l}%; font-size:${f.s}px; --start-x:0px; --end-x:${f.ex}px; animation-duration:${f.dur}s; animation-delay:calc(-20s * ${f.d}); opacity:${op}; --rotate-start:${f.rs}deg; --rotate-end:${f.re}deg; color:${this._color};">❄</i>`;
      })
      .join("\n");
    return `<div class="layer snow">${html}</div>`;
  }

  _renderLeavesLayer() {
    if (!this._leaves) return "";
    const leaves = FLAKES.slice(0, this._leafCount);
    const html = leaves
      .map((f, i) => {
        const op = (f.op * this._leafOpacity).toFixed(2);
        // Deterministic-but-varied t per leaf (avoids re-randomizing on every re-render).
        const t = ((i * 0.61803398875) % 1 + f.d) % 1;
        const color = gradientColor(this._leafColors, t);
        const px = `${f.s * 1.6}px`; // leaf artwork reads a bit small vs. snowflake glyphs
        const swayX = Math.round(f.ex * 2.6); // wider side-to-side sway than snow's drift
        return `<i class="leaf" style="left:${f.l}%; width:${px}; height:${px}; --start-x:0px; --end-x:${swayX}px; animation-duration:${f.dur}s; animation-delay:calc(-20s * ${f.d}); opacity:${op}; --rotate-start:${f.rs}deg; --rotate-end:${f.re}deg; color:${color};"><svg viewBox="0 0 100 100" width="100%" height="100%">${this._leafShape}</svg></i>`;
      })
      .join("\n");
    return `<div class="layer leaves">${html}</div>`;
  }

  _renderRainLayer() {
    if (!this._rain) return "";
    const drops = RAIN.slice(0, this._rainCount);
    const html = drops
      .map((r) => {
        const op = (r.op * this._rainOpacity).toFixed(2);
        return `<i class="drop" style="left:${r.l}%; width:${r.thick}px; height:${r.len}px; --end-x:${r.ex}px; animation-duration:${r.dur}s; animation-delay:calc(-1 * ${r.dur}s * ${r.d}); opacity:${op}; background:${this._rainColor};"></i>`;
      })
      .join("\n");
    return `<div class="layer rain">${html}</div>`;
  }

  _render() {
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

        .layer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 999;
        }

        .layer i {
          position: absolute;
          top: -10%;
          font-style: normal;
        }

        /* Snow follows a gentle 4-point wander. */
        .flake {
          animation-name: wander-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        /* Leaves sway noticeably side-to-side as they fall, like real
           dwarrelende blaadjes: more waypoints, eased motion. */
        .leaf {
          display: inline-block;
          animation-name: leaf-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .leaf svg {
          display: block;
        }

        @keyframes wander-fall {
          0%   { transform: translate(var(--start-x), -10%) rotate(var(--rotate-start)); }
          25%  { transform: translate(calc(var(--start-x) + calc(var(--end-x)/4)), 30vh) rotate(calc(var(--rotate-start) + var(--rotate-end)/4)); }
          50%  { transform: translate(calc(var(--start-x) - calc(var(--end-x)/4)), 60vh) rotate(calc(var(--rotate-start) + var(--rotate-end)/2)); }
          75%  { transform: translate(calc(var(--start-x) + calc(var(--end-x)/4)), 90vh) rotate(calc(var(--rotate-start) + 3*var(--rotate-end)/4)); }
          100% { transform: translate(var(--end-x), 120vh) rotate(var(--rotate-end)); }
        }

        @keyframes leaf-fall {
          0%   { transform: translate(var(--start-x), -10%) rotate(var(--rotate-start)); }
          10%  { transform: translate(calc(var(--end-x) * 0.85), 6vh) rotate(calc(var(--rotate-start) + var(--rotate-end) * 0.1)); }
          22%  { transform: translate(calc(var(--end-x) * -0.7), 18vh) rotate(calc(var(--rotate-start) + var(--rotate-end) * 0.22)); }
          35%  { transform: translate(calc(var(--end-x) * 1), 34vh) rotate(calc(var(--rotate-start) + var(--rotate-end) * 0.35)); }
          48%  { transform: translate(calc(var(--end-x) * -0.85), 47vh) rotate(calc(var(--rotate-start) + var(--rotate-end) * 0.48)); }
          60%  { transform: translate(calc(var(--end-x) * 0.75), 60vh) rotate(calc(var(--rotate-start) + var(--rotate-end) * 0.6)); }
          73%  { transform: translate(calc(var(--end-x) * -0.6), 74vh) rotate(calc(var(--rotate-start) + var(--rotate-end) * 0.73)); }
          85%  { transform: translate(calc(var(--end-x) * 0.8), 88vh) rotate(calc(var(--rotate-start) + var(--rotate-end) * 0.85)); }
          100% { transform: translate(var(--end-x), 120vh) rotate(var(--rotate-end)); }
        }

        /* Rain falls in a straight diagonal line, no zigzag. */
        .drop {
          top: -10%;
          border-radius: 2px;
          animation-name: rain-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes rain-fall {
          0%   { transform: translate(0, -10%); }
          100% { transform: translate(var(--end-x), 120vh); }
        }

        @media (prefers-reduced-motion: reduce) {
          .layer i { animation: none; display: none; }
        }
      </style>
      ${this._renderSnowLayer()}
      ${this._renderLeavesLayer()}
      ${this._renderRainLayer()}
    `;
  }
}

customElements.define("snowflakes-card", HaSnowflakesCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "snowflakes-card",
  name: "HA Snowflakes Card",
  description: "Animated weather overlay (snow, autumn leaves, rain) for your Lovelace dashboard.",
  preview: false,
  documentationURL: "https://github.com/Xornop/ha-snowflakes-card",
});

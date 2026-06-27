# ❄ HA Snowflakes Card

A Lovelace custom card that renders animated snowflakes as a full-screen overlay on your Home Assistant dashboard. Every snowflake is individually defined with its own size, speed, drift, rotation, and opacity — no two fall exactly the same way.

## Why not just use the built-in Winter Mode?

Home Assistant 2025.12 introduced Winter Mode as a Labs feature (Settings → System → Labs), and it's a great addition. But it comes with some limitations: it's a per-user setting with no way to automate it, it has a known issue where snowflakes only show for admin users, and you get no control over appearance — no color, no intensity, nothing.

HA Snowflakes Card fills that gap:

| | Winter Mode (Labs) | HA Snowflakes Card |
|---|---|---|
| Color | White only | Any color or hex |
| Per-dashboard control | ❌ | ✅ |
| Automation / conditional | ❌ | ✅ via `conditional` card |
| Works for all users | ⚠️ Admin only (known bug) | ✅ |
| Snowflake count | Fixed | Configurable |
| Multiple layers | ❌ | ✅ |

Use it standalone, wrap it in a `conditional` card to tie it to an `input_boolean` or the sun's position, or stack two instances for a layered effect with different colors and speeds.

## Installation

### Via HACS (recommended)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Xornop&repository=ha-snowflakes-card&category=plugin)

or

1. Open HACS → Frontend
2. Click the three-dot menu → **Custom repositories**
3. Add `Xornop/ha-snowflakes-card` with category **Lovelace**
4. Install **HA Snowflakes Card**
5. Reload your browser

### Manual

1. Copy `ha-snowflakes-card.js` to `config/www/ha-snowflakes-card.js`
2. Go to **Settings → Dashboards → Resources** and add:
   - URL: `/local/ha-snowflakes-card.js`
   - Type: JavaScript module

## Usage

Add the card to any dashboard view. It renders as a zero-height overlay, so it won't push other cards around.

```yaml
type: custom:snowflakes-card
color: "#ffffff"
```

### All options

| Option    | Type   | Default     | Description                                      |
|-----------|--------|-------------|--------------------------------------------------|
| `color`   | string | `"#ffffff"` | Snowflake color — any CSS color or hex value     |
| `count`   | number | `50`        | Number of snowflakes (max 100)                   |
| `speed`   | string | `"normal"`  | Fall speed: `slow`, `normal`, or `fast`          |
| `opacity` | number | `1`         | Global opacity multiplier (0–1)                  |

### Examples

**White snowflakes at night only:**
```yaml
type: conditional
conditions:
  - condition: state
    entity: sun.sun
    state: below_horizon
card:
  type: custom:snowflakes-card
  color: "#ffffff"
  count: 50
  speed: normal
```

**Green snowflakes during the day (Christmas mode):**
```yaml
type: conditional
conditions:
  - entity: input_boolean.christmasmode
    state: "on"
  - condition: state
    entity: sun.sun
    state: above_horizon
card:
  type: custom:snowflakes-card
  color: "#507828"
  count: 40
  speed: slow
  opacity: 0.7
```

**Two layers for a denser effect:**
```yaml
type: grid
columns: 1
cards:
  - type: custom:snowflakes-card
    color: "#ffffff"
    count: 30
    speed: slow
  - type: custom:snowflakes-card
    color: "#cce8ff"
    count: 20
    speed: fast
    opacity: 0.4
```

## Notes

- The card respects `prefers-reduced-motion` — snowflakes are hidden for users who have enabled reduced motion in their OS settings.
- The card takes up no space in the layout (height: 0). Place it anywhere in a grid view.
- Wrapping it in a `conditional` card is the recommended way to control visibility, for example use a time/date condition to only show the card during the holidays.

## License

MIT

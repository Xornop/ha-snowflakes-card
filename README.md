# ❄ HA Snowflakes Card

A Lovelace custom card that renders animated snowflakes as a full-screen overlay on your Home Assistant dashboard. Fully configurable: pick any color, control the count, speed, and opacity. Use multiple instances for layered effects (e.g. white flakes at night, green during the day).

## Installation

### Via HACS (recommended)

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
- Wrapping it in a `conditional` card is the recommended way to control visibility.

## License

MIT

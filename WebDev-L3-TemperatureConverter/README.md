# Temperature Converter Website

A simple vanilla JavaScript web app that converts a temperature between Celsius, Fahrenheit, and Kelvin and displays all three results at once.

## Files

- `index.html` — page structure and controls
- `style.css` — responsive, centered layout
- `script.js` — validation and conversion logic

## Features

- Numeric input with real-time validation and friendly error messages
- Selectable input unit (Celsius / Fahrenheit / Kelvin)
- All three converted values displayed simultaneously
- Convert button (also supports pressing Enter)
- Absolute-zero protection (−273.15 °C / −459.67 °F / 0 K)
- The source unit is highlighted in the results

## Formulas

- Celsius → Fahrenheit: `(°C × 9/5) + 32`
- Fahrenheit → Celsius: `(°F − 32) × 5/9`
- Celsius → Kelvin: `°C + 273.15`
- Kelvin → Celsius: `K − 273.15`

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

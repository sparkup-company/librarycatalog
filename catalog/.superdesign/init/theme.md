# Theme — stacks

## CSS Variables (set per tenant via inline style on :root)

```css
:root {
  --primary: #7d51ff;         /* tenant primary (Augsburg: #e05a00) */
  --primary-light: #e7defc;   /* tenant primary light */
  --primary-dark: #5c35e0;
  --primary-shadow: rgba(125,81,255,0.2);
  --primary-shadow-strong: rgba(125,81,255,0.3);
  --primary-light-alpha: rgba(231,222,252,0.5);
  --black: #130f1e;
  --white: #faf9fd;
  --gray-100: #f4f2fb;
  --gray-mid: #a89fba;
  --text-mid: #4a4358;
  --border: #e3dff0;
}
```

## Fonts

- **Headings:** Cabinet Grotesk (400, 500, 700, 800) — loaded via Google Fonts
- **Body:** Satoshi (not loaded — falls back to system-ui, sans-serif)
- **Accent/Handwritten:** Kalam (400, 700) — loaded via Google Fonts

## Augsburg Tenant Colors

```
--primary: #e05a00  (orange)
--primary-light: #fde8d4
```

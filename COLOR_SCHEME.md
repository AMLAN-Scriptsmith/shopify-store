# Shopify Theme - Responsive CSS Color System

## Color Ratio: 60/30/10

This theme uses a professional color ratio system for consistent, visually balanced design:

### Color Palette

| Role | Color | Hex | Usage | Ratio |
|------|-------|-----|-------|-------|
| **Primary** | Dark Blue-Gray | `#2c3e50` | Backgrounds, text, large sections | **60%** |
| **Secondary** | Light Gray | `#ecf0f1` | Cards, secondary backgrounds, borders | **30%** |
| **Accent** | Coral Red | `#e74c3c` | CTAs, highlights, interactive elements | **10%** |

---

## Design Guidelines

### Primary Color (60%) - Dominant
- Header & Footer backgrounds
- Main section backgrounds
- Primary typography
- Large layout components
- Creates visual hierarchy and stability

**Used in:**
- `.site-header`
- `.site-footer`
- `.section-dark`
- `h1, h2, h3` headings
- Primary cards and containers

### Secondary Color (30%) - Supporting
- Card backgrounds
- Secondary section backgrounds
- Form containers
- Dividers and borders
- Provides contrast and visual separation

**Used in:**
- `.card`
- `.product-card`
- `.testimonial-card`
- `.features` section
- Input backgrounds
- `.sidebar`

### Accent Color (10%) - Action
- Call-to-action buttons
- Links and hover states
- Badges and highlights
- Interactive elements
- Important notifications

**Used in:**
- `.btn`, `button`, `input[type="submit"]`
- `.add-to-cart` buttons
- Links and anchors
- `.badge`, `.highlight`
- Form focus states
- Hover states across components

---

## CSS Variables

All colors are defined in CSS custom properties at the root level:

```css
:root {
  /* Primary (60%) */
  --primary-color: #2c3e50;

  /* Secondary (30%) */
  --secondary-color: #ecf0f1;

  /* Accent (10%) */
  --accent-color: #e74c3c;
  --accent-light: #f5a29d;
  --accent-dark: #c0392b;

  /* Neutrals */
  --text-dark: #2c3e50;
  --text-light: #7f8c8d;
  --border-color: #bdc3c7;
  --bg-light: #f8f9fa;
}
```

---

## Responsive Design

The theme includes breakpoints for optimal mobile, tablet, and desktop experiences:

### Desktop (1200px+)
- Full-width layouts
- Multi-column grids
- Large typography
- Full navigation menus

### Tablet (769px - 1199px)
- Adjusted spacing and font sizes
- 2-column grids
- Optimized padding

### Mobile (480px - 768px)
- Single-column layouts
- Reduced font sizes
- Streamlined spacing
- Full-width buttons

### Small Mobile (< 480px)
- Minimal spacing
- Single-column everything
- Touch-optimized buttons
- Simplified navigation

---

## Component Examples

### Buttons (Accent - 10%)
```html
<button class="btn">Shop Now</button>
<button class="btn btn-secondary">Learn More</button>
```

### Cards (Secondary - 30%)
```html
<div class="card">
  <h3>Product Title</h3>
  <p>Product description</p>
  <button class="btn">Add to Cart</button>
</div>
```

### Sections (Primary - 60%)
```html
<section class="section-dark">
  <h2>Section Title</h2>
  <p>Content goes here...</p>
</section>
```

---

## Spacing Scale

All spacing uses consistent variables:

- `--spacing-xs`: 0.5rem (8px)
- `--spacing-sm`: 1rem (16px)
- `--spacing-md`: 1.5rem (24px)
- `--spacing-lg`: 2rem (32px)
- `--spacing-xl`: 3rem (48px)
- `--spacing-2xl`: 4rem (64px)

---

## Typography

- **Font Family**: System fonts (Apple System Font, Segoe UI, Roboto)
- **Base Size**: 16px (scales to 14px on mobile)
- **Line Height**: 1.6 (consistent readability)

### Heading Sizes
- `h1`: 2.5rem (responsive: 1.75rem mobile)
- `h2`: 2rem
- `h3`: 1.5rem
- `h4`: 1.25rem
- `h5`: 1.1rem
- `h6`: 1rem

---

## Accessibility Features

- **Focus Visible**: Accent color outline on all interactive elements
- **Screen Reader Text**: `.sr-only` class for hidden but readable text
- **Semantic HTML**: Proper heading hierarchy and semantic elements
- **Color Contrast**: All text meets WCAG AA standards
- **Touch Targets**: Buttons sized for easy mobile interaction

---

## Animation & Transitions

Default transition timing:
- Fast: 150ms
- Base: 300ms

Animations included:
- Fade in
- Slide in (up/down)
- Hover effects
- Transform delays on buttons

---

## How to Customize

### Change Primary Color

Edit the CSS variable in `theme.css`:

```css
:root {
  --primary-color: #new-color-here;
}
```

### Change Accent Color

```css
:root {
  --accent-color: #new-action-color;
  --accent-light: #lighter-version;
  --accent-dark: #darker-version;
}
```

### Adjust Spacing

Modify the spacing scale at the root level to affect the entire design proportionally.

---

## Files

- **`assets/theme.css`** - Core styles, reset, utilities, and responsive framework
- **`assets/components.css`** - Component-specific styles using the color system
- **`layout/theme.liquid`** - Main Shopify theme layout template
- **`sections/*.liquid`** - Modular section components (hero, collections, testimonials, newsletter)
- **`templates/index.json`** - Homepage template configuration

---

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Notes

- Color scheme maintains professional appearance suitable for most industries
- 60/30/10 ratio follows design best practices for visual balance
- All components are mobile-first responsive
- CSS variables allow easy theme updates without code duplication

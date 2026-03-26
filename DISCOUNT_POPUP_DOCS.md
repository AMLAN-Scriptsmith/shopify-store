# Discount Popup Documentation

## Overview

The Discount Popup is a JavaScript module that automatically displays a special offer popup when customers add a product to their cart. It includes functionality to copy discount codes, close the popup, and track analytics events.

---

## Features

✅ **Automatic Detection** - Triggers when items are added to cart  
✅ **Copy Code to Clipboard** - One-click discount code copying  
✅ **Session Tracking** - Show popup once per session (configurable)  
✅ **Auto-Close Option** - Automatically dismiss after delay  
✅ **Fully Customizable** - Change code, percentage, text, timing  
✅ **Analytics Integration** - Track popup impressions and interactions  
✅ **Mobile Responsive** - Optimized for all screen sizes  
✅ **Accessible** - WCAG compliant with proper ARIA labels  
✅ **Smooth Animations** - Fade and slide animations  
✅ **No Dependencies** - Pure JavaScript, no jQuery required  

---

## Files

- **`assets/discount-popup.js`** - Main JavaScript module
- **`assets/discount-popup.css`** - Styling and animations
- **`layout/theme.liquid`** - Integration in main layout

---

## Configuration

The popup is configured via `window.discountPopupConfig` before the script loads. In `theme.liquid`:

```javascript
<script>
  window.discountPopupConfig = {
    discountCode: 'WELCOME10',           // Code to display
    discountPercentage: 10,              // Percentage to show in badge
    popupText: 'Thank you for...',       // Custom message
    delay: 500,                          // Delay before showing (ms)
    autoClose: false,                    // Auto-dismiss popup
    autoCloseDelay: 10000,              // Auto-close delay (ms)
    showOncePerSession: true             // Show only once per session
  };
</script>
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `discountCode` | String | `WELCOME10` | Discount code displayed to customer |
| `discountPercentage` | Number | `10` | Discount percentage in the badge |
| `popupText` | String | Custom message | Main text in the popup |
| `delay` | Number | `500` | Milliseconds before popup appears |
| `autoClose` | Boolean | `false` | Auto-dismiss popup |
| `autoCloseDelay` | Number | `10000` | Milliseconds before auto-close |
| `showOncePerSession` | Boolean | `true` | Show only once per browser session |

---

## How It Works

### 1. **Initialization**
When the page loads, `DiscountPopupManager` creates the popup HTML and sets up event listeners.

### 2. **Cart Detection**
The script monitors cart additions through:
- Shopify's `cart:item:added` event
- Intercepts fetch requests to `/cart/add`
- Custom `product-added-to-cart` events

### 3. **Popup Display**
When a product is added:
1. Popup becomes visible with animation
2. Message and discount code are displayed
3. Customer can copy code or continue shopping
4. Popup closes when overlay is clicked

### 4. **Session Tracking**
If `showOncePerSession: true`, popup shows only once per browser session using `sessionStorage`.

---

## HTML Structure

The popup generates this structure when initialized:

```html
<div id="discount-popup-overlay" class="discount-popup-overlay">
  <div id="discount-popup" class="discount-popup">
    <button class="discount-popup-close">&times;</button>
    <h2>Special Offer!</h2>
    <div class="discount-badge">10% OFF</div>
    <p class="discount-popup-text">Custom message here</p>
    <div class="discount-code">
      <span class="discount-code-label">Use Code:</span>
      <div class="discount-code-value">WELCOME10</div>
    </div>
    <div class="discount-popup-actions">
      <button class="btn-copy-code">Copy Code</button>
      <button class="btn-continue-shopping">Continue Shopping</button>
    </div>
  </div>
</div>
```

---

## JavaScript API

### Access the Manager

```javascript
// Global instance is created automatically
const manager = window.discountPopupManager;
```

### Methods

#### `manuallyShowPopup()`
Manually trigger the popup display:
```javascript
window.discountPopupManager.manuallyShowPopup();
```

#### `closePopup()`
Close the popup:
```javascript
window.discountPopupManager.closePopup();
```

#### `updateConfig(newConfig)`
Update configuration at runtime:
```javascript
window.discountPopupManager.updateConfig({
  discountCode: 'NEWYEAR20',
  discountPercentage: 20
});
```

#### `resetSession()`
Clear session storage (for testing):
```javascript
window.discountPopupManager.resetSession();
```

#### `destroy()`
Remove popup and cleanup:
```javascript
window.discountPopupManager.destroy();
```

---

## Styling

### CSS Classes

The popup uses CSS classes that can be customized in `discount-popup.css`:

| Class | Purpose |
|-------|---------|
| `.discount-popup-overlay` | Full-screen overlay (backdrop) |
| `.discount-popup` | Popup container |
| `.discount-badge` | Large percentage display |
| `.discount-code` | Code display container |
| `.btn-copy-code` | Copy button (accent color) |
| `.btn-continue-shopping` | Continue button (secondary) |

### Customizing Colors

Edit `discount-popup.css` to change colors:

```css
.discount-badge {
  background: linear-gradient(135deg, #NEW-COLOR 0%, #DARK-VERSION 100%);
}

.btn-copy-code {
  background-color: #NEW-ACCENT;
}

.btn-copy-code:hover {
  background-color: #DARKER-ACCENT;
}
```

### Adjusting Animation Speed

Change `animation` and `transition` durations:

```css
.discount-popup-overlay {
  transition: opacity 0.5s ease, visibility 0.5s ease;  /* Slower fade */
}

.discount-popup {
  animation: popupSlideIn 0.5s ease;  /* Slower slide */
}
```

---

## Example Customizations

### Show Popup for Specific Products

```javascript
document.addEventListener('product-added-to-cart', (e) => {
  // Only show if it's a specific product
  if (e.detail && e.detail.variantId === 12345) {
    window.discountPopupManager.manuallyShowPopup();
  }
});
```

### Change Popup Based on Time of Day

```javascript
const hour = new Date().getHours();
const isNight = hour >= 18 || hour < 6;

window.discountPopupConfig = {
  discountCode: isNight ? 'NIGHT15' : 'WELCOME10',
  discountPercentage: isNight ? 15 : 10,
  popupText: isNight ? 'Late night special!' : 'Welcome offer!'
};
```

### Multiple Popups (Different Discount Tiers)

```javascript
const tier1Popup = new DiscountPopupManager({
  discountCode: 'FIRST10',
  discountPercentage: 10
});

const tier2Popup = new DiscountPopupManager({
  discountCode: 'LOYAL20',
  discountPercentage: 20
});

// Show different popup based on customer
if (isLoyalCustomer) {
  tier2Popup.manuallyShowPopup();
}
```

---

## Analytics Integration

The popup automatically tracks events if Google Analytics is present:

```javascript
// Tracked automatically
- "Discount Popup Shown" - When popup becomes visible
- "Discount Code Copied" - When customer copies code
```

To use with custom analytics:

```javascript
window.discountPopupManager.trackEvent('Custom Event', {
  customData: 'value'
});
```

---

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)
- IE 11 (with fallbacks for clipboard API)

---

## Testing & Debugging

### Manual Testing

1. Open browser DevTools Console
2. Run:
```javascript
// Reset and show popup
window.discountPopupManager.resetSession();
window.discountPopupManager.manuallyShowPopup();
```

### Enable Debug Logging

The script logs to console in development. Add to your config:

```javascript
window.discountPopupConfig.debug = true;
```

### Check Session Storage

```javascript
console.log(sessionStorage.getItem('discount-popup-shown'));
```

---

## Troubleshooting

### Popup Not Showing

**Check:**
1. Is `discount-popup.js` loaded? (Check Network tab)
2. Is `showOncePerSession` preventing display? Run: `discountPopupManager.resetSession()`
3. Are cart events firing? Add event listener to debug:
```javascript
document.addEventListener('product-added-to-cart', () => {
  console.log('Cart item added!');
});
```

### Copy Code Not Working

**Check:**
1. Is Clipboard API supported? Browser console should show fallback
2. Try the fallback method: `window.discountPopupManager.fallbackCopyToClipboard('WELCOME10')`

### Popup Styling Issues

**Check:**
1. Is `discount-popup.css` loaded?
2. Are there CSS conflicts? Check DevTools Styles panel
3. Do z-index values need adjustment? Edit in `discount-popup.css`

---

## Performance Considerations

- Script is ~8KB minified
- Uses event delegation (single listener)
- Session Storage has minimal overhead
- No external dependencies
- Optimized for mobile with reduced animations

---

## Accessibility

The popup includes:
- ✅ ARIA labels on buttons
- ✅ Keyboard navigation support
- ✅ Sufficient color contrast
- ✅ Focus indicators
- ✅ Screen reader friendly

---

## Version History

**1.0.0** - Initial release
- Basic popup functionality
- Clipboard copy support
- Session tracking
- Analytics integration

---

## Support

For issues or feature requests, check:
1. Console for JavaScript errors
2. Network tab for asset loading
3. DevTools Styles for CSS conflicts


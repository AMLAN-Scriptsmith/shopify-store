/**
 * Discount Popup Manager
 * Displays a discount offer popup when products are added to cart
 */

class DiscountPopupManager {
  constructor(config = {}) {
    this.config = {
      discountCode: config.discountCode || 'WELCOME10',
      discountPercentage: config.discountPercentage || 10,
      popupText: config.popupText || 'Thank you for adding to cart!',
      delay: config.delay || 500,
      autoClose: config.autoClose || false,
      autoCloseDelay: config.autoCloseDelay || 10000,
      showOncePerSession: config.showOncePerSession || false,
      ...config
    };

    this.popupShown = false;
    this.init();
  }

  /**
   * Initialize the discount popup manager
   */
  init() {
    this.createPopupHTML();
    this.setupEventListeners();
    this.checkSessionStorage();
  }

  /**
   * Create the discount popup HTML structure
   */
  createPopupHTML() {
    // Check if popup already exists
    if (document.getElementById('discount-popup-overlay')) {
      return;
    }

    const popupHTML = `
      <div id="discount-popup-overlay" class="discount-popup-overlay">
        <div id="discount-popup" class="discount-popup">
          <button class="discount-popup-close" aria-label="Close discount popup">&times;</button>
          
          <h2>Special Offer!</h2>
          
          <div class="discount-badge" id="discount-percentage">
            ${this.config.discountPercentage}% OFF
          </div>
          
          <p class="discount-popup-text" id="popup-text">
            ${this.config.popupText}
          </p>
          
          <div class="discount-code">
            <span class="discount-code-label">Use Code:</span>
            <div class="discount-code-value" id="discount-code-display">
              ${this.config.discountCode}
            </div>
          </div>
          
          <div class="copy-feedback" id="copy-feedback">
            ✓ Code copied to clipboard!
          </div>
          
          <div class="discount-popup-actions">
            <button class="discount-popup-actions button btn-copy-code" id="copy-code-btn">
              Copy Code
            </button>
            <button class="discount-popup-actions button btn-continue-shopping" id="close-popup-btn">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', popupHTML);
    this.bindDOMElements();
  }

  /**
   * Bind DOM elements to instance properties
   */
  bindDOMElements() {
    this.$overlay = document.getElementById('discount-popup-overlay');
    this.$popup = document.getElementById('discount-popup');
    this.$closeBtn = document.querySelector('.discount-popup-close');
    this.$copyCodeBtn = document.getElementById('copy-code-btn');
    this.$continueShoppingBtn = document.getElementById('close-popup-btn');
    this.$copyFeedback = document.getElementById('copy-feedback');
    this.$discountCodeDisplay = document.getElementById('discount-code-display');
  }

  /**
   * Setup event listeners for popup interactions
   */
  setupEventListeners() {
    // Close button click
    if (this.$closeBtn) {
      this.$closeBtn.addEventListener('click', () => this.closePopup());
    }

    // Continue shopping button click
    if (this.$continueShoppingBtn) {
      this.$continueShoppingBtn.addEventListener('click', () => this.closePopup());
    }

    // Copy code button click
    if (this.$copyCodeBtn) {
      this.$copyCodeBtn.addEventListener('click', () => this.copyCodeToClipboard());
    }

    // Close on overlay click (outside popup)
    if (this.$overlay) {
      this.$overlay.addEventListener('click', (e) => {
        if (e.target === this.$overlay) {
          this.closePopup();
        }
      });
    }

    // Listen for cart:item:added event (Shopify cart API)
    document.addEventListener('cart:item:added', (e) => {
      this.handleCartItemAdded(e);
    });

    // Fallback: Listen for custom event if needed
    document.addEventListener('product-added-to-cart', (e) => {
      this.handleCartItemAdded(e);
    });

    // Listen for Shopify's native fetch cart API
    this.observeCartAdditions();
  }

  /**
   * Observe cart additions via fetch intercept
   */
  observeCartAdditions() {
    const originalFetch = window.fetch;

    window.fetch = function(...args) {
      const [resource] = args;
      
      // Check if this is a cart add request
      if (typeof resource === 'string' && resource.includes('/cart/add')) {
        return originalFetch.apply(this, args).then((response) => {
          if (response.ok) {
            // Fire custom event when item successfully added
            document.dispatchEvent(new CustomEvent('product-added-to-cart', {
              detail: { success: true }
            }));
          }
          return response;
        });
      }

      return originalFetch.apply(this, args);
    };
  }

  /**
   * Handle cart item added event
   */
  handleCartItemAdded(event) {
    if (this.config.showOncePerSession && this.popupShown) {
      return;
    }

    if (sessionStorage.getItem('discount-popup-shown') && this.config.showOncePerSession) {
      return;
    }

    // Show popup after delay
    setTimeout(() => {
      this.showPopup();
    }, this.config.delay);

    // Auto-close popup if configured
    if (this.config.autoClose) {
      setTimeout(() => {
        this.closePopup();
      }, this.config.delay + this.config.autoCloseDelay);
    }
  }

  /**
   * Show the discount popup
   */
  showPopup() {
    if (this.$overlay) {
      this.$overlay.classList.add('active');
      this.popupShown = true;
      
      if (this.config.showOncePerSession) {
        sessionStorage.setItem('discount-popup-shown', 'true');
      }

      // Track popup impression (optional analytics)
      this.trackEvent('Discount Popup Shown', {
        code: this.config.discountCode,
        percentage: this.config.discountPercentage
      });
    }
  }

  /**
   * Close the discount popup
   */
  closePopup() {
    if (this.$overlay) {
      this.$overlay.classList.remove('active');
      
      // Reset feedback message
      if (this.$copyFeedback) {
        this.$copyFeedback.classList.remove('show');
      }
    }
  }

  /**
   * Copy discount code to clipboard
   */
  copyCodeToClipboard() {
    const code = this.config.discountCode;

    // Use modern Clipboard API if available
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(() => {
        this.showCopyFeedback();

        // Track event
        this.trackEvent('Discount Code Copied', {
          code: code
        });
      }).catch(() => {
        this.fallbackCopyToClipboard(code);
      });
    } else {
      this.fallbackCopyToClipboard(code);
    }
  }

  /**
   * Fallback clipboard copy method for older browsers
   */
  fallbackCopyToClipboard(code) {
    const textArea = document.createElement('textarea');
    textArea.value = code;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.showCopyFeedback();

      this.trackEvent('Discount Code Copied (Fallback)', {
        code: code
      });
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
    
    document.body.removeChild(textArea);
  }

  /**
   * Show copy feedback message
   */
  showCopyFeedback() {
    if (this.$copyFeedback) {
      this.$copyFeedback.classList.add('show');

      // Hide feedback after 2 seconds
      setTimeout(() => {
        this.$copyFeedback.classList.remove('show');
      }, 2000);
    }
  }

  /**
   * Check if popup was shown in current session
   */
  checkSessionStorage() {
    if (sessionStorage.getItem('discount-popup-shown')) {
      this.popupShown = true;
    }
  }

  /**
   * Track events for analytics (optional)
   */
  trackEvent(eventName, eventData = {}) {
    // Shopify Analytics
    if (window.gtag) {
      try {
        window.gtag('event', eventName, eventData);
      } catch (err) {
        console.log('Analytics not available');
      }
    }

    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DiscountPopup] ${eventName}`, eventData);
    }
  }

  /**
   * Update popup configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Manually trigger popup display
   */
  manuallyShowPopup() {
    this.showPopup();
  }

  /**
   * Reset session storage (for testing)
   */
  resetSession() {
    sessionStorage.removeItem('discount-popup-shown');
    this.popupShown = false;
  }

  /**
   * Destroy the popup and cleanup
   */
  destroy() {
    if (this.$overlay) {
      this.$overlay.remove();
    }
    document.removeEventListener('cart:item:added', (e) => this.handleCartItemAdded(e));
    document.removeEventListener('product-added-to-cart', (e) => this.handleCartItemAdded(e));
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize with default config or custom config from data attribute
    const config = window.discountPopupConfig || {
      discountCode: 'WELCOME10',
      discountPercentage: 10,
      popupText: 'Thank you for adding to cart! Use this code for an exclusive discount.',
      delay: 500,
      autoClose: false,
      autoCloseDelay: 10000,
      showOncePerSession: true
    };

    window.discountPopupManager = new DiscountPopupManager(config);
  });
} else {
  // DOM already loaded
  const config = window.discountPopupConfig || {
    discountCode: 'WELCOME10',
    discountPercentage: 10,
    popupText: 'Thank you for adding to cart! Use this code for an exclusive discount.',
    delay: 500,
    autoClose: false,
    autoCloseDelay: 10000,
    showOncePerSession: true
  };

  window.discountPopupManager = new DiscountPopupManager(config);
}

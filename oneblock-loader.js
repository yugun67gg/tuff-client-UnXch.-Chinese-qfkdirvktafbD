(function() {
  'use strict';
  console.log('[OneBlockLoader] v3.0 - Direct Integration');

  // Store OneBlock configuration globally
  window.ONEBLOCK_MOD = {
    enabled: true,
    id: 'oneblock',
    name: 'OneBlock',
    jarFile: 'oneblock-1.12.2-1.1.2.jar'
  };

  // Hook into Eaglercraft's world creation
  function hookEaglercraft() {
    // Patch the world creation to include OneBlock
    if (window.eaglercraftXOpts) {
      console.log('[OneBlockLoader] Found eaglercraftXOpts');
      
      // Add OneBlock as a world type option
      if (!window.eaglercraftXOpts.worldTypes) {
        window.eaglercraftXOpts.worldTypes = {};
      }

      // Register OneBlock
      window.eaglercraftXOpts.worldTypes['oneblock'] = {
        name: 'OneBlock',
        id: 'oneblock'
      };

      console.log('[OneBlockLoader] ✅ OneBlock added to worldTypes');
      console.log('[OneBlockLoader] worldTypes:', window.eaglercraftXOpts.worldTypes);
    }

    // Try to find and patch world generation selector
    try {
      // Look for any object that might contain world generators
      for (let key in window) {
        if (key.includes('Generator') || key.includes('World') || key.includes('Type')) {
          console.log('[OneBlockLoader] Found potential object:', key);
        }
      }
    } catch (e) {
      // Silent fail
    }
  }

  // Wait for page load and Eaglercraft initialization
  function initializeWhenReady() {
    // Try immediately
    hookEaglercraft();

    // Try after various delays
    const delays = [500, 1000, 2000, 3000, 5000, 10000];
    delays.forEach(delay => {
      setTimeout(() => {
        console.log('[OneBlockLoader] Retry at', delay, 'ms');
        hookEaglercraft();
      }, delay);
    });

    // Try on any DOM change
    const observer = new MutationObserver(() => {
      hookEaglercraft();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false
    });
  }

  // Start when document is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeWhenReady);
  } else {
    initializeWhenReady();
  }

  // Also try on window load
  window.addEventListener('load', initializeWhenReady);

  console.log('[OneBlockLoader] Module loaded');
})();

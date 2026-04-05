(function() {
  'use strict';
  console.log('[OneBlockMenu] v3.0 - Canvas Menu Injection');

  // Monitor console for Eaglercraft debug info
  function injectIntoMenu() {
    try {
      // Check if OneBlock is configured
      if (window.ONEBLOCK_MOD && window.ONEBLOCK_MOD.enabled) {
        console.log('[OneBlockMenu] ✅ OneBlock is enabled');
        console.log('[OneBlockMenu] OneBlock config:', window.ONEBLOCK_MOD);
      }

      // Log all world types for debugging
      if (window.eaglercraftXOpts && window.eaglercraftXOpts.worldTypes) {
        console.log('[OneBlockMenu] Available world types:');
        for (let type in window.eaglercraftXOpts.worldTypes) {
          console.log('[OneBlockMenu]  -', type, ':', window.eaglercraftXOpts.worldTypes[type]);
        }
      }

      // Try to access Eaglercraft's internal world type selector
      // This is where the "World Type: AMPLIFIED" button gets its data
      if (window.GuiCreateWorld) {
        console.log('[OneBlockMenu] Found GuiCreateWorld');
        
        // Try to patch it
        const originalGuiCreateWorld = window.GuiCreateWorld;
        window.GuiCreateWorld = function(...args) {
          console.log('[OneBlockMenu] GuiCreateWorld instantiated');
          
          // Add OneBlock to the world types
          if (this.worldTypes && Array.isArray(this.worldTypes)) {
            if (!this.worldTypes.includes('oneblock')) {
              this.worldTypes.push('oneblock');
              console.log('[OneBlockMenu] OneBlock added to worldTypes array');
            }
          }

          return originalGuiCreateWorld.apply(this, args);
        };
      }

    } catch (error) {
      console.error('[OneBlockMenu] Error:', error);
    }
  }

  // Initialize multiple times
  const attempts = [0, 500, 1000, 2000, 3000, 5000, 10000];
  attempts.forEach(delay => {
    setTimeout(injectIntoMenu, delay);
  });

  // Watch for DOM changes
  const observer = new MutationObserver(injectIntoMenu);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log('[OneBlockMenu] Initialized');
})();

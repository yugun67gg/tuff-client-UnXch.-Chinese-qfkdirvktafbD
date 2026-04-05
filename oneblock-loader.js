(function() {
  'use strict';
  console.log('[OneBlockLoader] Initializing...');
  
  // Ensure eaglercraftXOpts exists
  if (typeof window.eaglercraftXOpts === 'undefined') {
    console.log('[OneBlockLoader] Creating window.eaglercraftXOpts');
    window.eaglercraftXOpts = {};
  }
  
  // Initialize worldTypes array if it doesn't exist
  if (!Array.isArray(window.eaglercraftXOpts.worldTypes)) {
    window.eaglercraftXOpts.worldTypes = [];
  }
  
  // Register OneBlock world type
  const oneblockWorldType = {
    id: 'oneblock',
    name: 'OneBlock',
    jarMod: 'oneblock-1.12.2-1.1.2.jar',
    enabled: true
  };
  
  // Check if already registered
  const exists = window.eaglercraftXOpts.worldTypes.some(wt => wt.id === 'oneblock');
  
  if (!exists) {
    window.eaglercraftXOpts.worldTypes.push(oneblockWorldType);
    console.log('[OneBlockLoader] ✅ OneBlock world type registered:', oneblockWorldType);
  } else {
    console.log('[OneBlockLoader] OneBlock already registered');
  }
  
  window.OneBlockLoaded = true;
  console.log('[OneBlockLoader] Complete!');
})();

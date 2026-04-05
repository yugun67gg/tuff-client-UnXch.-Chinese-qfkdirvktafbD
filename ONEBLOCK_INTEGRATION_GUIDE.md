# OneBlock Mod Integration Guide

## Overview
This document describes how the OneBlock mod has been integrated into TuffClient 1.12 WASM-GC for single-player mode.

## Files Added

### 1. `oneblock-config.json`
Configuration file for the OneBlock mod containing:
- Mod metadata (name, version, minecraft version)
- JAR file reference
- World type configuration
- Module loading settings

### 2. `oneblock-loader.js`
Main loader script that:
- Reads the OneBlock configuration
- Registers the world type with the game
- Integrates with the global mod system
- Provides helper functions for creating OneBlock worlds

### 3. `oneblock-menu-integration.js`
UI integration script that:
- Adds OneBlock as a selectable option in single-player world creation
- Automatically injects the OneBlock menu option
- Uses MutationObserver to detect menu elements dynamically
- Provides world creation handlers

### 4. Updated `index.html`
Changes made:
- Added script tag for `oneblock-loader.js` after `bootstrap.js`
- Added script tag for `oneblock-menu-integration.js`
- Added OneBlock configuration to `window.eaglercraftXOpts`
- Registered OneBlock as an available world type

## How to Use

### For Players
1. Load the TuffClient in your browser
2. Click "Singleplayer"
3. Create a new world
4. Select "OneBlock" from the world type dropdown
5. Configure game mode and difficulty
6. Start playing!

### For Developers
To extend or modify the OneBlock integration:

```javascript
// Access OneBlock loader
window.OneBlockLoader.config

// Access menu integration
window.OneBlockMenuIntegration.createOneBlockWorld(name, gameMode, difficulty, seed)

// Listen for OneBlock loaded event
document.addEventListener('oneblockLoaded', function(e) {
  console.log('OneBlock config:', e.detail);
});
```

## Configuration

Edit `oneblock-config.json` to modify:
- `enabled`: Enable/disable the mod
- `autoLoad`: Automatically load on startup
- `worldTypeId`: Internal ID for the world type
- `worldTypeName`: Display name in menus

## Troubleshooting

### OneBlock option not appearing in menu
1. Check browser console for error messages
2. Verify `oneblock-loader.js` is loaded (check Network tab)
3. Check that `oneblock-config.json` exists and is accessible
4. Try clearing browser cache and reloading

### OneBlock world fails to load
1. Ensure `oneblock-1.12.2-1.1.2.jar` is in the repository root
2. Check that the JAR file path in config matches actual file
3. Verify the JAR is compatible with Eaglercraft 1.12.2

## Technical Details

### World Type Registration
The OneBlock mod registers itself as a world type via:
```javascript
window.eaglercraftXOpts.worldTypes.push({
  id: 'oneblock',
  name: 'OneBlock',
  jarMod: 'oneblock-1.12.2-1.1.2.jar'
});
```

### Menu Integration
The integration uses a MutationObserver to detect when menu elements are dynamically added to the DOM and automatically injects the OneBlock option.

### JAR Loading
The specified JAR file is loaded by the Eaglercraft engine during world initialization when the OneBlock world type is selected.

## Future Enhancements

Possible improvements:
- [ ] Custom OneBlock world preview image
- [ ] Preset difficulty configurations
- [ ] Challenge mode presets
- [ ] Statistics tracking
- [ ] Achievement integration
- [ ] Multiplayer OneBlock support

## Support

For issues or questions:
1. Check the console for error messages
2. Verify all files are present and accessible
3. Ensure browser is up-to-date
4. Try a different browser if issues persist
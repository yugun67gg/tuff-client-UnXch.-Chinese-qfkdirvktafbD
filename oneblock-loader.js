/**
 * OneBlock Mod Loader for TuffClient
 * Loads and registers the OneBlock mod for single-player world creation
 */

(function() {
  'use strict';

  const logger = {
    info: (msg) => console.log('[OneBlockLoader] [INFO] ' + msg),
    warn: (msg) => console.warn('[OneBlockLoader] [WARN] ' + msg),
    error: (msg) => console.error('[OneBlockLoader] [ERROR] ' + msg),
    debug: (msg) => console.debug('[OneBlockLoader] [DEBUG] ' + msg)
  };

  // Global OneBlock state
  const state = {
    loaded: false,
    config: null,
    jarPath: 'oneblock-1.12.2-1.1.2.jar',
    registeredWorldTypes: []
  };

  /**
   * Load OneBlock configuration
   */
  async function loadConfig() {
    try {
      const response = await fetch('oneblock-config.json');
      if (!response.ok) {
        logger.warn('oneblock-config.json not found, using default config');
        return getDefaultConfig();
      }
      
      const config = await response.json();
      state.config = config;
      logger.info('OneBlock config loaded');
      return config;
    } catch (error) {
      logger.warn('Failed to load oneblock-config.json: ' + error.message);
      return getDefaultConfig();
    }
  }

  /**
   * Get default configuration
   */
  function getDefaultConfig() {
    return {
      enabled: true,
      name: 'OneBlock',
      version: '1.1.2',
      minecraftVersion: '1.12.2',
      jarFile: 'oneblock-1.12.2-1.1.2.jar',
      worldTypeId: 'oneblock',
      worldTypeName: 'OneBlock',
      description: 'Survive on a single block with unlimited inventory',
      autoLoad: true
    };
  }

  /**
   * Register OneBlock as world type
   */
  function registerWorldType(config) {
    try {
      // Initialize world types array if needed
      if (!window.eaglercraftXOpts) {
        window.eaglercraftXOpts = {};
      }

      if (!window.eaglercraftXOpts.worldTypes) {
        window.eaglercraftXOpts.worldTypes = [];
      }

      // Create world type descriptor
      const worldType = {
        id: config.worldTypeId || 'oneblock',
        name: config.worldTypeName || 'OneBlock',
        jarMod: config.jarFile || state.jarPath,
        modVersion: config.version,
        mcVersion: config.minecraftVersion,
        description: config.description
      };

      // Check for duplicate
      const exists = window.eaglercraftXOpts.worldTypes.some(
        wt => wt.id === worldType.id
      );

      if (!exists) {
        window.eaglercraftXOpts.worldTypes.push(worldType);
        state.registeredWorldTypes.push(worldType);
        logger.info('OneBlock world type registered: ' + worldType.name);
      } else {
        logger.info('OneBlock world type already registered');
      }

      return worldType;
    } catch (error) {
      logger.error('Failed to register world type: ' + error.message);
      return null;
    }
  }

  /**
   * Add OneBlock mod to eaglercraft options
   */
  function registerMod(config) {
    try {
      if (!window.eaglercraftXOpts) {
        window.eaglercraftXOpts = {};
      }

      if (!window.eaglercraftXOpts.mods) {
        window.eaglercraftXOpts.mods = [];
      }

      const mod = {
        id: 'oneblock',
        name: config.name,
        version: config.version,
        jarFile: config.jarFile || state.jarPath,
        enabled: config.enabled !== false,
        autoLoad: config.autoLoad !== false,
        minecraftVersion: config.minecraftVersion
      };

      const exists = window.eaglercraftXOpts.mods.some(m => m.id === 'oneblock');
      if (!exists) {
        window.eaglercraftXOpts.mods.push(mod);
        logger.info('OneBlock mod registered in eaglercraft options');
      }

      return mod;
    } catch (error) {
      logger.error('Failed to register mod: ' + error.message);
      return null;
    }
  }

  /**
   * Initialize OneBlock Loader
   */
  async function initialize() {
    try {
      logger.info('OneBlock Loader v1.0 initializing...');

      // Load configuration
      const config = await loadConfig();

      if (!config.enabled) {
        logger.info('OneBlock is disabled in config');
        return false;
      }

      // Register mod and world type
      registerMod(config);
      registerWorldType(config);

      // Mark as loaded
      state.loaded = true;
      state.config = config;

      logger.info('OneBlock Loader initialized successfully');

      // Dispatch loaded event
      const event = new CustomEvent('oneblockLoaded', {
        detail: {
          config: config,
          worldTypes: state.registeredWorldTypes
        }
      });
      document.dispatchEvent(event);

      return true;
    } catch (error) {
      logger.error('OneBlock Loader initialization failed: ' + error.message);
      state.loaded = false;
      return false;
    }
  }

  /**
   * Public API
   */
  window.OneBlockLoader = {
    initialize: initialize,
    isLoaded: () => state.loaded,
    getConfig: () => state.config ? { ...state.config } : null,
    getWorldTypes: () => [...state.registeredWorldTypes],
    getState: () => ({ ...state }),
    logger: logger
  };

  /**
   * Auto-initialize when eager craft options are ready
   */
  const checkAndInitialize = setInterval(() => {
    if (window.eaglercraftXOpts && typeof window.eaglercraftXOpts === 'object') {
      clearInterval(checkAndInitialize);
      initialize().catch(error => {
        logger.error('Initialization error: ' + error.message);
      });
    }
  }, 100);

  // Fallback: initialize after timeout
  setTimeout(() => {
    if (!state.loaded && checkAndInitialize) {
      clearInterval(checkAndInitialize);
      initialize().catch(error => {
        logger.error('Fallback initialization error: ' + error.message);
      });
    }
  }, 2000);
})();
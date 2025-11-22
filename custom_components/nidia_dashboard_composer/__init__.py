"""Nidia Dashboard Composer Integration."""
import logging
import os
from pathlib import Path
from homeassistant.core import HomeAssistant

from homeassistant.components.frontend import async_register_built_in_panel

from .const import DOMAIN, TITLE
from .coordinator import ComposerCoordinator
from .api import async_setup_ws_api

_LOGGER = logging.getLogger(__name__)


async def async_setup(hass: HomeAssistant, config: dict):
    """Set up the Nidia Dashboard Composer component."""
    _LOGGER.info("Setting up Nidia Dashboard Composer")

    # Initialize coordinator
    coordinator = ComposerCoordinator(hass)
    await coordinator.async_init()
    hass.data[DOMAIN] = coordinator

    # Register WebSocket API
    async_setup_ws_api(hass)

    # Determine the correct module URL
    # 1. Check if HACS has installed the file in www/community
    hacs_path = hass.config.path(f"www/community/{DOMAIN}/nidia-dashboard-composer-panel.js")
    
    # 2. Check if file exists in custom_components (dev/manual install)
    dev_path = hass.config.path(f"custom_components/{DOMAIN}/www/nidia-dashboard-composer-panel.js")
    
    if os.path.exists(hacs_path):
        # Use the standard /local path which maps to /config/www
        module_url = f"/local/community/{DOMAIN}/nidia-dashboard-composer-panel.js"
        _LOGGER.info("Found frontend file in HACS path: %s", hacs_path)
    elif os.path.exists(dev_path):
        # Register a custom static path for development/manual install
        # This requires importing StaticPathConfig
        from homeassistant.components.http import StaticPathConfig
        
        await hass.http.async_register_static_paths([
            StaticPathConfig(
                url_path=f"/{DOMAIN}_static",
                path=hass.config.path(f"custom_components/{DOMAIN}/www"),
                cache_headers=False
            )
        ])
        module_url = f"/{DOMAIN}_static/nidia-dashboard-composer-panel.js"
        _LOGGER.info("Found frontend file in dev path, registered static url: %s", module_url)
    else:
        # Fallback to HACS proxy path if file not found (might be cached or not yet copied)
        module_url = f"/hacsfiles/{DOMAIN}/nidia-dashboard-composer-panel.js"
        _LOGGER.warning("Frontend file not found in expected locations, falling back to: %s", module_url)
    
    # Register the panel
    async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title=TITLE,
        sidebar_icon="mdi:view-dashboard-variant",
        frontend_url_path=DOMAIN,
        config={
            "_panel_custom": {
                "name": "nidia-dashboard-composer-panel",
                "module_url": module_url,
            }
        },
        require_admin=False,
    )
    
    _LOGGER.info("Nidia Dashboard Composer panel registered with module_url: %s", module_url)

    return True


async def async_unload_entry(hass: HomeAssistant, entry):
    """Unload a config entry."""
    return True

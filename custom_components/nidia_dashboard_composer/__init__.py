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

    # Read version from manifest.json for cache busting
    import json
    manifest_path = Path(__file__).parent / "manifest.json"
    try:
        with open(manifest_path) as f:
            manifest = json.load(f)
            version = manifest.get("version", "0.0.0")
    except Exception as e:
        _LOGGER.warning("Failed to read version from manifest: %s", e)
        version = "0.0.0"
    
    # Register static path for assets (images, etc.)
    # Use the absolute path of the current directory to ensure it works regardless of HA config
    from homeassistant.components.http import StaticPathConfig
    
    current_dir = os.path.dirname(__file__)
    www_dir = os.path.join(current_dir, "www")
    
    await hass.http.async_register_static_paths([
        StaticPathConfig(
            url_path="/nidia-assets",
            path=www_dir,
            cache_headers=False
        )
    ])
    _LOGGER.info("Registered static assets path: /nidia-assets -> %s", www_dir)

    # Determine the correct module URL for the frontend panel
    hacs_path = hass.config.path(f"www/community/{DOMAIN}/nidia-dashboard-composer-panel.js")
    dev_path = hass.config.path(f"custom_components/{DOMAIN}/www/nidia-dashboard-composer-panel.js")
    
    if os.path.exists(hacs_path):
        module_url = f"/local/community/{DOMAIN}/nidia-dashboard-composer-panel.js?v={version}"
        _LOGGER.info("Found frontend file in HACS path: %s", hacs_path)
    elif os.path.exists(dev_path):
        module_url = f"/{DOMAIN}_static/nidia-dashboard-composer-panel.js?v={version}"
        _LOGGER.info("Found frontend file in dev path, using static url: %s", module_url)
    else:
        module_url = f"/hacsfiles/{DOMAIN}/nidia-dashboard-composer-panel.js?v={version}"
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

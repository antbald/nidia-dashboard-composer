"""Nidia Dashboard Composer Integration."""
import logging
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

    # Register the frontend resource
    # The panel JavaScript will be served from /hacsfiles path automatically by HACS
    # or from /local/custom_components path for manual installations
    module_url = f"/hacsfiles/{DOMAIN}/nidia-dashboard-composer-panel.js"
    
    # Register the panel
    async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title=TITLE,
        sidebar_icon="mdi:view-dashboard-variant",
        frontend_url_path=DOMAIN,
        config={
            "_panel_custom": {
                "name": f"{DOMAIN}-panel",
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

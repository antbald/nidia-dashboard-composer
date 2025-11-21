"""Nidia Dashboard Composer Integration."""
import logging
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

    # Register static files path
    hass.http.register_static_path(
        f"/{DOMAIN}",
        hass.config.path(f"custom_components/{DOMAIN}/www"),
        cache_headers=False
    )


    hass.components.frontend.async_register_built_in_panel(
        component_name="custom",
        sidebar_title=TITLE,
        sidebar_icon="mdi:view-dashboard-variant",
        frontend_url_path=DOMAIN,
        config={
            "_panel_custom": {
                "name": f"{DOMAIN}-panel",
                "module_url": f"/{DOMAIN}/nidia-dashboard-composer-panel.js",
            }
        },
        require_admin=False,
    )

    return True


async def async_unload_entry(hass: HomeAssistant, entry):
    """Unload a config entry."""
    return True

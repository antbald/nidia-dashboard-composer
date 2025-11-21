"""WebSocket API for Nidia Dashboard Composer."""
import logging
import voluptuous as vol
from homeassistant.core import HomeAssistant, callback
from homeassistant.components import websocket_api

from .const import (
    DOMAIN,
    WS_TYPE_GET_CONFIG,
    WS_TYPE_SAVE_CONFIG,
    WS_TYPE_GENERATE,
    WS_TYPE_TEST_RUN,
)

_LOGGER = logging.getLogger(__name__)


@callback
def async_setup_ws_api(hass: HomeAssistant):
    """Set up the WebSocket API."""
    websocket_api.async_register_command(hass, ws_get_config)
    websocket_api.async_register_command(hass, ws_save_config)
    websocket_api.async_register_command(hass, ws_generate)
    websocket_api.async_register_command(hass, ws_test_run)


@websocket_api.websocket_command({vol.Required("type"): WS_TYPE_GET_CONFIG})
@websocket_api.async_response
async def ws_get_config(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
):
    """Get current configuration."""
    coordinator = hass.data[DOMAIN]
    config = await coordinator.get_config()
    connection.send_result(msg["id"], config)


@websocket_api.websocket_command({
    vol.Required("type"): WS_TYPE_SAVE_CONFIG,
    vol.Required("config"): dict,
})
@websocket_api.async_response
async def ws_save_config(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
):
    """Save configuration."""
    coordinator = hass.data[DOMAIN]
    await coordinator.save_config(msg["config"])
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command({vol.Required("type"): WS_TYPE_GENERATE})
@websocket_api.async_response
async def ws_generate(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
):
    """Generate dashboard."""
    coordinator = hass.data[DOMAIN]
    try:
        result = await coordinator.generate_dashboard()
        connection.send_result(msg["id"], result)
    except Exception as ex:
        _LOGGER.exception("Error generating dashboard")
        connection.send_error(msg["id"], "generation_failed", str(ex))


@websocket_api.websocket_command({
    vol.Required("type"): WS_TYPE_TEST_RUN,
    vol.Required("scenario"): str,
})
@websocket_api.async_response
async def ws_test_run(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
):
    """Run test scenario."""
    coordinator = hass.data[DOMAIN]
    try:
        result = await coordinator.run_test_scenario(msg["scenario"])
        connection.send_result(msg["id"], result)
    except Exception as ex:
        _LOGGER.exception("Error running test scenario")
        connection.send_error(msg["id"], "test_failed", str(ex))

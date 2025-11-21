"""Tests for integration setup."""
import pytest
from unittest.mock import MagicMock, AsyncMock, patch
from homeassistant.core import HomeAssistant
from custom_components.nidia_dashboard_composer import async_setup
from custom_components.nidia_dashboard_composer.const import DOMAIN


@pytest.mark.asyncio
async def test_async_setup(hass):
    """Test the setup of the integration."""
    # Mock the frontend component
    hass.components.frontend = MagicMock()
    hass.components.frontend.async_register_built_in_panel = MagicMock()
    
    # Mock http component  
    hass.http = MagicMock()
    
    # Run setup
    config = {DOMAIN: {}}
    result = await async_setup(hass, config)
    
    # Verify setup succeeded
    assert result is True
    
    # Verify coordinator was created
    assert DOMAIN in hass.data
    
    # Verify panel was registered
    hass.components.frontend.async_register_built_in_panel.assert_called_once()
    
    # Get the call arguments
    call_args = hass.components.frontend.async_register_built_in_panel.call_args
    assert call_args[1]["sidebar_title"] == "Nidia Dashboard Composer"
    assert call_args[1]["frontend_url_path"] == DOMAIN

"""Tests for integration setup."""
import pytest
from unittest.mock import MagicMock, AsyncMock, patch
from homeassistant.core import HomeAssistant
from custom_components.nidia_dashboard_composer import async_setup
from custom_components.nidia_dashboard_composer.const import DOMAIN


@pytest.mark.asyncio
async def test_async_setup(hass):
    """Test the setup of the integration."""
    # Mock http component  
    hass.http = MagicMock()
    hass.http.async_register_static_paths = AsyncMock()
    
    # Mock config
    hass.config = MagicMock()
    hass.config.path = MagicMock(side_effect=lambda *args: f"/mock/path/{'/'.join(args)}")
    hass.config.config_dir = "/tmp"
    # Mock loop
    hass.loop = MagicMock()
    hass.loop.create_future = MagicMock(return_value=AsyncMock())
    # Mock async_add_executor_job
    hass.async_add_executor_job = AsyncMock(return_value={})
    
    # Run setup
    config = {DOMAIN: {}}
    
    # We need to patch the imported function and os.path.exists
    with patch("custom_components.nidia_dashboard_composer.async_register_built_in_panel") as mock_register, \
         patch("os.path.exists", return_value=True): # Simulate HACS path exists
        
        result = await async_setup(hass, config)
        
        # Verify setup succeeded
        assert result is True
        
        # Verify coordinator was created
        assert DOMAIN in hass.data
        
        # Verify panel was registered
        mock_register.assert_called_once()
        
        # Get the call arguments
        args, kwargs = mock_register.call_args
        assert args[0] is hass
        assert kwargs["sidebar_title"] == "Nidia Dashboard Composer"
        assert kwargs["frontend_url_path"] == DOMAIN
        # Verify URL is local path when file exists
        assert "/local/community/" in kwargs["config"]["_panel_custom"]["module_url"]

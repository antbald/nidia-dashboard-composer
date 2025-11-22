"""Reproduction test for hass.components AttributeError."""
import pytest
from unittest.mock import MagicMock, patch, AsyncMock
from custom_components.nidia_dashboard_composer import async_setup
from custom_components.nidia_dashboard_composer.const import DOMAIN

class StrictMockHass:
    """A mock of HomeAssistant that strictly does not have 'components' attribute."""
    def __init__(self):
        self.data = {}
        self.config = MagicMock()
        self.http = MagicMock()
        # Explicitly do NOT set self.components
        
@pytest.mark.asyncio
async def test_async_setup_repro_failure():
    """Test that async_setup works without accessing hass.components."""
    hass = StrictMockHass()
    hass.config.path.return_value = "/tmp/path"
    
    # Mock the coordinator init
    with patch("custom_components.nidia_dashboard_composer.ComposerCoordinator") as mock_coord_cls:
        mock_coord = mock_coord_cls.return_value
        mock_coord.async_init = AsyncMock(return_value=None)
        
        # We also need to mock async_setup_ws_api
        with patch("custom_components.nidia_dashboard_composer.async_setup_ws_api"):
            
            # And crucially, we need to mock the IMPORTED async_register_built_in_panel
            # because the fix will use that.
            # If the code still uses hass.components, this test will raise AttributeError.
            
            # To verify the fix, we mock the function where it is imported
            with patch("custom_components.nidia_dashboard_composer.async_register_built_in_panel") as mock_register:
                
                await async_setup(hass, {})
                
                # If we get here, it means no AttributeError was raised!
                # And we should verify the imported function was called
                mock_register.assert_called_once()
                
                # Verify the first argument is hass
                args, _ = mock_register.call_args
                assert args[0] is hass

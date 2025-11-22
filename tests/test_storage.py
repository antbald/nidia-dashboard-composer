"""Tests for storage module."""
import pytest
from custom_components.nidia_dashboard_composer.storage import ComposerStorage
from unittest.mock import MagicMock, AsyncMock


@pytest.mark.asyncio
async def test_storage_load(hass):
    """Test loading storage."""
    hass.config = MagicMock()
    hass.config.config_dir = "/tmp"
    storage = ComposerStorage(hass)
    
    # Mock the store load
    storage._store.async_load = AsyncMock(return_value={"test": "data"})
    
    data = await storage.async_load()
    assert data == {"test": "data"}


@pytest.mark.asyncio
async def test_storage_save(hass):
    """Test saving storage."""
    hass.config = MagicMock()
    hass.config.config_dir = "/tmp"
    storage = ComposerStorage(hass)
    storage._store.async_save = AsyncMock()
    
    test_data = {
        "areas": ["living_room"],
        "modules": ["light"],
        "theme": "dark"
    }
    
    await storage.async_save(test_data)
    
    assert storage.config == test_data
    storage._store.async_save.assert_called_once_with(test_data)

"""Test configuration and fixtures."""
import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry, entity_registry


@pytest.fixture
def hass():
    """Create a mock Home Assistant instance."""
    hass = MagicMock(spec=HomeAssistant)
    hass.data = {}
    hass.states = MagicMock()
    return hass


@pytest.fixture
def mock_entity_registry():
    """Create a mock entity registry."""
    registry = MagicMock()
    registry.entities = {}
    return registry


@pytest.fixture
def mock_area_registry():
    """Create a mock area registry."""
    registry = MagicMock()
    registry.areas = {}
    return registry


@pytest.fixture
def sample_entities():
    """Sample entities for testing."""
    return [
        {
            "entity_id": "light.living_room",
            "domain": "light",
            "area_id": "living_room",
            "area_name": "Living Room",
            "friendly_name": "Living Room Light",
            "state": "on",
            "attributes": {},
            "device_class": None
        },
        {
            "entity_id": "climate.bedroom",
            "domain": "climate",
            "area_id": "bedroom",
            "area_name": "Bedroom",
            "friendly_name": "Bedroom Thermostat",
            "state": "heat",
            "attributes": {},
            "device_class": None
        }
    ]


@pytest.fixture
def sample_config():
    """Sample configuration for testing."""
    return {
        "areas": ["living_room", "bedroom"],
        "modules": ["light", "climate"],
        "theme": "default",
        "layout_style": "standard"
    }

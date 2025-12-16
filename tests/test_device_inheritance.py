"""Test device-to-entity area_id inheritance."""
import pytest
from unittest.mock import MagicMock, patch
from custom_components.nidia_dashboard_composer.generator.engine import DashboardGenerator


class MockEntity:
    """Mock entity for testing."""
    def __init__(self, entity_id, domain, area_id, device_id):
        self.entity_id = entity_id
        self.domain = domain
        self.area_id = area_id
        self.device_id = device_id
        self.device_class = None


class MockDevice:
    """Mock device for testing."""
    def __init__(self, id, area_id):
        self.id = id
        self.area_id = area_id


class MockArea:
    """Mock area for testing."""
    def __init__(self, id, name):
        self.id = id
        self.name = name


@pytest.mark.asyncio
async def test_device_area_inheritance(hass):
    """Test that entities inherit area from devices."""
    # Setup mock data
    entities = [
        MockEntity("light.bedroom_direct", "light", "bedroom", None),  # Direct area
        MockEntity("sensor.bedroom_temp", "sensor", None, "device_1"),  # Inherits from device
        MockEntity("light.kitchen_lamp", "light", None, "device_2"),  # Inherits from device
        MockEntity("sensor.standalone", "sensor", None, None),  # No area
    ]

    devices = [
        MockDevice("device_1", "bedroom"),
        MockDevice("device_2", "kitchen"),
        MockDevice("device_3", None),  # Device without area
    ]

    areas = [
        MockArea("bedroom", "Bedroom"),
        MockArea("kitchen", "Kitchen"),
    ]

    # Mock states
    for entity in entities:
        state = MagicMock()
        state.state = "on"
        state.attributes = {"friendly_name": entity.entity_id}
        hass.states.get = MagicMock(side_effect=lambda eid: state if eid in [e.entity_id for e in entities] else None)

    generator = DashboardGenerator(hass)

    # Mock registries
    with patch("homeassistant.helpers.entity_registry.async_get") as mock_ent_reg, \
         patch("homeassistant.helpers.device_registry.async_get") as mock_dev_reg, \
         patch("homeassistant.helpers.area_registry.async_get") as mock_area_reg:

        mock_ent_reg.return_value.entities = MagicMock(values=MagicMock(return_value=entities))
        mock_dev_reg.return_value.devices = MagicMock(values=MagicMock(return_value=devices))
        mock_area_reg.return_value.areas = MagicMock(values=MagicMock(return_value=areas))

        config = {"areas": ["bedroom", "kitchen"], "modules": []}
        discovered = await generator._discover_entities(config)

    # Verify results
    assert len(discovered) == 3  # 3 entities in bedroom/kitchen (standalone filtered)

    # Check entity with direct area
    bedroom_direct = next(e for e in discovered if e["entity_id"] == "light.bedroom_direct")
    assert bedroom_direct["area_id"] == "bedroom"
    assert bedroom_direct["area_name"] == "Bedroom"

    # Check entity with inherited area
    bedroom_temp = next(e for e in discovered if e["entity_id"] == "sensor.bedroom_temp")
    assert bedroom_temp["area_id"] == "bedroom"  # Inherited from device_1
    assert bedroom_temp["area_name"] == "Bedroom"

    kitchen_lamp = next(e for e in discovered if e["entity_id"] == "light.kitchen_lamp")
    assert kitchen_lamp["area_id"] == "kitchen"  # Inherited from device_2
    assert kitchen_lamp["area_name"] == "Kitchen"


@pytest.mark.asyncio
async def test_direct_area_takes_precedence(hass):
    """Test that direct entity area_id takes precedence over device area_id."""
    # Entity has area "bedroom", device has area "kitchen"
    # Entity area should win (more specific)
    entities = [MockEntity("light.test", "light", "bedroom", "device_1")]
    devices = [MockDevice("device_1", "kitchen")]
    areas = [
        MockArea("bedroom", "Bedroom"),
        MockArea("kitchen", "Kitchen"),
    ]

    state = MagicMock()
    state.state = "on"
    state.attributes = {"friendly_name": "Test Light"}
    hass.states.get = MagicMock(return_value=state)

    generator = DashboardGenerator(hass)

    with patch("homeassistant.helpers.entity_registry.async_get") as mock_ent_reg, \
         patch("homeassistant.helpers.device_registry.async_get") as mock_dev_reg, \
         patch("homeassistant.helpers.area_registry.async_get") as mock_area_reg:

        mock_ent_reg.return_value.entities = MagicMock(values=MagicMock(return_value=entities))
        mock_dev_reg.return_value.devices = MagicMock(values=MagicMock(return_value=devices))
        mock_area_reg.return_value.areas = MagicMock(values=MagicMock(return_value=areas))

        config = {"areas": ["bedroom"], "modules": []}
        discovered = await generator._discover_entities(config)

    assert len(discovered) == 1
    assert discovered[0]["area_id"] == "bedroom"  # Direct area wins, not kitchen


@pytest.mark.asyncio
async def test_no_area_entities_filtered(hass):
    """Test that entities without any area are filtered when valid areas are specified."""
    # Create entities: one in bedroom, one standalone
    entities = [
        MockEntity("light.bedroom", "light", None, "device_1"),  # Has device with area
        MockEntity("light.standalone", "light", None, None),  # No area at all
    ]
    devices = [MockDevice("device_1", "bedroom")]
    areas = [MockArea("bedroom", "Bedroom")]

    state = MagicMock()
    state.state = "on"
    state.attributes = {"friendly_name": "Light"}
    hass.states.get = MagicMock(return_value=state)

    generator = DashboardGenerator(hass)

    with patch("homeassistant.helpers.entity_registry.async_get") as mock_ent_reg, \
         patch("homeassistant.helpers.device_registry.async_get") as mock_dev_reg, \
         patch("homeassistant.helpers.area_registry.async_get") as mock_area_reg:

        mock_ent_reg.return_value.entities = MagicMock(values=MagicMock(return_value=entities))
        mock_dev_reg.return_value.devices = MagicMock(values=MagicMock(return_value=devices))
        mock_area_reg.return_value.areas = MagicMock(values=MagicMock(return_value=areas))

        config = {"areas": ["bedroom"], "modules": []}
        discovered = await generator._discover_entities(config)

    # Only the bedroom light should be found, standalone filtered out
    assert len(discovered) == 1
    assert discovered[0]["entity_id"] == "light.bedroom"


@pytest.mark.asyncio
async def test_no_area_entities_included_when_no_filter(hass):
    """Test that entities without area are included when no area filter."""
    entities = [MockEntity("light.standalone", "light", None, None)]
    devices = []
    areas = []

    state = MagicMock()
    state.state = "on"
    state.attributes = {"friendly_name": "Standalone"}
    hass.states.get = MagicMock(return_value=state)

    generator = DashboardGenerator(hass)

    with patch("homeassistant.helpers.entity_registry.async_get") as mock_ent_reg, \
         patch("homeassistant.helpers.device_registry.async_get") as mock_dev_reg, \
         patch("homeassistant.helpers.area_registry.async_get") as mock_area_reg:

        mock_ent_reg.return_value.entities = MagicMock(values=MagicMock(return_value=entities))
        mock_dev_reg.return_value.devices = MagicMock(values=MagicMock(return_value=devices))
        mock_area_reg.return_value.areas = MagicMock(values=MagicMock(return_value=areas))

        config = {"areas": [], "modules": []}  # No area filter
        discovered = await generator._discover_entities(config)

    assert len(discovered) == 1
    assert discovered[0]["area_id"] is None
    assert discovered[0]["area_name"] is None

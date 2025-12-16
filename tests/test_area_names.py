"""Test area name handling."""
import pytest
from custom_components.nidia_dashboard_composer.generator.modules.rooms_module import RoomsModule


def test_area_name_from_entity_info():
    """Test that rooms use area_name from EntityInfo."""
    entities = [
        {
            "entity_id": "light.bedroom",
            "domain": "light",
            "area_id": "camera_da_letto",
            "area_name": "Camera da letto",  # Correct capitalization from HA
            "friendly_name": "Bedroom Light",
            "state": "on",
            "attributes": {},
            "device_class": None
        }
    ]

    config = {}
    result = RoomsModule.generate(entities, config, all_entities=entities)

    # Verify the room card uses correct area name
    # The separator card has the room name
    separator_cards = [c for c in result.sections[0]["cards"] if c.get("card_type") == "separator"]
    assert len(separator_cards) == 1
    assert separator_cards[0]["name"] == "Camera da letto"  # Not "Camera Da Letto"


def test_area_name_fallback():
    """Test fallback when area_name is missing."""
    entities = [
        {
            "entity_id": "light.bedroom",
            "domain": "light",
            "area_id": "camera_da_letto",
            # No area_name field (backward compatibility)
            "friendly_name": "Bedroom Light",
            "state": "on",
            "attributes": {},
            "device_class": None
        }
    ]

    config = {}
    result = RoomsModule.generate(entities, config, all_entities=entities)

    # Should fallback to formatted area_id
    separator_cards = [c for c in result.sections[0]["cards"] if c.get("card_type") == "separator"]
    assert len(separator_cards) == 1
    assert separator_cards[0]["name"] == "Camera Da Letto"  # Fallback formatting


def test_area_name_none():
    """Test entities without area."""
    entities = [
        {
            "entity_id": "light.standalone",
            "domain": "light",
            "area_id": None,
            "area_name": None,
            "friendly_name": "Standalone Light",
            "state": "on",
            "attributes": {},
            "device_class": None
        }
    ]

    config = {}
    result = RoomsModule.generate(entities, config, all_entities=entities)

    # Should handle None gracefully - no rooms should be created
    assert result is not None
    assert result.sections is not None
    # Since there are no valid areas, there should be no separator cards
    separator_cards = [c for c in result.sections[0]["cards"] if c.get("card_type") == "separator"]
    assert len(separator_cards) == 0


def test_multiple_areas_with_correct_names():
    """Test multiple areas with correct Italian names."""
    entities = [
        {
            "entity_id": "light.bedroom",
            "domain": "light",
            "area_id": "camera_da_letto",
            "area_name": "Camera da letto",
            "friendly_name": "Bedroom Light",
            "state": "on",
            "attributes": {},
            "device_class": None
        },
        {
            "entity_id": "light.kitchen",
            "domain": "light",
            "area_id": "cucina",
            "area_name": "Cucina",
            "friendly_name": "Kitchen Light",
            "state": "on",
            "attributes": {},
            "device_class": None
        },
        {
            "entity_id": "light.living_room",
            "domain": "light",
            "area_id": "soggiorno",
            "area_name": "Soggiorno",
            "friendly_name": "Living Room Light",
            "state": "on",
            "attributes": {},
            "device_class": None
        }
    ]

    config = {}
    result = RoomsModule.generate(entities, config, all_entities=entities)

    # Verify all room names are correct
    separator_cards = [c for c in result.sections[0]["cards"] if c.get("card_type") == "separator"]
    assert len(separator_cards) == 3

    room_names = {card["name"] for card in separator_cards}
    assert "Camera da letto" in room_names
    assert "Cucina" in room_names
    assert "Soggiorno" in room_names


def test_area_name_empty_string():
    """Test behavior when area_name is empty string."""
    entities = [
        {
            "entity_id": "light.bedroom",
            "domain": "light",
            "area_id": "camera_da_letto",
            "area_name": "",  # Empty string
            "friendly_name": "Bedroom Light",
            "state": "on",
            "attributes": {},
            "device_class": None
        }
    ]

    config = {}
    result = RoomsModule.generate(entities, config, all_entities=entities)

    # Should fallback to formatted area_id when area_name is empty
    separator_cards = [c for c in result.sections[0]["cards"] if c.get("card_type") == "separator"]
    assert len(separator_cards) == 1
    assert separator_cards[0]["name"] == "Camera Da Letto"  # Fallback formatting

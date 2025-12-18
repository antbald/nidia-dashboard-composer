"""Test empty room filtering."""
from custom_components.nidia_dashboard_composer.generator.modules.rooms import (
    generate_lighting_module_for_all_rooms,
    Room
)


def test_empty_room_filtered():
    """Test that rooms with no entities are filtered out."""
    rooms = [
        Room(
            area_id="living_room",
            name="Living Room",
            entities=[
                {
                    "entity_id": "light.living_room",
                    "domain": "light",
                    "area_id": "living_room",
                    "area_name": "Living Room"
                }
            ]
        ),
        Room(
            area_id="empty_room",
            name="Empty Room",
            entities=[]  # No entities
        ),
        Room(
            area_id="bedroom",
            name="Bedroom",
            entities=[
                {
                    "entity_id": "light.bedroom",
                    "domain": "light",
                    "area_id": "bedroom",
                    "area_name": "Bedroom"
                }
            ]
        )
    ]

    cards = generate_lighting_module_for_all_rooms(rooms)

    # Extract separator cards (room titles)
    separator_cards = [c for c in cards if c.get("card_type") == "separator"]

    # Should only have 2 separator cards (Living Room and Bedroom), not Empty Room
    assert len(separator_cards) == 2
    room_names = [c["name"] for c in separator_cards]
    assert "Living Room" in room_names
    assert "Bedroom" in room_names
    assert "Empty Room" not in room_names


def test_room_with_only_sensors_filtered():
    """Test that rooms with only sensors (no lights/covers/climates) are filtered."""
    rooms = [
        Room(
            area_id="kitchen",
            name="Kitchen",
            entities=[
                {
                    "entity_id": "light.kitchen",
                    "domain": "light",
                    "area_id": "kitchen",
                    "area_name": "Kitchen"
                }
            ]
        ),
        Room(
            area_id="hallway",
            name="Hallway",
            entities=[
                {
                    "entity_id": "sensor.hallway_temperature",
                    "domain": "sensor",
                    "area_id": "hallway",
                    "area_name": "Hallway",
                    "device_class": "temperature"
                }
            ]  # Only sensor, no lights/covers/climates
        )
    ]

    cards = generate_lighting_module_for_all_rooms(rooms)

    # Extract separator cards
    separator_cards = [c for c in cards if c.get("card_type") == "separator"]

    # Should only have 1 separator card (Kitchen), not Hallway
    assert len(separator_cards) == 1
    assert separator_cards[0]["name"] == "Kitchen"


def test_room_with_cover_not_filtered():
    """Test that rooms with covers are not filtered."""
    rooms = [
        Room(
            area_id="bedroom",
            name="Bedroom",
            entities=[
                {
                    "entity_id": "cover.bedroom_blind",
                    "domain": "cover",
                    "area_id": "bedroom",
                    "area_name": "Bedroom"
                }
            ]
        )
    ]

    cards = generate_lighting_module_for_all_rooms(rooms)

    # Extract separator cards
    separator_cards = [c for c in cards if c.get("card_type") == "separator"]

    # Should have 1 separator card
    assert len(separator_cards) == 1
    assert separator_cards[0]["name"] == "Bedroom"


def test_room_with_climate_not_filtered():
    """Test that rooms with climate entities are not filtered."""
    rooms = [
        Room(
            area_id="office",
            name="Office",
            entities=[
                {
                    "entity_id": "climate.office_ac",
                    "domain": "climate",
                    "area_id": "office",
                    "area_name": "Office"
                }
            ]
        )
    ]

    cards = generate_lighting_module_for_all_rooms(rooms)

    # Extract separator cards
    separator_cards = [c for c in cards if c.get("card_type") == "separator"]

    # Should have 1 separator card
    assert len(separator_cards) == 1
    assert separator_cards[0]["name"] == "Office"


def test_all_rooms_empty():
    """Test when all rooms are empty."""
    rooms = [
        Room(area_id="empty1", name="Empty 1", entities=[]),
        Room(area_id="empty2", name="Empty 2", entities=[]),
    ]

    cards = generate_lighting_module_for_all_rooms(rooms)

    # Should only have branding card, no separator cards
    separator_cards = [c for c in cards if c.get("card_type") == "separator"]
    assert len(separator_cards) == 0

    # Should still have the branding card
    branding_cards = [c for c in cards if c.get("type") == "picture"]
    assert len(branding_cards) == 1

"""Room generation module."""
from typing import TypedDict, List, Any, cast
from ..types import EntityInfo, LovelaceCard

class Room(TypedDict):
    """Room definition."""
    area_id: str
    name: str
    entities: List[EntityInfo]

def get_room_lights(room: Room) -> List[EntityInfo]:
    """Get lights for a room."""
    return [e for e in room["entities"] if e["domain"] == "light"]

def get_room_covers(room: Room) -> List[EntityInfo]:
    """Get covers for a room."""
    return [e for e in room["entities"] if e["domain"] == "cover"]

def get_room_climates(room: Room) -> List[EntityInfo]:
    """Get climates for a room."""
    return [e for e in room["entities"] if e["domain"] == "climate"]

def find_room_temperature_sensor(room: Room) -> EntityInfo | None:
    """Find a temperature sensor for the room."""
    # 1. Try to find a sensor with device_class "temperature" and area_id matching room
    for entity in room["entities"]:
        if (entity["domain"] == "sensor" and 
            entity.get("device_class") == "temperature"):
            return entity
            
    # 2. Fallback: check if entity_id contains room name (normalized)
    room_name_slug = room["name"].lower().replace(" ", "_")
    for entity in room["entities"]:
        if (entity["domain"] == "sensor" and 
            entity.get("device_class") == "temperature" and 
            room_name_slug in entity["entity_id"].lower()):
            return entity
            
    return None

def generate_lighting_module_for_room(room: Room) -> List[LovelaceCard]:
    """Generate cards for a single room with 2-column layout using horizontal-stack."""
    cards: List[LovelaceCard] = []
    
    lights = get_room_lights(room)
    covers = get_room_covers(room)
    climates = get_room_climates(room)
    temp_sensor = find_room_temperature_sensor(room)
    
    # 1. SEPARATOR (full-width title for the room)
    separator_entity = ""
    if climates:
        separator_entity = climates[0]["entity_id"]
    elif lights:
        separator_entity = lights[0]["entity_id"]
    elif covers:
        separator_entity = covers[0]["entity_id"]
    
    separator_card = {
        "type": "custom:bubble-card",
        "card_type": "separator",
        "entity": separator_entity,
        "button_type": "switch",
        "name": room["name"],
        "styles": "styles: |\n  .bubble-line {\n    background: white; !important\n    opacity: 0.1;\n  }\n"
    }
    
    if temp_sensor:
        separator_card["sub_button"] = [{
            "entity": temp_sensor["entity_id"],
            "show_icon": False,
            "show_state": True,
            "state_background": False,
            "show_background": False,
            "show_attribute": False
        }]
        
    cards.append(cast(LovelaceCard, separator_card))
    
    # 2. CLIMATE + COVER in horizontal-stack if both exist, otherwise separate
    climate_cover_entities = []
    
    if covers:
        climate_cover_entities.append({
            "type": "custom:mushroom-cover-card",
            "entity": covers[0]["entity_id"],
            "fill_container": True,
            "layout": "horizontal",
            "show_position_control": False,
            "show_buttons_control": True,
            "hold_action": {"action": "more-info"}
        })
    
    for climate in climates:
        climate_cover_entities.append({
            "type": "custom:mushroom-climate-card",
            "entity": climate["entity_id"],
            "fill_container": False,
            "show_temperature_control": True,
            "collapsible_controls": True,
            "icon": "mdi:home-thermometer-outline",
            "hold_action": {"action": "more-info"},
            "tap_action": {"action": "toggle"}
        })
    
    # Add climate/cover in pairs using horizontal-stack
    for i in range(0, len(climate_cover_entities), 2):
        if i + 1 < len(climate_cover_entities):
            # Pair of 2
            cards.append(cast(LovelaceCard, {
                "type": "horizontal-stack",
                "cards": [climate_cover_entities[i], climate_cover_entities[i + 1]]
            }))
        else:
            # Single card
            cards.append(cast(LovelaceCard, climate_cover_entities[i]))
    
    # 3. LIGHTS in horizontal-stack pairs (2 columns)
    light_cards = []
    for light in lights:
        light_cards.append({
            "type": "custom:mushroom-entity-card",
            "entity": light["entity_id"],
            "tap_action": {"action": "toggle"},
            "icon_color": "orange",
            "primary_info": "name",
            "secondary_info": "none",
            "card_mod": {
                "style": {
                    "mushroom-entity-card$": "/* Colori di base (OFF) */\n:host {\n  --primary-text-color: white;\n  --secondary-text-color: white;\n}\n/* Quando la luce è ACCESA, testo nero */\n:host([data-state=\"on\"]) {\n  --primary-text-color: black !important;\n  --secondary-text-color: black !important;\n}\n"
                }
            }
        })
    
    # Group lights in pairs
    for i in range(0, len(light_cards), 2):
        if i + 1 < len(light_cards):
            # Pair of 2 lights
            cards.append(cast(LovelaceCard, {
                "type": "horizontal-stack",
                "cards": [light_cards[i], light_cards[i + 1]]
            }))
        else:
            # Single light (odd number)
            cards.append(cast(LovelaceCard, light_cards[i]))
        
    return cards

def generate_lighting_module_for_all_rooms(rooms: List[Room]) -> List[LovelaceCard]:
    """Generate cards for all rooms."""
    all_cards: List[LovelaceCard] = []
    for room in rooms:
        all_cards.extend(generate_lighting_module_for_room(room))
    return all_cards

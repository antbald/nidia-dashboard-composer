"""Room generation module."""
from typing import TypedDict, List, Any, cast
from ..types import EntityInfo, LovelaceCard
from ..layouts import smartphone as layout

class Room(TypedDict):
    """Room definition."""
    area_id: str
    name: str
    entities: List[EntityInfo]

def generate_branding_card() -> LovelaceCard:
    """Generate the branding logo card that adapts to theme."""
    return cast(LovelaceCard, {
        "type": "picture",
        "image": "/nidia_dashboard_composer_static/logos/black.png",
        "tap_action": {
            "action": "none"
        },
        "card_mod": {
            "style": """
                ha-card {
                    background: none !important;
                    box-shadow: none !important;
                    border: none !important;
                    border-radius: 0 !important;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 40px;
                    padding: 0 !important;
                    margin: 0 0 16px 0 !important;
                }
                ha-card img {
                    height: 20px !important;
                    width: auto !important;
                    content: url("/nidia_dashboard_composer_static/logos/black.png");
                    display: block;
                    margin: 0 auto;
                }
                @media (prefers-color-scheme: dark) {
                    ha-card img {
                        content: url("/nidia_dashboard_composer_static/logos/white.png");
                    }
                }
            """
        }
    })


def generate_energy_villetta_card(config: dict) -> LovelaceCard | None:
    """Generate Energy Image (Villetta model) card if enabled."""
    villetta_config = config.get("energy_villetta", {})

    # Return None if module disabled or sensor missing
    if not villetta_config.get("enabled", False):
        return None

    home_sensor = villetta_config.get("home_consumption_sensor")
    if not home_sensor:
        return None

    # Base elements - always include home consumption and import power labels
    elements: List[dict[str, Any]] = [
        {
            "type": "state-label",
            "entity": home_sensor,
            "style": {
                "top": "89%",
                "left": "13%",
                "color": "black",
                "font-size": "13px",
                "font-weight": "700",
                "text-shadow": "0 0 2px rgba(255,255,255,.8)",
                "z-index": "1"
            }
        }
    ]

    # Add import power label if configured
    import_sensor = villetta_config.get("import_power_sensor")
    if import_sensor:
        elements.append({
            "type": "state-label",
            "entity": import_sensor,
            "style": {
                "top": "13.5%",
                "left": "8%",
                "color": "black",
                "font-size": "13px",
                "font-weight": "700",
                "text-shadow": "0 0 2px rgba(255,255,255,.8)",
                "z-index": "1"
            }
        })

    # Add battery elements if enabled (ALWAYS VISIBLE - no conditional)
    battery_enabled = villetta_config.get("battery_enabled", False)
    battery_sensor = villetta_config.get("battery_sensor")

    if battery_enabled and battery_sensor:
        # Battery overlay image (always visible)
        elements.append({
            "type": "image",
            "image": "/nidia_dashboard_composer_static/sfondo-villetta-batteria.png",
            "style": {
                "top": "50%",
                "left": "50%",
                "width": "100%",
                "pointer-events": "none",
                "z-index": "1"
            }
        })

        # Battery state label (always visible)
        elements.append({
            "type": "state-label",
            "entity": battery_sensor,
            "style": {
                "top": "89%",
                "left": "85%",
                "color": "black",
                "font-size": "13px",
                "font-weight": "700",
                "text-shadow": "0 0 2px rgba(255,255,255,.8)",
                "z-index": "1"
            }
        })

    # Add photovoltaic conditional elements if enabled
    pv_enabled = villetta_config.get("photovoltaic_enabled", False)
    pv_sensor = villetta_config.get("photovoltaic_production_sensor")

    if pv_enabled and pv_sensor:
        # Conditional wrapper with EXACT 3-condition pattern
        pv_elements: List[dict[str, Any]] = [
            {
                "type": "image",
                "image": "/nidia_dashboard_composer_static/sfondo-villetta-fv.png",
                "style": {
                    "top": "50%",
                    "left": "50%",
                    "width": "100%",
                    "pointer-events": "none",
                    "z-index": "1"
                }
            },
            {
                "type": "state-label",
                "entity": pv_sensor,
                "style": {
                    "top": "8%",
                    "left": "85%",
                    "color": "black",
                    "font-size": "13px",
                    "font-weight": "700",
                    "text-shadow": "0 0 2px rgba(255,255,255,.8)",
                    "z-index": "1"
                }
            }
        ]

        # Wrap in conditional with 3 state_not conditions (EXACT pattern required)
        elements.append({
            "type": "conditional",
            "conditions": [
                {"entity": pv_sensor, "state_not": "0"},
                {"entity": pv_sensor, "state_not": "0 W"},
                {"entity": pv_sensor, "state_not": "0.0"}
            ],
            "elements": pv_elements
        })

    return cast(LovelaceCard, {
        "type": "picture-elements",
        "image": "/nidia_dashboard_composer_static/sfondo-villetta.png",
        "elements": elements
    })


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
    """Generate cards for a single room with flat layout using grid_options."""
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
    
    separator_card: dict[str, Any] = {
        "type": "custom:bubble-card",
        "card_type": "separator",
        "entity": separator_entity,
        "button_type": "switch",
        "name": room["name"],
        "icon": " ",  # Empty space to hide icon
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
    
    # 2. COVER (full-width if exists)
    if covers:
        cover_card: dict[str, Any] = {
            "type": "custom:mushroom-cover-card",
            "entity": covers[0]["entity_id"],
            "grid_options": layout.COVER_GRID_OPTIONS,
            "layout": "horizontal",
            "fill_container": True,
            "show_buttons_control": True,
            "hold_action": {"action": "more-info"}
        }
        cards.append(cast(LovelaceCard, cover_card))
    
    # 3. CLIMATE (2 columns - managed by layout)
    for climate in climates:
        climate_card: dict[str, Any] = {
            "type": "custom:mushroom-climate-card",
            "entity": climate["entity_id"],
            "grid_options": layout.CLIMATE_GRID_OPTIONS,
            "fill_container": False,
            "show_temperature_control": True,
            "collapsible_controls": True,
            "icon": "mdi:home-thermometer-outline",
            "hold_action": {"action": "more-info"},
            "tap_action": {"action": "toggle"}
        }
        cards.append(cast(LovelaceCard, climate_card))
    
    # 4. LIGHTS (no grid_options - grid container handles layout)
    for light in lights:
        light_card: dict[str, Any] = {
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
        }
        cards.append(cast(LovelaceCard, light_card))
        
    return cards

def generate_lighting_module_for_all_rooms(rooms: List[Room], config: dict | None = None) -> List[LovelaceCard]:
    """Generate cards for all rooms."""
    all_cards: List[LovelaceCard] = []

    # Add branding card at the top
    all_cards.append(generate_branding_card())

    # Add energy villetta card if enabled (immediately after branding)
    if config:
        villetta_card = generate_energy_villetta_card(config)
        if villetta_card:
            all_cards.append(villetta_card)

    for room in rooms:
        # Skip rooms with no entities (lights, covers, climates)
        lights = get_room_lights(room)
        covers = get_room_covers(room)
        climates = get_room_climates(room)

        if not lights and not covers and not climates:
            continue

        all_cards.extend(generate_lighting_module_for_room(room))
    return all_cards

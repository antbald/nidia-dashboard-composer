"""Rooms module generator."""
import logging
from typing import List, Any
from ..types import ModuleResult, EntityInfo
from .rooms import generate_lighting_module_for_all_rooms, Room
from ..layouts import smartphone as layout
from ..backgrounds import get_background_config

_LOGGER = logging.getLogger(__name__)

class RoomsModule:
    """Generator for room-based dashboard."""
    
    @staticmethod
    def generate(entities: List[EntityInfo], config: dict, all_entities: List[EntityInfo] | None = None) -> ModuleResult:
        """Generate room cards."""
        _LOGGER.info("RoomsModule.generate called")
        _LOGGER.info("  - entities parameter: %d items", len(entities))
        _LOGGER.info("  - all_entities parameter: %s", "None" if all_entities is None else f"{len(all_entities)} items")
        
        # We prefer using all_entities if available to perform our own grouping
        source_entities = all_entities if all_entities else entities
        
        _LOGGER.info("Using source_entities with %d items", len(source_entities))
        
        # Group entities by area
        # We need to reconstruct 'Room' objects from the flat entity list
        
        # 1. Identify all unique areas
        areas = {}
        entities_without_area = 0
        
        for ent in source_entities:
            area_id = ent.get("area_id")
            if not area_id:
                entities_without_area += 1
                _LOGGER.debug("Entity %s has no area_id", ent.get("entity_id"))
                continue
                
            if area_id not in areas:
                # Use actual area_name from HA if available, fallback to formatted area_id
                area_name = ent.get("area_name") or area_id.replace("_", " ").title()
                areas[area_id] = {
                    "area_id": area_id,
                    "name": area_name,
                    "entities": []
                }
            
            areas[area_id]["entities"].append(ent)
        
        _LOGGER.info(
            "Grouped entities into %d areas (%d entities without area)",
            len(areas), entities_without_area
        )
        # Convert to list of Room objects
        rooms_list: List[Room] = list(areas.values())
        
        # Sort rooms by name
        rooms_list.sort(key=lambda r: r["name"])
        
        _LOGGER.debug("Rooms list: %s", [(r["name"], len(r["entities"])) for r in rooms_list])
        
        
        if not rooms_list:
            _LOGGER.warning("No rooms found! Check if entities are assigned to areas.")
            
            # Get available areas from hass if possible (for better error message)
            available_areas_info = ""
            try:
                from homeassistant.helpers import area_registry as ar
                area_reg = ar.async_get(config.get("_hass"))  # We'll need to pass hass
                if area_reg:
                    available_areas = [f"{area.name} (id: {area.id})" for area in area_reg.areas.values()]
                    if available_areas:
                        available_areas_info = f"\n\n**Aree Disponibili:**\n" + "\n".join(f"- {a}" for a in available_areas[:10])
            except:
                pass  # Fallback if we can't get area info
            
            cards = [{
                "type": "markdown",
                "content": f"## ⚠️ Nessuna Area Trovata\n\nNon sono state trovate entità associate ad aree o tutte le aree sono state filtrate.\n\n**Possibili Cause:**\n1. I dispositivi non sono assegnati alle Aree in Home Assistant.\n2. La configurazione delle aree nel composer esclude tutte le aree esistenti.\n3. **Gli ID delle aree nella config non corrispondono** agli ID effettivi del sistema.\n\n**Soluzione:**\n1. Vai su **Impostazioni > Aree e Zone** e assicurati che i dispositivi siano assegnati alle stanze.\n2. **Controlla gli ID delle aree**: potrebbero essere diversi da quelli che hai configurato (es. 'camera_da_letto' vs 'cameradaletto').\n3. **Usa `[]` per il filtro aree** se vuoi includere tutte le aree.{available_areas_info}\n\n**Debug Info:**\n- Source entities: {len(source_entities)}\n- Config areas filter: {config.get('areas', [])}"
            }]
        else:
            _LOGGER.info("Generating cards for %d rooms", len(rooms_list))
            # Generate cards
            cards = generate_lighting_module_for_all_rooms(rooms_list)
            _LOGGER.info("Generated %d total cards", len(cards))
        
        # Get background configuration
        background_name = config.get("background", "none")
        background_config = get_background_config(background_name)
        
        # Return as sections-type view (smartphone layout)
        return ModuleResult(
            cards=[],  # Empty for sections view
            view_title="Home",
            view_type=layout.VIEW_TYPE,
            sections=[{
                "type": layout.SECTION_TYPE,
                "cards": cards
            }],
            background=background_config
        )

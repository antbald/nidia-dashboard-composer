"""Rooms module generator."""
import logging
from typing import List, Any
from ..types import ModuleResult, EntityInfo
from .rooms import generate_lighting_module_for_all_rooms, Room
from ..layouts import smartphone as layout

_LOGGER = logging.getLogger(__name__)

class RoomsModule:
    """Generator for room-based dashboard."""
    
    @staticmethod
    def generate(entities: List[EntityInfo], config: dict, all_entities: List[EntityInfo] | None = None) -> ModuleResult:
        """Generate room cards."""
        # We prefer using all_entities if available to perform our own grouping
        source_entities = all_entities if all_entities else entities
        
        _LOGGER.debug("Generating rooms module with %d source entities", len(source_entities))
        
        # Group entities by area
        # We need to reconstruct 'Room' objects from the flat entity list
        
        # 1. Identify all unique areas
        areas = {}
        for ent in source_entities:
            area_id = ent.get("area_id")
            if not area_id:
                continue
                
            if area_id not in areas:
                areas[area_id] = {
                    "area_id": area_id,
                    "name": area_id.replace("_", " ").title(), # Fallback name
                    "entities": []
                }
            
            areas[area_id]["entities"].append(ent)
            
        # Convert to list of Room objects
        rooms_list: List[Room] = list(areas.values())
        
        # Sort rooms by name
        rooms_list.sort(key=lambda r: r["name"])
        
        # Generate cards
        cards = generate_lighting_module_for_all_rooms(rooms_list)
        
        # Return as sections-type view (smartphone layout)
        return ModuleResult(
            cards=[],  # Empty for sections view
            view_title="Home",
            view_type=layout.VIEW_TYPE,
            sections=[{
                "type": layout.SECTION_TYPE,
                "cards": cards
            }]
        )

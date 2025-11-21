"""Light module generator."""
import logging
from typing import List
from ..types import ModuleResult, EntityInfo

_LOGGER = logging.getLogger(__name__)


class LightModule:
    """Generator for light cards."""
    
    @staticmethod
    def generate(entities: List[EntityInfo], config: dict) -> ModuleResult:
        """Generate light cards from entities."""
        _LOGGER.debug("Generating light module with %d entities", len(entities))
        
        if not entities:
            return ModuleResult(cards=[], view_title="Lights")
        
        # Group by area
        by_area = {}
        for entity in entities:
            area = entity.get("area_id") or "other"
            if area not in by_area:
                by_area[area] = []
            by_area[area].append(entity)
        
        cards = []
        
        # Create a card for each area
        for area, area_entities in by_area.items():
            entity_ids = [e["entity_id"] for e in area_entities]
            
            cards.append({
                "type": "light",
                "entities": entity_ids,
                "title": f"{area.replace('_', ' ').title()} Lights"
            })
        
        return ModuleResult(cards=cards, view_title="Lights")

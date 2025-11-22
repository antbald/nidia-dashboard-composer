"""Climate module generator."""
import logging
from typing import List
from ..types import ModuleResult, EntityInfo

_LOGGER = logging.getLogger(__name__)


class ClimateModule:
    """Generator for climate cards."""
    
    @staticmethod
    def generate(entities: List[EntityInfo], config: dict, **kwargs) -> ModuleResult:
        """Generate climate cards from entities."""
        _LOGGER.debug("Generating climate module with %d entities", len(entities))
        
        if not entities:
            return ModuleResult(cards=[], view_title="Climate")
        
        cards = []
        
        # Create thermostat card for each climate entity
        for entity in entities:
            cards.append({
                "type": "thermostat",
                "entity": entity["entity_id"],
                "name": entity.get("friendly_name", entity["entity_id"])
            })
        
        return ModuleResult(cards=cards, view_title="Climate")

"""Energy module generator."""
import logging
from typing import List
from ..types import ModuleResult, EntityInfo

_LOGGER = logging.getLogger(__name__)


class EnergyModule:
    """Generator for energy cards."""
    
    @staticmethod
    def generate(entities: List[EntityInfo], config: dict, **kwargs) -> ModuleResult:
        """Generate energy cards from entities."""
        _LOGGER.debug("Generating energy module with %d entities", len(entities))
        
        if not entities:
            return ModuleResult(cards=[], view_title="Energy")
        
        cards = []
        
        # Look for specific energy sensor patterns
        consumption = [e for e in entities if "power" in e["entity_id"] or "consumption" in e["entity_id"]]
        solar = [e for e in entities if "solar" in e["entity_id"] or "pv" in e["entity_id"]]
        
        # Create energy distribution card if available
        if consumption or solar:
            cards.append({
                "type": "energy-distribution",
                "title": "Energy Overview"
            })
        
        # Create statistics cards for consumption
        for entity in consumption[:3]:  # Limit to first 3
            cards.append({
                "type": "statistic",
                "entity": entity["entity_id"],
                "period": "day",
                "stat_type": "mean"
            })
        
        return ModuleResult(cards=cards, view_title="Energy")

"""Media module generator."""
import logging
from typing import List
from ..types import ModuleResult, EntityInfo

_LOGGER = logging.getLogger(__name__)


class MediaModule:
    """Generator for media player cards."""
    
    @staticmethod
    def generate(entities: List[EntityInfo], config: dict) -> ModuleResult:
        """Generate media cards from entities."""
        _LOGGER.debug("Generating media module with %d entities", len(entities))
        
        if not entities:
            return ModuleResult(cards=[], view_title="Media")
        
        cards = []
        
        # Create media control card for each media player
        for entity in entities:
            cards.append({
                "type": "media-control",
                "entity": entity["entity_id"]
            })
        
        return ModuleResult(cards=cards, view_title="Media")

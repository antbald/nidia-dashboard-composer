"""Dashboard Generator Engine."""
import logging
from homeassistant.core import HomeAssistant
from homeassistant.helpers import area_registry, entity_registry

from .modules import AVAILABLE_MODULES
from .types import EntityInfo, LovelaceDashboard

_LOGGER = logging.getLogger(__name__)

# Domain to module mapping
DOMAIN_MODULE_MAP = {
    "light": "light",
    "climate": "climate",
    "media_player": "media",
    "sensor": "energy",  # Energy sensors typically have sensor domain
}


class DashboardGenerator:
    def __init__(self, hass: HomeAssistant):
        self.hass = hass

    async def generate(self, config: dict, entities: list[EntityInfo] | None = None):
        """Generate Lovelace config from composer config.
        
        Args:
            config: Composer configuration
            entities: Optional list of entities (for testing). If None, discovers from hass.
        """
        _LOGGER.info("Generating dashboard with config: %s", config)
        
        # 1. Discovery
        if entities is None:
            entities = await self._discover_entities(config)
        
        _LOGGER.debug("Discovered %d entities", len(entities))
        
        # 2. Module mapping
        module_entities = self._map_entities_to_modules(entities, config)
        
        # 3. Generate views from modules
        views = []
        enabled_modules = config.get("modules", [])
        
        for module_name in enabled_modules:
            if module_name not in AVAILABLE_MODULES:
                _LOGGER.warning("Unknown module: %s", module_name)
                continue
            
            module_class = AVAILABLE_MODULES[module_name]
            module_ents = module_entities.get(module_name, [])
            
            result = module_class.generate(module_ents, config)
            
            if result.cards:
                views.append({
                    "title": result.view_title or module_name.title(),
                    "cards": result.cards
                })
        
        # 4. Build final dashboard
        dashboard: LovelaceDashboard = {
            "title": "Nidia Generated Dashboard",
            "views": views if views else [
                {
                    "title": "Home",
                    "cards": [
                        {"type": "markdown", "content": "No modules configured."}
                    ]
                }
            ]
        }
        
        return dashboard

    async def _discover_entities(self, config: dict) -> list[EntityInfo]:
        """Discover entities from Home Assistant."""
        ent_reg = entity_registry.async_get(self.hass)
        area_reg = area_registry.async_get(self.hass)
        
        selected_areas = config.get("areas", [])
        
        entities = []
        for entity in ent_reg.entities.values():
            # Filter by area if specified
            if selected_areas and entity.area_id not in selected_areas:
                continue
            
            # Get state
            state = self.hass.states.get(entity.entity_id)
            if not state:
                continue
            
            entities.append({
                "entity_id": entity.entity_id,
                "domain": entity.domain,
                "area_id": entity.area_id,
                "friendly_name": state.attributes.get("friendly_name", entity.entity_id),
                "state": state.state
            })
        
        return entities

    def _map_entities_to_modules(self, entities: list[EntityInfo], config: dict) -> dict:
        """Map entities to modules based on domain."""
        module_entities = {}
        
        for entity in entities:
            domain = entity["domain"]
            module_name = DOMAIN_MODULE_MAP.get(domain)
            
            if module_name and module_name in config.get("modules", []):
                if module_name not in module_entities:
                    module_entities[module_name] = []
                module_entities[module_name].append(entity)
        
        return module_entities

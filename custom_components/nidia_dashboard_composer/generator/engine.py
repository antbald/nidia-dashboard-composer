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
            
            result = module_class.generate(module_ents, config, all_entities=entities)
            
            _LOGGER.info("Module '%s' generated result:", module_name)
            _LOGGER.info("  - view_type: %s", result.view_type)
            _LOGGER.info("  - view_title: %s", result.view_title)
            _LOGGER.info("  - sections count: %s", len(result.sections) if result.sections else 0)
            _LOGGER.info("  - cards count: %d", len(result.cards))
            
            if result.view_type == "sections" and result.sections:
                # Sections-type view
                view_data = {
                    "type": "sections",
                    "title": result.view_title or module_name.title(),
                    "sections": result.sections
                }
                #Apply background if configured
                if result.background:
                    view_data["background"] = result.background
                _LOGGER.info("Adding sections view: %s", view_data.get("title"))
                views.append(view_data)
            elif result.cards:
                # Traditional card-based view
                _LOGGER.info("Adding traditional card view: %s", result.view_title or module_name.title())
                views.append({
                    "title": result.view_title or module_name.title(),
                    "cards": result.cards
                })
        
        
        # 4. Build final dashboard
        _LOGGER.info("Building final dashboard with %d views", len(views))
        
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
        
        _LOGGER.info("Dashboard generation complete. Total views: %d", len(dashboard["views"]))
        
        return dashboard

    async def _discover_entities(self, config: dict) -> list[EntityInfo]:
        """Discover entities from Home Assistant."""
        ent_reg = entity_registry.async_get(self.hass)
        area_reg = area_registry.async_get(self.hass)
        
        selected_areas = config.get("areas", [])
        _LOGGER.info("Discovery started. Selected areas from config: %s", selected_areas)
        
        # Log all available areas
        all_areas = {area.id: area.name for area in area_reg.areas.values()}
        _LOGGER.debug("Available areas in HA: %s", all_areas)
        
        entities = []
        total_entities = len(ent_reg.entities)
        filtered_by_area = 0
        no_state = 0
        entities_by_domain = {}
        entities_by_area = {}
        
        for entity in ent_reg.entities.values():
            # Filter by area if specified
            if selected_areas and entity.area_id not in selected_areas:
                filtered_by_area += 1
                continue
            
            # Get state
            state = self.hass.states.get(entity.entity_id)
            if not state:
                no_state += 1
                continue
            
            entity_info = {
                "entity_id": entity.entity_id,
                "domain": entity.domain,
                "area_id": entity.area_id,
                "friendly_name": state.attributes.get("friendly_name", entity.entity_id),
                "state": state.state,
                "attributes": dict(state.attributes),
                "device_class": state.attributes.get("device_class") or entity.device_class
            }
            entities.append(entity_info)
            
            # Track statistics
            entities_by_domain[entity.domain] = entities_by_domain.get(entity.domain, 0) + 1
            if entity.area_id:
                area_name = all_areas.get(entity.area_id, entity.area_id)
                entities_by_area[area_name] = entities_by_area.get(area_name, 0) + 1
        
        _LOGGER.info(
            "Discovery complete: %d entities found (from %d total, %d filtered by area, %d without state)",
            len(entities), total_entities, filtered_by_area, no_state
        )
        _LOGGER.debug("Entities by domain: %s", entities_by_domain)
        _LOGGER.debug("Entities by area: %s", entities_by_area)
        
        return entities

    def _map_entities_to_modules(self, entities: list[EntityInfo], config: dict) -> dict:
        """Map entities to modules based on domain."""
        module_entities = {}
        enabled_modules = config.get("modules", [])
        
        _LOGGER.info("Mapping entities to modules. Enabled modules: %s", enabled_modules)
        _LOGGER.debug("Domain to module map: %s", DOMAIN_MODULE_MAP)
        
        unmapped_domains = set()
        
        for entity in entities:
            domain = entity["domain"]
            module_name = DOMAIN_MODULE_MAP.get(domain)
            
            if not module_name:
                unmapped_domains.add(domain)
            elif module_name in enabled_modules:
                if module_name not in module_entities:
                    module_entities[module_name] = []
                module_entities[module_name].append(entity)
        
        if unmapped_domains:
            _LOGGER.debug("Domains without module mapping: %s", unmapped_domains)
        
        for module, ents in module_entities.items():
            _LOGGER.info("Module '%s' will receive %d entities", module, len(ents))
        
        return module_entities

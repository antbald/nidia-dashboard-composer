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
        
        # Build area mappings for smart matching
        all_areas = {area.id: area.name for area in area_reg.areas.values()}
        _LOGGER.debug("Available areas in HA: %s", all_areas)
        
        # Create normalized name → area_id mapping for fuzzy matching
        area_name_to_id = {}
        for area in area_reg.areas.values():
            # Normalize: lowercase, remove spaces and special chars
            normalized_name = area.name.lower().replace(" ", "").replace("_", "").replace("-", "")
            area_name_to_id[normalized_name] = area.id
            # Also map the exact ID
            area_name_to_id[area.id] = area.id
        
        # Smart area resolution: if selected_areas contains IDs that don't exist,
        # try to match them by normalized name
        resolved_areas = []
        area_auto_corrections = {}
        
        if selected_areas:
            for configured_area in selected_areas:
                # Try exact match first
                if configured_area in all_areas:
                    resolved_areas.append(configured_area)
                else:
                    # Try normalized fuzzy match
                    normalized_config = configured_area.lower().replace(" ", "").replace("_", "").replace("-", "")
                    if normalized_config in area_name_to_id:
                        matched_id = area_name_to_id[normalized_config]
                        resolved_areas.append(matched_id)
                        area_auto_corrections[configured_area] = matched_id
                        _LOGGER.warning(
                            "⚠️  Area ID auto-corrected: '%s' → '%s' (name: '%s')",
                            configured_area, matched_id, all_areas.get(matched_id, "Unknown")
                        )
                    else:
                        _LOGGER.warning(
                            "❌ Area ID '%s' not found in system and couldn't be auto-matched. Skipping.",
                            configured_area
                        )
            
            # If we made auto-corrections, suggest updating the config
            if area_auto_corrections:
                _LOGGER.warning(
                    "💡 TIP: Update your configuration to use the correct area IDs: %s",
                    list(area_auto_corrections.values())
                )
            
            # Use resolved areas for filtering
            selected_areas = resolved_areas if resolved_areas else selected_areas
            _LOGGER.info("Resolved area filter: %s", selected_areas)
        
        entities = []
        total_entities = len(ent_reg.entities)
        filtered_by_area = 0
        no_state = 0
        entities_by_domain = {}
        entities_by_area = {}
        
        
        # Track unique area IDs encountered for debugging
        encountered_area_ids = set()
        
        for entity in ent_reg.entities.values():
            # Track all area IDs we encounter
            if entity.area_id:
                encountered_area_ids.add(entity.area_id)
            
            # Filter by area if specified
            if selected_areas and entity.area_id not in selected_areas:
                filtered_by_area += 1
                # Log first few mismatches for debugging
                if filtered_by_area <= 3:
                    _LOGGER.debug(
                        "Entity %s filtered: area_id='%s' not in selected_areas %s",
                        entity.entity_id, entity.area_id, selected_areas
                    )
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
        
        # Warning if no entities found but areas were filtered
        if len(entities) == 0 and filtered_by_area > 0:
            _LOGGER.warning(
                "⚠️  All entities filtered by area! This is likely an area ID mismatch."
            )
            _LOGGER.warning("Selected areas in config: %s", selected_areas)
            _LOGGER.warning("Encountered area IDs in system: %s", sorted(encountered_area_ids))
            _LOGGER.warning(
                "💡 TIP: The area IDs must match EXACTLY. "
                "Check '.storage/core.area_registry' for the correct 'id' field (not 'name')."
            )
        
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

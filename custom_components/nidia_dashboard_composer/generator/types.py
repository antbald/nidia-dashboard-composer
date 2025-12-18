"""Type definitions for dashboard generation."""
from typing import TypedDict, List, Any
from dataclasses import dataclass


class EnergyVillettaConfig(TypedDict, total=False):
    """Configuration for Energy Villetta module."""
    enabled: bool
    home_consumption_sensor: str | None
    import_power_sensor: str | None
    photovoltaic_enabled: bool
    photovoltaic_production_sensor: str | None
    battery_enabled: bool
    battery_sensor: str | None


class ComposerConfig(TypedDict, total=False):
    """Configuration for dashboard generation."""
    areas: List[str]
    modules: List[str]
    theme: str
    layout_style: str
    background: str  # 'none', 'modern', etc.
    energy_villetta: EnergyVillettaConfig


class EntityInfo(TypedDict):
    """Entity information."""
    entity_id: str
    domain: str
    area_id: str | None
    area_name: str | None
    friendly_name: str
    state: str
    attributes: dict[str, Any]
    device_class: str | None


@dataclass
class ModuleResult:
    """Result from a module generator."""
    cards: List[dict]
    view_title: str | None = None
    view_type: str | None = None  # 'sections' or None for default
    sections: List[dict] | None = None  # For sections-type views
    background: str | None = None  # Background configuration


class LovelaceCard(TypedDict):
    """Lovelace card definition."""
    type: str


class LovelaceView(TypedDict):
    """Lovelace view definition."""
    title: str
    cards: List[LovelaceCard]


class LovelaceDashboard(TypedDict):
    """Lovelace dashboard definition."""
    title: str
    views: List[LovelaceView]

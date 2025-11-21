"""Type definitions for dashboard generation."""
from typing import TypedDict, List, Any
from dataclasses import dataclass


class ComposerConfig(TypedDict):
    """Configuration for dashboard generation."""
    areas: List[str]
    modules: List[str]
    theme: str
    layout_style: str


class EntityInfo(TypedDict):
    """Entity information."""
    entity_id: str
    domain: str
    area_id: str | None
    friendly_name: str
    state: str


@dataclass
class ModuleResult:
    """Result from a module generator."""
    cards: List[dict]
    view_title: str | None = None


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

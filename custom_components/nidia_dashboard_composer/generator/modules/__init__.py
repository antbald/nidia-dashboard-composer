"""Generator modules."""
from .light import LightModule
from .climate import ClimateModule
from .media import MediaModule
from .energy import EnergyModule

AVAILABLE_MODULES = {
    "light": LightModule,
    "climate": ClimateModule,
    "media": MediaModule,
    "energy": EnergyModule,
}

__all__ = ["AVAILABLE_MODULES", "LightModule", "ClimateModule", "MediaModule", "EnergyModule"]

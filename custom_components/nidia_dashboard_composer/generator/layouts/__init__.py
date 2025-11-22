"""
Layout configurations for different devices.

Available Layouts:
-----------------
- smartphone: Optimized for phone screens (sections + grid, 2 columns auto)
- tablet: (TODO) Optimized for tablets (wider grid, more columns)
- desktop: (TODO) Optimized for desktop/wall panels

Usage:
------
from .layouts import smartphone

# Use layout constants
grid_options = smartphone.CLIMATE_GRID_OPTIONS
"""

from . import smartphone

__all__ = ["smartphone"]

"""
Smartphone Layout Configuration
================================

This layout is optimized for smartphone screens using Home Assistant's sections view
with grid layout for automatic 2-column card arrangement.

Key Features:
- View type: sections
- Section type: grid (auto-handles 2-column layout on mobile)
- Separator: Bubble card with no grid_options (full-width)
- Cover: Full-width with grid_options: {columns: 12}
- Climate: 2-column with grid_options: {columns: 6, rows: 2}
- Lights: NO grid_options (grid auto-arranges in 2 columns)

Structure:
----------
views:
  - type: sections
    title: "Home"
    sections:
      - type: grid
        cards:
          - [separator]
          - [cover] (if exists)
          - [climate] (grid_options: 6 cols)
          - [light] (no grid_options)
          - [light] (no grid_options)
          ...

Why This Works:
--------------
- sections + grid view enables the new HA layout system
- grid container automatically arranges cards in columns
- Lights without grid_options are auto-positioned by the grid
- This avoids the "Edit" boxes that appear with horizontal-stack

Migration Notes:
---------------
If creating a tablet/desktop layout:
- May want panel: true for wall tablet mode
- May want 3-4 columns instead of 2
- May want grid_options on lights for more control
- Consider different section layouts (not just grid)
"""

# Layout-specific constants
LAYOUT_NAME = "smartphone"
VIEW_TYPE = "sections"
SECTION_TYPE = "grid"

# Grid configuration for different entity types
SEPARATOR_GRID_OPTIONS = None  # Full-width, no grid options
COVER_GRID_OPTIONS = {"columns": 12, "rows": 1}  # Full-width but compact
CLIMATE_GRID_OPTIONS = {"columns": 6, "rows": 2}  # 2 columns
LIGHT_GRID_OPTIONS = None  # Auto-arranged by grid (2 columns default)

# View configuration
VIEW_CONFIG = {
    "type": VIEW_TYPE,
    "max_columns": 4,  # HA default for sections view
}

SECTION_CONFIG = {
    "type": SECTION_TYPE,
    "column_span": 1,
}

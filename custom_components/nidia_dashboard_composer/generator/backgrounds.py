"""
Background system for dashboard customization.
"""

# Available backgrounds
BACKGROUNDS = {
    "none": {
        "name": "None",
        "description": "No background image",
        "config": None
    },
    "modern": {
        "name": "Modern",
        "description": "Modern gradient background optimized for smartphone",
        "config": "center / cover no-repeat fixed linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), center / cover no-repeat fixed url('/nidia_dashboard_composer_static/backgrounds/modern.jpg')"
    }
}

def get_background_config(background_name: str) -> str | None:
    """
    Get background configuration for a given background name.
    
    Args:
        background_name: Name of the background ('none', 'modern', etc.)
        
    Returns:
        Background configuration dict or None
    """
    bg = BACKGROUNDS.get(background_name, BACKGROUNDS["none"])
    return bg["config"]

def get_available_backgrounds() -> list[dict]:
    """
    Get list of available background options for UI.
    
    Returns:
        List of dicts with name, id, description
    """
    return [
        {
            "id": bg_id,
            "name": bg_data["name"],
            "description": bg_data["description"]
        }
        for bg_id, bg_data in BACKGROUNDS.items()
    ]

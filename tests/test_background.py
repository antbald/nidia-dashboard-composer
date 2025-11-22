"""Tests for dashboard background generation."""
import pytest
from custom_components.nidia_dashboard_composer.generator.engine import DashboardGenerator

@pytest.mark.asyncio
async def test_background_modern(hass, sample_entities):
    """Test generation with modern background."""
    generator = DashboardGenerator(hass)
    
    config = {
        "areas": ["living_room"],
        "modules": ["home"],
        "theme": "default",
        "layout_style": "standard",
        "background": "modern"
    }
    
    result = await generator.generate(config, sample_entities)
    
    assert "views" in result
    assert len(result["views"]) > 0
    
    home_view = result["views"][0]
    assert home_view["title"] == "Home"
    assert "background" in home_view
    assert home_view["background"]["image"] == "/local/nidia_dashboard_composer_static/backgrounds/modern.jpg"
    assert home_view["background"]["opacity"] == 40

@pytest.mark.asyncio
async def test_background_none(hass, sample_entities):
    """Test generation with no background."""
    generator = DashboardGenerator(hass)
    
    config = {
        "areas": ["living_room"],
        "modules": ["home"],
        "theme": "default",
        "layout_style": "standard",
        # background missing or "none"
    }
    
    result = await generator.generate(config, sample_entities)
    
    assert "views" in result
    assert len(result["views"]) > 0
    
    home_view = result["views"][0]
    assert "background" not in home_view

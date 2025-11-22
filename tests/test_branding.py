"""Tests for dashboard branding."""
import pytest
from custom_components.nidia_dashboard_composer.generator.engine import DashboardGenerator

@pytest.mark.asyncio
async def test_branding_card_present(hass, sample_entities):
    """Test that branding card is always present at the top."""
    generator = DashboardGenerator(hass)
    
    config = {
        "areas": ["living_room"],
        "modules": ["home"],
        "theme": "default",
        "layout_style": "standard"
    }
    
    result = await generator.generate(config, sample_entities)
    
    assert "views" in result
    assert len(result["views"]) > 0
    
    home_view = result["views"][0]
    assert "sections" in home_view
    assert len(home_view["sections"]) > 0
    
    # Get the first section (grid) and check first card is branding
    first_section = home_view["sections"][0]
    assert "cards" in first_section
    assert len(first_section["cards"]) > 0
    
    branding_card = first_section["cards"][0]
    assert branding_card["type"] == "picture"
    assert "card_mod" in branding_card
    assert "style" in branding_card["card_mod"]
    
@pytest.mark.asyncio
async def test_branding_card_theme_adaptive(hass, sample_entities):
    """Test that branding card adapts to dark/light theme."""
    generator = DashboardGenerator(hass)
    
    config = {
        "areas": ["living_room"],
        "modules": ["home"],
        "theme": "default",
        "layout_style": "standard"
    }
    
    result = await generator.generate(config, sample_entities)
    
    home_view = result["views"][0]
    first_section = home_view["sections"][0]
    branding_card = first_section["cards"][0]
    
    # Check that the card_mod style contains dark mode media query
    style = branding_card["card_mod"]["style"]
    assert "@media (prefers-color-scheme: dark)" in style
    assert "white.png" in style  # Dark theme logo
    assert "black.png" in style  # Light theme logo

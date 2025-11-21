"""Tests for dashboard generator."""
import pytest
from custom_components.nidia_dashboard_composer.generator.engine import DashboardGenerator


@pytest.mark.asyncio
async def test_generator_basic(hass, sample_config, sample_entities):
    """Test basic dashboard generation."""
    generator = DashboardGenerator(hass)
    
    # Run generation with mocked entities
    result = await generator.generate(sample_config, sample_entities)
    
    # Verify structure
    assert "title" in result
    assert "views" in result
    assert len(result["views"]) > 0


@pytest.mark.asyncio
async def test_generator_light_module(hass, sample_entities):
    """Test light module generation."""
    from custom_components.nidia_dashboard_composer.generator.modules.light import LightModule
    
    light_entities = [e for e in sample_entities if e["domain"] == "light"]
    result = LightModule.generate(light_entities, {})
    
    assert result.cards is not None
    assert len(result.cards) > 0
    assert result.view_title == "Lights"


@pytest.mark.asyncio
async def test_generator_climate_module(hass, sample_entities):
    """Test climate module generation."""
    from custom_components.nidia_dashboard_composer.generator.modules.climate import ClimateModule
    
    climate_entities = [e for e in sample_entities if e["domain"] == "climate"]
    result = ClimateModule.generate(climate_entities, {})
    
    assert result.cards is not None
    assert len(result.cards) > 0
    assert result.view_title == "Climate"


@pytest.mark.asyncio
async def test_generator_empty_config(hass):
    """Test generation with empty config."""
    generator = DashboardGenerator(hass)
    
    result = await generator.generate({"modules": [], "areas": []}, [])
    
    assert "views" in result
    # Should have at least a placeholder view
    assert len(result["views"]) >= 1

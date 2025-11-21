"""Tests for test harness."""
import pytest
import json
import os
from custom_components.nidia_dashboard_composer.testing.harness import TestHarness


@pytest.mark.asyncio
async def test_harness_list_scenarios(hass):
    """Test listing available scenarios."""
    harness = TestHarness(hass)
    scenarios = harness.list_scenarios()
    
    # Should include our test scenarios
    assert "small_home" in scenarios
    assert "energy_home" in scenarios


@pytest.mark.asyncio
async def test_harness_run_small_home(hass):
    """Test running small_home scenario."""
    harness = TestHarness(hass)
    result = await harness.run_scenario("small_home")
    
    assert "scenario" in result
    assert result["scenario"] == "small_home"
    assert "generated_dashboard" in result
    assert "config" in result
    assert "entities" in result


@pytest.mark.asyncio
async def test_harness_invalid_scenario(hass):
    """Test running invalid scenario."""
    harness = TestHarness(hass)
    result = await harness.run_scenario("nonexistent")
    
    assert "error" in result
    assert "available" in result

"""Test Harness for Nidia Dashboard Composer."""
import logging
import json
import os
from homeassistant.core import HomeAssistant
from ..generator.engine import DashboardGenerator

_LOGGER = logging.getLogger(__name__)


class TestHarness:
    def __init__(self, hass: HomeAssistant):
        self.hass = hass
        self.generator = DashboardGenerator(hass)
        self.scenarios_dir = os.path.join(
            os.path.dirname(__file__), "scenarios"
        )

    async def run_scenario(self, scenario_name: str):
        """Run a specific test scenario."""
        _LOGGER.info("Running test scenario: %s", scenario_name)
        
        # Load scenario from file
        scenario_path = os.path.join(self.scenarios_dir, f"{scenario_name}.json")
        
        if not os.path.exists(scenario_path):
            return {
                "error": f"Scenario {scenario_name} not found",
                "available": self.list_scenarios()
            }
        
        with open(scenario_path, "r") as f:
            scenario = json.load(f)
        
        # Extract config and entities
        config = scenario.get("config", {})
        entities = scenario.get("entities", [])
        
        # Run generator with mocked entities
        dashboard = await self.generator.generate(config, entities)
        
        return {
            "scenario": scenario_name,
            "description": scenario.get("description", ""),
            "config": config,
            "entities": entities,
            "generated_dashboard": dashboard
        }

    def list_scenarios(self):
        """List available scenarios."""
        if not os.path.exists(self.scenarios_dir):
            return []
        
        scenarios = []
        for filename in os.listdir(self.scenarios_dir):
            if filename.endswith(".json"):
                scenarios.append(filename[:-5])  # Remove .json extension
        
        return scenarios


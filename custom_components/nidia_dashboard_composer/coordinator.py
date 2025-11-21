"""Coordinator for Nidia Dashboard Composer."""
import logging
from homeassistant.core import HomeAssistant
from .storage import ComposerStorage
from .generator.engine import DashboardGenerator
from .testing.harness import TestHarness

_LOGGER = logging.getLogger(__name__)

class ComposerCoordinator:
    def __init__(self, hass: HomeAssistant):
        self.hass = hass
        self.storage = ComposerStorage(hass)
        self.generator = DashboardGenerator(hass)
        self.test_harness = TestHarness(hass)

    async def async_init(self):
        """Initialize the coordinator."""
        await self.storage.async_load()

    async def get_config(self):
        return self.storage.config

    async def save_config(self, config):
        await self.storage.async_save(config)

    async def generate_dashboard(self):
        """Generate the dashboard based on current config."""
        config = self.storage.config
        return await self.generator.generate(config)

    async def run_test_scenario(self, scenario_name):
        """Run a test scenario."""
        return await self.test_harness.run_scenario(scenario_name)

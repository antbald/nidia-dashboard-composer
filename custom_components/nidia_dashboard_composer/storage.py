"""Storage handler for Nidia Dashboard Composer."""
from homeassistant.helpers.storage import Store
from homeassistant.core import HomeAssistant
from .const import STORAGE_KEY, STORAGE_VERSION, DOMAIN

class ComposerStorage:
    def __init__(self, hass: HomeAssistant):
        self.hass = hass
        self._store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._data = None

    async def async_load(self):
        """Load data from storage."""
        data = await self._store.async_load()
        if data is None:
            data = {
                "areas": [],
                "modules": [],
                "theme": "default",
                "energy_villetta": {
                    "enabled": False,
                    "home_consumption_sensor": None,
                    "import_power_sensor": None,
                    "photovoltaic_enabled": False,
                    "photovoltaic_production_sensor": None,
                    "battery_enabled": False,
                    "battery_sensor": None,
                    "export_enabled": False,
                    "export_sensor": None,
                    "ev_enabled": False,
                    "ev_sensor": None
                }
            }
        self._data = data
        return self._data

    async def async_save(self, data: dict):
        """Save data to storage."""
        self._data = data
        await self._store.async_save(data)

    @property
    def config(self):
        return self._data

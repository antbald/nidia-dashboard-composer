"""Constants for Nidia Dashboard Composer."""

DOMAIN = "nidia_dashboard_composer"
TITLE = "Nidia Dashboard Composer"

CONF_AREAS = "areas"
CONF_MODULES = "modules"
CONF_THEME = "theme"

STORAGE_KEY = f"{DOMAIN}.storage"
STORAGE_VERSION = 1

WS_TYPE_GET_CONFIG = f"{DOMAIN}/get_config"
WS_TYPE_SAVE_CONFIG = f"{DOMAIN}/save_config"
WS_TYPE_GENERATE = f"{DOMAIN}/generate"
WS_TYPE_TEST_RUN = f"{DOMAIN}/test_run"

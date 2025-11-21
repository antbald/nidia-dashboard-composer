import { HomeAssistant, ComposerConfig, TestScenarioResult } from './types';

const WS_TYPE_GET_CONFIG = 'nidia_dashboard_composer/get_config';
const WS_TYPE_SAVE_CONFIG = 'nidia_dashboard_composer/save_config';
const WS_TYPE_GENERATE = 'nidia_dashboard_composer/generate';
const WS_TYPE_TEST_RUN = 'nidia_dashboard_composer/test_run';

export async function getConfig(hass: HomeAssistant): Promise<ComposerConfig> {
    return hass.callWS({ type: WS_TYPE_GET_CONFIG });
}

export async function saveConfig(hass: HomeAssistant, config: ComposerConfig): Promise<void> {
    await hass.callWS({ type: WS_TYPE_SAVE_CONFIG, config });
}

export async function generateDashboard(hass: HomeAssistant): Promise<any> {
    return hass.callWS({ type: WS_TYPE_GENERATE });
}

export async function runTestScenario(hass: HomeAssistant, scenario: string): Promise<TestScenarioResult> {
    return hass.callWS({ type: WS_TYPE_TEST_RUN, scenario });
}

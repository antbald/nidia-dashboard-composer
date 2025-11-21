/**
 * Home Assistant types
 */

export interface HomeAssistant {
    callWS<T>(msg: any): Promise<T>;
    callApi<T>(method: string, path: string, data?: any): Promise<T>;
    language: string;
    config: any;
    themes: any;
    selectedTheme: any;
    panels: any;
    panelUrl: string;
    states: { [entity_id: string]: HassEntity };
}

export interface HassEntity {
    entity_id: string;
    state: string;
    attributes: { [key: string]: any };
    last_changed: string;
    last_updated: string;
}

export interface ComposerConfig {
    areas: string[];
    modules: string[];
    theme: string;
    layout_style?: string;
}

export interface TestScenarioResult {
    scenario: string;
    description: string;
    config: ComposerConfig;
    entities: any[];
    generated_dashboard: any;
    error?: string;
}

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
    areas: { [area_id: string]: HassArea };
}

export interface HassArea {
    area_id: string;
    name: string;
    picture: string | null;
    aliases: string[];
}

export interface HassEntity {
    entity_id: string;
    state: string;
    attributes: { [key: string]: any };
    last_changed: string;
    last_updated: string;
}

export interface EnergyVillettaConfig {
    enabled: boolean;
    home_consumption_sensor: string | null;
    photovoltaic_enabled: boolean;
    photovoltaic_production_sensor: string | null;
}

export interface ComposerConfig {
    areas: string[];
    modules: string[];
    theme: string;
    layout_style?: string;
    background?: string; // added for background selection
    energy_villetta?: EnergyVillettaConfig;
}

export interface TestScenarioResult {
    scenario: string;
    description: string;
    config: ComposerConfig;
    entities: any[];
    generated_dashboard: any;
    error?: string;
}

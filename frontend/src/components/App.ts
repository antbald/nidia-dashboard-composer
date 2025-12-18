import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, ComposerConfig } from '../types';
import { getConfig, saveConfig, generateDashboard } from '../api';

@customElement('nidia-dashboard-composer-panel')
export class NidiaDashboardComposerPanel extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean }) narrow = false;

  @state() private _config: ComposerConfig = {
    areas: [],
    modules: [],
    theme: 'default',
    layout_style: 'standard',
    energy_villetta: {
      enabled: false,
      home_consumption_sensor: null,
      import_power_sensor: null,
      photovoltaic_enabled: false,
      photovoltaic_production_sensor: null,
      battery_enabled: false,
      battery_sensor: null
    }
  };

  @state() private _loading = false;
  @state() private _generatedDashboard: any = null;

  static styles = css`
    :host {
      display: block;
      height: 100%;
      width: 100%;
      background-color: var(--primary-background-color);
      color: var(--primary-text-color);
      overflow-y: auto;
      font-family: var(--paper-font-body1_-_font-family);
      -webkit-font-smoothing: antialiased;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 32px 16px;
    }

    .header {
      text-align: center;
      margin-bottom: 48px;
    }

    .header h1 {
      font-size: 36px;
      font-weight: 300;
      margin: 0 0 8px 0;
      color: var(--primary-text-color);
    }

    .header p {
      font-size: 16px;
      color: var(--secondary-text-color);
      margin: 0;
    }

    .card {
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: 12px;
      padding: 24px;
      box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,0.1));
      margin-bottom: 24px;
      border: 1px solid var(--divider-color, #e0e0e0);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .card-title {
      font-size: 20px;
      font-weight: 500;
      margin: 0;
    }

    .area-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 12px;
    }

    .area-card {
      background: var(--secondary-background-color);
      border-radius: 8px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.2s;
      border: 2px solid transparent;
      text-align: center;
    }

    .area-card:hover {
      background: var(--primary-color);
      color: white;
    }

    .area-card.selected {
      border-color: var(--primary-color);
      background: var(--primary-color);
      color: white;
    }

    .area-icon {
      font-size: 24px;
      margin-bottom: 8px;
      display: block;
    }

    .area-name {
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 32px;
      position: sticky;
      bottom: 32px;
      background: var(--primary-background-color);
      padding: 16px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      z-index: 10;
    }

    button {
      padding: 12px 24px;
      border-radius: 8px;
      border: none;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .btn-secondary {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    .btn-primary {
      background: var(--primary-color);
      color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .btn-primary:hover {
      filter: brightness(1.1);
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .code-preview {
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 16px;
      border-radius: 8px;
      overflow: auto;
      font-family: 'JetBrains Mono', 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.5;
      max-height: 600px;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .status-saved { background: #e8f5e9; color: #2e7d32; }
    .status-error { background: #ffebee; color: #c62828; }
  `;

  constructor() {
    super();
  }

  private _configLoaded = false;

  protected updated(changedProps: PropertyValues) {
    super.updated(changedProps);
    if (!this._configLoaded && this.hass) {
      this._configLoaded = true;
      this._loadConfig();
    }
  }

  private async _loadConfig() {
    this._loading = true;
    try {
      this._config = await getConfig(this.hass);
      // Ensure 'home' is always in modules
      if (!this._config.modules.includes('home')) {
        this._config.modules = ['home'];
      }
    } catch (err) {
      console.error('Failed to load config:', err);
    }
    this._loading = false;
  }

  @state() private _saveStatus: 'idle' | 'saving' | 'saved' | 'error' = 'idle';

  private async _saveConfig() {
    this._saveStatus = 'saving';
    try {
      // Force 'home' module
      this._config.modules = ['home'];
      await saveConfig(this.hass, this._config);
      this._saveStatus = 'saved';
      setTimeout(() => {
        this._saveStatus = 'idle';
      }, 2000);
    } catch (err) {
      console.error('Failed to save config:', err);
      this._saveStatus = 'error';
      setTimeout(() => {
        this._saveStatus = 'idle';
      }, 3000);
    }
  }

  private _onBackgroundChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    const value = select.value;
    this._config = { ...this._config, background: value || undefined };
  }

  private async _generate() {
    this._loading = true;
    try {
      this._generatedDashboard = await generateDashboard(this.hass);
    } catch (err) {
      console.error('Failed to generate dashboard:', err);
    }
    this._loading = false;
  }

  private _toggleArea(areaId: string) {
    const index = this._config.areas.indexOf(areaId);
    if (index > -1) {
      this._config.areas.splice(index, 1);
    } else {
      this._config.areas.push(areaId);
    }
    this._config = { ...this._config };
  }

  private _selectAllAreas() {
    if (!this.hass.areas) return;
    this._config.areas = Object.keys(this.hass.areas);
    this._config = { ...this._config };
  }

  private _deselectAllAreas() {
    this._config.areas = [];
    this._config = { ...this._config };
  }

  private _getSensorEntities() {
    if (!this.hass?.states) return [];

    return Object.values(this.hass.states)
      .filter(entity => entity.entity_id.startsWith('sensor.'))
      .map(entity => ({
        entity_id: entity.entity_id,
        friendly_name: entity.attributes.friendly_name || entity.entity_id
      }))
      .sort((a, b) => a.friendly_name.localeCompare(b.friendly_name));
  }

  private _getAreasByFloor() {
    if (!this.hass?.areas) return { floors: {}, noFloor: [] };

    const areas = Object.values(this.hass.areas);
    const floors: { [floor_id: string]: typeof areas } = {};
    const noFloor: typeof areas = [];

    areas.forEach(area => {
      if (area.floor_id) {
        if (!floors[area.floor_id]) {
          floors[area.floor_id] = [];
        }
        floors[area.floor_id].push(area);
      } else {
        noFloor.push(area);
      }
    });

    return { floors, noFloor };
  }

  render() {
    const areas = this.hass?.areas ? Object.values(this.hass.areas) : [];
    const { floors, noFloor } = this._getAreasByFloor();

    return html`
      <div class="container">
        <div class="header">
          <h1>Nidia Dashboard Composer</h1>
          <p>Create your perfect Home Assistant dashboard in seconds.</p>
        </div>

        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Select Areas</h2>
            <div>
              <button class="btn-secondary" style="padding: 6px 12px; font-size: 12px;" @click="${this._selectAllAreas}">All</button>
              <button class="btn-secondary" style="padding: 6px 12px; font-size: 12px;" @click="${this._deselectAllAreas}">None</button>
            </div>
          </div>

          ${areas.length > 0 ? html`
            ${Object.entries(floors).map(([floorId, floorAreas]) => html`
              <div style="margin-bottom: 24px;">
                <h3 style="margin: 16px 0 12px 0; font-size: 14px; font-weight: 600; color: var(--secondary-text-color); text-transform: uppercase; letter-spacing: 0.5px;">
                  ${floorId}
                </h3>
                <div class="area-grid">
                  ${floorAreas.map(area => html`
                    <div
                      class="area-card ${this._config.areas.includes(area.area_id) ? 'selected' : ''}"
                      @click="${() => this._toggleArea(area.area_id)}"
                    >
                      <span class="area-icon">🏠</span>
                      <div class="area-name">${area.name}</div>
                    </div>
                  `)}
                </div>
              </div>
            `)}

            ${noFloor.length > 0 ? html`
              <div style="margin-bottom: 24px;">
                <h3 style="margin: 16px 0 12px 0; font-size: 14px; font-weight: 600; color: var(--secondary-text-color); text-transform: uppercase; letter-spacing: 0.5px;">
                  Other Areas
                </h3>
                <div class="area-grid">
                  ${noFloor.map(area => html`
                    <div
                      class="area-card ${this._config.areas.includes(area.area_id) ? 'selected' : ''}"
                      @click="${() => this._toggleArea(area.area_id)}"
                    >
                      <span class="area-icon">🏠</span>
                      <div class="area-name">${area.name}</div>
                    </div>
                  `)}
                </div>
              </div>
            ` : ''}
          ` : html`
            <p style="text-align: center; color: var(--secondary-text-color);">
              No areas found in Home Assistant. Please configure areas first.
            </p>
          `}
        </div>
<div class="card">
  <div class="card-header">
    <h2 class="card-title">Background Settings</h2>
    <div>
      <select @change="${(e: any) => this._onBackgroundChange(e)}" .value="${this._config.background || ''}">
        <option value="">None</option>
        <option value="modern">Modern</option>
      </select>
    </div>
  </div>
</div>

        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Energy Image (Villetta)</h2>
          </div>

          <!-- Module Enable Toggle -->
          <div style="margin-bottom: 16px;">
            <label style="display: flex; align-items: center; cursor: pointer;">
              <input
                type="checkbox"
                .checked="${this._config.energy_villetta?.enabled || false}"
                @change="${(e: any) => {
                  this._config = {
                    ...this._config,
                    energy_villetta: {
                      ...this._config.energy_villetta,
                      enabled: e.target.checked,
                      home_consumption_sensor: this._config.energy_villetta?.home_consumption_sensor || null,
                      import_power_sensor: this._config.energy_villetta?.import_power_sensor || null,
                      photovoltaic_enabled: this._config.energy_villetta?.photovoltaic_enabled || false,
                      photovoltaic_production_sensor: this._config.energy_villetta?.photovoltaic_production_sensor || null,
                      battery_enabled: this._config.energy_villetta?.battery_enabled || false,
                      battery_sensor: this._config.energy_villetta?.battery_sensor || null
                    }
                  };
                }}"
                style="margin-right: 8px;"
              />
              <span style="font-weight: 500;">Enable Energy Image Module</span>
            </label>
          </div>

          ${this._config.energy_villetta?.enabled ? html`
            <!-- Home Consumption Sensor -->
            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 4px; font-weight: 500;">
                Home Consumption Sensor <span style="color: red;">*</span>
              </label>
              <select
                .value="${this._config.energy_villetta?.home_consumption_sensor || ''}"
                @change="${(e: any) => {
                  this._config = {
                    ...this._config,
                    energy_villetta: {
                      ...this._config.energy_villetta!,
                      home_consumption_sensor: e.target.value || null
                    }
                  };
                }}"
                style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--primary-background-color); color: var(--primary-text-color);"
              >
                <option value="">Select entity...</option>
                ${this._getSensorEntities().map(entity => html`
                  <option value="${entity.entity_id}">${entity.friendly_name || entity.entity_id}</option>
                `)}
              </select>
            </div>

            <!-- Import Power Sensor -->
            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 4px; font-weight: 500;">
                Import Power Sensor <span style="color: red;">*</span>
              </label>
              <select
                .value="${this._config.energy_villetta?.import_power_sensor || ''}"
                @change="${(e: any) => {
                  this._config = {
                    ...this._config,
                    energy_villetta: {
                      ...this._config.energy_villetta!,
                      import_power_sensor: e.target.value || null
                    }
                  };
                }}"
                style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--primary-background-color); color: var(--primary-text-color);"
              >
                <option value="">Select entity...</option>
                ${this._getSensorEntities().map(entity => html`
                  <option value="${entity.entity_id}">${entity.friendly_name || entity.entity_id}</option>
                `)}
              </select>
            </div>

            <!-- Photovoltaic Toggle -->
            <div style="margin-bottom: 16px;">
              <label style="display: flex; align-items: center; cursor: pointer;">
                <input
                  type="checkbox"
                  .checked="${this._config.energy_villetta?.photovoltaic_enabled || false}"
                  @change="${(e: any) => {
                    this._config = {
                      ...this._config,
                      energy_villetta: {
                        ...this._config.energy_villetta!,
                        photovoltaic_enabled: e.target.checked
                      }
                    };
                  }}"
                  style="margin-right: 8px;"
                />
                <span style="font-weight: 500;">Photovoltaic System</span>
              </label>
            </div>

            ${this._config.energy_villetta?.photovoltaic_enabled ? html`
              <!-- PV Production Sensor -->
              <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 4px; font-weight: 500;">
                  Instant Photovoltaic Production Sensor <span style="color: red;">*</span>
                </label>
                <select
                  .value="${this._config.energy_villetta?.photovoltaic_production_sensor || ''}"
                  @change="${(e: any) => {
                    this._config = {
                      ...this._config,
                      energy_villetta: {
                        ...this._config.energy_villetta!,
                        photovoltaic_production_sensor: e.target.value || null
                      }
                    };
                  }}"
                  style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--primary-background-color); color: var(--primary-text-color);"
                >
                  <option value="">Select entity...</option>
                  ${this._getSensorEntities().map(entity => html`
                    <option value="${entity.entity_id}">${entity.friendly_name || entity.entity_id}</option>
                  `)}
                </select>
              </div>
            ` : ''}

            <!-- Battery Toggle -->
            <div style="margin-bottom: 16px;">
              <label style="display: flex; align-items: center; cursor: pointer;">
                <input
                  type="checkbox"
                  .checked="${this._config.energy_villetta?.battery_enabled || false}"
                  @change="${(e: any) => {
                    this._config = {
                      ...this._config,
                      energy_villetta: {
                        ...this._config.energy_villetta!,
                        battery_enabled: e.target.checked
                      }
                    };
                  }}"
                  style="margin-right: 8px;"
                />
                <span style="font-weight: 500;">Battery Storage System</span>
              </label>
            </div>

            ${this._config.energy_villetta?.battery_enabled ? html`
              <!-- Battery Sensor -->
              <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 4px; font-weight: 500;">
                  Battery Power / Status Sensor <span style="color: red;">*</span>
                </label>
                <select
                  .value="${this._config.energy_villetta?.battery_sensor || ''}"
                  @change="${(e: any) => {
                    this._config = {
                      ...this._config,
                      energy_villetta: {
                        ...this._config.energy_villetta!,
                        battery_sensor: e.target.value || null
                      }
                    };
                  }}"
                  style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--primary-background-color); color: var(--primary-text-color);"
                >
                  <option value="">Select entity...</option>
                  ${this._getSensorEntities().map(entity => html`
                    <option value="${entity.entity_id}">${entity.friendly_name || entity.entity_id}</option>
                  `)}
                </select>
              </div>
            ` : ''}
          ` : ''}
        </div>

        ${this._generatedDashboard ? html`
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Generated Dashboard</h2>
              <button class="btn-secondary" @click="${() => { navigator.clipboard.writeText(JSON.stringify(this._generatedDashboard, null, 2)); }}">
                Copy JSON
              </button>
            </div>
            <pre class="code-preview">${JSON.stringify(this._generatedDashboard, null, 2)}</pre>
          </div>
        ` : ''}

        <div class="actions">
          <button 
            class="btn-primary" 
            @click="${async () => { await this._saveConfig(); await this._generate(); }}"
            ?disabled="${this._saveStatus === 'saving' || this._loading}"
          >
            ${this._saveStatus === 'saving' ? 'Saving...' :
        this._loading ? 'Generating...' :
          this._saveStatus === 'saved' ? 'Saved & Generated!' :
            'Save & Generate Dashboard'}
          </button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nidia-dashboard-composer-panel': NidiaDashboardComposerPanel;
  }
}

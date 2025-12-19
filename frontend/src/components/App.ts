import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, ComposerConfig } from '../types';
import { getConfig, saveConfig, generateDashboard } from '../api';

@customElement('nidia-dashboard-composer-panel')
export class NidiaDashboardComposerPanel extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean, reflect: true }) narrow = false;

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
      battery_sensor: null,
      export_enabled: false,
      export_sensor: null,
      ev_enabled: false,
      ev_sensor: null
    }
  };

  @state() private _loading = false;
  @state() private _generatedDashboard: any = null;
  @state() private _activeTab: 'general' | 'areas' | 'energy' | 'preview' = 'general';
  @state() private _saveStatus: 'idle' | 'saving' | 'saved' | 'error' = 'idle';
  @state() private _sidebarOpen = false;

  static styles = css`
    :host {
      display: block;
      height: 100vh;
      width: 100%;
      background-color: var(--primary-background-color);
      color: var(--primary-text-color);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      overflow: hidden;
    }

    .app-layout {
      display: flex;
      height: 100%;
      width: 100%;
      position: relative;
    }

    /* Sidebar Styles */
    .sidebar {
      width: 280px;
      background: var(--card-background-color, #fff);
      border-right: 1px solid var(--divider-color);
      display: flex;
      flex-direction: column;
      padding: 24px 0;
      flex-shrink: 0;
      box-shadow: 2px 0 8px rgba(0,0,0,0.02);
      z-index: 100;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    :host([narrow]) .sidebar {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      transform: translateX(-100%);
    }

    :host([narrow]) .sidebar.open {
      transform: translateX(0);
      box-shadow: 4px 0 20px rgba(0,0,0,0.15);
    }

    .sidebar-overlay {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.4);
      z-index: 90;
      backdrop-filter: blur(2px);
    }

    :host([narrow]) .sidebar.open + .sidebar-overlay {
      display: block;
    }

    .mobile-header {
      display: none;
      padding: 12px 16px;
      background: var(--card-background-color, #fff);
      border-bottom: 1px solid var(--divider-color);
      align-items: center;
      gap: 12px;
      z-index: 80;
    }

    :host([narrow]) .mobile-header {
      display: flex;
    }

    .menu-button {
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
      color: var(--primary-text-color);
      font-size: 20px;
    }

    .sidebar-header {
      padding: 0 24px 32px 24px;
    }

    .sidebar-header h1 {
      font-size: 20px;
      font-weight: 700;
      margin: 0;
      background: linear-gradient(135deg, var(--primary-color) 0%, #a855f7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.5px;
    }

    .sidebar-header p {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin: 4px 0 0 0;
    }

    .nav-items {
      flex: 1;
      padding: 0 12px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      margin-bottom: 4px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
      color: var(--secondary-text-color);
      font-weight: 500;
      gap: 12px;
    }

    .nav-item:hover {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    .nav-item.active {
      background: var(--primary-color);
      color: white;
      box-shadow: 0 4px 12px rgba(var(--rgb-primary-color, 33, 150, 243), 0.3);
    }

    .nav-icon {
      font-size: 18px;
    }

    .sidebar-footer {
      padding: 24px;
      border-top: 1px solid var(--divider-color);
    }

    /* Main Content Styles */
    .main-content {
      flex: 1;
      overflow-y: auto;
      background: var(--secondary-background-color);
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .content-container {
      max-width: 900px;
      margin: 0 auto;
      width: 100%;
      padding: 40px 24px 100px 24px;
    }

    :host([narrow]) .content-container {
      padding: 24px 16px 120px 16px;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-header h2 {
      font-size: 28px;
      font-weight: 600;
      margin: 0 0 8px 0;
    }

    .page-header p {
      color: var(--secondary-text-color);
      margin: 0;
    }

    /* Card Styles */
    .glass-card {
      background: var(--card-background-color, #fff);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.04);
      margin-bottom: 24px;
      border: 1px solid var(--divider-color);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .glass-card:hover {
      box-shadow: 0 8px 30px rgba(0,0,0,0.06);
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 20px 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    /* Grid & Controls */
    .area-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 16px;
    }

    :host([narrow]) .area-grid {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 12px;
    }

    .area-card {
      background: var(--secondary-background-color);
      border-radius: 12px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 2px solid transparent;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .area-card:hover {
      transform: translateY(-4px);
      border-color: var(--primary-color);
    }

    .area-card.selected {
      border-color: var(--primary-color);
      background: var(--card-background-color);
    }

    .area-card.selected .area-name {
      color: var(--primary-color);
      font-weight: 600;
    }

    .area-card.selected .area-icon {
      transform: scale(1.1);
    }

    .area-icon {
      font-size: 32px;
      margin-bottom: 12px;
      display: block;
      transition: transform 0.3s ease;
    }

    .area-name {
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .floor-section {
      margin-bottom: 40px;
    }

    .floor-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--secondary-text-color);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .floor-title::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--divider-color);
    }

    /* Form Controls */
    .form-group {
      margin-bottom: 24px;
    }

    .form-label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      font-size: 14px;
      color: var(--primary-text-color);
    }

    .form-control {
      width: 100%;
      padding: 12px 16px;
      border-radius: 10px;
      border: 1px solid var(--divider-color);
      background: var(--primary-background-color);
      color: var(--primary-text-color);
      font-size: 14px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(var(--rgb-primary-color, 33, 150, 243), 0.1);
    }

    /* Switch Style */
    .switch-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      background: var(--secondary-background-color);
      border-radius: 10px;
      margin-bottom: 12px;
    }

    /* Actions Sticky Bar */
    .floating-actions {
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      background: rgba(var(--rgb-card-background-color, 255, 255, 255), 0.8);
      backdrop-filter: blur(12px);
      border-top: 1px solid var(--divider-color);
      padding: 16px 40px;
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      z-index: 85;
    }

    :host([narrow]) .floating-actions {
      padding: 16px;
    }

    button {
      padding: 10px 24px;
      border-radius: 10px;
      border: none;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn-primary {
      background: var(--primary-color);
      color: white;
      box-shadow: 0 4px 12px rgba(var(--rgb-primary-color, 33, 150, 243), 0.2);
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(var(--rgb-primary-color, 33, 150, 243), 0.3);
      filter: brightness(1.05);
    }

    .btn-secondary {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    .btn-secondary:hover {
      background: var(--divider-color);
    }

    .status-badge {
      font-size: 12px;
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: 600;
    }

    .status-saving { background: #fff3e0; color: #ef6c00; }
    .status-saved { background: #e8f5e9; color: #2e7d32; }
    .status-error { background: #ffebee; color: #c62828; }

    .code-preview {
      background: #0f172a;
      color: #e2e8f0;
      padding: 24px;
      border-radius: 12px;
      overflow: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      line-height: 1.6;
      max-height: 500px;
      border: 1px solid #1e293b;
    }

    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: var(--divider-color);
      border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--secondary-text-color);
    }
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
      if (!this._config.modules.includes('home')) {
        this._config.modules = ['home'];
      }
    } catch (err) {
      console.error('Failed to load config:', err);
    }
    this._loading = false;
  }

  private async _saveConfig() {
    this._saveStatus = 'saving';
    try {
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
    const newAreas = [...this._config.areas];
    if (index > -1) {
      newAreas.splice(index, 1);
    } else {
      newAreas.push(areaId);
    }
    this._config = { ...this._config, areas: newAreas };
  }

  private _selectAllAreas() {
    if (!this.hass.areas) return;
    this._config = { ...this._config, areas: Object.keys(this.hass.areas) };
  }

  private _deselectAllAreas() {
    this._config = { ...this._config, areas: [] };
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
    return html`
      <div class="app-layout">
        <div class="mobile-header">
          <button class="menu-button" @click="${() => this._sidebarOpen = true}">☰</button>
          <h2 style="margin: 0; font-size: 16px;">Nidia Composer</h2>
        </div>

        <aside class="sidebar ${this._sidebarOpen ? 'open' : ''}">
          <div class="sidebar-header">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h1>Nidia Composer</h1>
              ${this.narrow ? html`<button class="menu-button" @click="${() => this._sidebarOpen = false}">✕</button>` : ''}
            </div>
            <p>v0.6.2 • Dashboard Tool</p>
          </div>
          
          <nav class="nav-items">
            <div class="nav-item ${this._activeTab === 'general' ? 'active' : ''}" @click="${() => { this._activeTab = 'general'; this._sidebarOpen = false; }}">
              <span class="nav-icon">⚙️</span>
              <span>General Settings</span>
            </div>
            <div class="nav-item ${this._activeTab === 'areas' ? 'active' : ''}" @click="${() => { this._activeTab = 'areas'; this._sidebarOpen = false; }}">
              <span class="nav-icon">🏠</span>
              <span>Room Selection</span>
            </div>
            <div class="nav-item ${this._activeTab === 'energy' ? 'active' : ''}" @click="${() => { this._activeTab = 'energy'; this._sidebarOpen = false; }}">
              <span class="nav-icon">⚡</span>
              <span>Energy Module</span>
            </div>
            <div class="nav-item ${this._activeTab === 'preview' ? 'active' : ''}" @click="${() => { this._activeTab = 'preview'; this._sidebarOpen = false; }}">
              <span class="nav-icon">👁️</span>
              <span>Preview & JSON</span>
            </div>
          </nav>

          <div class="sidebar-footer">
            ${this._saveStatus !== 'idle' ? html`
              <div class="status-badge status-${this._saveStatus}">
                ${this._saveStatus === 'saving' ? 'Saving...' :
          this._saveStatus === 'saved' ? 'Config Saved!' : 'Error Saving'}
              </div>
            ` : ''}
          </div>
        </aside>

        ${this._sidebarOpen ? html`<div class="sidebar-overlay" @click="${() => this._sidebarOpen = false}"></div>` : ''}

        <main class="main-content">
          <div class="content-container">
            ${this._renderActiveTab()}
          </div>

          <div class="floating-actions">
            <button class="btn-secondary" @click="${this._loadConfig}">
              Reset
            </button>
            <button 
              class="btn-primary" 
              @click="${async () => { await this._saveConfig(); await this._generate(); }}"
              ?disabled="${this._saveStatus === 'saving' || this._loading}"
            >
              ${this._loading ? 'Working...' : 'Save & Generate Dashboard'}
            </button>
          </div>
        </main>
      </div>
    `;
  }

  private _renderActiveTab() {
    switch (this._activeTab) {
      case 'general': return this._renderGeneralTab();
      case 'areas': return this._renderAreasTab();
      case 'energy': return this._renderEnergyTab();
      case 'preview': return this._renderPreviewTab();
      default: return html``;
    }
  }

  private _renderGeneralTab() {
    return html`
      <div class="page-header">
        <h2>General Settings</h2>
        <p>Configure the basic look and feel of your dashboard.</p>
      </div>

      <div class="glass-card">
        <h3 class="section-title">Visual Appearance</h3>
        
        <div class="form-group">
          <label class="form-label">Background Theme</label>
          <select class="form-control" @change="${(e: any) => this._onBackgroundChange(e)}" .value="${this._config.background || ''}">
            <option value="">Default (No background)</option>
            <option value="modern">Modern Gradient</option>
          </select>
          <p style="font-size: 12px; color: var(--secondary-text-color); margin-top: 8px;">
            Choose a background style for your dashboard. "Modern" uses a sleek gradient with an image overlay.
          </p>
        </div>

        <div class="form-group">
          <label class="form-label">Layout Style</label>
          <select class="form-control" .value="${this._config.layout_style || 'standard'}" 
            @change="${(e: any) => this._config = { ...this._config, layout_style: e.target.value }}">
            <option value="standard">Standard Grid</option>
            <option value="compact">Compact View</option>
          </select>
        </div>
      </div>
    `;
  }

  private _renderAreasTab() {
    const areas = this.hass?.areas ? Object.values(this.hass.areas) : [];
    const { floors, noFloor } = this._getAreasByFloor();

    return html`
      <div class="page-header">
        <div style="display: flex; justify-content: space-between; align-items: ${this.narrow ? 'flex-start' : 'center'}; flex-direction: ${this.narrow ? 'column' : 'row'}; gap: 16px;">
          <div>
            <h2>Room Selection</h2>
            <p>Select which areas should be included.</p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-secondary" style="padding: 6px 12px; font-size: 12px;" @click="${this._selectAllAreas}">Select All</button>
            <button class="btn-secondary" style="padding: 6px 12px; font-size: 12px;" @click="${this._deselectAllAreas}">Deselect All</button>
          </div>
        </div>
      </div>

      ${areas.length > 0 ? html`
        ${Object.entries(floors).map(([floorId, floorAreas]) => html`
          <div class="floor-section">
            <h3 class="floor-title">Floor: ${floorId}</h3>
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
          <div class="floor-section">
            <h3 class="floor-title">Other Areas</h3>
            <div class="area-grid">
              ${noFloor.map(area => html`
                <div
                  class="area-card ${this._config.areas.includes(area.area_id) ? 'selected' : ''}"
                  @click="${() => this._toggleArea(area.area_id)}"
                >
                  <span class="area-icon">📍</span>
                  <div class="area-name">${area.name}</div>
                </div>
              `)}
            </div>
          </div>
        ` : ''}
      ` : html`
        <div class="glass-card" style="text-align: center; padding: 48px;">
          <p style="color: var(--secondary-text-color);">No areas found in Home Assistant.</p>
        </div>
      `}
    `;
  }

  private _renderEnergyTab() {
    const sensors = this._getSensorEntities();
    const energy = this._config.energy_villetta || { enabled: false };

    return html`
      <div class="page-header">
        <h2>Energy Engine</h2>
        <p>Configure the "Villetta" visualization module.</p>
      </div>

      <div class="glass-card">
        <div class="switch-group">
          <div>
            <div style="font-weight: 600;">Enable Module</div>
            <div style="font-size: 12px; color: var(--secondary-text-color);">Show the energy flow visualization</div>
          </div>
          <input type="checkbox" .checked="${energy.enabled}" 
            @change="${(e: any) => this._updateEnergyConfig({ enabled: e.target.checked })}"
            style="width: 20px; height: 20px; cursor: pointer;">
        </div>

        ${energy.enabled ? html`
          <div style="margin-top: 24px;">
            <div class="form-group">
              <label class="form-label">Home Consumption Sensor <span style="color: #ef4444;">*</span></label>
              <select class="form-control" .value="${energy.home_consumption_sensor || ''}"
                @change="${(e: any) => this._updateEnergyConfig({ home_consumption_sensor: e.target.value || null })}">
                <option value="">Select entity...</option>
                ${sensors.map(s => html`<option value="${s.entity_id}">${s.friendly_name}</option>`)}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Grid Import Sensor <span style="color: #ef4444;">*</span></label>
              <select class="form-control" .value="${energy.import_power_sensor || ''}"
                @change="${(e: any) => this._updateEnergyConfig({ import_power_sensor: e.target.value || null })}">
                <option value="">Select entity...</option>
                ${sensors.map(s => html`<option value="${s.entity_id}">${s.friendly_name}</option>`)}
              </select>
            </div>

            <div class="glass-card" style="background: var(--secondary-background-color); border: none; padding: 20px;">
              <h4 style="margin: 0 0 16px 0; font-size: 14px; color: var(--secondary-text-color); text-transform: uppercase;">Optional Components</h4>
              
              <div class="switch-group" style="background: transparent; padding: 8px 0;">
                <span style="font-size: 14px;">Photovoltaic System</span>
                <input type="checkbox" .checked="${energy.photovoltaic_enabled}"
                  @change="${(e: any) => this._updateEnergyConfig({ photovoltaic_enabled: e.target.checked })}">
              </div>
              ${energy.photovoltaic_enabled ? html`
                <div class="form-group" style="padding-left: 12px; border-left: 2px solid var(--divider-color); margin-top: 8px;">
                  <select class="form-control" .value="${energy.photovoltaic_production_sensor || ''}"
                    @change="${(e: any) => this._updateEnergyConfig({ photovoltaic_production_sensor: e.target.value || null })}">
                    <option value="">Select production entity...</option>
                    ${sensors.map(s => html`<option value="${s.entity_id}">${s.friendly_name}</option>`)}
                  </select>
                </div>
              ` : ''}

              <div class="switch-group" style="background: transparent; padding: 8px 0;">
                <span style="font-size: 14px;">Battery Storage</span>
                <input type="checkbox" .checked="${energy.battery_enabled}"
                  @change="${(e: any) => this._updateEnergyConfig({ battery_enabled: e.target.checked })}">
              </div>
              ${energy.battery_enabled ? html`
                <div class="form-group" style="padding-left: 12px; border-left: 2px solid var(--divider-color); margin-top: 8px;">
                  <select class="form-control" .value="${energy.battery_sensor || ''}"
                    @change="${(e: any) => this._updateEnergyConfig({ battery_sensor: e.target.value || null })}">
                    <option value="">Select battery entity...</option>
                    ${sensors.map(s => html`<option value="${s.entity_id}">${s.friendly_name}</option>`)}
                  </select>
                </div>
              ` : ''}

              <div class="switch-group" style="background: transparent; padding: 8px 0;">
                <span style="font-size: 14px;">Grid Export Power</span>
                <input type="checkbox" .checked="${energy.export_enabled}"
                  @change="${(e: any) => this._updateEnergyConfig({ export_enabled: e.target.checked })}">
              </div>
              ${energy.export_enabled ? html`
                <div class="form-group" style="padding-left: 12px; border-left: 2px solid var(--divider-color); margin-top: 8px;">
                  <select class="form-control" .value="${energy.export_sensor || ''}"
                    @change="${(e: any) => this._updateEnergyConfig({ export_sensor: e.target.value || null })}">
                    <option value="">Select export entity...</option>
                    ${sensors.map(s => html`<option value="${s.entity_id}">${s.friendly_name}</option>`)}
                  </select>
                </div>
              ` : ''}
              
              <div class="switch-group" style="background: transparent; padding: 8px 0;">
                <span style="font-size: 14px;">Electric Vehicle Charging</span>
                <input type="checkbox" .checked="${energy.ev_enabled}"
                  @change="${(e: any) => this._updateEnergyConfig({ ev_enabled: e.target.checked })}">
              </div>
              ${energy.ev_enabled ? html`
                <div class="form-group" style="padding-left: 12px; border-left: 2px solid var(--divider-color); margin-top: 8px;">
                  <select class="form-control" .value="${energy.ev_sensor || ''}"
                    @change="${(e: any) => this._updateEnergyConfig({ ev_sensor: e.target.value || null })}">
                    <option value="">Select EV charger entity...</option>
                    ${sensors.map(s => html`<option value="${s.entity_id}">${s.friendly_name}</option>`)}
                  </select>
                </div>
              ` : ''}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  private _renderPreviewTab() {
    return html`
      <div class="page-header">
        <h2>Live Preview</h2>
        <p>Inspect the generated dashboard configuration.</p>
      </div>

      <div class="glass-card">
        <div style="display: flex; justify-content: space-between; align-items: ${this.narrow ? 'flex-start' : 'center'}; flex-direction: ${this.narrow ? 'column' : 'row'}; gap: 16px; margin-bottom: 20px;">
          <h3 class="section-title" style="margin: 0;">YAML/JSON Configuration</h3>
          <button class="btn-secondary" @click="${() => { navigator.clipboard.writeText(JSON.stringify(this._generatedDashboard, null, 2)); }}">
            Copy to Clipboard 📋
          </button>
        </div>
        
        ${this._generatedDashboard ? html`
          <pre class="code-preview">${JSON.stringify(this._generatedDashboard, null, 2)}</pre>
        ` : html`
          <div style="text-align: center; padding: 40px; color: var(--secondary-text-color);">
            Generate the dashboard to see the preview here.
          </div>
        `}
      </div>
    `;
  }

  private _updateEnergyConfig(updates: Partial<any>) {
    this._config = {
      ...this._config,
      energy_villetta: {
        ...(this._config.energy_villetta || {
          enabled: false,
          home_consumption_sensor: null,
          import_power_sensor: null,
          photovoltaic_enabled: false,
          photovoltaic_production_sensor: null,
          battery_enabled: false,
          battery_sensor: null,
          export_enabled: false,
          export_sensor: null,
          ev_enabled: false,
          ev_sensor: null
        }),
        ...updates
      }
    };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nidia-dashboard-composer-panel': NidiaDashboardComposerPanel;
  }
}

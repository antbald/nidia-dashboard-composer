import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, ComposerConfig } from '../types';
import { getConfig, saveConfig, generateDashboard, runTestScenario } from '../api';

@customElement('nidia-dashboard-composer-panel')
export class NidiaDashboardComposerPanel extends LitElement {
    @property({ attribute: false }) hass!: HomeAssistant;
    @property({ type: Boolean }) narrow = false;

    @state() private _config: ComposerConfig = {
        areas: [],
        modules: [],
        theme: 'default',
        layout_style: 'standard'
    };

    @state() private _currentStep = 0;
    @state() private _loading = false;
    @state() private _generatedDashboard: any = null;

    static styles = css`
    :host {
      display: block;
      padding: 16px;
      background: var(--primary-background-color);
      min-height: 100vh;
    }

    .header {
      margin-bottom: 24px;
    }

    .header h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 400;
      color: var(--primary-text-color);
    }

    .tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      border-bottom: 2px solid var(--divider-color);
    }

    .tab {
      padding: 12px 24px;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      font-size: 14px;
      font-weight: 500;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: all 0.2s;
    }

    .tab:hover {
      color: var(--primary-text-color);
    }

    .tab.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
    }

    .content {
      background: var(--card-background-color);
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .section {
      margin-bottom: 24px;
    }

    .section h2 {
      font-size: 20px;
      font-weight: 500;
      margin: 0 0 16px 0;
      color: var(--primary-text-color);
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: var(--primary-text-color);
      font-weight: 500;
    }

    .checkbox-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      border-radius: 4px;
      transition: background 0.2s;
    }

    .checkbox-item:hover {
      background: var(--secondary-background-color);
    }

    .checkbox-item input[type="checkbox"] {
      width: 20px;
      height: 20px;
    }

    .button-group {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }

    button {
      padding: 12px 24px;
      border-radius: 4px;
      border: none;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .button-primary {
      background: var(--primary-color);
      color: white;
    }

    .button-primary:hover {
      opacity: 0.9;
    }

    .button-secondary {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    .button-secondary:hover {
      background: var(--divider-color);
    }

    .code-block {
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 16px;
      border-radius: 4px;
      overflow: auto;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      max-height: 500px;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: var(--secondary-text-color);
    }
  `;

    async connectedCallback() {
        super.connectedCallback();
        await this._loadConfig();
    }

    private async _loadConfig() {
        this._loading = true;
        try {
            this._config = await getConfig(this.hass);
        } catch (err) {
            console.error('Failed to load config:', err);
        }
        this._loading = false;
    }

    private async _saveConfig() {
        this._loading = true;
        try {
            await saveConfig(this.hass, this._config);
        } catch (err) {
            console.error('Failed to save config:', err);
        }
        this._loading = false;
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

    private _toggleModule(module: string) {
        const index = this._config.modules.indexOf(module);
        if (index > -1) {
            this._config.modules.splice(index, 1);
        } else {
            this._config.modules.push(module);
        }
        this._config = { ...this._config };
    }

    render() {
        return html`
      <div class="header">
        <h1>🎨 Nidia Dashboard Composer</h1>
      </div>

      <div class="tabs">
        <button class="tab ${this._currentStep === 0 ? 'active' : ''}" @click="${() => this._currentStep = 0}">
          Configure
        </button>
        <button class="tab ${this._currentStep === 1 ? 'active' : ''}" @click="${() => this._currentStep = 1}">
          Generate
        </button>
        <button class="tab ${this._currentStep === 2 ? 'active' : ''}" @click="${() => this._currentStep = 2}">
          Test
        </button>
      </div>

      <div class="content">
        ${this._currentStep === 0 ? this._renderConfigStep() : ''}
        ${this._currentStep === 1 ? this._renderGenerateStep() : ''}
        ${this._currentStep === 2 ? this._renderTestStep() : ''}
      </div>
    `;
    }

    private _renderConfigStep() {
        const availableModules = ['light', 'climate', 'media', 'energy'];

        return html`
      <div class="section">
        <h2>Select Modules</h2>
        <div class="checkbox-list">
          ${availableModules.map(module => html`
            <label class="checkbox-item">
              <input
                type="checkbox"
                .checked="${this._config.modules.includes(module)}"
                @change="${() => this._toggleModule(module)}"
              />
              <span>${module.charAt(0).toUpperCase() + module.slice(1)}</span>
            </label>
          `)}
        </div>
      </div>

      <div class="button-group">
        <button class="button-primary" @click="${this._saveConfig}">
          Save Configuration
        </button>
      </div>
    `;
    }

    private _renderGenerateStep() {
        return html`
      <div class="section">
        <h2>Generate Dashboard</h2>
        <p>Click the button below to generate a dashboard based on your configuration.</p>
        
        <div class="button-group">
          <button class="button-primary" @click="${this._generate}" ?disabled="${this._loading}">
            ${this._loading ? 'Generating...' : 'Generate Dashboard'}
          </button>
        </div>

        ${this._generatedDashboard ? html`
          <div style="margin-top: 24px;">
            <h2>Generated Dashboard</h2>
            <pre class="code-block">${JSON.stringify(this._generatedDashboard, null, 2)}</pre>
          </div>
        ` : ''}
      </div>
    `;
    }

    private _renderTestStep() {
        return html`
      <div class="section">
        <h2>Developer Testing</h2>
        <p>Test the generator with predefined scenarios.</p>
        
        <div class="button-group">
          <button class="button-primary" @click="${() => this._runTest('small_home')}">
            Test: Small Home
          </button>
          <button class="button-primary" @click="${() => this._runTest('energy_home')}">
            Test: Energy Home
          </button>
        </div>

        ${this._generatedDashboard ? html`
          <div style="margin-top: 24px;">
            <h2>Test Result</h2>
            <pre class="code-block">${JSON.stringify(this._generatedDashboard, null, 2)}</pre>
          </div>
        ` : ''}
      </div>
    `;
    }

    private async _runTest(scenario: string) {
        this._loading = true;
        try {
            this._generatedDashboard = await runTestScenario(this.hass, scenario);
        } catch (err) {
            console.error('Failed to run test:', err);
        }
        this._loading = false;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'nidia-dashboard-composer-panel': NidiaDashboardComposerPanel;
    }
}

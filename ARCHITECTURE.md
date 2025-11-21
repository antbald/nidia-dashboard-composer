# Nidia Dashboard Composer - Architecture & Design

## 1. Overview
Nidia Dashboard Composer is a Home Assistant custom integration that allows users to generate Lovelace dashboards based on high-level preferences. It includes a backend generator, a frontend configuration panel, and a robust testing framework.

## 2. Backend Architecture (Python)
Located in `custom_components/nidia_dashboard_composer/`.

### Core Components
- **`__init__.py`**: Entry point. Sets up the component, registers the frontend panel, and initializes the `ComposerCoordinator`.
- **`api.py`**: Registers WebSocket commands for the frontend to communicate with the backend (read/write config, generate, run tests).
- **`coordinator.py`**: Central logic controller. Manages the state, loads/saves data via `storage.py`, and delegates to `generator.py`.
- **`storage.py`**: Handles persistence using `hass.helpers.storage`. Saves user preferences to `.storage/nidia_dashboard_composer`.
- **`generator/`**: The core generation engine.
    - **`engine.py`**: Main generator logic.
    - **`modules/`**: Sub-modules for specific domains (e.g., `light.py`, `climate.py`). Each module implements a standard interface to return cards based on input entities.
    - **`types.py`**: TypedDicts and dataclasses for the internal model.
- **`testing/`**: Internal test harness.
    - **`harness.py`**: Logic to load scenarios and run the generator with mock data.
    - **`scenarios/`**: Folder containing JSON/YAML files defining test scenarios (mock entities + config).

## 3. Frontend Architecture (TypeScript + Lit)
Located in `frontend/`. Built using Vite.

### Core Components
- **`main.ts`**: Entry point. Registers the custom panel `<nidia-dashboard-composer-panel>`.
- **`App.ts`**: Main container. Manages the wizard state (Welcome -> Areas -> Modules -> Generate).
- **`components/`**:
    - **`Wizard/`**: Steps for the configuration flow.
    - **`ModuleSelector.ts`**: UI for enabling/configuring specific modules.
    - **`TestPanel.ts`**: Developer-only panel to run internal scenarios.
- **`api.ts`**: Typed wrappers for `hass.callWS`.

## 4. Data Flow
1.  **User Interaction**: User selects "Living Room" and "Lights" module in Frontend.
2.  **Config Save**: Frontend sends config to Backend via WebSocket. Backend saves to storage.
3.  **Generation Trigger**: User clicks "Generate".
4.  **Entity Discovery**: Backend scans `hass.states` for entities matching selected areas and domains.
5.  **Module Execution**: For each enabled module, the generator calls the corresponding module logic (e.g., `modules.light.generate(entities)`).
6.  **Layout Composition**: The generator assembles the cards returned by modules into Views and Sections.
7.  **Output**: The final Lovelace configuration is generated and either:
    - Returned to Frontend for preview.
    - Saved to a new Dashboard resource in HA.

## 5. Testing Strategy
### Automated Tests (pytest)
- **Unit Tests**: Test individual generator modules (e.g., does `light.py` return a card?).
- **Integration Tests**: Test the full flow from Config -> Lovelace Output using `pytest-homeassistant-custom-component`.

### Internal Test Harness (Dev Tool)
- A dedicated "Test" tab in the frontend.
- Allows selecting a scenario (e.g., "Complex Home").
- Backend loads the scenario (mock entities), runs the generator, and returns the result.
- Frontend displays the JSON model and the generated YAML for inspection.

## 6. Directory Structure
```
nidia-dashboard-composer/
├── custom_components/
│   └── nidia_dashboard_composer/
│       ├── __init__.py
│       ├── manifest.json
│       ├── api.py
│       ├── const.py
│       ├── storage.py
│       ├── generator/
│       │   ├── __init__.py
│       │   ├── engine.py
│       │   └── modules/
│       └── testing/
│           ├── harness.py
│           └── scenarios/
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
├── tests/
│   ├── conftest.py
│   └── test_generator.py
├── hacs.json
└── README.md
```

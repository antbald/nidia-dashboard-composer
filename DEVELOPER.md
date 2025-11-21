# Nidia Dashboard Composer - Developer Guide

## Project Structure

```
nidia-dashboard-composer/
├── custom_components/nidia_dashboard_composer/  # Python backend
│   ├── __init__.py                             # Integration setup
│   ├── api.py                                  # WebSocket API
│   ├── coordinator.py                          # Main coordinator
│   ├── generator/                              # Dashboard generator
│   │   ├── engine.py                          # Generation engine
│   │   ├── types.py                           # Type definitions
│   │   └── modules/                           # Module generators
│   │       ├── light.py
│   │       ├── climate.py
│   │       ├── media.py
│   │       └── energy.py
│   └── testing/                               # Test harness
│       ├── harness.py                         # Test runner
│       └── scenarios/                         # Test scenarios
│           ├── small_home.json
│           └── energy_home.json
├── frontend/                                  # TypeScript frontend
│   ├── src/
│   │   ├── main.ts                           # Entry point
│   │   ├── api.ts                            # API client
│   │   ├── types.ts                          # Type definitions
│   │   └── components/
│   │       └── App.ts                        # Main panel component
│   ├── package.json
│   └── vite.config.ts
└── tests/                                    # pytest tests
    ├── conftest.py
    ├── test_generator.py
    └── test_harness.py
```

## Development Workflow

### 1. Backend Development

The backend is a standard Home Assistant custom integration. Key files:

- **`__init__.py`**: Entry point, registers panel and WebSocket API
- **`generator/engine.py`**: Core generation logic
- **`generator/modules/`**: Individual module generators

### 2. Frontend Development

Built with TypeScript + Lit + Vite.

```bash
cd frontend
npm install
npm run dev    # Development mode
npm run build  # Production build to ../custom_components/.../www/
```

### 3. Testing

#### Run pytest tests:
```bash
pip install -r requirements_test.txt
pytest tests/
```

#### Use the internal test harness:
1. Open Home Assistant
2. Navigate to "Nidia Dashboard Composer" in the sidebar
3. Go to the "Test" tab
4. Select a scenario and click "Test"

### 4. Adding New Modules

1. Create a new file in `custom_components/nidia_dashboard_composer/generator/modules/`
2. Implement the module class with a static `generate(entities, config)` method
3. Register it in `modules/__init__.py`
4. Add domain mapping in `engine.py`

Example:
```python
class SecurityModule:
    @staticmethod
    def generate(entities, config):
        cards = [...]
        return ModuleResult(cards=cards, view_title="Security")
```

### 5. Adding Test Scenarios

Create a JSON file in `testing/scenarios/`:

```json
{
  "name": "my_scenario",
  "description": "Description here",
  "config": {
    "areas": ["living_room"],
    "modules": ["light"]
  },
  "entities": [
    {
      "entity_id": "light.test",
      "domain": "light",
      "area_id": "living_room",
      "friendly_name": "Test Light",
      "state": "on"
    }
  ]
}
```

## Installation

### Via HACS (Recommended)
1. Add this repository as a custom repository in HACS
2. Search for "Nidia Dashboard Composer"
3. Install and restart Home Assistant

### Manual
1. Copy `custom_components/nidia_dashboard_composer` to your HA config
2. Restart Home Assistant

## API Reference

### WebSocket Commands

#### Get Configuration
```json
{
  "type": "nidia_dashboard_composer/get_config"
}
```

#### Save Configuration
```json
{
  "type": "nidia_dashboard_composer/save_config",
  "config": {
    "areas": ["living_room"],
    "modules": ["light", "climate"],
    "theme": "default"
  }
}
```

#### Generate Dashboard
```json
{
  "type": "nidia_dashboard_composer/generate"
}
```

#### Run Test
```json
{
  "type": "nidia_dashboard_composer/test_run",
  "scenario": "small_home"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Architecture Notes

- **Storage**: User preferences are stored in `.storage/nidia_dashboard_composer`
- **Entity Discovery**: Uses Home Assistant's entity and area registries
- **Module System**: Modular design allows easy extension
- **Testing**: Both pytest and internal harness for comprehensive testing

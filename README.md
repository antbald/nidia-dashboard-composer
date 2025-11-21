# 🎨 Nidia Dashboard Composer

**Automatically generate beautiful Home Assistant dashboards based on your preferences.**

Nidia Dashboard Composer is a HACS-compatible custom integration that intelligently creates Lovelace dashboards by analyzing your Home Assistant setup and applying user-selected preferences.

## ✨ Features

- **🎯 Smart Entity Discovery**: Automatically finds and categorizes your entities
- **🧩 Modular Design**: Select which modules to include (lights, climate, energy, media, etc.)
- **🎨 Customizable Layout**: Choose between compact, standard, or large layouts
- **🧪 Developer-Friendly**: Built-in testing harness with mock scenarios
- **📦 HACS Compatible**: Easy installation and updates
- **🔧 Extensible**: Add your own modules easily

## 🚀 Quick Start

### Installation

#### Via HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Click on "Integrations"
3. Click the three dots in the top right corner
4. Select "Custom repositories"
5. Add `https://github.com/antbald/nidia-dashboard-composer` as an Integration
6. Click "Install"
7. Restart Home Assistant

#### Manual Installation

1. Download the latest release
2. Copy the `custom_components/nidia_dashboard_composer` directory to your Home Assistant `custom_components` folder
3. Restart Home Assistant

### Usage

1. **Enable in configuration.yaml**:
   ```yaml
   nidia_dashboard_composer:
   ```
   
2. **Restart Home Assistant**

3. After restart, look for **"Nidia Dashboard Composer"** in your Home Assistant sidebar

4. Click on it to open the configuration panel

5. **Configure Tab**: Select which modules you want to include

6. **Generate Tab**: Click "Generate Dashboard" to create your dashboard

7. **Test Tab** (for developers): Test with predefined scenarios

## 📚 Documentation

- **[Developer Guide](DEVELOPER.md)**: Detailed development instructions
- **[Architecture](ARCHITECTURE.md)**: System design and architecture

## 🧩 Available Modules

- **🔆 Lights**: Automatically grouped by area
- **🌡️ Climate**: Thermostats and climate controls
- **📺 Media**: Media players
- **⚡ Energy**: Energy monitoring and solar
- _More modules coming soon!_

## 🧪 Testing

### Running Tests

```bash
# Install test dependencies
pip install -r requirements_test.txt

# Run tests
pytest tests/
```

### Using the Test Harness

The integration includes an internal testing module accessible from the "Test" tab:

1. Select a test scenario (e.g., "Small Home", "Energy Home")
2. Click the test button
3. View the generated dashboard JSON and internal model

## 🛠️ Development

> **⚠️ IMPORTANT**: Before committing changes, **ALWAYS run tests**!  
> See [DEVELOPMENT_WORKFLOW.md](DEVELOPMENT_WORKFLOW.md) for mandatory testing requirements.

### Building the Frontend

```bash
cd frontend
npm install
npm run build
```

The build output will be placed in `custom_components/nidia_dashboard_composer/www/`.

### Adding a New Module

1. Create a file in `custom_components/nidia_dashboard_composer/generator/modules/`
2. Implement the module class:

```python
from ..types import ModuleResult, EntityInfo

class MyModule:
    @staticmethod
    def generate(entities: list[EntityInfo], config: dict) -> ModuleResult:
        cards = [...]  # Create your cards
        return ModuleResult(cards=cards, view_title="My Module")
```

3. Register in `modules/__init__.py`
4. Add domain mapping in `engine.py`

See [DEVELOPER.md](DEVELOPER.md) for more details.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

Built with ❤️ for the Home Assistant community.

- Uses [Lit](https://lit.dev/) for frontend components
- Built with [Vite](https://vitejs.dev/)
- Tested with [pytest](https://pytest.org/)

## 📬 Support

- **Issues**: [GitHub Issues](https://github.com/antbald/nidia-dashboard-composer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/antbald/nidia-dashboard-composer/discussions)

---

**Note**: This is an early version. Features and API may change. Feedback and contributions are highly appreciated!


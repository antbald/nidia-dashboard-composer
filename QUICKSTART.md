# 🚀 Quick Start Guide

## Getting Started in 5 Minutes

### Step 1: Build the Frontend
```bash
cd frontend
npm install
npm run build
cd ..
```

### Step 2: Install Test Dependencies (Optional)
```bash
pip install -r requirements_test.txt
```

### Step 3: Run Tests (Optional)
```bash
# Run all tests
pytest tests/ -v

# Run specific test
pytest tests/test_generator.py -v
```

### Step 4: Install in Home Assistant

**Method 1: Symlink (Development)**
```bash
# Replace with your HA config path
ln -s $(pwd)/custom_components/nidia_dashboard_composer \
      ~/homeassistant/custom_components/
```

**Method 2: Copy (Production)**
```bash
# Replace with your HA config path
cp -r custom_components/nidia_dashboard_composer \
      ~/homeassistant/custom_components/
```

### Step 5: Restart Home Assistant

After HA restarts, you should see "Nidia Dashboard Composer" in your sidebar!

## Using the Integration

### Configure Tab
1. Select modules you want (Light, Climate, Media, Energy)
2. Click "Save Configuration"

### Generate Tab
1. Click "Generate Dashboard"
2. View the generated Lovelace configuration

### Test Tab (Developers)
1. Click "Test: Small Home" or any scenario
2. View the full test results including mock data

## Troubleshooting

### Frontend doesn't load
- Make sure you ran `npm run build` in the frontend directory
- Check that `custom_components/nidia_dashboard_composer/www/nidia-dashboard-composer-panel.js` exists
- Clear browser cache (Ctrl+Shift+R)

### Panel doesn't appear
- Check HA logs for errors
- Verify the integration loaded: Settings → System → Logs
- Make sure you restarted HA after copying files

### Tests fail
- Install test dependencies: `pip install -r requirements_test.txt`
- Make sure you're in the project root when running pytest

## What's Next?

- **Read DEVELOPER.md** to learn how to add modules
- **Read ARCHITECTURE.md** to understand the system design
- **Add your own test scenarios** in `testing/scenarios/`
- **Customize modules** to fit your needs

## Quick File Reference

| File | Purpose |
|------|---------|
| `custom_components/.../api.py` | WebSocket API handlers |
| `custom_components/.../generator/engine.py` | Dashboard generation logic |
| `custom_components/.../generator/modules/` | Module implementations |
| `frontend/src/components/App.ts` | Main UI component |
| `tests/` | All tests |

## Commands Cheat Sheet

```bash
# Frontend
cd frontend && npm install && npm run build

# Tests
pytest tests/ -v
pytest tests/test_generator.py::test_generator_basic -v

# Install in HA (example paths)
ln -s $(pwd)/custom_components/nidia_dashboard_composer ~/.homeassistant/custom_components/

# Check what's been built
ls -la custom_components/nidia_dashboard_composer/www/

# Count lines of code
find custom_components tests frontend/src -name "*.py" -o -name "*.ts" | xargs wc -l
```

Happy coding! 🎉

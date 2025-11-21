# Installation Guide for Home Assistant

## 📦 Installation Methods

### Method 1: HACS (Recommended)

#### Adding as Custom Repository

1. **Open HACS** in your Home Assistant instance
   
2. **Navigate to Integrations**
   - Click on "HACS" in the sidebar
   - Select "Integrations"

3. **Add Custom Repository**
   - Click the three dots (⋮) in the top right corner
   - Select "Custom repositories"
   
4. **Enter Repository Details**
   - Repository URL: `https://github.com/antbald/nidia-dashboard-composer`
   - Category: Select "Integration"
   - Click "Add"

5. **Install the Integration**
   - Search for "Nidia Dashboard Composer" in HACS
   - Click "Download"
   - Restart Home Assistant

6. **Access the Panel**
   - After restart, look for "Nidia Dashboard Composer" in your sidebar
   - Click to open the panel

### Method 2: Manual Installation

1. **Download the Latest Release**
   ```bash
   cd /config  # Your Home Assistant config directory
   wget https://github.com/antbald/nidia-dashboard-composer/archive/refs/tags/v0.1.0.tar.gz
   tar -xzvf v0.1.0.tar.gz
   ```

2. **Copy Integration Files**
   ```bash
   cp -r nidia-dashboard-composer-0.1.0/custom_components/nidia_dashboard_composer custom_components/
   ```

3. **Restart Home Assistant**
   - Settings → System → Restart

4. **Verify Installation**
   - Check sidebar for "Nidia Dashboard Composer"

## ✅ Post-Installation

### Verify the Panel Loaded

1. Open Home Assistant
2. Look for "🎨 Nidia Dashboard Composer" in the sidebar
3. Click to open the configuration panel

### First Steps

1. **Configure Tab**
   - Select which modules you want (Light, Climate, Media, Energy)
   - Click "Save Configuration"

2. **Generate Tab**
   - Click "Generate Dashboard"
   - View the generated Lovelace configuration

3. **Test Tab** (Optional for Developers)
   - Test with predefined scenarios
   - View mock data and results

## 🐛 Troubleshooting

### Panel Doesn't Appear

**Check Integration Loaded**
```bash
# In Home Assistant logs (Settings → System → Logs)
# Look for: "Setting up Nidia Dashboard Composer"
```

**Verify Files**
```bash
ls -la /config/custom_components/nidia_dashboard_composer/
# Should show: __init__.py, manifest.json, www/ directory
```

**Clear Browser Cache**
- Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
- This forces reload of the frontend panel

### Panel Loads but Shows Errors

**Check Browser Console**
- Press `F12` to open Developer Tools
- Look for JavaScript errors

**Verify Frontend Build**
```bash
ls -la /config/custom_components/nidia_dashboard_composer/www/
# Should show: nidia-dashboard-composer-panel.js
```

### No Entities Found

The generator discovers entities automatically. If no dashboard is generated:
- Ensure you have entities in Home Assistant
- Check that entities are assigned to areas (Settings → Areas)
- Verify entity domains match module types (light, climate, media_player, sensor)

## 🔄 Updating

### Via HACS
1. HACS → Integrations
2. Find "Nidia Dashboard Composer"
3. Click "Update"
4. Restart Home Assistant

### Manual Update
1. Delete old integration: `rm -rf custom_components/nidia_dashboard_composer`
2. Download new version
3. Copy files as in initial installation
4. Restart Home Assistant

## 🆘 Getting Help

- **Issues**: [GitHub Issues](https://github.com/antbald/nidia-dashboard-composer/issues)
- **Documentation**: See [README.md](README.md) and [DEVELOPER.md](DEVELOPER.md)
- **Community**: [Home Assistant Community Forum](https://community.home-assistant.io/)

## 📋 System Requirements

- Home Assistant Core 2024.1.0 or newer
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Entities configured in Home Assistant

## ⚙️ Configuration

The integration automatically loads and creates a sidebar panel. No configuration.yaml entry needed.

All settings are managed through the frontend panel.

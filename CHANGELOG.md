# Release Notes

## Version 0.6.1 - Smart Area ID Matching (2025-12-16)

### 🎯 Major Fix: Automatic Area ID Mismatch Resolution

This release solves a critical issue where dashboards wouldn't generate when configured area IDs didn't match the actual IDs in Home Assistant.

#### 🔧 Smart Area ID Fuzzy Matching
- **Automatic ID normalization**: Removes spaces, underscores, hyphens, and applies lowercase
- **Intelligent matching**: Finds correct area IDs even when configuration uses different formats
- **Auto-correction**: Automatically resolves mismatches and logs corrections
- **Clear warnings**: Notifies you when auto-corrections happen with suggestions

**Examples of automatic resolution:**
- `camera_da_letto` → `cameradaletto` ✅
- `Camera da Letto` → `cameradaletto` ✅
- `vano_tecnico` → `vanotecnico` ✅
- `Camera-Matrimoniale` → `cameramatrimoniale` ✅

#### 📊 Enhanced Logging
- **Area ID comparison**: Shows configured IDs vs actual system IDs
- **Auto-correction tracking**: Logs each ID that gets auto-corrected
- **Mismatch detection**: Warns when areas can't be matched
- **Helpful suggestions**: Provides correct IDs to update configuration

#### 🛡️ Safety & Fallbacks
- Non-matching areas are skipped safely without breaking generation
- Exact ID matches are used first (no performance impact for correct configs)
- Empty array `[]` still works to include all areas

#### 🔍 Improved Error Messages
- Explicit mention of possible Area ID mismatch
- Shows available areas when possible
- Suggests using `[]` to include all areas
- More detailed debug information

#### 🧪 Testing
- New test suite: `tests/test_area_matching.py`
- Validates 10+ normalization scenarios
- All tests passing ✅

#### 📚 Documentation
- **AREA_ID_FIX.md**: Complete guide to the fuzzy matching system
- **AREA_ID_RESOLUTION_SUMMARY.md**: Technical implementation details
- **check_area_ids.py**: Utility to verify area IDs in your system

### 🐛 Bug Fixes
- Fixed issue where 0 entities were discovered due to area ID mismatch
- Resolved dashboard not generating rooms despite devices being assigned to areas

### 💡 Use Case
**Problem**: You configured:
```json
{"areas": ["camera_da_letto", "vano_tecnico"]}
```
But your system has: `["cameradaletto", "vanotecnico"]`

**Before v0.6.1**: 0 entities found, dashboard empty  
**After v0.6.1**: Auto-corrected, dashboard generates correctly! 🎉

### 🎁 Benefits
- ✅ Works "out of the box" with common configuration mistakes
- ✅ No need to manually check area IDs
- ✅ Clear logging explains what's happening
- ✅ Backward compatible with existing configurations
- ✅ Self-healing for minor configuration errors

---

## Version 0.6.0 - Enhanced Diagnostics (2025-12-16)

### 🔍 Diagnostic & Debugging Features

This release focuses on improving troubleshooting capabilities when the dashboard doesn't generate properly.

#### Enhanced Logging
- **Comprehensive Entity Discovery Logging**: Track entity discovery with detailed statistics
  - Areas available vs selected
  - Total entities examined, filtered, and without state
  - Distribution by domain and area
- **Module Mapping Insights**: See exactly which entities go to which modules
  - Enabled modules list
  - Domain to module mapping
  - Unmapped domains detection
- **View Generation Tracking**: Monitor the view creation process
  - Module results (type, title, sections, cards)
  - View type (sections vs traditional)
  - Final view count

#### RoomsModule Diagnostics
- **Parameter Tracking**: Log entities received via both parameters
- **Area Grouping Details**: See how entities are grouped into rooms
  - Number of areas identified
  - Entities without area assignment
  - Room list with entity counts
- **Card Generation Stats**: Track cards generated per room and total

#### Debug Tools
- **`debug_config.py`**: Automated configuration verification script
  - Checks storage file validity
  - Verifies module "home" is enabled
  - Lists available areas in Home Assistant
  - Shows entity distribution by area and domain
  - Identifies entities without area assignment
- **`DEBUG_GUIDE.md`**: Comprehensive troubleshooting guide
  - All logging points documented
  - Step-by-step diagnostic procedures
  - Critical log messages to search for
  - Common problems and solutions
- **`ANALYSIS_SUMMARY.md`**: Technical analysis summary

#### User Experience Improvements
- **Better Error Messages**: When no rooms are found, display helpful message with:
  - Possible causes
  - Debug information (entity count, area filter)
  - Clear instructions to resolve

### 🐛 Bug Fixes
- Improved detection of entities without area assignment
- Better handling of empty configuration scenarios

### 📚 Documentation
- Added comprehensive debug documentation
- Technical notes on RoomsModule architecture
- Troubleshooting flowcharts and procedures

### 🎯 Use Cases
This release is perfect for:
- New installations where rooms don't appear
- Troubleshooting configuration issues
- Understanding entity-to-module mapping
- Verifying area assignments

---

## Version 0.1.0 - Initial Release (2025-11-21)

### 🎉 First Public Release

This is the initial release of **Nidia Dashboard Composer**, a Home Assistant custom integration for automatically generating Lovelace dashboards.

### ✨ Features

#### Core Functionality
- **Dashboard Generation Engine**: Automatically creates Lovelace dashboards based on user preferences
- **Entity Discovery**: Scans Home Assistant for entities and maps them to modules
- **Modular Architecture**: Easy to extend with new modules

#### Available Modules
- **🔆 Light Module**: Groups lights by area
- **🌡️ Climate Module**: Creates thermostat cards
- **📺 Media Module**: Generates media player controls
- **⚡ Energy Module**: Energy monitoring and statistics

#### Frontend
- **Configuration Panel**: Accessible from HA sidebar
- **3-Tab Interface**: Configure, Generate, Test
- **Module Selection**: Enable/disable modules via checkboxes
- **Dashboard Preview**: View generated JSON
- **Developer Test Mode**: Run test scenarios with mock data

#### Testing
- **Test Harness**: Internal testing system with scenario loading
- **3 Built-in Scenarios**:
  - `small_home`: Basic apartment setup
  - `energy_home`: Energy-focused configuration
  - `media_home`: Media-heavy setup
- **pytest Suite**: Automated tests for all core components

#### Developer Experience
- **TypeScript Frontend**: Type-safe frontend with Lit
- **Type Annotations**: Python TypedDicts for internal models
- **Extensible Design**: Add modules with minimal code
- **Comprehensive Docs**: README, DEVELOPER, ARCHITECTURE guides

### 🏗️ Technical Stack

**Backend**
- Python 3.11+
- Home Assistant 2024.1.0+
- WebSocket API (4 commands)

**Frontend**
- TypeScript 5.3+
- Lit 3.1+
- Vite 5.0+

**Testing**
- pytest 7.4+
- pytest-asyncio 0.21+

### 📋 Installation

See [QUICKSTART.md](QUICKSTART.md) for installation instructions.

### 🐛 Known Issues

- No area selection UI (coming in v0.2.0)
- Dashboard saving to HA not implemented (preview only)
- No theme/layout customization UI
- No translations (English only)

### 🚀 Future Plans

#### v0.2.0 (Planned)
- [ ] Area selection UI
- [ ] Dashboard saving to HA
- [ ] More modules (Security, Presence, Automation)
- [ ] Theme customization
- [ ] Layout options (grid, masonry)

#### v0.3.0 (Planned)
- [ ] Translations (i18n)
- [ ] Config flow setup
- [ ] Advanced module configuration
- [ ] Card customization options

### 🙏 Credits

Created by Antonio Baldassarre for the Home Assistant community.

### 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

**Full Changelog**: https://github.com/antoniobaldassarre/nidia-dashboard-composer/commits/v0.1.0

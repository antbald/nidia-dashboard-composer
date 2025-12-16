# Release Notes

## Version 0.7.0 - Device Area Inheritance (2025-12-16)

### 🚀 Major Feature: Device-to-Entity Area Inheritance

This release fixes a critical limitation where entities that inherit their area from their parent device were being incorrectly filtered out during discovery.

#### 🐛 Problem Solved

**Previous Behavior:**
- Only entities with direct `area_id` were discovered
- Entities inheriting area from their device were invisible
- Result: Missing entities in dashboards, "Nessuna Area Trovata" errors
- Affected: Zigbee, Z-Wave, and most device-based integrations

**Root Cause:**
Home Assistant uses a hierarchical model where entities can inherit `area_id` from their parent device. Previous code only checked `entity.area_id`, missing inherited areas.

**Evidence:** User logs showed `Encountered area IDs in system: []` even though devices were assigned to areas.

#### ✅ Solution in v0.7.0

**Device Area Inheritance:**
- Loads device registry to build `device_id → area_id` mapping
- Resolves entity area with fallback logic:
  1. Use direct `entity.area_id` if present (most specific)
  2. Fall back to `device.area_id` if entity has device
  3. Return None if neither exists
- Updates both filtering and EntityInfo population

**Resolution Priority:**
```python
resolved_area_id = entity.area_id or device_area_map.get(entity.device_id)
```

#### 📊 Statistics & Logging

New detailed logging shows inheritance breakdown:
```
INFO: Discovery complete: 87 entities found
INFO: Area assignment breakdown: 12 direct, 75 inherited from device, 0 without area
DEBUG: Built device-to-area mapping: 45 devices with areas
```

#### 🎯 Impact

**Before v0.7.0:**
```
Discovery complete: 0 entities found
Encountered area IDs in system: []
Result: "Nessuna Area Trovata" error
```

**After v0.7.0:**
```
Discovery complete: 87 entities found
Area assignment breakdown: 12 direct, 75 inherited from device, 0 without area
Encountered area IDs: ['camera_da_letto', 'cucina', 'soggiorno', ...]
Result: Dashboard displays correctly with all entities
```

#### 🛡️ Edge Cases Handled

1. **Standalone entities** (no device): Uses direct area_id only
2. **Device without area**: Graceful fallback to None
3. **Both entity and device have area**: Entity area wins (more specific)
4. **Empty area filter**: All entities included regardless of area
5. **Non-existent device**: Safe dictionary lookup, no errors

#### 🧪 Testing

- New comprehensive test suite: `tests/test_device_inheritance.py`
- 4 new tests covering inheritance, precedence, filtering, edge cases
- All 28 tests passing ✅
- Backward compatible with existing tests

#### 🔧 Files Modified

- `engine.py`: Added device registry loading, resolution logic, enhanced logging
- `test_device_inheritance.py`: New comprehensive test suite
- `conftest.py`: Added device_registry fixture

#### 🎁 Benefits

- ✅ Discovers all entities (direct + inherited areas)
- ✅ Fixes "Nessuna Area Trovata" error for device-based entities
- ✅ Maintains backward compatibility
- ✅ Zero breaking changes
- ✅ Detailed diagnostics and logging
- ✅ O(1) performance per entity
- ✅ Handles all edge cases gracefully

#### 💡 For Users

If you were seeing "Nessuna Area Trovata" errors, this release will fix it! After updating:
1. Reload the Nidia Dashboard Composer integration
2. Generate the dashboard again
3. Your entities should now appear correctly grouped by area

---

## Version 0.6.3 - Area Name Display Fix (2025-12-16)

### 🎯 Major Fix: Correct Area Names in Dashboard

This release fixes an issue where area names were displayed with incorrect capitalization in the dashboard.

#### 🐛 Problem Description
**Previous Behavior:**
- Area IDs were correctly matched (thanks to v0.6.2)
- But area names displayed were generated from area_id using fallback logic
- Example: `camera_da_letto` → displayed as "Camera Da Letto" (wrong)
- Correct name in Home Assistant: "Camera da letto"

**Root Cause:**
The `EntityInfo` type only contained `area_id`, not the actual `area_name` from Home Assistant's area registry. Modules had no access to the correct area names.

#### ✅ Solution in v0.6.3
**Enhanced EntityInfo with area_name:**
- Added `area_name` field to `EntityInfo` TypedDict
- Engine now populates `area_name` during entity discovery
- Rooms module uses actual Home Assistant area names for display
- Maintains backward compatibility with fallback logic

**Data Flow:**
1. Engine loads area registry: `{area.id: area.name}`
2. Entity discovery populates both `area_id` and `area_name`
3. Modules receive complete information
4. Dashboard displays correct area names

#### 📊 Result
```
✅ camera_da_letto → displays "Camera da letto" (correct)
✅ cucina → displays "Cucina" (correct)
✅ soggiorno → displays "Soggiorno" (correct)
✅ vano_tecnico → displays "Vano Tecnico" (correct)
```

#### 🛡️ Edge Cases Handled
- Entities without areas: `area_id = None`, `area_name = None`
- Missing area_name field: Falls back to formatted area_id
- Empty area name: Falls back to formatted area_id
- Area ID not in registry: Graceful fallback

#### 🧪 Testing
- New comprehensive test suite: `tests/test_area_names.py`
- Tests for correct name usage, fallback behavior, None handling, multiple areas
- Updated test fixtures with `area_name` field
- All 24 tests passing ✅

#### 🔧 Files Modified
- `types.py`: Added `area_name: str | None` to EntityInfo
- `engine.py`: Populate area_name during entity discovery
- `rooms_module.py`: Use area_name instead of fallback
- `conftest.py`: Updated test fixtures
- `test_area_names.py`: New comprehensive test suite

#### 🎁 Benefits
- ✅ Correct area names matching Home Assistant exactly
- ✅ Proper Italian capitalization (e.g., "Camera da letto" not "Camera Da Letto")
- ✅ Type-safe implementation
- ✅ Backward compatible
- ✅ Zero performance overhead
- ✅ Extensible for other modules

---

## Version 0.6.2 - Critical Bugfix (2025-12-16)

### 🚨 CRITICAL BUGFIX: Area Matching Logic

This release fixes a critical bug in v0.6.1 where area IDs with underscores (e.g., `camera_da_letto`) would not match correctly, resulting in 0 entities discovered and empty dashboards.

#### 🐛 Bug Description
**Problem in v0.6.1:**
- System had area IDs like: `camera_da_letto`, `vano_tecnico`
- User configured same IDs: `["camera_da_letto", "vano_tecnico"]`
- Result: ❌ **0 entities found, dashboard empty**

**Root Cause:**
The lookup dictionary only mapped normalized versions (without underscores), missing exact ID matches. When an exact match failed, the fuzzy match tried to find the normalized version which also failed.

#### ✅ Solution in v0.6.2
**Comprehensive Multi-Level Lookup:**
Now creates a 3-level mapping for each area:
1. **Exact ID** → area_id (e.g., `camera_da_letto` → `camera_da_letto`)
2. **Normalized ID** → area_id (e.g., `cameradaletto` → `camera_da_letto`)
3. **Normalized Name** → area_id (e.g., `cameradaletto` from "Camera da letto" → `camera_da_letto`)

This ensures ALL variations match correctly.

#### 📊 Validation
```
✅ 'camera_da_letto' → match (exact)
✅ 'cameradaletto' → match (normalized ID)
✅ 'Camera da Letto' → match (normalized name)
✅ 'vano_tecnico' → match (exact)
✅ 'vanotecnico' → match (normalized ID)
```

#### 🔍 Enhanced Logging
New detailed error messages when areas can't be resolved:
- Shows configured areas vs available area IDs
- Shows available area names for reference
- Suggests using `[]` to include all areas
- Reports normalized versions attempted

#### 🎯 Impact
- **Fixes**: Dashboards not generating with underscore area IDs
- **Ensures**: All area ID formats work correctly
- **Maintains**: Full backward compatibility

### 🧪 Testing
- New test suite: `tests/test_area_lookup.py`
- Validates comprehensive lookup logic
- All tests passing ✅

### 📚 Documentation
- **BUGFIX_0.6.2.md**: Complete bug analysis and solution

---

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

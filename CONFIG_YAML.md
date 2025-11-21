# Configuration.yaml Entry

Add this to your Home Assistant `configuration.yaml`:

```yaml
nidia_dashboard_composer:
```

That's it! Just add those two lines.

## Complete Setup Steps

1. **Edit configuration.yaml**:
   ```bash
   # SSH into your Home Assistant or use the File Editor add-on
   nano /config/configuration.yaml
   ```

2. **Add the integration**:
   ```yaml
   # At the end of the file, add:
   nidia_dashboard_composer:
   ```

3. **Save the file**

4. **Restart Home Assistant**:
   - Settings → System → Restart

5. **Check the sidebar**:
   - After restart, look for "Nidia Dashboard Composer" with 🎨 icon

## Verification

After restart, check the logs (Settings → System → Logs):
- Look for: `"Setting up Nidia Dashboard Composer"`
- Should see: `"Nidia Dashboard Composer panel loaded"`

No errors should appear.

## Why This is Needed

The integration has `"config_flow": false` in manifest.json, which means:
- ❌ Cannot be added via UI (Settings → Devices & Services → Add Integration)
- ✅ Must be enabled in configuration.yaml
- ✅ Loads automatically on HA startup
- ✅ No configuration needed (just the entry is enough)

This is intentional because the integration:
- Has no setup wizard
- Requires no configuration parameters
- Just registers a frontend panel
- All configuration is done in the panel UI

## Troubleshooting

### Panel still doesn't appear?

Check the logs for errors:
```
Settings → System → Logs
Filter: "nidia"
```

### Check files are installed:
```bash
ls -la /config/custom_components/nidia_dashboard_composer/
# Should show:
# __init__.py
# manifest.json
# www/nidia-dashboard-composer-panel.js
```

### Clear browser cache:
Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)

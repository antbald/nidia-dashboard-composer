# Frontend Loading Troubleshooting

## How HACS Loads Frontend Files

When HACS installs an integration with a `www/` directory:

1. **HACS copies www/ files** to:
   ```
   /config/www/community/nidia_dashboard_composer/
   ```

2. **Files are accessible** at:
   ```
   http://homeassistant.local:8123/hacsfiles/nidia_dashboard_composer/nidia-dashboard-composer-panel.js
   ```

3. **The integration loads** the panel using this URL

## Verification Steps

### 1. Check if www files were copied by HACS

```bash
ls -la /config/www/community/nidia_dashboard_composer/
```

You should see:
```
nidia-dashboard-composer-panel.js
```

### 2. Check if file is accessible

Open in browser:
```
http://YOUR_HA_IP:8123/hacsfiles/nidia_dashboard_composer/nidia-dashboard-composer-panel.js
```

You should see JavaScript code (not a 404 error).

### 3. Check Home Assistant logs

Settings → System → Logs, look for:
```
Nidia Dashboard Composer panel registered with module_url: /hacsfiles/nidia_dashboard_composer/nidia-dashboard-composer-panel.js
```

## Common Issues

### Issue 1: www/ folder not copied by HACS

**Solution**: 
1. Remove the integration from HACS
2. Delete `/config/www/community/nidia_dashboard_composer/` if it exists
3. Re-install via HACS
4. Restart Home Assistant

### Issue 2: File returns 404

**Cause**: HACS didn't copy the files

**Solution**:
```bash
# Manual copy
cp -r /config/custom_components/nidia_dashboard_composer/www/* \
      /config/www/community/nidia_dashboard_composer/
```

### Issue 3: Panel doesn't load

**Check browser console** (F12):
- Look for errors loading the JavaScript file
- Check Network tab for failed requests

**Clear browser cache**:
- Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)

## Manual Installation Path

If you installed manually (not via HACS), the panel expects files at:
```
/hacsfiles/nidia_dashboard_composer/nidia-dashboard-composer-panel.js
```

Which means you need to manually create the symlink or copy:
```bash
mkdir -p /config/www/community/nidia_dashboard_composer
cp /config/custom_components/nidia_dashboard_composer/www/* \
   /config/www/community/nidia_dashboard_composer/
```

## HACS Logs

To see what HACS is doing:

Settings → System → Logs
Filter: "hacs"

Look for messages about copying files.

## After Update

When you update the integration:
1. HACS should automatically update `/config/www/community/` files
2. You may need to hard-refresh the browser (`Ctrl+Shift+R`)
3. Check that the new file is there:
   ```bash
   stat /config/www/community/nidia_dashboard_composer/nidia-dashboard-composer-panel.js
   ```

## Alternative: Use lovelace_gen

If problems persist, you can use lovelace_gen to load resources:

Edit `configuration.yaml`:
```yaml
lovelace:
  mode: yaml
  resources:
    - url: /hacsfiles/nidia_dashboard_composer/nidia-dashboard-composer-panel.js
      type: module
```

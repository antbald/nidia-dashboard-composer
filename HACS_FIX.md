# 🔧 HACS Installation Fix

## ✅ Problema Risolto

L'errore HACS è stato risolto modificando `hacs.json` da `zip_release: true` a `zip_release: false`.

### Causa del Problema

HACS cercava di scaricare un file zip da:
```
https://github.com/antbald/nidia-dashboard-composer/releases/download/9f035fc/nidia_dashboard_composer.zip
```

Ma non avevamo creato una release con asset zip, solo un tag.

### Soluzione Applicata

Modificato `hacs.json` per usare il clone diretto del repository invece del download zip:

```json
{
  "name": "Nidia Dashboard Composer",
  "content_in_root": false,
  "zip_release": false,  // ← Cambiato da true a false
  "render_readme": true,
  "homeassistant": "2024.1.0"
}
```

## 📥 Nuove Istruzioni di Installazione

### In HACS

1. **Rimuovi la repository** se l'hai già aggiunta:
   - HACS → Integrations
   - Cerca "Nidia Dashboard Composer"
   - Se presente, rimuovila

2. **Aggiungi di nuovo come Custom Repository**:
   - HACS → Integrations → ⋮ → Custom repositories
   - URL: `https://github.com/antbald/nidia-dashboard-composer`
   - Category: Integration
   - Click "Add"

3. **Installa l'integrazione**:
   - Cerca "Nidia Dashboard Composer"
   - Click "Download"
   - Aspetta il download (HACS clonerà il repository)
   - Riavvia Home Assistant

4. **Verifica**:
   - Dopo il riavvio, cerca "Nidia Dashboard Composer" nella sidebar
   - Apri il pannello

### Cosa Fa HACS Ora

Con `zip_release: false`, HACS:
- ✅ Clona il repository GitHub direttamente
- ✅ Copia `custom_components/nidia_dashboard_composer/` nella tua installazione HA
- ✅ Gestisce gli aggiornamenti tramite git pull

Questo è il metodo standard e più affidabile per le custom integration.

## ⚠️ Note Importanti

### Se l'installazione precedente era parziale:

1. **Pulisci la cache HACS** (opzionale):
   ```bash
   rm -rf /config/.storage/hacs*
   ```

2. **Riavvia Home Assistant** dopo aver rimosso e re-aggiunto la repository

### Alternative di Installazione

Se preferisci NON usare HACS, puoi installare manualmente:

**Metodo 1: Script automatico**
```bash
curl -sSL https://raw.githubusercontent.com/antbald/nidia-dashboard-composer/main/install.sh | bash
```

**Metodo 2: Git clone manuale**
```bash
cd /config/custom_components
git clone https://github.com/antbald/nidia-dashboard-composer.git temp
mv temp/custom_components/nidia_dashboard_composer ./
rm -rf temp
```

**Metodo 3: Download manuale**
1. Vai a https://github.com/antbald/nidia-dashboard-composer
2. Click "Code" → "Download ZIP"
3. Estrai e copia `custom_components/nidia_dashboard_composer/` in `/config/custom_components/`

Tutti i metodi richiedono un **riavvio di Home Assistant** dopo l'installazione.

## ✅ Verifica Installazione

Dopo il riavvio, verifica:

1. **Controlla i log** (Settings → System → Logs):
   - Cerca "Setting up Nidia Dashboard Composer"
   - Non dovrebbero esserci errori

2. **Verifica i file**:
   ```bash
   ls -la /config/custom_components/nidia_dashboard_composer/
   ```
   Dovresti vedere:
   - `__init__.py`
   - `manifest.json`
   - `www/` directory con `nidia-dashboard-composer-panel.js`

3. **Controlla la sidebar**:
   - Cerca l'icona "🎨 Nidia Dashboard Composer"
   - Click per aprire il pannello

## 🐛 Risoluzione Problemi

### Errore: "Panel doesn't load"
- Pulisci la cache del browser (Ctrl+Shift+R)
- Verifica che `www/nidia-dashboard-composer-panel.js` esista

### Errore: "Integration not found"
- Verifica che la directory sia in `/config/custom_components/`
- Controlla i permessi dei file
- Riavvia Home Assistant

### HACS mostra ancora errori
- Rimuovi completamente l'integrazione da HACS
- Riavvia HA
- Re-aggiungi come custom repository

## 🎉 Dopo l'Installazione

Una volta installato e riavviato:

1. **Apri il pannello** dalla sidebar
2. **Tab Configure**: Seleziona i moduli (Light, Climate, etc.)
3. Click **"Save Configuration"**
4. **Tab Generate**: Click **"Generate Dashboard"**
5. Visualizza il JSON generato!

Enjoy! 🏠🎨

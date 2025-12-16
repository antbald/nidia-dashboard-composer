# 🎉 Versione 0.6.0 Pubblicata!

## ✅ Release Pubblicata con Successo

La nuova versione **v0.6.0** è ora disponibile su GitHub e può essere aggiornata tramite HACS.

### 🔗 Link alla Release
https://github.com/antbald/nidia-dashboard-composer/releases/tag/v0.6.0

## 📦 Come Aggiornare tramite HACS

### Metodo 1: Aggiornamento Automatico
1. Apri **HACS** in Home Assistant
2. Vai su **Integrazioni**
3. Cerca **Nidia Dashboard Composer**
4. Clicca su **Update** se disponibile
5. Riavvia Home Assistant

### Metodo 2: Aggiornamento Manuale
Se HACS non rileva automaticamente l'aggiornamento:
1. Vai su **HACS** → **Integrazioni**
2. Clicca sui tre puntini in alto a destra
3. Seleziona **Repository personalizzati**
4. Cerca `nidia-dashboard-composer`
5. Clicca su **Ricarica**
6. Poi clicca su **Update**
7. Riavvia Home Assistant

## 🔍 Cosa Include Questa Release

### Funzionalità di Diagnostica
- **Logging Completo**: Traccia tutto il processo di generazione
- **Script di Debug**: `debug_config.py` per verificare la configurazione
- **Guida alla Risoluzione**: Documentazione completa in `DEBUG_GUIDE.md`
- **Messaggi di Errore Migliorati**: Indicazioni chiare su come risolvere i problemi

### Strumenti Aggiunti
1. **debug_config.py** - Verifica automatica della configurazione
2. **DEBUG_GUIDE.md** - Guida completa al troubleshooting
3. **ANALYSIS_SUMMARY.md** - Analisi tecnica del sistema

## 🎯 Per Risolvere il Tuo Problema

Dopo aver aggiornato, segui questi passi:

### 1. Abilita i Log di Debug
Aggiungi in `configuration.yaml`:
```yaml
logger:
  logs:
    custom_components.nidia_dashboard_composer: debug
```

### 2. Riavvia Home Assistant

### 3. Genera la Dashboard
Vai al pannello Nidia Dashboard Composer e genera la dashboard.

### 4. Controlla i Log
Vai su **Impostazioni** → **Sistema** → **Log** e cerca messaggi da `nidia_dashboard_composer`.

I log ti diranno **esattamente** cosa sta succedendo:
- Quante entità vengono scoperte
- Come vengono distribuite per area
- Quante stanze vengono identificate
- Quante cards vengono generate
- Se e perché le view non vengono create

### 5. Opzione Alternativa: Script Diagnostico
```bash
# Dalla directory /config di Home Assistant
cd /config
python3 custom_components/nidia_dashboard_composer/../../debug_config.py
```

## 📊 Cosa Cercare nei Log

### ✅ Log di Successo
```
INFO: Discovery complete: 150 entities found
INFO: Grouped entities into 5 areas
INFO: Generating cards for 5 rooms
INFO: Module 'home' generated result: sections count: 1
INFO: Dashboard generation complete. Total views: 1
```

### ⚠️ Possibili Problemi
```
INFO: Discovery complete: 0 entities found
```
→ Problema con filtro aree o configurazione

```
INFO: Grouped entities into 0 areas (150 entities without area)
```
→ Le entità non hanno area_id assegnata

## 🆘 Supporto

Se dopo l'aggiornamento il problema persiste:
1. Condividi i log generati
2. Esegui lo script `debug_config.py` e condividi l'output
3. Verifica che le entità abbiano area_id in **Strumenti per sviluppatori** → **Stati**

---

**Data Release**: 16 Dicembre 2025  
**Versione**: 0.6.0  
**Commit**: 83f0d78

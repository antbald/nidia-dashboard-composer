# Guida al Debug del Nidia Dashboard Composer

## Modifiche Applicate

Ho aggiunto logging dettagliato in tutti i punti chiave del processo di generazione:

### 1. Engine - Discovery delle Entità (`engine.py`)
**Linea ~92-146**: Logging della discovery
- Aree selezionate nella configurazione
- Aree disponibili in Home Assistant
- Numero totale di entità esaminate
- Quante entità filtrate per area
- Quante entità senza stato
- Distribuzione per dominio
- Distribuzione per area

### 2. Engine - Mapping ai Moduli (`engine.py`)
**Linea ~158-175**: Logging del mapping
- Moduli abilitati nella configurazione
- Mappa dominio → modulo
- Domini senza mapping
- Numero di entità per ogni modulo

### 3. Engine - Generazione delle View (`engine.py`)
**Linea ~54-80**: Logging della generazione view
- Risultato di ogni modulo (tipo, titolo, sezioni, cards)
- Tipo di view aggiunta (sections vs traditional)
- Numero totale di views generate

### 4. RoomsModule - Generazione Stanze (`rooms_module.py`)
**Linea ~15-27**: Logging dei parametri ricevuti
- Quante entità ricevute come primo parametro
- Quante entità ricevute come `all_entities`
- Quale set viene utilizzato

**Linea ~35-50**: Logging del raggruppamento
- Numero di aree identificate
- Numero di entità senza area
- Lista delle stanze con conteggio entità
- Se non ci sono stanze, mostra info di debug

**Linea ~56-62**: Logging della generazione cards
- Quante stanze vengono processate
- Quante cards totali generate

## Come Diagnosticare il Problema

### Passo 1: Abilita i Log di Debug
In Home Assistant, vai su:
- **Impostazioni** → **Sistema** → **Log**
- Oppure modifica `configuration.yaml`:

```yaml
logger:
  default: info
  logs:
    custom_components.nidia_dashboard_composer: debug
```

### Passo 2: Verifica la Configurazione Salvata

Controlla quale configurazione è salvata:

**File di storage:** `.storage/nidia_dashboard_composer`

Verifica che contenga:
```json
{
  "areas": [...],  // Lista degli ID delle aree (o vuota per includere tutte)
  "modules": ["home"],  // Deve includere "home" per generare le stanze
  "background": "none"
}
```

### Passo 3: Genera la Dashboard e Controlla i Log

Dopo aver generato la dashboard, cerca nei log:

#### Log Critici da Verificare:

1. **Discovery started**
   ```
   INFO: Discovery started. Selected areas from config: [...]
   INFO: Available areas in HA: {...}
   ```
   → Verifica che le aree esistano e siano selezionate correttamente

2. **Discovery complete**
   ```
   INFO: Discovery complete: X entities found
   DEBUG: Entities by domain: {...}
   DEBUG: Entities by area: {...}
   ```
   → Verifica che le entità siano state trovate e distribuite nelle aree

3. **Module mapping**
   ```
   INFO: Mapping entities to modules. Enabled modules: ['home']
   INFO: Module 'home' will receive X entities
   ```
   → **IMPORTANTE**: "home" riceverà 0 entità perché non ha mapping dei domini!

4. **RoomsModule called**
   ```
   INFO: RoomsModule.generate called
   INFO:   - entities parameter: 0 items
   INFO:   - all_entities parameter: X items
   INFO: Using source_entities with X items
   ```
   → Verifica che `all_entities` contenga le entità

5. **Grouping by area**
   ```
   INFO: Grouped entities into X areas (Y entities without area)
   DEBUG: Rooms list: [...]
   ```
   → Verifica che le aree siano state identificate

6. **Card generation**
   ```
   INFO: Generating cards for X rooms
   INFO: Generated Y total cards
   ```
   → Verifica che le cards siano state generate

7. **View generation**
   ```
   INFO: Module 'home' generated result:
   INFO:   - view_type: sections
   INFO:   - sections count: X
   ```
   → Verifica che le sezioni siano state create

## Possibili Problemi

### A) Configurazione non salvata correttamente
**Sintomo**: `modules: []` nei log
**Soluzione**: Verifica il file `.storage/nidia_dashboard_composer` e assicurati che contenga `"modules": ["home"]`

### B) Nessuna entità scoperta
**Sintomo**: `Discovery complete: 0 entities found`
**Cause possibili**:
- Filtro aree troppo restrittivo
- Le entità non hanno stato

### C) Entità senza area_id
**Sintomo**: `X entities without area` molto alto
**Soluzione**: Assegna i dispositivi alle aree in HA

### D) View non aggiunta
**Sintomo**: Sezioni generate ma views = 0
**Cause possibili**:
- `result.sections` è vuota nonostante le cards
- Problema nella logica di `view_type`

## Prossimi Passi

1. **Genera la dashboard** nella nuova installazione
2. **Copia i log completi** relativi a `nidia_dashboard_composer`
3. **Condividi i log** per analisi dettagliata
4. **Confronta** con i log dell'installazione funzionante (se possibile)

## Note Tecniche

### Flusso di Generazione
```
1. Coordinator.generate_dashboard()
   ↓
2. DashboardGenerator.generate(config)
   ↓
3. _discover_entities() → Lista di EntityInfo
   ↓
4. _map_entities_to_modules() → {module_name: [entities]}
   ↓
5. Per ogni modulo abilitato:
   - module_class.generate(mapped_ents, config, all_entities)
   ↓
6. Build dashboard con le views generate
```

### Particolarità del RoomsModule
- **Non ha mapping dei domini**: Il modulo "home" non è in `DOMAIN_MODULE_MAP`
- **Riceve tutte le entità**: Via parametro `all_entities` 
- **Fa grouping interno**: Raggruppa per `area_id`

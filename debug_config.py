#!/usr/bin/env python3
"""
Script di test per verificare la configurazione del Nidia Dashboard Composer.
Da eseguire dal container/ambiente di Home Assistant.
"""
import json
import sys
from pathlib import Path

def check_storage():
    """Verifica il file di storage della configurazione."""
    storage_path = Path(".storage/nidia_dashboard_composer")
    
    print("=" * 60)
    print("VERIFICA CONFIGURAZIONE NIDIA DASHBOARD COMPOSER")
    print("=" * 60)
    print()
    
    if not storage_path.exists():
        print("❌ File di storage NON trovato!")
        print(f"   Percorso: {storage_path.absolute()}")
        print()
        print("📋 Azioni da compiere:")
        print("   1. Apri il pannello Nidia Dashboard Composer in HA")
        print("   2. Seleziona almeno un'area")
        print("   3. Seleziona il modulo 'home'")
        print("   4. Salva la configurazione")
        return False
    
    print(f"✅ File di storage trovato: {storage_path.absolute()}")
    print()
    
    try:
        with open(storage_path) as f:
            config = json.load(f)
    except json.JSONDecodeError as e:
        print(f"❌ Errore nel parsing JSON: {e}")
        return False
    except Exception as e:
        print(f"❌ Errore nella lettura del file: {e}")
        return False
    
    print("📄 Contenuto della configurazione:")
    print(json.dumps(config, indent=2))
    print()
    
    # Verifica campi
    issues = []
    
    if "modules" not in config:
        issues.append("Campo 'modules' mancante")
    elif not isinstance(config["modules"], list):
        issues.append("'modules' non è una lista")
    elif len(config["modules"]) == 0:
        issues.append("⚠️  Lista 'modules' è vuota - nessun modulo abilitato!")
    elif "home" not in config["modules"]:
        issues.append("⚠️  Modulo 'home' non presente nella lista dei moduli")
    else:
        print("✅ Modulo 'home' abilitato")
    
    if "areas" not in config:
        issues.append("Campo 'areas' mancante")
    elif not isinstance(config["areas"], list):
        issues.append("'areas' non è una lista")
    else:
        if len(config["areas"]) == 0:
            print("ℹ️  Lista 'areas' vuota - verranno incluse TUTTE le aree")
        else:
            print(f"✅ Filtro aree attivo: {len(config['areas'])} aree selezionate")
            for area_id in config["areas"]:
                print(f"   - {area_id}")
    
    print()
    
    if issues:
        print("⚠️  PROBLEMI RILEVATI:")
        for issue in issues:
            print(f"   - {issue}")
        print()
        return False
    else:
        print("✅ Configurazione valida!")
        print()
        return True

def check_areas():
    """Verifica le aree registrate in Home Assistant."""
    from homeassistant.helpers import area_registry
    from homeassistant.core import HomeAssistant
    
    # Questo funziona solo se eseguito nel contesto di HA
    # In alternativa, possiamo leggere direttamente lo storage
    area_storage = Path(".storage/core.area_registry")
    
    print("=" * 60)
    print("VERIFICA AREE DISPONIBILI")
    print("=" * 60)
    print()
    
    if not area_storage.exists():
        print("❌ Registry delle aree non trovato")
        return
    
    try:
        with open(area_storage) as f:
            area_data = json.load(f)
    except Exception as e:
        print(f"❌ Errore nella lettura del registry: {e}")
        return
    
    areas = area_data.get("data", {}).get("areas", [])
    
    if not areas:
        print("❌ Nessuna area configurata in Home Assistant!")
        print()
        print("📋 Azioni da compiere:")
        print("   1. Vai su Impostazioni > Aree e Zone")
        print("   2. Crea le aree (es. Cucina, Salone, Camera)")
        print("   3. Assegna i dispositivi alle aree")
        return
    
    print(f"✅ Trovate {len(areas)} aree:")
    print()
    for area in areas:
        print(f"   📍 {area.get('name', 'N/A')}")
        print(f"      ID: {area.get('id', 'N/A')}")
        print()

def check_entities():
    """Verifica le entità e la loro assegnazione alle aree."""
    entity_storage = Path(".storage/core.entity_registry")
    
    print("=" * 60)
    print("VERIFICA ENTITÀ")
    print("=" * 60)
    print()
    
    if not entity_storage.exists():
        print("❌ Registry delle entità non trovato")
        return
    
    try:
        with open(entity_storage) as f:
            entity_data = json.load(f)
    except Exception as e:
        print(f"❌ Errore nella lettura del registry: {e}")
        return
    
    entities = entity_data.get("data", {}).get("entities", [])
    
    print(f"Totale entità registrate: {len(entities)}")
    print()
    
    # Statistiche
    with_area = 0
    without_area = 0
    by_domain = {}
    by_area = {}
    
    for ent in entities:
        area_id = ent.get("area_id")
        domain = ent.get("entity_id", "").split(".")[0] if ent.get("entity_id") else "unknown"
        
        if area_id:
            with_area += 1
            by_area[area_id] = by_area.get(area_id, 0) + 1
        else:
            without_area += 1
        
        by_domain[domain] = by_domain.get(domain, 0) + 1
    
    print(f"✅ Entità con area assegnata: {with_area}")
    print(f"⚠️  Entità senza area: {without_area}")
    print()
    
    print("Distribuzione per dominio:")
    for domain, count in sorted(by_domain.items(), key=lambda x: -x[1])[:10]:
        print(f"   - {domain}: {count}")
    print()
    
    if by_area:
        print("Distribuzione per area:")
        for area_id, count in sorted(by_area.items(), key=lambda x: -x[1]):
            print(f"   - {area_id}: {count} entità")
    else:
        print("❌ NESSUNA entità assegnata ad aree!")
        print()
        print("📋 Questo è probabilmente il problema!")
        print("   Vai su Impostazioni > Dispositivi e Servizi")
        print("   Per ogni dispositivo, assegna l'area corretta.")
    print()

if __name__ == "__main__":
    print()
    success = check_storage()
    print()
    check_areas()
    print()
    check_entities()
    print()
    
    if success:
        print("=" * 60)
        print("✅ VERIFICA COMPLETATA - Configurazione OK")
        print("=" * 60)
        print()
        print("Prossimi passi:")
        print("1. Verifica i log di Home Assistant durante la generazione")
        print("2. Cerca messaggi da 'custom_components.nidia_dashboard_composer'")
        print("3. Condividi i log per analisi più approfondita")
    else:
        print("=" * 60)
        print("⚠️  VERIFICA COMPLETATA - Problemi rilevati")
        print("=" * 60)
        print()
        print("Segui le indicazioni sopra per risolvere i problemi.")
    
    print()
    sys.exit(0 if success else 1)

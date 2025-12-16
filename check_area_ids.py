#!/usr/bin/env python3
"""
Quick script to check actual area IDs in Home Assistant.
Run this from your HA config directory.
"""
import json
from pathlib import Path

def check_area_ids():
    """Check the actual area IDs in the system."""
    area_storage = Path(".storage/core.area_registry")
    
    print("=" * 70)
    print("AREA ID VERIFICATION")
    print("=" * 70)
    print()
    
    if not area_storage.exists():
        print(f"❌ File not found: {area_storage}")
        print("Make sure you're running this from the /config directory")
        return
    
    try:
        with open(area_storage) as f:
            data = json.load(f)
    except Exception as e:
        print(f"❌ Error reading file: {e}")
        return
    
    areas = data.get("data", {}).get("areas", [])
    
    if not areas:
        print("❌ No areas found in the registry!")
        return
    
    print(f"Found {len(areas)} areas:\n")
    print(f"{'NAME':<30} {'ID':<30}")
    print("-" * 70)
    
    area_ids = []
    for area in areas:
        name = area.get("name", "N/A")
        area_id = area.get("id", "N/A")
        area_ids.append(area_id)
        print(f"{name:<30} {area_id:<30}")
    
    print()
    print("=" * 70)
    print("COPY THIS FOR YOUR CONFIG")
    print("=" * 70)
    print()
    print('"areas": [')
    for i, area_id in enumerate(area_ids):
        comma = "," if i < len(area_ids) - 1 else ""
        print(f'    "{area_id}"{comma}')
    print(']')
    print()

if __name__ == "__main__":
    check_area_ids()

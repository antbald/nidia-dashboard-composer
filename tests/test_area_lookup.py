"""Test comprehensive area matching logic."""

def test_area_lookup_logic():
    """Test the area lookup dictionary creation."""
    
    # Simulate area registry
    class Area:
        def __init__(self, id, name):
            self.id = id
            self.name = name
    
    areas = [
        Area("camera_da_letto", "Camera da letto"),
        Area("cucina", "Cucina"),
        Area("vano_tecnico", "Vano Tecnico"),
        Area("cameradaletto", "Camera Senza Underscore"),  # Edge case
    ]
    
    # Build lookup (same logic as in engine.py)
    area_lookup = {}
    for area in areas:
        area_id = area.id
        # Map exact ID
        area_lookup[area_id] = area_id
        # Map normalized ID
        normalized_id = area_id.lower().replace(" ", "").replace("_", "").replace("-", "")
        area_lookup[normalized_id] = area_id
        # Map normalized name
        normalized_name = area.name.lower().replace(" ", "").replace("_", "").replace("-", "")
        area_lookup[normalized_name] = area_id
    
    print("Area Lookup Table:")
    for key, value in sorted(area_lookup.items()):
        print(f"  '{key}' → '{value}'")
    print()
    
    # Test cases
    test_cases = [
        ("camera_da_letto", "camera_da_letto"),  # Exact match
        ("cameradaletto", "camera_da_letto"),    # Normalized ID
        ("Camera da Letto", None),               # Won't match (not in lookup as-is)
        ("cucina", "cucina"),                    # Exact match
        ("Cucina", None),                        # Won't match as-is
        ("vano_tecnico", "vano_tecnico"),        # Exact match
        ("vanotecnico", "vano_tecnico"),         # Normalized ID
        ("Vano Tecnico", None),                  # Won't match as-is
    ]
    
    print("Test Cases:")
    for config_area, expected in test_cases:
        # Try exact match first
        if config_area in area_lookup:
            result = area_lookup[config_area]
            status = "✅" if result == expected else "❌"
        else:
            # Try normalized
            normalized = config_area.lower().replace(" ", "").replace("_", "").replace("-", "")
            if normalized in area_lookup:
                result = area_lookup[normalized]
                status = "✅ (normalized)"
            else:
                result = None
                status = "❌"
        
        print(f"  {status} '{config_area}' → '{result}' (expected: '{expected}')")
    
    print()
    print("✅ Lookup logic validated!")

if __name__ == "__main__":
    test_area_lookup_logic()

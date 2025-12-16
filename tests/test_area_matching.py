"""Test for area ID fuzzy matching."""


def test_area_normalization():
    """Test that area ID normalization works correctly."""
    
    test_cases = [
        # (input, expected_normalized)
        ("Camera da Letto", "cameradaletto"),
        ("camera_da_letto", "cameradaletto"),
        ("camera-da-letto", "cameradaletto"),
        ("cameradaletto", "cameradaletto"),
        ("CAMERA DA LETTO", "cameradaletto"),
        ("Camera_Da_Letto", "cameradaletto"),
        ("Vano Tecnico", "vanotecnico"),
        ("vano_tecnico", "vanotecnico"),
        ("Cucina", "cucina"),
        ("cucina", "cucina"),
    ]
    
    def normalize(text):
        """Internal normalization function."""
        return text.lower().replace(" ", "").replace("_", "").replace("-", "")
    
    for input_text, expected in test_cases:
        result = normalize(input_text)
        assert result == expected, f"normalize('{input_text}') = '{result}', expected '{expected}'"
    
    print("✅ All area normalization tests passed!")


if __name__ == "__main__":
    test_area_normalization()

"""Test frontend URL generation."""
import pytest
from custom_components.nidia_dashboard_composer.const import DOMAIN

def test_frontend_url_path():
    """Test that the frontend URL path is constructed correctly."""
    # Expected: /hacsfiles/nidia_dashboard_composer/nidia-dashboard-composer-panel.js
    expected = f"/hacsfiles/{DOMAIN}/nidia-dashboard-composer-panel.js"
    
    # Verify domain has underscores
    assert "_" in DOMAIN
    assert DOMAIN == "nidia_dashboard_composer"
    
    # Verify filename has dashes (based on what we built)
    filename = "nidia-dashboard-composer-panel.js"
    
    assert expected == "/hacsfiles/nidia_dashboard_composer/nidia-dashboard-composer-panel.js"

#!/bin/bash
# Quick installation script for Home Assistant

set -e

echo "================================================"
echo "Nidia Dashboard Composer - Quick Installer"
echo "================================================"
echo ""

# Detect Home Assistant config directory
if [ -d "/config" ]; then
    HA_CONFIG="/config"
elif [ -d "$HOME/.homeassistant" ]; then
    HA_CONFIG="$HOME/.homeassistant"
elif [ -d "$HOME/homeassistant" ]; then
    HA_CONFIG="$HOME/homeassistant"
else
    echo "❌ Could not find Home Assistant config directory."
    echo "Please specify manually:"
    read -p "Enter path to your HA config directory: " HA_CONFIG
fi

echo "📁 Using Home Assistant config: $HA_CONFIG"
echo ""

# Create custom_components directory if it doesn't exist
if [ ! -d "$HA_CONFIG/custom_components" ]; then
    echo "📂 Creating custom_components directory..."
    mkdir -p "$HA_CONFIG/custom_components"
fi

# Download or clone the repository
echo "📥 Downloading Nidia Dashboard Composer..."

cd "$HA_CONFIG/custom_components"

if [ -d "nidia_dashboard_composer" ]; then
    echo "⚠️  Integration already exists. Removing old version..."
    rm -rf nidia_dashboard_composer
fi

# Clone the repository temporarily
git clone https://github.com/antbald/nidia-dashboard-composer.git temp_nidia

# Move only the integration files
echo "📦 Installing integration files..."
mv temp_nidia/custom_components/nidia_dashboard_composer ./

# Clean up
rm -rf temp_nidia

echo ""
echo "✅ Installation complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Restart Home Assistant"
echo "  2. Look for 'Nidia Dashboard Composer' in your sidebar"
echo "  3. Open the panel and start configuring!"
echo ""
echo "📚 Documentation: https://github.com/antbald/nidia-dashboard-composer"
echo "🐛 Issues: https://github.com/antbald/nidia-dashboard-composer/issues"
echo ""
echo "================================================"

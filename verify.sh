#!/bin/bash
# Nidia Dashboard Composer - Verification Script

echo "=========================================="
echo "Nidia Dashboard Composer"
echo "Project Verification"
echo "=========================================="
echo ""

# Check backend files
echo "✓ Checking backend files..."
BACKEND_FILES=(
  "custom_components/nidia_dashboard_composer/__init__.py"
  "custom_components/nidia_dashboard_composer/api.py"
  "custom_components/nidia_dashboard_composer/manifest.json"
  "custom_components/nidia_dashboard_composer/generator/engine.py"
  "custom_components/nidia_dashboard_composer/generator/modules/light.py"
  "custom_components/nidia_dashboard_composer/testing/harness.py"
)

for file in "${BACKEND_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ MISSING: $file"
  fi
done

echo ""

# Check frontend files
echo "✓ Checking frontend files..."
FRONTEND_FILES=(
  "frontend/package.json"
  "frontend/vite.config.ts"
  "frontend/src/main.ts"
  "frontend/src/components/App.ts"
)

for file in "${FRONTEND_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ MISSING: $file"
  fi
done

echo ""

# Check test files
echo "✓ Checking test files..."
TEST_FILES=(
  "tests/conftest.py"
  "tests/test_generator.py"
  "tests/test_harness.py"
)

for file in "${TEST_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ MISSING: $file"
  fi
done

echo ""

# Check scenarios
echo "✓ Checking test scenarios..."
SCENARIOS=(
  "custom_components/nidia_dashboard_composer/testing/scenarios/small_home.json"
  "custom_components/nidia_dashboard_composer/testing/scenarios/energy_home.json"
  "custom_components/nidia_dashboard_composer/testing/scenarios/media_home.json"
)

for file in "${SCENARIOS[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ MISSING: $file"
  fi
done

echo ""

# Check documentation
echo "✓ Checking documentation..."
DOCS=(
  "README.md"
  "QUICKSTART.md"
  "DEVELOPER.md"
  "ARCHITECTURE.md"
)

for file in "${DOCS[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ MISSING: $file"
  fi
done

echo ""
echo "=========================================="
echo "Next Steps:"
echo "=========================================="
echo ""
echo "1. Build Frontend:"
echo "   cd frontend && npm install && npm run build"
echo ""
echo "2. Run Tests:"
echo "   pip install -r requirements_test.txt"
echo "   pytest tests/ -v"
echo ""
echo "3. Install in Home Assistant:"
echo "   See QUICKSTART.md for instructions"
echo ""
echo "=========================================="

#!/usr/bin/env python3
"""Update version across manifest.json and frontend main.ts"""
import json
import re
import sys
from pathlib import Path

def update_version(new_version: str):
    """Update version in manifest.json and main.ts"""
    base_dir = Path(__file__).parent
    
    # Update manifest.json
    manifest_path = base_dir / "custom_components" / "nidia_dashboard_composer" / "manifest.json"
    with open(manifest_path, 'r') as f:
        manifest = json.load(f)
    
    old_version = manifest['version']
    manifest['version'] = new_version
    
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=4)
    
    print(f"✓ Updated manifest.json: {old_version} → {new_version}")
    
    # Update main.ts
    main_ts_path = base_dir / "frontend" / "src" / "main.ts"
    with open(main_ts_path, 'r') as f:
        content = f.read()
    
    # Replace CURRENT_VERSION = 'X.Y.Z'
    updated_content = re.sub(
        r"const CURRENT_VERSION = '[^']+';",
        f"const CURRENT_VERSION = '{new_version}';",
        content
    )
    
    with open(main_ts_path, 'w') as f:
        f.write(updated_content)
    
    print(f"✓ Updated frontend/src/main.ts: CURRENT_VERSION = '{new_version}'")
    print(f"\n📦 Version updated to {new_version}")
    print("\nNext steps:")
    print("  1. cd frontend && npm run build")
    print("  2. git add .")
    print(f"  3. git commit -m 'Release v{new_version}'")
    print(f"  4. git tag -a v{new_version} -m 'Release v{new_version}'")
    print("  5. git push && git push --tags")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: ./update_version.py <new_version>")
        print("Example: ./update_version.py 0.2.1")
        sys.exit(1)
    
    new_version = sys.argv[1]
    
    # Validate version format (simple check)
    if not re.match(r'^\d+\.\d+\.\d+$', new_version):
        print("Error: Version must be in format X.Y.Z (e.g., 0.2.1)")
        sys.exit(1)
    
    update_version(new_version)

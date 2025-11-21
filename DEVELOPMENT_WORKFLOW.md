# Development Workflow (MANDATORY TESTING)

## ⚠️ CRITICAL RULE: TEST BEFORE PUBLISH

**NEVER push to GitHub without testing locally first!**

## Development Cycle

### 1. Make Changes
- Backend: Edit Python files in `custom_components/`
- Frontend: Edit TypeScript files in `frontend/src/`

### 2. Build (if frontend changes)
```bash
cd frontend
npm run build
cd ..
```

### 3. **MANDATORY: Test Locally** ✅

#### A. Run Unit Tests
```bash
# Install test dependencies (first time only)
pip install -r requirements_test.txt

# Run all tests
pytest tests/ -v

# Run specific test
pytest tests/test_init.py -v
```

#### B. Test Integration Setup
```bash
# Test that __init__.py loads without errors
pytest tests/test_init.py::test_async_setup -v
```

#### C. Verify Built Files Exist
```bash
# Check frontend was built
ls -la custom_components/nidia_dashboard_composer/www/nidia-dashboard-composer-panel.js

# Check file size (should be >10KB)
stat -f%z custom_components/nidia_dashboard_composer/www/nidia-dashboard-composer-panel.js
```

#### D. Check Git Status
```bash
# Verify all necessary files are tracked
git status

# Verify www/ files are included (not ignored)
git ls-files | grep "www/"
```

### 4. Commit and Push (only after tests pass)
```bash
git add .
git commit -m "Descriptive message"

# FINAL CHECK before push
git diff HEAD~1 --stat

# Push
git push
```

### 5. Verify on GitHub
```bash
# Check that www/ files were uploaded
open "https://github.com/antbald/nidia-dashboard-composer/tree/main/custom_components/nidia_dashboard_composer/www"
```

## Testing Checklist

Before EVERY push to GitHub, verify:

- [ ] All `pytest` tests pass
- [ ] Frontend built successfully (`npm run build`)
- [ ] `www/nidia-dashboard-composer-panel.js` exists and is >10KB
- [ ] `www/` files are NOT in `.gitignore`
- [ ] `git status` shows www files as staged
- [ ] No Python syntax errors (`python3 -m py_compile custom_components/**/*.py`)
- [ ] manifest.json is valid JSON
- [ ] hacs.json is valid JSON

## Common Mistakes to Avoid

### ❌ Mistake 1: Forgetting to build frontend
**Problem**: Frontend changes don't appear
**Solution**: Always run `npm run build` after frontend changes

### ❌ Mistake 2: www/ in .gitignore
**Problem**: Built frontend not uploaded to GitHub
**Solution**: Verify `.gitignore` doesn't block `custom_components/.../www/`

### ❌ Mistake 3: Skipping tests
**Problem**: Breaking changes reach production
**Solution**: **ALWAYS run pytest before commit**

### ❌ Mistake 4: Not verifying git staged files
**Problem**: Important files not committed
**Solution**: Run `git status` and check staged files

## Quick Test Command

Add this to your workflow:

```bash
# One-liner to test everything
pytest tests/ -v && \
ls custom_components/nidia_dashboard_composer/www/nidia-dashboard-composer-panel.js && \
echo "✅ All checks passed - safe to commit"
```

## Post-Push Verification

After pushing to GitHub:

1. **Check GitHub web UI**:
   - Files visible in `custom_components/.../www/`
   - Commit shows file changes

2. **Test HACS installation** (optional but recommended):
   - Add as custom repository in test HA instance
   - Install via HACS
   - Verify panel loads

## Emergency Rollback

If you pushed broken code:

```bash
# Revert last commit
git revert HEAD
git push

# Or force push previous version
git reset --hard HEAD~1
git push --force
```

## Summary

```
┌─────────────────┐
│  Make Changes   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Build Frontend  │ (if needed)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  RUN TESTS ✅   │ ◄── MANDATORY!
└────────┬────────┘
         │
     PASS?├─NO──► Fix issues
         │
        YES
         │
         ▼
┌─────────────────┐
│ Verify Files    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Commit & Push   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Verify GitHub   │
└─────────────────┘
```

**Remember**: Testing locally is FASTER than debugging in production! 🚀

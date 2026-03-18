# Fork Merge Guide: HMS → TWG Upstream

## 📋 Overview

This guide provides a step-by-step process for merging changes from **HMS-Analytical-Software** forked repositories back to their upstream **sdmx-twg** repositories.

**Context**: HMS repositories are forks of TWG repositories. This process creates pull requests to merge feature branches from HMS forks back to the corresponding upstream branches.

**Target Audience**: Developers with write access to sdmx-twg repositories.

---

## 🔢 Branch Naming Convention

SDMX repositories follow this branch naming pattern:

- **`master`** - Production/stable release branch
- **`X.Y.x`** - Version branch (e.g., `3.0.x`, `3.1.x`)
- **`feature/<description>-X.Y`** - Feature branches for specific version (e.g., `feature/initial-creation-3.1`)

When creating PRs, ensure the **target branch** in the upstream matches the version in your feature branch name.

---

## 📊 SDMX Version Matrix

Different components use different version numbers. Match your PR target branch to the component's version:

| SDMX Version | REST API | SDMX-ML | SDMX-JSON | SDMX-CSV |
|--------------|----------|---------|-----------|----------|
| **3.1**      | 2.2      | 3.1     | 2.1       | 2.1      |
| **3.0**      | 2.0      | 3.0     | 2.0       | 2.0      |
| **2.1**      | 1.5      | 2.1     | 1.0       | 1.0      |

**Example**: For SDMX 3.1 work:

- `sdmx-rest` → merge to `2.2.x` branch
- `sdmx-json` → merge to `2.1.x` branch
- `sdmx-ml` → merge to `3.1.x` branch

---

## 🚀 Migration Process

### Step 0: Repository Setup (sdmx-technical-documentation only)

⚠️ **Special requirement**: The `sdmx-technical-documentation` repository does not yet exist in the TWG organization and must be created first.

**Create repository:**

1. Go to https://github.com/organizations/sdmx-twg/repositories/new
2. Set **Repository name**: `sdmx-technical-documentation`
3. Set **Description**: "SDMX Technical Documentation (MkDocs monorepo)"
4. Set **Visibility**: Public
5. **Do NOT** initialize with README, .gitignore, or license (will be added via PR)
6. Click **Create repository**

**Enable GitHub Pages:**

1. Go to repository Settings → Pages
2. Under **Source**, select:
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
3. Click **Save**

**Note**: The GitHub Action workflow (`.github/workflows/publish_prod.yml`) expects the `gh-pages` branch for deployment. This branch will be automatically created by the workflow after the first merge.

### Step 1: Pre-Merge Checklist

- [ ] Verify you have **write access** to the upstream TWG repository
- [ ] **For sdmx-technical-documentation**: Confirm repository exists and GitHub Pages is enabled
- [ ] Confirm the **version branch exists** in upstream (e.g., `3.1.x`, `2.1.x`)
- [ ] Check HMS fork is **up-to-date** with latest commits
- [ ] Identify the correct **component version** from the matrix above

### Step 2: Sync Fork with Upstream

Ensure your fork has the latest upstream changes to avoid conflicts:

```bash
# Add upstream if not already added
cd /path/to/local/repo
git remote add upstream https://github.com/sdmx-twg/<repo-name>.git

# Fetch upstream branches
git fetch upstream

# Checkout your feature branch
git checkout feature/<description>-X.Y

# Optional: Rebase on upstream version branch to reduce conflicts
git rebase upstream/X.Y.x
```

### Step 3: Create Pull Request

**Option A: Using GitHub Web UI**

1. Go to your HMS fork: `https://github.com/HMS-Analytical-Software/<repo-name>`
2. Click **Contribute** → **Open pull request**
3. Set **base repository**: `sdmx-twg/<repo-name>`
4. Set **base branch**: Correct version branch (e.g., `2.1.x` for SDMX-JSON 2.1)
5. Set **head repository**: `HMS-Analytical-Software/<repo-name>`
6. Set **compare branch**: Your feature branch (e.g., `feature/initial-conversion-2.1`)
7. Fill in PR title and description
8. Click **Create pull request**

**Option B: Using GitHub CLI**

```bash
gh pr create \
  --repo sdmx-twg/<repo-name> \
  --base X.Y.x \
  --head HMS-Analytical-Software:feature/<description>-X.Y \
  --title "feat: <description> for version X.Y" \
  --body "Merging changes from HMS fork for SDMX X.Y release"
```

### Step 4: PR Description Template

Include in your PR description:

```markdown
## Summary
Brief description of changes

## SDMX Version
- SDMX Version: X.Y
- Component Version: X.Y (use version matrix)

## Changes Made
- List key changes
- Link to related issues if applicable

## Checklist
- [ ] Branch name matches version (feature/*-X.Y)
- [ ] Target branch correct (X.Y.x)
- [ ] No merge conflicts
- [ ] Documentation updated
- [ ] Builds successfully
```

### Step 5: Post-PR Actions

- [ ] **Request reviews** from TWG maintainers
- [ ] **Monitor CI/CD** - ensure all checks pass
- [ ] **Resolve conflicts** if any arise
- [ ] **Address review comments** promptly
- [ ] **Wait for approval** before merging

---

## 📋 Repository Checklist

Use this checklist for each repository migration:

### Current Migration Targets

| Repository | HMS Fork Branch | TWG Upstream | Target Branch | SDMX Version | Component Version | Notes |
|------------|----------------|--------------|---------------|--------------|-------------------|-------|
| sdmx-technical-documentation | feature/initial-creation-3.1 | sdmx-twg/sdmx-technical-documentation | `main` or `3.1.x` | 3.1 | 3.1 | **⚠️ Repo must be created first + enable GitHub Pages (gh-pages branch)** |
| sdmx-json | feature/initial-conversion-2.1 | sdmx-twg/sdmx-json | `2.1.x` | 3.1 | 2.1 | |
| sdmx-csv | feature/initial-conversion-2.1 | sdmx-twg/sdmx-csv | `2.1.x` | 3.1 | 2.1 | |
| sdmx-rest | feature/initial-creation-2.2 | sdmx-twg/sdmx-rest | `2.2.x` | 3.1 | 2.2 | |
| sdmx-ml | (varies) | sdmx-twg/sdmx-ml | `3.1.x` | 3.1 | 3.1 | |
| sdmx-im | feature/conversion-other-documents-3.1 | sdmx-twg/sdmx-im | `3.1.x` | 3.1 | 3.1 | |

---

## ✅ Verification Checklist

After PR is merged:

### Immediate Checks

- [ ] PR shows as **merged** in TWG repository
- [ ] Commits appear in target branch history
- [ ] CI/CD passes on target branch
- [ ] No broken links in documentation

### Documentation Validation

- [ ] Published docs updated (if auto-deployed)
- [ ] Version number correct in documentation
- [ ] Cross-references between components work
- [ ] **For sdmx-technical-documentation**: GitHub Pages deployed successfully to `gh-pages` branch

---

## ⚠️ Common Issues

### Issue: "GitHub Pages not deploying (sdmx-technical-documentation)"
**Solution**: 
1. Verify GitHub Pages is enabled in Settings → Pages
2. Ensure source is set to `gh-pages` branch and `/ (root)` folder
3. Check that `.github/workflows/publish_prod.yml` has correct permissions
4. Verify the workflow ran successfully in Actions tab
5. The `gh-pages` branch should be automatically created by the workflow on first run

### Issue: "Base branch doesn't exist"

**Solution**: The version branch may not be created yet. Check with TWG maintainers or create it from `master`:

```bash
git checkout master
git pull origin master
git checkout -b X.Y.x
git push origin X.Y.x
```

### Issue: "Merge conflicts"

**Solution**: Rebase your branch on the target upstream branch:

```bash
git fetch upstream
git rebase upstream/X.Y.x
# Resolve conflicts
git push --force-with-lease origin feature/<description>-X.Y
```

### Issue: "Wrong component version"

**Solution**: Verify component version in the matrix above. Create new PR targeting correct branch.

### Issue: "CI/CD failures after merge"

**Solution**: Check that workflows reference correct branches and that secrets/variables are set in the upstream repository.

---

## 📚 Additional Resources

- [GitHub: Creating a pull request from a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)
- [GitHub CLI: `gh pr create`](https://cli.github.com/manual/gh_pr_create)
- [Git: Syncing a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)

---

**Last Updated**: 2026-01-12  
**Version**: 1.0  
**Maintainer**: SDMX TWG Documentation Team

# Copilot Instructions for SDMX Technical Documentation

## Project Overview
- This repository contains the source for SDMX Technical Documentation, built with [MkDocs](https://www.mkdocs.org/).
- **Documentation-only repository**: No code implementation, no tests—only comprehensive technical specifications.
- Documentation covers SDMX standards: CSV, JSON, ML, REST API, guidelines, and the Information Model.
- The repo is a **monorepo** with component-based structure using the `mkdocs-monorepo-plugin`.

## Repository Architecture

### Monorepo Structure
The project uses MkDocs monorepo plugin with `!include` directives in the root `mkdocs.yml`:
```yaml
nav:
- Framework: '!include ./components/information_model/mkdocs_framework.yml'
- Information Model: '!include ./components/information_model/mkdocs_information_model.yml'
- SDMX-JSON (v2.0): '!include ./components/sdmx_json/mkdocs.yml'
```
This merges component-level navigation into a unified documentation site.

### Top-level Files
- `mkdocs.yml` - Main site configuration with Material theme, plugins (mike, monorepo, to-pdf, search, exclude)
- `pyproject.toml` - Python dependencies (requires Python 3.12, see `.python-version`)
- `VERSION` - Version and alias for mike versioning (format: `3.0|latest`)
- `site/` - Built documentation (git-ignored locally, published to gh-pages)

### Components Directory
Six independent documentation components in `components/`:
- **`information_model/`** - Four separate mkdocs configs (`mkdocs_framework.yml`, `mkdocs_information_model.yml`, `mkdocs_logical_interfaces.yml`, `mkdocs_technical_notes.yml`)
- **`rest_api/`** - Two configs (`mkdocs_rest_api.yml`, `mkdocs_registry_specification.yml`), includes OpenAPI spec in `api/sdmx-rest.yaml`
- **`sdmx_json/`, `sdmx_csv/`, `sdmx_ml/`** - Format specifications with message types (structure, data, metadata)
- **`guidelines/`** - Implementation guidelines and modeling practices

Each component has: `docs/` folder, `README.md`, one or more `mkdocs.yml` files.

### Main Documentation
- `docs/` - Top-level content (index, getting started)
- `docs/assets/` - Custom JS (`anchors.js`) and CSS (`style.css`)
- `docs/media/logos/` - SDMX logos and favicon

## Developer Workflows

### Environment Setup
**Always use `uv` as the package manager** (enforced in CI/CD):
```bash
pip install uv              # Install uv
uv sync                     # Install all dependencies from pyproject.toml
```
Python version: **3.12** (pinned in `.python-version`)

### Serving Documentation
**Full site (recommended):**
```bash
uv run mkdocs serve         # Serves at http://127.0.0.1:8000
```
This builds the complete site with all components merged via monorepo plugin.

### Building for Production
```bash
uv run mkdocs build         # Builds to site/
```

### Versioning with Mike
The project uses [mike](https://github.com/jimporter/mike) for multi-version documentation:
- Versions defined in `VERSION` file: `3.0|latest`
- Deployed via GitHub Actions to `gh-pages` branch
- Mike commands (used in CI):
  ```bash
  uv run mike deploy --update-aliases --branch gh-pages --push 3.0 latest
  ```

## Content Conventions

### File Naming Pattern
Files use **numbered prefixes** for ordering in navigation:
- `0_Introduction.md`, `0_change_history.md` - Always first
- `1_field_guide.md`, `2_linking_mechanism.md`, `3_handling_indexes.md` - Sequential chapters
- `15_Appendix_...` - Appendices last
- Numbers determine order in `mkdocs.yml` nav configuration

### Document Structure Standards

**UML Diagrams** (especially in `information_model/`):
- Stored in `docs/*/media/` as **SVG (preferred)** or PNG
- Always use figure captions with custom MkDocs syntax:
  ```markdown
  ![](media/image36.png){ width="550" }
  /// figure-caption | 10
  SDMX Identification, Maintenance and Versioning
  ///
  ```
- Optional `| N` indicates figure number for cross-referencing

**Class Definitions** (Information Model):
Use standardized table format with courier font for technical terms:
```markdown
| Class | Feature | Description |
| :--- | :--- | :--- |
| `ClassName` |  |  |
|  | `attributeName` | Description |
|  | `associationName` | Association details |
|  | `+roleName` | Role in relationship |
```
- Abstract classes in *italic courier*: `*AnnotableArtefact*`

### Markdown Extensions
Available extensions (configured in root `mkdocs.yml`):
- `pymdownx.tabbed` - Tabbed content with `alternate_style: true`
- `pymdownx.superfences` - Code fences and nested blocks
- `pymdownx.details` - Collapsible admonitions
- `admonition` - Note, warning, info blocks
- `footnotes` - Footnote syntax

## Critical Patterns

### Cross-component Linking
When linking between components, use **relative paths from the built site structure**:
- Framework docs: `/framework/...`
- JSON format: `/json/data_message/1_field_guide/`
- ML format: `/ml/structure/`
- Not component paths like `/components/sdmx_json/docs/...` (these don't exist in built site)

### Navigation Configuration
The `!include` directive in root `mkdocs.yml` merges component navs. When editing component navigation:
1. Edit the component's `mkdocs.yml` (e.g., `components/sdmx_json/mkdocs.yml`)
2. Reference files relative to component's `docs/` folder
3. Test both: `uv run mkdocs serve -f components/sdmx_json/mkdocs.yml` and root `uv run mkdocs serve`

### Media Assets
- Component-specific media: `components/<component>/docs/media/`
- Shared logos: `docs/media/logos/`
- In Markdown, reference relative to current file: `![](media/diagram.png)`

## Integration Points

### GitHub Actions & CI/CD
- `.github/workflows/publish_prod.yml` - Deploys on push to `master` or version branches (`[0-9]+.[0-9]+.x`)
- Uses `VERSION` file to determine mike version and alias
- PDF generation controlled by `ENABLE_PDF_EXPORT=1` env var

### External References
- REST API: OpenAPI spec at `components/rest_api/api/sdmx-rest.yaml`
- Component READMEs link to external SDMX wikis for additional context
- Main site links to sdmx.org

### Plugins & Extensions
Configured plugins in `mkdocs.yml` (plugins section):
1. **to-pdf** - Generates PDF exports (enabled via env var)
2. **monorepo** - Merges component docs into unified site
3. **mike** - Multi-version documentation with symlink aliases
4. **search** - Built-in MkDocs search
5. **exclude** - Excludes patterns from build

## Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `uv sync` |
| Serve full site | `uv run mkdocs serve` |
| Serve one component | `uv run mkdocs serve -f components/sdmx_json/mkdocs.yml` |
| Build site | `uv run mkdocs build` |
| Check for broken links | `uv run mkdocs build --strict` |
| Format check | Test with both root and component-level serves |

## Notes
- **No Python code/tests**: Repository contains only Markdown, YAML, and media files
- **Utility script**: `scratch/get_figure_height_width_ratio.py` for analyzing image dimensions
- **Version branches**: Release branches follow pattern `[0-9]+.[0-9]+.x` (e.g., `3.0.x`)
- For component-specific conventions, see component-level READMEs (e.g., `components/information_model/README.md`)

---
For additional details, see `README.md` and component-level documentation.

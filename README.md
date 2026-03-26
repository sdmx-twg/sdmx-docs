# SDMX Technical Documentation

This repository contains the source files for the SDMX Technical Documentation.
The documentation is built using [MkDocs](https://www.mkdocs.org/), a static
site generator designed for project documentation.

## Getting Started

### Prerequisites

-   **Git** (with submodule support)
-   **Python ≥ 3.12**

### Clone the Repository

```bash
git clone --recurse-submodules <link-to-repository>
```

The `--recurse-submodules` flag is required because the `components/`
directories are Git submodules containing the format-specific documentation.

### Install `uv`

Follow the
[official installation instructions](https://docs.astral.sh/uv/getting-started/installation/).

`uv` manages a virtual environment automatically — no manual activation is
needed.

### Install Dependencies

```bash
uv sync
```

This installs all locked dependencies (from `uv.lock`) into a managed virtual
environment.

### Serve the Documentation

```bash
uv run mkdocs serve
```

This starts a local development server. View the documentation in your browser
at <http://127.0.0.1:8000>.

## Submodule Workflow

The `components/` directory contains Git submodules, one per SDMX
specification. The submodule configuration — including the upstream repository
URL and the tracked branch for each component — is maintained in
[`.gitmodules`](.gitmodules).

Documentation content inside `components/` **can be edited directly** in this
working tree — changes are staged and committed inside the submodule, pushed to
the upstream submodule branch, and then the parent repository's submodule
pointer is updated separately.

| Operation | Command |
| --------- | ------- |
| Fetch all submodules after cloning | `git submodule update --init --recursive` |
| Update submodules to latest upstream | `git submodule update --init --recursive --remote` |
| Commit submodule edits | Two-step: commit and push inside the submodule directory, then stage and commit the updated pointer in the parent repo |

> **Important:** changes pushed to a submodule repository do **not**
> automatically trigger a site rebuild. The parent repository stores a pointer
> to a specific commit in each submodule. To publish updated submodule content,
> the updated pointer must be committed explicitly in a version branch (e.g.,
> `master` or `X.Y.x`) so that the build pipeline picks it up.

> **Never** push directly to `gh-pages` or `gh-pages-preview` — these branches
> are managed by CI.

## Repository Structure

This repository is organized into two main areas:

-   **`docs/`**: Contains the main documentation content for the SDMX Technical
    Documentation site. This folder includes overarching topics like the general
    index page.

-   **`components/`**: Contains individual submodules for each SDMX format and
    specification. Each component (e.g., `sdmx_csv`, `sdmx_json`, `sdmx_ml`,
    `rest_api`, `guidelines`, `information_model`) has its own `docs/` folder
    and `mkdocs.yml` configuration, allowing them to be developed and built
    independently or integrated into the main site.

When building the full documentation site, MkDocs merges content from both the
main `docs/` folder and the component submodules to create a unified
documentation structure. For the resulting
[folder structure see the section below](#folder-structure-during-build), e.g.,
to create links within the files.

## Tooling & Recommended Configuration

### Prettier (Markdown Formatter)

This project formats Markdown and YAML files with
[Prettier](https://prettier.io/). The settings are:

-   `proseWrap: "always"`, `printWidth: 80`, `tabWidth: 4` for Markdown
-   `tabWidth: 2` for YAML files

To use these settings locally, create a `.prettierrc` file at the repository
root with the following content:

```json
{
    "proseWrap": "always",
    "printWidth": 80,
    "tabWidth": 4,
    "overrides": [
        {
            "files": ["*.yml", "*.yaml"],
            "options": { "tabWidth": 2 }
        }
    ]
}
```

Install the **Prettier - Code formatter** VS Code extension
(`esbenp.prettier-vscode`) and enable **Format on Save** to apply formatting
automatically.

### Recommended VS Code Extensions

| Extension | Marketplace ID |
| --------- | -------------- |
| Prettier — Code formatter | `esbenp.prettier-vscode` |
| Code Spell Checker | `streetsidesoftware.code-spell-checker` |
| YAML | `redhat.vscode-yaml` |
| markdownlint | `DavidAnson.vscode-markdownlint` |

## CI/CD Pipeline

### PR Preview (`publish_dev.yml`)

-   **Trigger:** every pull request.
-   **Result:** the documentation site is built and deployed to the
    `gh-pages-preview` branch under the version label `v.PR-<pr-number>`.
-   **Note:** contributors never run this manually; the workflow fires
    automatically on every opened or updated pull request.

### Production Deployment (`publish_prod.yml`)

-   **Trigger:** push to `master` or any branch matching `X.Y.x`.
-   **Result:** site deployed to the `gh-pages` branch using `mike deploy`.
-   **Version label:** read from the `VERSION` file. The format is
    `<version>[|<alias>]` — for example, `3.0|latest`. The version is required;
    the alias is optional. When cutting a release, update `VERSION` to set the
    deployed version label and alias.
-   **Note:** contributors never deploy manually; CI handles all deployments.

## Contributing

Contributions are welcome — please submit pull requests or open issues.

When contributing, follow these conventions:

-   **Commit style:**
    [Conventional Commits](https://www.conventionalcommits.org/) — use prefixes
    `feat`, `fix`, `docs`, `chore`, `ci`, or `refactor` followed by an
    imperative description (e.g., `fix(ml): correct broken cross-link`).
-   **Branch naming:** `feature/kebab-case-description` for new content
    branches, `X.Y.x` for release branches.

A `CONTRIBUTING.md` with full contribution guidelines is planned for a future
update.

## License

A formal `LICENSE` file is planned. Until it is added, please contact the
maintainers for licensing information before reusing any content.

## Plugins

The following plugins are used:

-   `mike` (<https://github.com/jimporter/mike>)
-   `monorepo` (<https://github.com/backstage/mkdocs-monorepo-plugin>)
-   `to-pdf` (<https://github.com/orzih/mkdocs-with-pdf>)
-   `search` (built-in MkDocs plugin)
-   `exclude` (<https://github.com/apenwarr/mkdocs-exclude>)

## Folder Structure during build

```sh
├── assets
│   ├── anchors.js
│   └── style.css
├── framework
│   ├── framework
│   ├── information_model
│   ├── logical_interfaces
│   └── technical_notes
├── getting_started
├── index.md
├── information_model
│   ├── framework
│   ├── information_model
│   ├── logical_interfaces
│   └── technical_notes
├── logical_interfaces
│   ├── framework
│   ├── information_model
│   ├── logical_interfaces
│   └── technical_notes
├── media
│   └── logos
├── csv
│   ├── data_message_field_guide.md
│   ├── index.md
│   └── metadata_message_field_guide.md
├── json
│   ├── data_message
│   ├── index.md
│   ├── metadata_message
│   └── structure_message
├── ml
│   ├── common.md
│   ├── data.md
│   ├── index.md
│   ├── message.md
│   ├── registry.md
│   ├── samples
│   ├── samples.md
│   ├── schemas
│   └── structure.md
├── registry_specification
│   ├── registry_specification
│   └── rest_api
├── rest_api
│   ├── registry_specification
│   └── rest_api
└── technical_notes
    ├── framework
    ├── information_model
    ├── logical_interfaces
    └── technical_notes
```

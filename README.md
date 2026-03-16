# SDMX Technical Documentation

This repository contains the source files for the SDMX Technical Documentation.
The documentation is built using [MkDocs](https://www.mkdocs.org/), a static
site generator designed for project documentation.

## Getting Started

Follow the steps below to clone the repository and set up a local development
environment. The recommended package manager for this project is
[uv](https://github.com/uv-py/uv), which handles all Python dependencies
including MkDocs itself.

### Clone the Repository

Clone the repository together with all submodules in one step:

```bash
git clone --recurse-submodules <repository-url>
```

If you have already cloned without submodules, initialize them afterwards:

```bash
git submodule update --init --recursive
```

### Install `uv`

You can install `uv` using pip:

```bash
pip install uv
```

### Install Dependencies

Once uv is installed, you can install the project dependencies by running:

```sh
uv sync
```

### Serve the Documentation

To serve the documentation locally, use the following command:

```sh
uv run mkdocs serve
```

This will start a local development server, and you can view the documentation
in your browser at <http://127.0.0.1:8000>.

## Repository Structure

This repository is organized into two main areas:

- **`docs/`**: Contains the main documentation content for the SDMX Technical
  Documentation site. This folder includes overarching topics like the general
  index page.

- **`components/`**: Contains individual submodules for each SDMX format and
  specification. Each component (e.g., `sdmx_csv`, `sdmx_json`, `sdmx_ml`,
  `rest_api`, `guidelines`, `information_model`) has its own `docs/` folder and
  `mkdocs.yml` configuration, allowing them to be developed and built
  independently or integrated into the main site.

When building the full documentation site, MkDocs merges content from both the
main `docs/` folder and the component submodules to create a unified
documentation structure. Refer to the
[Folder Structure during build](#folder-structure-during-build) section for the
directory layout produced — useful as a reference when creating relative
cross-links between documentation pages.

## Git Submodules

Git submodules allow a repository to include and track another repository at a
specific commit. This repository uses submodules so that the documentation
content for each SDMX specification can live in its own dedicated repository,
keeping it aligned with the respective Technical Working Group (TWG) workstream.
Each component under `components/` (e.g. `rest_api`, `sdmx_csv`, `sdmx_json`,
`sdmx_ml`, `information_model`) is a submodule pointing to a separate upstream
repository.

The submodules and their tracked branches are declared in
[`.gitmodules`](.gitmodules). For example:

```ini
[submodule "components/sdmx_ml"]
    path = components/sdmx_ml
    url = https://github.com/sdmx-twg/sdmx-ml.git
    branch = 3.0.x
```

> **Important:** Git submodules do not update automatically. The link between a
> submodule and its tracked branch is intentionally loose — the repository only
> records the exact commit that was last checked in, not the branch tip. This
> means changes made upstream in a submodule repository are **not** reflected
> locally until you explicitly pull them in.

To fetch the latest commits from all tracked branches and update the working
tree, run:

```bash
git submodule update --init --recursive --remote
```

This checks out the current tip of each configured branch for every submodule.
Any resulting changes to the recorded submodule commits can then be staged,
committed, and pushed in the usual way.

## MKDocs Plugins

The following MkDocs plugins are used in this project:

- [`mike`](https://github.com/jimporter/mike) — manages multiple versions of the
  documentation and handles versioned deployments.
- [`monorepo`](https://github.com/backstage/mkdocs-monorepo-plugin) — merges
  documentation from multiple repositories (submodules) into a single unified
  site.
- [`to-pdf`](https://github.com/orzih/mkdocs-with-pdf) — generates a PDF version
  of the documentation.
- `search` (built-in MkDocs plugin) — provides full-text search across the
  documentation site.
- [`exclude`](https://github.com/apenwarr/mkdocs-exclude) — excludes specified
  files or directories from the build output.

## Contributing

Feel free to contribute to the SDMX Technical Documentation by submitting pull
requests or reporting issues.

## License

The license will be added.

## Plugins

The following plugins are used:

- `mike` (<https://github.com/jimporter/mike>)
- `monorepo` (<https://github.com/backstage/mkdocs-monorepo-plugin>)
- `to-pdf` (<https://github.com/orzih/mkdocs-with-pdf>)
- `search` (built-in MkDocs plugin)
- `exclude` (<https://github.com/apenwarr/mkdocs-exclude>)

## Folder Structure during build

The directory tree below shows the virtual file system MkDocs assembles during a
build. Use it as a reference when writing relative links between pages, since
the paths here correspond to the URL structure of the built site.

```sh
├── assets
│   ├── anchors.js
│   └── style.css
├── framework
│   ├── framework
│   ├── information_model
│   ├── logical_interfaces
│   └── technical_notes
├── getting_started
├── index.md
├── information_model
│   ├── framework
│   ├── information_model
│   ├── logical_interfaces
│   └── technical_notes
├── logical_interfaces
│   ├── framework
│   ├── information_model
│   ├── logical_interfaces
│   └── technical_notes
├── media
│   └── logos
├── csv
│   ├── data_message_field_guide.md
│   ├── index.md
│   └── metadata_message_field_guide.md
├── json
│   ├── data_message
│   ├── index.md
│   ├── metadata_message
│   └── structure_message
├── ml
│   ├── common.md
│   ├── data.md
│   ├── index.md
│   ├── message.md
│   ├── registry.md
│   ├── samples
│   ├── samples.md
│   ├── schemas
│   └── structure.md
├── registry_specification
│   ├── registry_specification
│   └── rest_api
├── rest_api
│   ├── registry_specification
│   └── rest_api
└── technical_notes
    ├── framework
    ├── information_model
    ├── logical_interfaces
    └── technical_notes
```

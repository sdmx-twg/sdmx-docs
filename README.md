# SDMX Technical Documentation

This repository contains the source files for the SDMX Technical Documentation.
The documentation is built using [MkDocs](https://www.mkdocs.org/), a static
site generator designed for project documentation.

## Getting Started

To build and serve the documentation locally, ensure you have MkDocs installed.
The recommended package manager for this project is
[uv](https://github.com/astral-sh/uv).

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
documentation structure.
For the resulting
[folder structure see the section below](#folder-structure-during-build), 
e.g., to create links within the files

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

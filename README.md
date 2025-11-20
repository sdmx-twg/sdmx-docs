# SDMX Technical Documentation

This repository contains the source files for the SDMX Technical Documentation.
The documentation is built using [MkDocs](https://www.mkdocs.org/), a static
site generator designed for project documentation.

## Getting Started

To build and serve the documentation locally, ensure you have MkDocs installed.
The recommended package manager for this project is
[uv](https://github.com/uv-py/uv).

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

- pyproject.toml: Configuration file for the project.
- .github/: Contains GitHub-specific files, including Copilot instructions.
- .gitignore: Specifies intentionally untracked files to ignore.
- .python-version: Specifies the Python version used for the project.

## Contributing

Feel free to contribute to the SDMX Technical Documentation by submitting pull
requests or reporting issues.

## License

The license will be added.

## Plugins

The following plugins are used:

- `mike`
- `llmstxt` (https://github.com/jimporter/mike)
- `exclude` (https://github.com/apenwarr/mkdocs-exclude)

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

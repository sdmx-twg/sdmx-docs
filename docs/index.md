# SDMx Technical Documentation

!!! note "This page is work in progress"

    The official documentation is available on [https://www.sdmx.org](https://sdmx.org/standards-2/)

## Project Description

This project provides a new, easier-to-browse and searchable version of the SDMx
Technical Documentation. It brings together all active specifications from the
official SDMx website and the GitHub repositories maintained by the SDMx
Technical Working Group (TWG), now shown centrally here.

**SDMx - The standard for Statistical Data and Metadata**

## Documentation Layout

- **Top-level navigation**: available through the horizontal bar at the top.
- **Second-level navigation**: available in the left sidebar.
- **Within-page navigation**: available in the right sidebar.

This structure allows quick access to high-level sections, detailed subsections,
and in-page anchors.

## Contents of the Documentation

The **Statistical Data and Metadata (SDMx)** initiative
([https://www.sdmx.org](https://www.sdmx.org)) sets standards for statistical
data and metadata using modern information technology.

The SDMx Technical Specifications are organised into several discrete sections,
which are all available in this documentation site.

### Framework and Information Model

- [Section 1 – Framework for SDMx Technical Standards](./framework/framework/0_framework-introduction.md)
  Provides an introduction to the technical standards.
- [Section 2 – SDMx Information Model](./information_model/information_model/0_Introduction.md)
  A standardised object model for
  modelling statistical domains, covering the structure of data and metadata
  sets, coding schemes, and exchange rules. Includes UML specifications and
  narrative.

### Registries and Technical Notes

- [Section 5 – SDMx Registry Specification](./registry_specification/1_Introduction.md)
  Specification of the SDMx
  Registry, a repository for structural metadata and provisioning information.
- [Section 6 – SDMx Technical Notes](./technical_notes/technical_notes/0_Purpose_and_Structure.md)
  Detailed technical guidance for
  implementors of the SDMx standard.

### Transmission Formats and APIs

- [REST API](./rest_api/index.md)
  Technical specifications for the SDMx RESTful web services API.
- [SDMX-ML](./ml/index.md)
  Technical specifications for the XML transmission format,
  including schemas, documentation, and samples.
- [SDMX-JSON](./json/index.md)
  Technical specifications for the JSON transmission format,
  including documentation, schemas, and samples.
- [SDMX-CSV](./csv/index.md)
  Technical specifications for the CSV transmission format for data
  and reference metadata.

### VTL (Validation and Transformation Language)

Since 2020, the SDMx specifications include support for the **Validation and
Transformation Language (VTL)**. For SDMx 3.0, the VTL specification has been
updated to align with changes to the Information Model and the introduction of
Semantic Versioning.

- [Information Model](./information_model/information_model/14_Validation_and_Transformation_Language.md)
  covers the "Transformation and Expressions"
  package for defining and managing VTL 2.0 programs.
- [Technical Notes](./technical_notes/technical_notes/11_Validation_and_Transformation_Language__VTL_.md)
  provides detailed guidance on implementing
  and using VTL with SDMx.

### Obsolete Sections (not included here)

- **Section 3 – SDMX-ML** (replaced by SDMX-ML repository)
- **Section 4 – SDMX-EDI**
- **Section 7 – API** (replaced by SDMx REST API)

## Known Limitations

- Formatting improvements are ongoing.
- Some footnotes are missing.
- Review is in progress.
- Any remarks are welcome.
- Current focus is mainly on **SDMx 3.0**.

## Feedback

We welcome feedback to improve this documentation. Please provide your input
via:

- [GitHub Issues](https://github.com/sdmx-twg)
- E-Mail: [twg@sdmx.org](mailto:twg@sdmx.org)

## Matrix of SDMx and REST / Transmission Format Versions

The SDMx versions do not coincide with the versions of all sections of the
standard. This page includes for each SDMx version the documentation of
REST-API, SDMX-ML, SDMX-JSON, and SDMX-CSV that were released together with the
standard:

| SDMx version | REST-API version | SDMX-ML version | SDMX-JSON version | SDMX-CSV version |
| ------------ | ---------------- | --------------- | ----------------- | ---------------- |
| 3.1          | 2.2              | 3.1             | 2.1               | 2.1              |
| 3.0          | 2.0              | 3.0             | 2.0               | 2.0              |
| 2.1          | 1.5              | 2.1             | 1.0               | 1.0              |

Please refer to the individual repositories for other versions of the packages:

- [REST-API](https://github.com/sdmx-twg/sdmx-rest),
- [SDMX-ML](https://github.com/sdmx-twg/sdmx-ml),
- [SDMX-JSON](https://github.com/sdmx-twg/sdmx-json), and
- [SDMX-CSV](https://github.com/sdmx-twg/sdmx-csv).

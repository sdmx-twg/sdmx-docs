# TWG documentation handover manual

This manual is for Technical Standards Working Group (TWG) maintainers of the
aggregated SDMX technical documentation. It covers routine edits, validation,
versioning, and publication in this parent repository and its six component
repositories; it does not replace release approval or component specifications.

Repository configuration is authoritative. Recheck this manual when any of
these change: [`.gitmodules`](.gitmodules) (component remotes and update
branches), [`mkdocs.yml`](mkdocs.yml) (navigation, validation, PDF labels),
[`VERSION`](VERSION) (published version and optional alias),
[the publication workflow](.github/workflows/publish_prod.yml), or
[`pyproject.toml`](pyproject.toml) and `uv.lock` (the locked build environment).

## Repository model

The parent is the documentation aggregator. `docs/` contains parent-owned
content; `components/` holds six Git submodules; `.gitmodules` records their
remotes and remote-update branches; and `mkdocs.yml` combines their navigation
with the parent site. `VERSION` supplies `<version>[|<alias>]` to CI, while the
workflow checks out submodules, installs the lockfile, validates pull requests,
and deploys eligible pushes.

Each parent commit pins every component to one exact commit (a *gitlink*).
The `.gitmodules` `branch` value affects only an explicit
[`git submodule update --remote`](https://git-scm.com/docs/git-submodule), not
the deployed checkout. Therefore, publish a reviewed component commit first,
then update, validate, and commit its gitlink in the parent. A component push
alone cannot update the site.

## Setup

Install Git, Python 3.12+, and [uv](https://docs.astral.sh/uv/getting-started/installation/).
For a fresh clone, run:

```bash
git clone --recurse-submodules <parent-repository-url> sdmx-technical-documentation
cd sdmx-technical-documentation
uv sync
```

For an existing clone, run `git pull --ff-only`, then
`git submodule sync --recursive`, `git submodule update --init --recursive`,
and `uv sync`. The update restores the parent-pinned commits; use it alone to
populate missing components. Check all six with `git submodule status --recursive`
(`-` means uninitialised). `uv` manages the environment; no activation is needed.

## Branch policy

For components, `develop` is the active integration branch, `master` is the
official release branch, and `docs_v<MAJOR>.<MINOR>` preserves the final
official commit of an old version. Old documentation branches may receive only
typo, styling, formatting, link-presentation, and equivalent non-specification
corrections; specification changes follow `develop` to `master`.

The parent workflow is configured for `main`, `dev`, and `docs_v*.*`, but the
parent currently has **no** `dev` branch. Before the first push of a new parent
`dev`, give its `VERSION` a unique version label and no `latest` alias;
otherwise its workflow can deploy over an existing documentation version.

## Routine component edit

Submodules are normally detached at the parent-pinned commit. Before editing,
initialise the component, fetch it, switch to `develop` (create a tracking
branch if necessary), and create a feature branch; inspect it with
`git -C <component-path> status --short --branch`.

Commit, validate, review, and publish the component in its own repository.
After it is merged to the branch named in `.gitmodules`, clear or update any
local branch override, then run from the parent:

```bash
git submodule sync --recursive
git submodule update --init --remote <component-path>
git -C <component-path> rev-parse HEAD
git diff --submodule=log -- <component-path>
```

Confirm the SHA is the reviewed commit, run the strict aggregate build, and
commit only the intended gitlink. `git submodule update --init --recursive
--remote` is for deliberate all-component updates; review every changed
gitlink, as it can advance unrelated components.

## Starting a new documentation version

This is an ordered transaction: preserve the old aggregate before advancing the
parent main line. Use distinct aggregate and component versions—REST, CSV,
JSON, ML, information model, and registry versions may differ.

1. Finalise and publish each component's reviewed release on `master`; record
   its exact commit and old component version.
2. From each recorded commit, create and publish
   `docs_v<old-component-version>`.
3. On a reviewed parent branch from the current main line, retarget every
   `.gitmodules` entry to its corresponding old component branch, synchronise
   it, update the six gitlinks, set `VERSION` to `<old-aggregate-version>`
   without an alias, and update the navigation and PDF cover labels. Validate
   and commit this coherent snapshot together.
4. Create and publish `docs_v<old-aggregate-version>` from that exact parent
   commit. This snapshot is necessary: its commit must contain the old component
   branch metadata, matching old gitlinks, visible old version labels, and a
   `VERSION` without `latest`.
5. Return to the parent main line, retarget every `.gitmodules` entry to its
   appropriate active/new-version branch, synchronise and update the gitlinks,
   set `VERSION` to `<new-aggregate-version>|latest`, and update each component
   navigation label and the PDF cover subtitle using its actual version.
   Validate and merge by pull request.

Use the [Git submodule documentation](https://git-scm.com/docs/git-submodule)
for the routine `git config`, branch, and remote-update syntax. Do not create
the old parent branch after step 5: it would preserve new component pointers or
labels. The 3.0-to-3.1 history is the reference example for the ordering.

## Preview, validation, and publication

Use these three levels before a parent pull request:

1. Live preview: `uv run mkdocs serve`
2. Strict HTML build: `uv run mkdocs build --strict`
3. Production-like HTML and PDF build:
   `ENABLE_PDF_EXPORT=1 uv run mkdocs build --strict`

Then open a pull request targeting a branch configured in the publication
workflow. CI recursively checks out submodules, runs `uv sync`, reads `VERSION`,
and validates without pushing generated content; an eligible push deploys under
workflow control. Never push directly to `gh-pages` or `gh-pages-preview`.

## Common pitfalls

- **Detached component:** normal for a pinned checkout, unsafe for edits; switch
  to a working branch first.
- **Changed `.gitmodules` URL or branch:** `git submodule sync --recursive`
  refreshes changed URLs. A local `submodule.<name>.branch` override takes
  precedence; remove or update it before `git submodule update --remote`.
- **Unchanged site after a component push:** the parent gitlink still pins the
  old commit; update and commit that pointer.
- **Unexpected component updates:** inspect `git status --short` and
  `git diff --submodule=log`; prefer targeted updates.
- **Mixed versions:** before a transition, check every component branch and
  gitlink, `mkdocs.yml` labels, PDF `cover_subtitle`, and `VERSION` separately.
- **Image wider than A4 PDF output:** constrain it with the repository's
  attribute-list syntax, then rerun the PDF build:

  ```markdown
  ![Description](docs/media/logos/SDMx_Logo_2026.png){ width="550" }
  ```

  Reduce the width if needed. Diagnose other build failures from their actual
  output rather than treating them as image-width failures.

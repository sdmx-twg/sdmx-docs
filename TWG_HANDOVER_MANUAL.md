# TWG documentation handover manual

## Audience, scope, and sources of truth

This manual is for SDMX Technical Standards Working Group (TWG) maintainers
who set up, edit, validate, version, and publish the aggregated technical
documentation. It covers routine work in this parent repository and in the six
component repositories. It does not replace the release approval process or
the component specifications.

Treat the current repository configuration as authoritative. When this manual
and the repository differ, inspect and update the manual against these files:

- `.gitmodules` for component paths, remotes, and remote-update branches;
- `mkdocs.yml` for navigation, component includes, validation, plugins, and
  visible version labels;
- `VERSION` for the aggregate deployed version and optional alias;
- `.github/workflows/publish_prod.yml` for CI triggers and publication;
- `pyproject.toml` and `uv.lock` for the supported Python version and exact
  build environment; and
- each component's README and MkDocs files for component-local instructions.

`REPOSITORY_MIGRATION_GUIDE.md` describes the earlier repository migration. It
is historical context, not the current branch or maintenance policy.

## How the documentation is assembled

This repository is the parent documentation aggregator. Its main parts are:

| Path | Role |
| --- | --- |
| `docs/` | Parent-owned pages, assets, styles, and the aggregate landing page. |
| `components/` | Checked-out component repositories, stored as Git submodules. |
| `.gitmodules` | Maps every component path to its upstream repository and the branch used by explicit remote updates. |
| `mkdocs.yml` | Defines the aggregate navigation, includes component navigation, and configures MkDocs, Mike, validation, and conditional PDF export. |
| `VERSION` | Supplies the version and optional alias to the publication workflow, in `<version>[|<alias>]` form. |
| `.github/workflows/publish_prod.yml` | Checks out submodules, installs the locked environment, builds with Mike, validates pull requests, and deploys eligible pushes. |
| `pyproject.toml` | Requires Python 3.12 or newer and declares the documentation tools. |
| `uv.lock` | Locks the resolved dependency versions used locally and in CI. |

The six component paths configured in `.gitmodules` are:

| Component | Path |
| --- | --- |
| REST API | `components/rest_api` |
| SDMX-CSV | `components/sdmx_csv` |
| SDMX-JSON | `components/sdmx_json` |
| SDMX-ML | `components/sdmx_ml` |
| Information Model, Framework, Logical Interfaces, and Technical Notes | `components/information_model` |
| Registry Specification | `components/sdmx_registry` |

The MkDocs monorepo plugin follows the `!include` entries in `mkdocs.yml` and
combines navigation and Markdown from those component checkouts with `docs/`.
The result is one site, but the source remains split across seven Git
repositories: this parent and the six components.

### Gitlinks and branch metadata

Each parent commit stores a **gitlink**, which pins a component path to one
exact component commit. A `branch` value in `.gitmodules` does not make the
parent or deployed site follow that branch automatically. It only selects the
upstream branch used when a maintainer explicitly runs `git submodule update
--remote` for that component. Without `--remote`, `git submodule update` checks
out the exact commit recorded by the parent.

This distinction creates two publication boundaries. First make the component
commit available in its upstream repository. Then update, review, validate,
and commit the corresponding gitlink in the parent. Pushing only the component
commit cannot rebuild the aggregate website: parent CI still checks out the
older commit pinned by the parent repository.

## Workstation setup

### Prerequisites

Install:

- Git with submodule support;
- Python 3.12 or newer; and
- `uv`, following its official installation instructions.

`uv` manages the project virtual environment, so manual activation is not
required.

### Fresh clone

Clone the parent and all nested submodules, then install exactly the locked
dependencies:

```bash
git clone --recurse-submodules <parent-repository-url> sdmx-technical-documentation
cd sdmx-technical-documentation
uv sync
```

Check that all six component paths are populated:

```bash
git submodule status --recursive
```

A leading `-` in that output means a submodule is not initialized.

### Existing clone

After pulling parent changes, synchronize local submodule configuration before
updating. This order matters when `.gitmodules` changed:

```bash
git pull --ff-only
git submodule sync --recursive
git submodule update --init --recursive
uv sync
```

The update without `--remote` restores the exact component commits recorded by
the checked-out parent commit. Use `git submodule update --init --recursive`
on its own when an existing clone simply lacks component content.

## Branch policy

Apply this policy consistently to every component repository:

- `develop` is the integration branch for active specification and
  documentation work.
- `master` contains the official released specification.
- When work on a new version starts, create
  `docs_v<MAJOR>.<MINOR>` from the previous version's final official component
  commit. For example, component version 2.2 uses `docs_v2.2`.

An old `docs_v<MAJOR>.<MINOR>` branch preserves released documentation. It may
receive small styling, typo, formatting, link-presentation, and equivalent
non-specification corrections. It must not be used to change the released
specification; such changes follow the normal `develop` to `master` release
process.

The parent publication workflow currently runs for pull requests and pushes on
`main`, `dev`, and `docs_v*.*`. These parent CI branch names do not change the
component branch responsibilities above.

## Routine component edit and parent-pointer update

Use one component at a time. In the commands below, `<component-path>` is one
of the six paths in the repository map and `<component-feature-branch>` is a
short-lived component branch.

### 1. Put a detached component on a working branch

A normal parent checkout often leaves submodules at a detached HEAD. That is
correct for reading and building, but do not start an edit there. Fetch the
component and attach it to the active integration branch:

```bash
git submodule update --init <component-path>
git -C <component-path> fetch origin
git -C <component-path> switch develop
git -C <component-path> pull --ff-only origin develop
git -C <component-path> switch -c <component-feature-branch>
```

If `develop` does not yet exist locally, replace the `switch develop` and
`pull` commands with:

```bash
git -C <component-path> switch --track -c develop origin/develop
```

Confirm the branch before editing:

```bash
git -C <component-path> status --short --branch
```

### 2. Commit and publish the component first

Edit and validate the component according to its own README. Then commit in the
component repository, not in the parent:

```bash
git -C <component-path> add <component-files>
git -C <component-path> diff --cached
git -C <component-path> commit -m "docs: <describe-component-change>"
git -C <component-path> push -u origin <component-feature-branch>
```

Have that change reviewed and merged into the branch named by the parent
`.gitmodules` entry before updating the parent pointer. Record the desired
component commit SHA.

### 3. Update only the intended parent gitlink

From the parent repository, synchronize metadata and update the selected
component from its configured remote branch:

```bash
git submodule sync --recursive
git submodule update --init --remote <component-path>
git -C <component-path> rev-parse HEAD
git status --short
```

Confirm that `rev-parse` reports the reviewed component commit. Build the
aggregate documentation, then inspect the parent gitlink change before staging
it:

```bash
uv run mkdocs build --strict
git diff --submodule=log -- <component-path>
git add <component-path>
git diff --cached --submodule=log -- <component-path>
git commit -m "docs: update <component-name> documentation"
```

The parent diff should show a submodule commit range, not component file
contents. A clean component with a changed gitlink appears as a modified path
in the parent `git status --short` output until the pointer is committed.

To update every component explicitly from its configured remote branch, use:

```bash
git submodule sync --recursive
git submodule update --init --recursive --remote
git status --short
git diff --submodule=log
```

This recursive form can advance unrelated components. Use it only when that is
intended, and review every changed gitlink. For routine work, prefer the
targeted form.

## Starting a new documentation version

This is an ordered transaction. Preserve the complete old aggregate version
before advancing the parent main line. Carry parent changes through reviewed
branches and pull requests as required by repository protection; “parent main”
below means the current main-line history, not permission to bypass review.

Do not reuse the aggregate version for every component. Define and verify these
values separately before starting:

| Placeholder | Meaning |
| --- | --- |
| `<old-aggregate-version>`, `<new-aggregate-version>` | Public aggregate documentation versions. |
| `<old-rest-version>`, `<new-rest-version>` | REST API versions. |
| `<old-csv-version>`, `<new-csv-version>` | SDMX-CSV versions. |
| `<old-json-version>`, `<new-json-version>` | SDMX-JSON versions. |
| `<old-ml-version>`, `<new-ml-version>` | SDMX-ML versions. |
| `<old-im-version>`, `<new-im-version>` | Information Model versions. |
| `<old-registry-version>`, `<new-registry-version>` | Registry Specification versions. |

REST, ML, JSON, CSV, information-model, registry, and aggregate versions may
differ. The 3.0 to 3.1 history is the model: the old parent branch retained old
component documentation branches and `VERSION` `3.0`, while main advanced its
gitlinks, visible component labels, and `VERSION` to `3.1|latest`.

### 1. Finalize every official component release

For each of the six components, finish review and validation on `develop`,
merge the approved release to `master`, and ensure the resulting official
commit is published to `origin/master`. Record each component's final official
commit SHA and actual old component version. Do not proceed with an unreviewed
or only-local component commit.

### 2. Preserve every old component version

In each component repository, create its old documentation branch from that
component's final official commit, using that component's own version:

```bash
git -C <component-path> fetch origin
git -C <component-path> switch --detach <old-component-official-sha>
git -C <component-path> switch -c docs_v<old-component-version>
git -C <component-path> push -u origin docs_v<old-component-version>
```

Repeat this for all six components and verify every remote branch resolves to
the recorded official SHA.

### 3. Commit a coherent old-version snapshot on the parent main line

Start from current parent `main` and create a review branch. Retarget each
`.gitmodules` entry to the matching old **component** version, never
mechanically to the aggregate version:

```bash
git switch main
git pull --ff-only
git switch -c chore/preserve-docs-<old-aggregate-version>
git config -f .gitmodules submodule.components/rest_api.branch docs_v<old-rest-version>
git config -f .gitmodules submodule.components/sdmx-csv.branch docs_v<old-csv-version>
git config -f .gitmodules submodule.components/sdmx-json.branch docs_v<old-json-version>
git config -f .gitmodules submodule.components/sdmx_ml.branch docs_v<old-ml-version>
git config -f .gitmodules submodule.components/information_model.branch docs_v<old-im-version>
git config -f .gitmodules submodule.components/sdmx_registry.branch docs_v<old-registry-version>
git submodule sync --recursive
git submodule update --init --remote \
  components/rest_api components/sdmx_csv components/sdmx_json \
  components/sdmx_ml components/information_model components/sdmx_registry
```

Verify each gitlink against the recorded old official SHA. Set the old
aggregate version with **no** alias, and confirm the file contains exactly that
value:

```bash
printf '%s\n' '<old-aggregate-version>' > VERSION
test "$(cat VERSION)" = '<old-aggregate-version>'
git submodule status
git diff --submodule=log
```

Confirm the navigation labels and PDF `cover_subtitle` in `mkdocs.yml` show the
actual old aggregate and component versions. Run both strict builds, commit all
old-snapshot metadata and gitlinks together, and merge the reviewed pull
request to parent `main`:

```bash
uv run mkdocs build --strict
ENABLE_PDF_EXPORT=1 uv run mkdocs build --strict
git add .gitmodules VERSION mkdocs.yml \
  components/rest_api components/sdmx_csv components/sdmx_json \
  components/sdmx_ml components/information_model components/sdmx_registry
git diff --cached --submodule=log
git commit -m "docs: preserve SDMX <old-aggregate-version> documentation"
```

Record the exact merged parent commit SHA. It is the coherent old-version
snapshot from which the parent maintenance branch must be created.

Removing `latest` before branching is essential. If the old branch retained
that alias, a later maintenance push could make the public default alias point
backward to the old version.

### 4. Create the old parent maintenance branch

Only after the old snapshot is on parent `main`, create and publish the parent
branch from that exact commit:

```bash
git switch main
git pull --ff-only
git branch docs_v<old-aggregate-version> <old-parent-snapshot-sha>
git push origin docs_v<old-aggregate-version>
```

Verify the branch contains the old `.gitmodules` branch values, matching old
gitlinks, the old visible labels, and `VERSION` without `|latest`.

### 5. Advance the parent main line to the new version

Return to current parent `main` and create the new-version review branch. Point
all component remote-update metadata back to active integration, synchronize
it, and update the gitlinks:

```bash
git switch main
git pull --ff-only
git switch -c feature/start-docs-<new-aggregate-version>
git config -f .gitmodules submodule.components/rest_api.branch develop
git config -f .gitmodules submodule.components/sdmx-csv.branch develop
git config -f .gitmodules submodule.components/sdmx-json.branch develop
git config -f .gitmodules submodule.components/sdmx_ml.branch develop
git config -f .gitmodules submodule.components/information_model.branch develop
git config -f .gitmodules submodule.components/sdmx_registry.branch develop
git submodule sync --recursive
git submodule update --init --remote \
  components/rest_api components/sdmx_csv components/sdmx_json \
  components/sdmx_ml components/information_model components/sdmx_registry
printf '%s\n' '<new-aggregate-version>|latest' > VERSION
```

In `mkdocs.yml`, update every component version in the navigation using its
own `<new-…-version>` value and set the PDF `cover_subtitle` to the new
aggregate version. Review every changed gitlink and label, then validate both
outputs:

```bash
git status --short
git diff --submodule=log
uv run mkdocs build --strict
ENABLE_PDF_EXPORT=1 uv run mkdocs build --strict
```

Commit the coherent new-version state and open a pull request to `main`. The PR
must pass CI before merge. Never create the old parent branch after these
new-version changes; doing so would preserve the wrong component commits or
labels.

## Preview, validation, and publication

Use the validation level appropriate to the work, and run the stricter levels
before a parent pull request:

1. Live preview while editing:

   ```bash
   uv run mkdocs serve
   ```

2. Strict HTML build:

   ```bash
   uv run mkdocs build --strict
   ```

3. Production-like strict build with PDF export enabled:

   ```bash
   ENABLE_PDF_EXPORT=1 uv run mkdocs build --strict
   ```

4. Pull-request validation: open a PR targeting a branch configured in
   `.github/workflows/publish_prod.yml`. CI checks out submodules recursively,
   runs `uv sync`, reads `VERSION`, and exercises the Mike build without
   pushing generated content. A push to a configured parent branch performs
   deployment through CI.

Never push directly to `gh-pages` or `gh-pages-preview`. They are generated
publication branches. Contributors change sources and gitlinks through normal
review; the workflow owns generated output and deployment.

## Common pitfalls

### Editing a detached submodule

Detached HEAD is normal for a pinned submodule checkout, but a commit made
there is easy to lose. Before editing, fetch, switch to `develop` (creating the
local tracking branch if needed), and create a feature branch. Check with
`git -C <component-path> status --short --branch`.

### Changed `.gitmodules` metadata has not taken effect

After pulling or editing `.gitmodules`, run `git submodule sync --recursive`
before any update. Otherwise local Git configuration may still use an earlier
URL or remote-update branch.

### The component changed but the site did not

A component push does not change the parent gitlink. Update the intended
component in the parent, confirm its SHA, review `git diff --submodule=log`,
and commit the gitlink. Only a parent workflow run can assemble and publish the
new pinned state.

### A recursive update changed unrelated components

`git submodule update --init --recursive --remote` can advance all six
gitlinks. Inspect `git status --short` and `git diff --submodule=log`, then keep
only reviewed, intentional component advances. Prefer a targeted update during
routine work.

### Aggregate and component versions were mixed

The aggregate SDMX version is not a substitute for REST, ML, JSON, CSV,
information-model, or registry versions. Recheck the separate version table,
each `docs_v<component-version>` branch, every gitlink, MkDocs navigation
label, `cover_subtitle`, and `VERSION` before committing a version transition.

### An image is too wide for A4 PDF output

An oversized image is a confirmed PDF-generation failure. Constrain it using
the repository's Markdown attribute-list syntax, for example:

```markdown
![Description](path/to/image.png){ width="550" }
```

Reduce the width further if necessary, then rerun the PDF-enabled strict build:

```bash
ENABLE_PDF_EXPORT=1 uv run mkdocs build --strict
```

Do not infer other build failures from this case. For other symptoms, first
check setup, submodule initialization and synchronization, the exact pinned
SHAs, and the current build output.

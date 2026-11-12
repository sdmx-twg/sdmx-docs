"""Prototype: add navigation context to page titles in Material's search index."""

import json
from html import escape
from pathlib import Path

from mkdocs.plugins import event_priority


_breadcrumbs: dict[str, str] = {}


def on_nav(nav, *, config, files):
    # Reset on each build, including rebuilds during `mkdocs serve`.
    _breadcrumbs.clear()
    for page in nav.pages:
        titles = [
            escape(ancestor.title)
            for ancestor in reversed(list(page.ancestors))
            if ancestor.title
        ]
        if titles:
            _breadcrumbs[page.url] = " › ".join(titles)


@event_priority(-100)
def on_post_build(*, config):
    # Run after Material has written the index. Only change the index on disk,
    # so page headings and Material's cache for incremental builds stay intact.
    index_path = Path(config.site_dir) / "search" / "search_index.json"
    if not index_path.is_file():
        return

    index = json.loads(index_path.read_text(encoding="utf-8"))
    for entry in index["docs"]:
        # Fragment URLs are the sections grouped beneath a page result.
        location = entry["location"]
        if "#" not in location and location in _breadcrumbs:
            entry["title"] = f"{_breadcrumbs[location]} › {entry['title']}"

    index_path.write_text(
        json.dumps(index, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )

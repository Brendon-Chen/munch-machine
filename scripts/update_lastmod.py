"""Write lastmod.json: the date each sitemap URL's page template last changed.

Dates come from git history, so they only move when a page's content does.
Templates with uncommitted changes get today's date, since they're about to
be committed. Runs automatically from .githooks/pre-commit.
"""
from __future__ import annotations

import json
import re
import subprocess
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "lastmod.json"

ROUTE_RE = re.compile(
    r'@app\.route\("([^"]+)"\)\s*\ndef \w+\(\):\s*\n\s*return render_template\(\s*"([^"]+)"'
)


def git(*args: str) -> str:
    return subprocess.run(
        ["git", *args], cwd=ROOT, capture_output=True, text=True, check=True
    ).stdout.strip()


def last_changed(template: Path) -> str | None:
    rel = template.relative_to(ROOT).as_posix()
    if git("status", "--porcelain", "--", rel):
        return date.today().isoformat()
    return git("log", "-1", "--format=%cs", "--", rel) or None


def main() -> None:
    sitemap_paths = set(
        re.findall(r"<loc>\{\{ base \}\}(/[^<]*)</loc>",
                   (ROOT / "templates/sitemap.xml").read_text(encoding="utf-8"))
    )
    routes = dict(ROUTE_RE.findall((ROOT / "app.py").read_text(encoding="utf-8")))

    result, missing = {}, []
    for path in sorted(sitemap_paths):
        tpl = routes.get(path)
        stamp = last_changed(ROOT / "templates" / tpl) if tpl else None
        if stamp:
            result[path] = stamp
        else:
            missing.append(path)

    OUT.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(f"lastmod.json: {len(result)} URLs dated")
    if missing:
        print("No date found (lastmod omitted):", ", ".join(missing))


if __name__ == "__main__":
    main()

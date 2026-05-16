"""Munch Machine landing page backend."""
from __future__ import annotations

import os
from datetime import date
from pathlib import Path

from flask import Flask, Response, jsonify, render_template, request

ROOT = Path(__file__).parent
app = Flask(__name__, template_folder=str(ROOT / "templates"), static_folder=str(ROOT / "static"))

SITE_URL = os.environ.get("SITE_URL", "").rstrip("/")


def _base_url() -> str:
    return SITE_URL or request.url_root.rstrip("/")


@app.route("/")
def index():
    return render_template("index.html", site_url=_base_url())


@app.route("/robots.txt")
def robots_txt():
    base = _base_url()
    body = f"User-agent: *\nAllow: /\nSitemap: {base}/sitemap.xml\n"
    return Response(body, mimetype="text/plain")


@app.route("/sitemap.xml")
def sitemap_xml():
    return (
        render_template("sitemap.xml", base=_base_url(), today=date.today().isoformat()),
        200,
        {"Content-Type": "application/xml; charset=utf-8"},
    )


@app.route("/api/inquiry", methods=["POST"])
def api_inquiry():
    data = request.get_json(silent=True) or {}
    return jsonify({"ok": True, "received": {k: data.get(k) for k in ("org", "email", "capacity")}})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True, use_reloader=True)

@app.route("/google617561aecc5ec7c1.html")
def google_verify():
    return "google-site-verification: google617561aecc5ec7c1.html"
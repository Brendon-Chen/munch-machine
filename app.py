"""Munch Machine landing page backend."""
from __future__ import annotations

import os
from datetime import date
from pathlib import Path

from flask import Flask, Response, render_template, request

ROOT = Path(__file__).parent
app = Flask(__name__, template_folder=str(ROOT / "templates"), static_folder=str(ROOT / "static"))

SITE_URL = os.environ.get("SITE_URL", "").rstrip("/")


def _base_url() -> str:
    return SITE_URL or request.url_root.rstrip("/")


def _ctx():
    return {"site_url": _base_url()}


@app.route("/")
def index():
    return render_template("index.html", site_url=_base_url())


@app.route("/resources")
def blog():
    return render_template("blog.html", **_ctx())


@app.route("/fremont-vending-services")
def page_fremont_vending():
    return render_template("pages/fremont-vending-services.html", **_ctx())


@app.route("/office-vending")
def page_office_vending():
    return render_template("pages/office-vending.html", **_ctx())


@app.route("/micro-markets")
def page_micro_markets():
    return render_template("pages/micro-markets.html", **_ctx())


@app.route("/healthy-vending")
def page_healthy_vending():
    return render_template("pages/healthy-vending.html", **_ctx())


@app.route("/warehouse-vending")
def page_warehouse_vending():
    return render_template("pages/warehouse-vending.html", **_ctx())


@app.route("/bay-area-vending-services")
def page_bay_area_vending():
    return render_template("pages/bay-area-vending-services.html", **_ctx())


@app.route("/break-room-solutions")
def page_break_room():
    return render_template("pages/break-room-solutions.html", **_ctx())


@app.route("/cashless-vending")
def page_cashless_vending():
    return render_template("pages/cashless-vending.html", **_ctx())


@app.route("/silicon-valley-vending")
def page_silicon_valley_vending():
    return render_template("pages/silicon-valley-vending.html", **_ctx())


@app.route("/newark-vending-services")
def page_newark_vending():
    return render_template("pages/newark-vending-services.html", **_ctx())


@app.route("/san-jose-vending-services")
def page_san_jose_vending():
    return render_template("pages/san-jose-vending-services.html", **_ctx())


@app.route("/inquire")
def page_inquire():
    return render_template("pages/inquire.html", **_ctx())


# --- Batch 3: City pages ---

@app.route("/hayward-vending-services")
def page_hayward_vending():
    return render_template("pages/hayward-vending-services.html", **_ctx())


@app.route("/union-city-vending-services")
def page_union_city_vending():
    return render_template("pages/union-city-vending-services.html", **_ctx())


@app.route("/milpitas-vending-services")
def page_milpitas_vending():
    return render_template("pages/milpitas-vending-services.html", **_ctx())


@app.route("/sunnyvale-vending-services")
def page_sunnyvale_vending():
    return render_template("pages/sunnyvale-vending-services.html", **_ctx())


@app.route("/mountain-view-vending")
def page_mountain_view_vending():
    return render_template("pages/mountain-view-vending.html", **_ctx())


@app.route("/oakland-vending-services")
def page_oakland_vending():
    return render_template("pages/oakland-vending-services.html", **_ctx())


@app.route("/pleasanton-vending-services")
def page_pleasanton_vending():
    return render_template("pages/pleasanton-vending-services.html", **_ctx())


# --- Industry pages ---

@app.route("/apartment-vending")
def page_apartment_vending():
    return render_template("pages/apartment-vending.html", **_ctx())


@app.route("/coworking-vending")
def page_coworking_vending():
    return render_template("pages/coworking-vending.html", **_ctx())


@app.route("/gym-vending")
def page_gym_vending():
    return render_template("pages/gym-vending.html", **_ctx())


@app.route("/manufacturing-vending")
def page_manufacturing_vending():
    return render_template("pages/manufacturing-vending.html", **_ctx())


@app.route("/school-vending")
def page_school_vending():
    return render_template("pages/school-vending.html", **_ctx())


@app.route("/corporate-campus-vending")
def page_corporate_campus():
    return render_template("pages/corporate-campus-vending.html", **_ctx())


# --- Service long-tail pages ---

@app.route("/managed-vending-services")
def page_managed_vending():
    return render_template("pages/managed-vending-services.html", **_ctx())


@app.route("/full-service-vending")
def page_full_service_vending():
    return render_template("pages/full-service-vending.html", **_ctx())


@app.route("/vending-machine-installation")
def page_vending_installation():
    return render_template("pages/vending-machine-installation.html", **_ctx())


@app.route("/vending-machine-restocking")
def page_vending_restocking():
    return render_template("pages/vending-machine-restocking.html", **_ctx())


@app.route("/office-snack-delivery")
def page_office_snack_delivery():
    return render_template("pages/office-snack-delivery.html", **_ctx())


# --- Workplace culture guides ---

@app.route("/why-employees-come-to-the-office")
def guide_hybrid_office():
    return render_template("pages/why-employees-come-to-the-office.html", **_ctx())


@app.route("/break-room-audit")
def guide_break_room_audit():
    return render_template("pages/break-room-audit.html", **_ctx())


@app.route("/cost-of-employee-turnover")
def guide_turnover_cost():
    return render_template("pages/cost-of-employee-turnover.html", **_ctx())


@app.route("/what-candidates-notice-on-an-office-tour")
def guide_office_tour():
    return render_template("pages/what-candidates-notice-office-tour.html", **_ctx())


@app.route("/office-perks-that-actually-matter")
def guide_office_perks():
    return render_template("pages/office-perks-that-actually-matter.html", **_ctx())


@app.route("/the-hidden-cost-of-the-coffee-run")
def guide_coffee_run():
    return render_template("pages/hidden-cost-of-the-coffee-run.html", **_ctx())


# --- Question-based pages ---

@app.route("/how-office-vending-works")
def page_how_vending_works():
    return render_template("pages/how-office-vending-works.html", **_ctx())


@app.route("/how-to-get-a-vending-machine")
def page_how_to_get_vending():
    return render_template("pages/how-to-get-a-vending-machine.html", **_ctx())


@app.route("/vending-service-vs-owning")
def page_vending_vs_owning():
    return render_template("pages/vending-service-vs-owning.html", **_ctx())


@app.route("/benefits-of-office-vending")
def page_vending_benefits():
    return render_template("pages/benefits-of-office-vending.html", **_ctx())


@app.route("/how-much-does-vending-cost")
def page_vending_cost():
    return render_template("pages/how-much-does-vending-cost.html", **_ctx())


# --- Research pages ---

@app.route("/research/afternoon-energy-crash")
def research_afternoon_crash():
    return render_template("research/afternoon-energy-crash.html", **_ctx())


@app.route("/research/dehydration-at-work")
def research_dehydration():
    return render_template("research/dehydration-at-work.html", **_ctx())


@app.route("/research/choice-architecture-break-room")
def research_choice_architecture():
    return render_template("research/choice-architecture-break-room.html", **_ctx())


@app.route("/research/work-breaks-and-performance")
def research_work_breaks():
    return render_template("research/work-breaks-and-performance.html", **_ctx())


# --- Consumer tips ---

@app.route("/tips/how-to-pick-a-healthy-snack")
def tip_healthy_snack():
    return render_template("tips/how-to-pick-a-healthy-snack.html", **_ctx())


@app.route("/tips/how-many-snacks-a-day")
def tip_snacks_per_day():
    return render_template("tips/how-many-snacks-a-day.html", **_ctx())


@app.route("/tips/best-snacks-for-energy")
def tip_snacks_energy():
    return render_template("tips/best-snacks-for-energy.html", **_ctx())


@app.route("/tips/healthy-vending-options")
def tip_healthy_options():
    return render_template("tips/healthy-vending-options.html", **_ctx())


@app.route("/tips/snacks-for-work-break")
def tip_work_break_snacks():
    return render_template("tips/snacks-for-work-break.html", **_ctx())


@app.route("/tips/workplace-snack-benefits")
def tip_workplace_benefits():
    return render_template("tips/workplace-snack-benefits.html", **_ctx())


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


@app.route("/googlea56dbcb37b555c0c.html")
def google_verify():
    return "google-site-verification: googlea56dbcb37b555c0c.html"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True, use_reloader=True)
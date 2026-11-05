# Munch Machine — website

Marketing and lead-generation site for **Munch Machine LLC**, a Fremont, CA managed-vending company: free-to-host, AI-powered cashless snack and drink machines (plus micro markets), stocked and serviced by us. Audience: Bay Area businesses (offices, warehouses, gyms, apartments, coworking, property managers). Primary goals: **leads** (`/inquire`) and **Google ranking**.

Live: https://munch-machine.com · Contact: (925) 583-4228 · admin@munch-machine.com

## Stack and running it

- Flask (`app.py`) + Jinja templates, deployed on **Vercel** (`vercel.json`, `@vercel/python`). No database, no build step.
- Run locally: `launch.bat` (port 5050), or `venv\Scripts\python.exe app.py`.
- JS: `static/js/main.js` plus vendored GSAP, ScrollTrigger and Lenis in `static/js/vendor/`.
- CSS: `static/css/main.css` (theme tokens, header, homepage pieces) and `static/css/pages.css` (all inner-page components).
- `SITE_URL` env var sets canonical and schema URLs; otherwise they come from the request host. Live canonical is `https://munch-machine.com/`.

## Repo map

- `templates/base.html`: layout for every page **except the homepage**. Head, header and nav, footer.
- `templates/index.html`: the **homepage is standalone**. It has its own `<head>`, header, footer, intro overlay and **inline CSS** (copies of the hero and nav styles). Any change to the head, nav, footer or shared styles must be made in **both** base.html and index.html (or in a partial both include).
- `templates/partials/`: `google_tag.html` (GTM, included first in `<head>` of both layouts) `service_area_nav.html` (Service area dropdown, included in both navs), `service_areas.html` (the city list both menus import; add new city pages here), and `mobile_nav.html` (menu button + full-screen panel below 900px: `styles()`, `toggle()`, `panel()` macros, imported by both layouts; JS in main.js "MOBILE NAV"). Below 560px the header goes compact (smaller logo, CTA without arrow); below 360px the wordmark is visually hidden so logo mark + CTA + menu button still fit.
- `templates/pages/`: service, city, guide and utility pages. `templates/research/` and `templates/tips/` hold articles.
- `templates/blog.html`: the `/resources` hub of cards grouped by category. `templates/sitemap.xml`: hand-maintained URL list.
- `templates/emails/announcement.txt`: HTML cold-outreach email (table layout, inline styles, VML buttons). Not served by Flask.
- `scripts/update_lastmod.py` writes `lastmod.json` (sitemap `<lastmod>` from git history). Run automatically by `.githooks/pre-commit`; on a new clone, run `git config core.hooksPath .githooks` once.
- `Reference/`: early concept material. **`Reference/DESIGN.md` is superseded.** It describes a dark Manrope / neon-green theme that is *not* the live design. Use the CSS and the Design section below instead.

## Adding a page (checklist)

1. Route in `app.py`: `@app.route("/slug")` → `render_template("pages/slug.html", **_ctx())`. Keep the single-line `return render_template("...")` form, which `update_lastmod.py` parses.
2. The template extends `base.html` and fills `title`, `meta_description`, `canonical_path`, `og_url_path`, `og_title`, `og_description`, `twitter_title`, `twitter_description`, plus `schema` (JSON-LD) where useful.
3. Add it to `templates/sitemap.xml` (unless it's a utility page) and add a card to `templates/blog.html` in the right category.
4. Add `related-links` to and from sibling pages. Use `url_for(...)` and check that endpoint names exist.
5. Utility pages (`/feedback`, `/thank-you`) use `{% block robots %}noindex…{% endblock %}` and stay out of the sitemap.

## Forms, analytics, ads

- Forms post via fetch to **Formspree**. The generic handler in `main.js` binds every `form[data-endpoint]`.
  - Business inquiries (`/inquire` and the homepage form): `https://formspree.io/f/mqejkyvn`, with `data-success-url="/thank-you"`.
  - Customer feedback and referrals (`/feedback`, the QR code on machines, `?m=<machine-id>`): `https://formspree.io/f/xbgdzwqa`. It shows an in-page thank-you, not a redirect. Referral bonus: $100 cash or Venmo when a machine is installed.
- `/thank-you` is the **Google Ads conversion page** (URL-based). Don't rename it, link it in nav, or make other flows land on it.
- Google Tag Manager container **GTM-NTQZZ3JR** (contains Ads tag `AW-18547222648`) must stay on every page, exactly once, first in `<head>`.
- Homepage JSON-LD includes `WebSite` (site name "Munch Machine"; `url` must equal the canonical exactly), plus `LocalBusiness` (`#business`), `Service` and `FAQPage`.
- The `/googlea56dbcb37b555c0c.html` route in `app.py` is Search Console verification. Leave it untouched.

## Content and SEO rules (the owner has asked for these)

- **Titles and slugs are plain and search-friendly**: name the query people type ("How to Choose a Service Vendor"), not a concept ("The Vendor Reliability Checklist"). Format: `Page Title | Munch Machine`.
- **No claims that overstate scale**: no "route density", "dedicated team", "clients like…", "trusted by", fleet or client counts, or "most/highest of any market we serve".
- **No headcount or space minimums** anywhere. Qualification is "consistent daily traffic" and "we assess each location individually".
- Only use claims the site can back up: $0 to host, reply within 24 hours, setup in about 2 weeks, cashless, AI-powered machines with live inventory, built-in advertising panels. Don't add "same-day response" or "no contracts" unless the owner confirms them.
- Voice: premium, confident, specific, human. No fluff or clichés, short paragraphs, scannable.
- Service areas (nav dropdown): Fremont, San Jose, Palo Alto, Menlo Park, Union City, Newark, Milpitas. City pages also exist for Hayward, Sunnyvale, Mountain View, Oakland, Pleasanton, Silicon Valley and Bay Area.

## Design system (live; source of truth is the CSS)

**Theme: "Editorial Organic"**. Warm cream paper, near-black ink, a single sage accent. Calm, spacious, magazine-like.

Tokens (`:root` in `main.css`, duplicated inline in index.html):

| Token | Value | Use |
|---|---|---|
| `--cream` | #EAE6E0 | page background, light text on dark |
| `--cream-warm` | #E2DDD4 | cards, callouts, footer, hover fills |
| `--sand` | #C8B99B | subtle accents |
| `--ink` / `--ink-soft` | #111111 / #222220 | text, dark sections, primary buttons |
| `--muted` / `--muted-soft` | #4A4A47 / #7A7A76 | body copy, labels, fine print |
| `--line` | #C4BAA8 | 1px hairline rules and borders |
| `--sage` / `--sage-deep` / `--sage-light` | #3F6B4A / #2C4D34 / #8DA68F | the only accent: italics, links, active states (`--sage-light` on dark) |

Typography:
- **Fraunces** (serif, weight 300–500): headings and display. Tight tracking (−0.02 to −0.04em), line-height about 0.95–1.2.
- **Inter** (300–600): body and UI.
- **Signature move**: the second half of a headline in *italic sage*, e.g. `<h1>Host a <em>machine.</em></h1>`.
- **Eyebrow labels**: 11px, uppercase, 0.18–0.2em tracking, muted (sage-light on dark).
- Icons: Material Symbols Outlined (weight 300).

Patterns:
- **Inner pages** = dark `page-hero` (ink, faint sage radial glow, cream text) → cream `prose-section`. Homepage hero is light. base.html's header carries `on-dark` (cream text and CTA until scrolled); a page with a light top overrides `{% block header_theme %}{% endblock %}` to opt out.
- **Buttons**: pill-shaped (radius 999px). Primary is ink with cream text; on dark, cream with ink text. Form submit is sage.
- **Borders**: 1px `--line` hairlines are part of this look (dividers, tables, meta strips). Cards are cream-warm and usually borderless or hairline.
- **Reuse existing components** from `pages.css` before inventing new ones: `page-hero-meta`, `callout`, `feat-grid`, `steps-list`, `audit-list`, `comparison-table`, `pillar-list`, `score-grid`, `page-faq`, `related-links`, `page-cta`, `blog-card`, and the dark form panel (`inquire-form-wrap`, `field`, `submit-btn`).
- Spacing is generous; prefer more whitespace over denser layouts. Keep layouts responsive with no horizontal scroll at 375px.

Motion (`main.js`):
- **Homepage intro** (GSAP timeline in `runIntro`): the vending-machine logo draws in about 1.9s; the "Munch Machine" letters start about 1.0s in; then the curtain exit (0.7s close, 0.6s fade, 0.7s open, the original timing the owner wants kept). The hero headline lines and fade-ins start with the curtain opening. `bootSite()` runs once, guarded, when the curtains finish; safety timers are 7s and 9s.
- Scroll reveals: `[data-reveal]` (fade up, `data-reveal-delay`) and `[data-reveal-lines]`. Hero reveal lines use extended masks so descenders aren't clipped.
- Lenis smooth scroll; a custom "target cursor" snaps to `.cursor-target` elements.

## Verifying changes

- Smoke test: Flask test client over every GET route (status 200, JSON-LD parses), plus spot checks of the rendered HTML.
- Behaviour, layout and animation: Playwright driving installed Chrome (`channel="chrome"`) against `app.run(port=5055)`. Install Playwright in a throwaway venv in the scratchpad, not the project venv. Intercept `https://formspree.io/**` so tests never send real submissions.
- `node --check static/js/main.js` after JS edits.

## Working with the owner

- Show changes in the actual browser when layout or animation is involved; screenshots catch what HTML checks miss.
- Ask before changing URLs of live, indexed pages (they need 301s); titles and copy can change freely.
- The owner commits; don't commit or push unless asked.

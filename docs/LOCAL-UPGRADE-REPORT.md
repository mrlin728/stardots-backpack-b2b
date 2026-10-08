# Stardots Bags — local upgrade handoff

Completed 2026-10-07. Local preview only; no deployment, live CMS mutation, form transmission or production domain change.

## Design

Direction: **Carry what comes next**. Editorial Portfolio Chapters + Build Awwwards-Quality Sites. Burgundy / parchment / acid-yellow palette; split editorial cover; staggered product edit; large typographic family index; development notebook; buyer reading; final invitation. Shared type, spacing, image frames, buttons, navigation and footer cover the full EN/Chinese route set, catalog filtering, model galleries, service/buyer/resource content and contact form.

The design targets the requested craft bar. It has not been evaluated by an award jury and does not claim an award or guaranteed award eligibility.

## Content and assets

- 67 products and their bilingual details retained from the live-matching release snapshot `80b45652-f83a-4587-ae46-00de45fe6f96`, original hash `40f7df1e37394d6099bf67746b9628666c408475c589c727d3c4cd0dc5051deb`, source commit `d019b1bbb97c5c77dc212dcac370697aa7682598`.
- `content/release.snapshot.json` preserves that source snapshot. `content/local.snapshot.json` is the local derivative with localized asset URLs and release label `local-review-bags-2026-10-07`.
- All 143 original product photographs downloaded from existing public Stardots storage into `public/images/catalog`. Source URLs mapped in `docs/local-media-provenance.json`. Existing 67 AVIF catalog derivatives retained.
- Existing hero/development images are illustrative, labeled in the home layout; they are not evidence of specific inventory, factory equipment or capabilities.
- Local DM Sans variable font with SIL OFL license in `public/fonts/OFL.txt`; no external font requests.
- No new business certifications, prices, customer evidence, product specs or lead-time promises.

## Motion and interaction

GSAP 3.15.0 (Standard no-charge license) and Lenis 1.3.26 (MIT), inspected through official npm metadata with no installation scripts. Exactly one smooth-scroll instance, GSAP ticker + ScrollTrigger synchronization, cleanup on unmount and motion-preference change. Motion modules load separately and are bypassed completely when reduced motion is enabled. Static prerendered content is readable before JavaScript and all animation is additive; no text opacity hiding. Three.js is intentionally absent.

Contact form has no API path in the local UI. It validates entries, constructs an email draft and states that the buyer must send it. No submission success or delivered-success claim is shown. Vite local API middleware was removed; production API source is retained for provenance only and is not part of the static `dist` deployment output.

## Quality iterations

1. Full home/chapter design and shared interior system.
2. Independent review found inherited CTA pseudo-gradient and footer specificity causing poor contrast; removed overlays and overrode exact footer selectors. Mobile metadata raised to 10px.
3. Main JS split from 554KB to 423KB, with animation loaded separately; reduced motion loads no animation modules.
4. Old provenance detector matched 'AI' inside 'retained', leaking English implementation text into Chinese details. Fixed with word-boundary detection; conceptual reference note is now one localized explanation.
5. Runtime axe contact-page audit found eight low-contrast supporting text nodes inherited from older styles. Darkened form metadata and contact labels, and lightened footer paragraphs/copyright with exact selectors. Expanded six-template review additionally darkened guide/service numbering and model breadcrumbs. Root performs the final runtime recheck.
6. Existing build dependency `source-map-js` updated to fix its reported advisory; npm audit is clean.

## Validation

- Production build + 192-route EN/Chinese prerender + locale checker: passed.
- Existing unit/integrity tests: 21/21 passed. Media integrity test adapted to verify local original bytes AND their original source mappings.
- Static audit: 194 HTML files including two fallback pages, 1,438 image references, 8,752 internal links; zero missing files/targets, zero external runtime resources.
- Root/reviewer visual and interaction QA cover desktop/mobile home, product filtering, model gallery, Chinese detail, language state, navigation and form flow. Cross-site evidence is owned by the parent handoff.
- npm audit including development dependencies: zero vulnerabilities after patch.
- Main bundle ~423KB / 130KB gzip; stylesheet ~104KB / 20KB gzip; optional motion chunks separate.

## Run and rebuild

Production output: `dist/`. Root's desktop launcher serves the existing build at `http://127.0.0.1:4382`, with GET/HEAD-only static serving and API writes blocked. Standard Vite preview is also available:

```sh
PATH=/opt/homebrew/bin:$PATH npm run preview -- --port 4382
```

Rebuild:

```sh
PATH=/opt/homebrew/bin:$PATH npm ci --ignore-scripts
PATH=/opt/homebrew/bin:$PATH npm run build
PATH=/opt/homebrew/bin:$PATH npm test
python3 work/check-static.py
```

Node 26.9.0 was used for validation. No credentials are required for the local build. Source includes historical API code, but it is not served or called by the local preview.

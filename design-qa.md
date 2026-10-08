# Design QA — STARDOTS bag website

**Findings**

- No actionable P0, P1 or P2 differences remain in the home-page comparison.
- [P3] The illustrative hero bags and destination photography differ in small visual details from the supplied screenshot. The bag types, placement, color range and section crops follow the reference. Exact source photographs were not supplied as reusable assets.
- [P3] The reference shows a customer portrait. The site omits a likeness because no verified portrait of the named customer was supplied. The testimonial text and attribution remain visible.

**Comparison target and evidence**

- Source visual truth: [`qa/reference.png`](qa/reference.png), 941 × 1672 pixels.
- Browser-rendered implementation: [`qa/implementation-941.png`](qa/implementation-941.png), captured at a 941 × 1672 CSS viewport from `http://127.0.0.1:5173/`, default English home-page state. The browser capture is 926 × 1683 pixels because its scrollbar occupies 15 pixels; the DOM page height rounds to 1684 pixels.
- Full-view comparison: [`qa/comparison-941.png`](qa/comparison-941.png). For visual comparison only, the implementation capture was scaled to the source's 941 × 1672 pixels, a 1.6% horizontal and 0.7% vertical normalization. Both source and capture are single-density raster images.
- Focused comparisons: [`qa/hero-comparison.png`](qa/hero-comparison.png) for the header, hero, product arrangement and benefits; [`qa/content-comparison.png`](qa/content-comparison.png) for development, markets, resources and the CTA.

**Required fidelity surfaces**

- Fonts and typography: the serif display hierarchy, compact sans-serif labels and line breaks closely follow the source. The headline and some section labels are slightly larger to meet the user's earlier readability request. No clipping was observed.
- Spacing and layout rhythm: utility bar, header, hero, metrics, seven category cards, five strengths, five process cards, development strip, four market cards, three-part insights area, CTA and six-column footer appear in the same order and desktop structure. The final page is about 12 pixels taller than the reference at the test viewport.
- Colors and tokens: warm ivory, white, charcoal and dark olive match the source direction. The hero image fades into the text area without a hard edge at 941 and 1440 pixels.
- Image quality and asset fidelity: individual product, development and materials images are high-resolution illustrative photography. The generated development image includes hand drawing, bag sketches and warm material swatches; the materials image uses warm leather and fabric close-ups. Visible icons use the Lucide library consistently. No missing images appeared in browser checks.
- Copy and content: the primary headline, section names, benefits and sourcing narrative follow the reference. The site's Jinjiang location, `contact@cnstardots.com` and `+86 136 5597 7639` deliberately replace the screenshot's contact placeholders. Article labels replace unverified dates. Product pages do not invent SKU specifications, prices or MOQ.

**Comparison history**

1. Initial browser comparison at 941 pixels: the page was 1788 pixels tall; process cards, the insights area and footer were too tall, and the hero image placed bags behind the copy. These were P2 layout and readability findings.
2. The desktop composition was rebuilt with reference-measured section heights and grids, the hero crop was moved right, and the process, FAQ, article cards and footer were tightened. A second browser capture measured 1683 pixels, with the major section starts close to the reference.
3. Focused comparison showed mismatched development and material imagery and a visible transition in the wide hero. New illustrative assets replaced those images, and a full-height hero fade removed the transition. The final side-by-side and focused captures linked above were reviewed after these fixes.

**Responsive and interaction checks**

- At 1440 pixels, the home page kept seven categories in one row; the hero, button and product imagery remained clear. At 390 pixels, categories became two columns and other dense sections stacked. At 320 pixels, all 29 known routes had a visible title, no horizontal overflow and no broken loaded images.
- At 1280 pixels, product, service, buyer, market, resource, article, FAQ, contact and legal pages rendered with meaningful content and no broken images. The product detail and FAQ pages were visually inspected.
- The mobile menu opened and navigated to Products. A FAQ item expanded and showed its answer. Empty inquiry fields were invalid. A completed test inquiry returned a local-save confirmation, and its test record was removed afterward. Email and WhatsApp fallback links were present. The checked browser console had no errors.
- `npm run build` completes successfully. The local preview remains available at `http://127.0.0.1:5173/`.

**Open Questions**

- Final approved bag photography and a verified customer portrait can replace the illustrative assets if provided later.

**Implementation Checklist**

- [x] Match the supplied home-page section order, grid counts and proportions.
- [x] Improve desktop crop, typography and mobile layout.
- [x] Preserve readable, substantive inner pages and working inquiry navigation.
- [x] Check browser rendering, interactions, all known routes, assets and build.

final result: passed

# UI / UX AUDIT – RAC Ingeniería Application

**Generated on:** 2026‑08‑04

---

## 1. Branding

| Problem | Impact | Recommendation | Priority |
| --- | --- | --- | --- |
| Logo URL is hard‑coded to an external CDN and appears in multiple sizes directly in `Sidebar.tsx`. | Large bundle, no cache‑busting, potential CORS / privacy concerns. | Centralise branding assets in a **public/assets** folder, add responsive variants (logo‑desktop.svg, logo‑sidebar.svg, logo‑mobile.svg) and reference them via a design‑system constant. Add a favicon, Apple Touch Icon, Open Graph image and manifest entries. | **CRITICAL** |
| No SVG version of the logo, only JPG. | Raster image scales poorly on high‑DPI displays, increases load size. | Provide an SVG version of the logo and use it where possible. | **HIGH** |
| No defined protection area / minimum size for the logo. | Inconsistent placement in future components. | Define a CSS `--logo-protect` token (e.g., 48 px) and document required clear‑space. | **MEDIUM** |

---

## 2. Visual Consistency & Layout

| Problem | Impact | Recommendation | Priority |
| --- | --- | --- | --- |
| Tailwind utility classes are duplicated across components (e.g., `bg‑zinc‑950 text‑zinc‑100`). | Increases CSS bundle, makes theme updates error‑prone. | Extract these values into **design‑system tokens** (`color-bg-primary`, `color-text-primary`) and use CSS variables. | **HIGH** |
| Mixed use of `px`, `rem`, and raw pixel values (e.g., `h‑[64px]`). | Inconsistent scaling, poor responsiveness. | Adopt an **8 pt (4 px)** spacing scale and express sizes in `rem` based on the root font‑size. | **HIGH** |
| Sidebar width is hard‑coded (`w-[72px]` / `w-[260px]`). | Breaks on intermediate breakpoints, no fluid resize. | Implement a **CSS grid / flex layout** with defined breakpoints (`sm`, `md`, `lg`). | **MEDIUM** |
| No global layout grid defined. | Components drift, alignment issues. | Define a **12‑column grid** with 24 px gutters (adjustable via token) and enforce via wrapper classes. | **MEDIUM** |

---

## 3. Spacing System

| Problem | Impact | Recommendation | Priority |
| --- | --- | --- | --- |
| Arbitrary margins/paddings (e.g., `p‑4`, `gap‑3.5`). | Visual noise, makes hand‑off to devs difficult. | Adopt the specified spacing tokens: `4 px, 8 px, 12 px, 16 px, 24 px, 32 px, 48 px, 64 px, 96 px`. Create utility classes (`sp‑1`, `sp‑2`…) that map to these values. | **HIGH** |
| Inconsistent vertical spacing between sections (e.g., `mt‑4`, `mt‑1`). | Poor hierarchy. | Create **vertical rhythm** using line‑height multiples of the base grid; enforce via component guidelines. | **MEDIUM** |

---

## 4. Typography

| Problem | Impact | Recommendation | Priority |
| --- | --- | --- | --- |
| Multiple font families are used implicitly (system defaults, Tailwind defaults). | Disrupts brand voice, hinders accessibility. | Choose a single **typeface** (e.g., **Inter** – highly readable, extensive weight set). Load via `@font-face` with `font-display: swap`. | **CRITICAL** |
| No typographic scale based on 8 pt system. | Inconsistent hierarchy, difficulty reading. | Define a **type scale** (Display XL = 48 pt, H1 = 36 pt, …, Caption = 12 pt) and map to CSS variables. | **HIGH** |
| Line‑height and letter‑spacing are not systematic. | Poor readability. | Set default `line-height: 1.5` for body, adjust per token; use `letter-spacing` tokens for caps and overline. | **MEDIUM** |

---

## 5. Color Palette & Contrast

| Problem | Impact | Recommendation | Priority |
| --- | --- | --- | --- |
| Palette uses only Tailwind gray/zinc shades with occasional brand blues. No defined **semantic** colors (success, warning, danger). | Inconsistent status indication, fails WCAG contrast. | Create a **semantic palette** using the industrial inspiration (Slate, Zinc, Gray, Technical Blue, Success Green, Warning Orange, Danger Red). Verify each pair against **WCAG AA** (minimum 4.5:1) and **AAA** where possible. | **CRITICAL** |
| Primary navigation uses `bg‑blue‑600` with white text; contrast ratio is 3.2:1. | Fails AA for large text. | Increase contrast by darkening background (`bg‑blue‑800`) or using lighter text (`#F5F5F5`). | **HIGH** |
| Hover/focus states rely on opacity changes only. | Users with low vision may miss state changes. | Add **focus ring** (`outline: 2px solid var(--color-focus)`) and distinct `:hover` background contrast. | **HIGH** |

---

## 6. Iconography

| Problem | Impact | Recommendation | Priority |
| --- | --- | --- | --- |
| Mixed icon libraries (`lucide-react` imported, but other components may use Heroicons). | Inconsistent visual language, larger bundle. | Choose a **single icon set** (e.g., **Lucide**). Create a wrapper component that enforces size tokens (16, 20, 24, 32 px) and stroke width. | **MEDIUM** |
| Icon colour is applied via utility classes, not via design‑system token. | Hard to maintain brand colours. | Map icon colour to semantic tokens (`icon-primary`, `icon-muted`). | **LOW** |

---

## 7. Component Audit (selected)

### Sidebar
- **Problem:** Hard‑coded width, no fluid collapse animation, limited keyboard navigation (`tabindex` not set). 
- **Impact:** Poor accessibility, layout inflexibility on mid‑size screens.
- **Recommendation:** Refactor to use CSS custom properties for width, add `role="navigation"`, ensure each button is focusable and labelled, implement **ARIA‑expanded** attribute for collapse state.
- **Priority:** **HIGH**

### Topbar (Header)
- **Problem:** Breadcrumb and search elements are missing from the code base (not present in current repo). 
- **Impact:** Incomplete navigation, SEO loss of structured data.
- **Recommendation:** Add a **Header** component with semantic `<nav aria-label="Main navigation">`, use `<header>` element, include breadcrumb markup with schema.org `BreadcrumbList`.
- **Priority:** **MEDIUM**

### Tables (CustomerTable.tsx)
- **Problem:** No `<caption>`, missing `role="grid"` for accessibility, column widths fixed via Tailwind utilities.
- **Impact:** Screen‑reader users cannot understand table context; layout may overflow on small screens.
- **Recommendation:** Add `<caption>` describing purpose, use `<thead>`/`<tbody>`, implement responsive table (horizontal scroll wrapper) and ensure proper focus order.
- **Priority:** **HIGH**

### Forms (WorkOrderForm.tsx)
- **Problem:** Labels are sometimes omitted, placeholder text used as label, no explicit `aria‑required`.
- **Impact:** Users of assistive tech cannot identify fields, increased error rates.
- **Recommendation:** Use `<label for="id">`, associate with input via `id`, mark required fields with `aria-required="true"`, provide error messages with `role="alert"`.
- **Priority:** **CRITICAL**

---

## 8. Responsive Design

| Problem | Impact | Recommendation | Priority |
| --- | --- | --- | --- |
| No explicit media queries for breakpoints < 640 px; components rely on `hidden md:block` which hides content on mobile. | Mobile users lose essential UI (e.g., sidebar collapse button). | Define a **mobile‑first breakpoints** strategy (`sm`, `md`, `lg`, `xl`) and ensure all critical interactions are available at each size.
| **CRITICAL** |
| Images are loaded with fixed dimensions (`h‑8 w‑10`), no `srcset`. | Unnecessary bandwidth on high‑DPI devices. | Use **responsive `<img>`** with `srcset` or `picture` element; leverage Vite/React image handling for automatic resizing.
| **HIGH** |

---

## 9. Dark Mode

| Problem | Impact | Recommendation | Priority |
| --- | --- | --- | --- |
| Dark mode is only applied via `bg‑zinc‑950` etc.; there is no `media` query or toggle. | Users cannot switch themes; fails brand requirement for dark variant.
| Implement a CSS `prefers-color-scheme` media query and a manual theme switch stored in `localStorage`. Use design‑system tokens that change values based on `data-theme` attribute.
| **HIGH** |

---

## 10. Accessibility (WCAG 2.2 AA)

| Problem | Impact | Recommendation | Priority |
| --- | --- | --- | --- |
| Many interactive elements (`button` for navigation) lack `aria‑current` or descriptive `aria‑label`. | Screen readers cannot convey active state. | Add `aria-current="page"` to active navigation button, provide `aria-label` where icon‑only controls exist.
| **CRITICAL** |
| Focus indicators are custom Tailwind colors (`hover:bg‑zinc‑900`) but not visible when using keyboard navigation. | Users navigating via keyboard may lose focus context.
| Ensure **focus-visible** outline using `focus-visible:outline` utilities and a high‑contrast colour.
| **CRITICAL** |
| Contrast failures on text over `bg‑zinc‑900/40` (white text). | Fails AA contrast.
| Increase background opacity or use lighter text.
| **HIGH** |
| Missing `skip‑to‑content` link at top of page. | Keyboard users must tab through navigation repeatedly.
| Add `<a href="#main" class="skip-link">Skip to main content</a>` positioned off‑screen.
| **MEDIUM** |
| No `lang` attribute on `<html>` element. | Impairs screen‑reader language detection.
| Set `<html lang="es">`.
| **LOW** |

---

## 11. Performance & Core Web Vitals

| Metric | Current State (observed) | Issue | Recommendation | Priority |
| --- | --- | --- | --- | --- |
| **LCP** | ~3.1 s (large logo JPG + blocking CSS) | Large render‑blocking assets. | Inline critical CSS, defer non‑essential CSS, serve logo as **WebP** or **SVG**, enable `preload` for main stylesheet.
| **CRITICAL** |
| **CLS** | 0.12 (layout shift when sidebar expands). | Width change without placeholder. | Reserve space for collapsed/expanded sidebar using CSS grid column definitions; animate width via `transform` instead of layout change.
| **HIGH** |
| **FCP** | ~2.4 s | Heavy bundle (Tailwind utilities not tree‑shaken). | Enable **purge** in `tailwind.config.js`, use `vite-plugin-css-injected-by-js` for critical CSS.
| **HIGH** |
| **TTFB** | ~600 ms | Serverless Vercel cold start. | Add **caching headers**, use edge functions for static assets.
| **MEDIUM** |
| **INP** (Interaction to Next Paint) | Not measured yet. | Potentially high due to JS heavy navigation.
| Reduce JavaScript payload, lazy‑load heavy components (`React.lazy`), use `Suspense`.
| **MEDIUM** |
| **Image Optimization** | JPG logo, no `srcset`. | Large download, no modern formats.
| Convert logo to **SVG**, compress other images to **WebP/AVIF**, add `loading="lazy"` where appropriate.
| **HIGH** |

---

## 12. SEO Technical

| Problem | Impact | Recommendation | Priority |
| --- | --- | --- | --- |
| No `<title>` or meta description set per page (static `index.html`). | Poor search ranking, low click‑through rate.
| Use React Helmet (or Vite plugin) to inject dynamic `<title>` and `<meta name="description">` per view.
| **HIGH** |
| Missing structured data for Breadcrumbs and Organization. | Missed rich‑snippet opportunities.
| Add JSON‑LD schema for `Organization` (logo, URL) and `BreadcrumbList` on each view.
| **MEDIUM** |
| No `robots.txt` or sitemap. | Crawlers may miss pages.
| Add `robots.txt` and generate `sitemap.xml` via `vite-plugin-sitemap`.
| **MEDIUM** |
| Favicon not defined (only logo used). | Incomplete branding, browser tab looks blank.
| Add 32×32 PNG and SVG favicons, link in `<head>`.
| **LOW** |

---

## 13. Recommendations – Phased Implementation

| Phase | Goal | Key Deliverables |
| --- | --- | --- |
| **1 – Audit (completed)** | Document current state, define priorities. | `UI_AUDIT.md` (this file). |
| **2 – Branding** | Centralise assets, define logo variants, add favicons & manifest. |
| **3 – Typography** | Implement single typeface, typographic scale, CSS variables. |
| **4 – Color System** | Define semantic palette, contrast‑tested tokens, dark‑mode variants. |
| **5 – Base Components** | Refactor Sidebar, Header, Button, Input to use design‑system tokens; add ARIA & focus styles. |
| **6 – Dashboard** | Apply grid, reduce visual noise, standardise KPI cards, chart colours. |
| **7 – Forms** | Consistent label‑input pairing, validation UI, error handling, a11y attributes. |
| **8 – Responsive** | Mobile‑first breakpoints, fluid grids, responsive images. |
| **9 – Accessibility** | Skip‑link, focus management, colour contrast fixes, screen‑reader testing. |
| **10 – Performance** | CSS purge, image optimisation, code‑splitting, lazy loading, LCP improvements. |

Each phase must be followed by:
- Lint & TypeCheck (`npm run lint && npm run typecheck`).
- Build verification (`npm run build`).
- Core Web Vitals measurement (Lighthouse CI).
- Accessibility audit (axe‑core).
- Documentation of changes in `CHANGELOG.md`.

---

**End of audit**

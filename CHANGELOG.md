# Changelog

All notable changes to this portfolio are recorded in this file.

The format follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) and the project loosely follows [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html), interpreted for a documentation site:

- **MAJOR** — site-wide structural changes (a new top-level section, a Diátaxis re-cluster, a switch of static-site framework).
- **MINOR** — a new page, a new feature in the build pipeline, a new style rule, a new OpenAPI sample.
- **PATCH** — copy edits, typo fixes, link repairs, single-rule Vale tweaks.

URL changes are always called out under a **Changed** subsection so that anyone linking to a page can update or redirect.

## [Unreleased]

### Added

- `.github/CODEOWNERS` mapping every path in the repository to the active maintainer.
- `MAINTAINERS.md` documenting the responsible maintainer, decision conventions, and the process for adding or removing maintainers.
- `CHANGELOG.md` (this file) following the Keep a Changelog convention.

### Changed

- Aligned the "years of experience" claim across `README.md`, `docs/methodology.md`, `src/pages/index.js`, and `blog/2026-04-24-documenting-pix-lessons.md`. The site now consistently reads **6+ years** (Softcom — October 2019 to present), correcting an earlier overstatement of 8+ years.

## [1.0.0] — 2026-04-24

The first publicly listed release of the portfolio. Snapshot of what landed in the initial six commits, grouped by category.

### Added

- **Docusaurus 3 site scaffolding** — `@docusaurus/core` and `@docusaurus/preset-classic` 3.9.2, React 19, SASS theming, Mermaid diagrams.
- **Featured project: EnergyGrid** — fictional utility platform documented end-to-end across three audiences:
  - Integration engineers — long-form integration guide covering OAuth 2.0 / OIDC, CIS data sync, bulk MDM and billing ingestion via SFTP and object storage, rate information, hardware binding.
  - Field technicians — install guides for the DataBridge Hub and SmartLink Plug smart-meter hardware.
  - Customer support agents — BillSense AI user guide and troubleshooting reference.
- **PIX showcase** — Diátaxis-organised section on Brazil's instant-payments rail. One page of each Diátaxis type:
  - Explanation: `docs/pix/about-pix.md`
  - How-to: `docs/pix/how-to-issue-static-qr.md`
  - Reference: anonymised OpenAPI sample modelled on the public PIX PSP standard, served at `/docs/api/pix-api/`
  - Tutorial: *(planned — see [Unreleased] in a future release)*
- **API references** — interactive, auto-generated documentation via `docusaurus-plugin-openapi-docs` 4.6.0 for two OpenAPI specs (PowerBox API, PIX API).
- **Methodology page** — explanation of why the site uses the Google Developer Documentation Style Guide for sentence-level rules and the Diátaxis Framework for page taxonomy.
- **Writing guideline** — the applied version of both frameworks, with voice rules, banned fillers, admonition conventions, and a pre-publication checklist.
- **Flagship blog post** — `blog/2026-04-24-documenting-pix-lessons.md`, a long-form post on documenting the PIX API at Itaú.
- **Docs-as-code CI pipeline** — `.github/workflows/docs-quality.yml` runs three jobs in parallel on every pull request:
  - **Vale** prose lint against the Google package, with project vocabulary in `.vale/styles/config/vocabularies/Portfolio/`. Bound to `fail_on_error: true` and `reporter: github-pr-review` for inline PR comments.
  - **Build** — `docusaurus build` with `onBrokenLinks: 'throw'` to catch every broken internal link before merge.
  - **Lychee** — external link check on Markdown content and the README, with cache restore for performance.
- **Vale configuration** — `.vale.ini` with deliberate per-path overrides:
  - `Google.Headings = NO` (heading capitalisation reviewed in PRs).
  - `Vale.Repetition = NO` (anchor- and link-rich Diátaxis content trips the heuristic without adding signal).
  - `[docs/api/**]` excluded from prose lint (auto-generated content).
  - `[blog/**]` allows first person and "we" (different editorial voice).
- **Deployment pipeline** — `.github/workflows/deploy.yml` builds the site and publishes to the `gh-pages` branch on every push to `main`.
- **Containerised serve** — `Dockerfile` and `nginx.conf` for portable deployment outside GitHub Pages.
- **Contributor documentation** — `CONTRIBUTING.md` covering the stack, repository layout, local dev setup, the PR checklist, the page-creation workflow, and the OpenAPI regeneration process.

### Changed

- **Style foundation switched from Microsoft to Google Style** — the site now lints against the Google Developer Documentation Style Guide rather than the Microsoft Writing Style Guide. The chosen Vale package is `Google` from `errata-ai/Google` ([commit `ccb6aa7`](https://github.com/L-G99921/tw-portfolio/commit/ccb6aa7)).
- **API reference branding white-labelled** — generated OpenAPI pages under `docs/api/` were updated to use neutral product names rather than the placeholder names from the upstream Docusaurus template.
- **Footer swizzled** — the default Docusaurus footer was replaced via `docusaurus swizzle` to surface the maintainer's contact details rather than the framework's defaults.

### Fixed

- Polish pass on PIX docs and the flagship article based on a structured review (typos, missing absolute-path links, admonition type corrections, sentence-case heading enforcement).

[Unreleased]: https://github.com/L-G99921/tw-portfolio/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/L-G99921/tw-portfolio/releases/tag/v1.0.0

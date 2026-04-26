# Changelog

All notable changes to this portfolio are recorded in this file.

The format follows [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) and the project loosely follows [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html), interpreted for a documentation site:

- **MAJOR** — site-wide structural changes (a new top-level section, a Diátaxis re-cluster, a switch of static-site framework).
- **MINOR** — a new page, a new feature in the build pipeline, a new style rule, a new OpenAPI sample.
- **PATCH** — copy edits, typo fixes, link repairs, single-rule Vale tweaks.

URL changes are always called out under a **Changed** subsection so that anyone linking to a page can update or redirect.

## [Unreleased]

## [1.1.0] — 2026-04-25

The first iteration after the initial public launch. Three threads of work landed in this release:

- **Repository meta-documentation** so the project signals "maintained" rather than "private development pushed to a public mirror" ([#5](https://github.com/L-G99921/tw-portfolio/pull/5)).
- **OpenAPI metadata enrichment, Architecture Decision Records, and AI-ready signaling** to deepen the showcase with material that demonstrates editorial reasoning, not only writing samples ([#6](https://github.com/L-G99921/tw-portfolio/pull/6)).
- **Production-grade CI**, after the docs-quality workflow turned out to be failing on every push since the day it was added — pre-existing infrastructure bugs masked by the noise ([#7](https://github.com/L-G99921/tw-portfolio/pull/7)).

### Added

#### Repository meta-documentation

- `.github/CODEOWNERS` mapping every path in the repository to the active maintainer, with per-area rules (`docs/`, `blog/`, `docs/api/`, `src/`, `.vale/`, meta-docs).
- `MAINTAINERS.md` documenting the responsible maintainer, decision conventions for content / style / structural changes, and the process for adding or removing maintainers.
- `CHANGELOG.md` (this file) following the [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) convention, paired with informal SemVer for the documentation context.

#### Architecture Decision Records

- `docs/adr/` directory with an index and five initial ADRs, each under 250 words, following the [Michael Nygard template](https://github.com/joelparkerhenderson/architecture-decision-record/blob/main/locales/en/templates/decision-record-template-by-michael-nygard/index.md):
  - **ADR-001** — Docusaurus 3 over MkDocs Material.
  - **ADR-002** — Google Developer Style Guide over Microsoft Writing Style Guide.
  - **ADR-003** — Diátaxis as page-level taxonomy, one type per page.
  - **ADR-004** — Vale CI blocks on error, not warning-only.
  - **ADR-005** — OpenAPI specs are the single source of truth for API reference.
- New **About this site** sidebar category exposing the ADRs and the AI-readiness explanation page.

#### OpenAPI metadata enrichment

- **PowerBox API** (`static/openapi.json`) and **Usage API** (`static/usage-api-openapi.json`) now carry rich top-level metadata: a Markdown `info.description` covering audience, authentication, base URL, conventions (content type, identifiers, idempotency, errors), and versioning policy; full `info.contact` with name, email, URL; `info.license`; `tags[].description` for each operation group; and a staging server alongside production in `servers[]`.
- The previously near-empty PowerBox API reference landing page (`/docs/api/powerbox-api`) now renders a complete overview without any hand-edited MDX. Generated `docs/api/*.mdx` files were regenerated via `gen-api-docs`.

#### AI-ready signaling

- `static/llms.txt` following the [llmstxt.org proposal](https://llmstxt.org/) — lists the canonical pages of the site grouped by purpose, with one-line descriptions and absolute URLs. Served at `/tw-portfolio/llms.txt`.
- `docs/using-these-docs-with-ai.md` — explanation page covering why the structural choices (Diátaxis at the page level, OpenAPI as the spec-driven source of truth) make the site predictable to ingest into LLM pipelines.

### Changed

- **Years of experience** — aligned the claim across `README.md`, `docs/methodology.md`, `src/pages/index.js`, and `blog/2026-04-24-documenting-pix-lessons.md`. The site now consistently reads **6+ years** (Softcom — October 2019 to present), correcting an earlier overstatement of 8+ years.
- **Vale `MinAlertLevel`** from `suggestion` to `error` in `.vale.ini`. Lower-severity findings (suggestions for contractions, parens, semicolons, first-person pronouns, write-good wordiness) overwhelmed reviewdog's per-PR annotation cap. Authors can still run `vale --minAlertLevel suggestion` locally for the full picture; the disciplinary signal of fail-on-error is preserved (per ADR-004) — only the noise is suppressed.
- **Vale rule overrides** added to `.vale.ini`, each with a comment explaining the reason and where the convention is documented:
  - `Google.EmDash = NO` — the portfolio uses spaced em-dashes ( — ) consistently across long-form prose.
  - `Google.Quotes = NO` — punctuation outside quotation marks unless it belongs to the quoted material (BR/UK "logical" convention).
  - `Google.AMPM = NO` — the site uses 24-hour time formatting throughout.
  - `Google.Latin = NO` — `methodology.md` and `writing-guideline.md` *quote* "e.g."/"i.e." as examples to avoid; the rule was flagging the meta-discussion as usage.
  - `write-good.ThereIs = NO` — fires on legitimate technical constructions ("There are three audiences", "There is no opt-out").
- **Vocabulary cleanup** in `.vale/styles/config/vocabularies/Portfolio/accept.txt`:
  - Removed the duplicate `Powerbox` (kept `PowerBox` — the canonical brand name documented in the writing guideline).
  - Removed the duplicate `Pix` (kept `PIX` — the official, all-caps brand name from Banco Central do Brasil).
  - Removed `LED` (already covered by the `[A-Z]{2,}` regex pattern; the explicit entry collided with the English verb "led").
  - Removed `docs-as-code` (let both `docs-as-code` and `Docs-as-code` be plain text rather than collide on canonical-form selection).

### Fixed

#### CI pipeline

- **Lychee** — dropped the deprecated `--exclude-mail` flag (lychee v0.23.0 removed it; mail addresses are excluded by default in modern versions).
- **Lychee** — added a markdown pre-processing step that strips Docusaurus root-relative links (`/docs/foo`, `/blog/foo`) before lychee scans them. Lychee's URL parser hard-fails on these before `--exclude` can take effect, and the Docusaurus build job already validates internal links via `onBrokenLinks: 'throw'`. This division of labour is now correct: Build = internal links; Lychee = external links.
- **Lychee** — added `--accept '200..=299,999'` so LinkedIn's anti-bot 999 response doesn't fail the build, and `--scheme https,http` so non-network references in markdown don't trigger file-not-found errors.
- **Vale** — backticked filler-word *mentions* across `README.md`, `docs/methodology.md`, and `docs/writing-guideline.md`. The style guide that talks about banned words has to talk about them; without backticks Vale.Avoid was treating mentions as usages.
- **Vale** — wrapped the `support@energygrid.com` reference in `databridge-hub-setup-guide-pacific-grid.md` in backticks so Vale.Terms doesn't try to lint the lowercase "energygrid" inside the email domain.

#### Content

- **Markdown capitalisation** in `docs/using-these-docs-with-ai.md` — the format name is `Markdown`, not `markdown`.
- **`llms.txt` link** in `docs/using-these-docs-with-ai.md` — switched from a hardcoded production URL (which 404s on PRs before deploy) to Docusaurus's `pathname:///llms.txt` syntax. Resolves to the correct base URL at build time.

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

[Unreleased]: https://github.com/L-G99921/tw-portfolio/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/L-G99921/tw-portfolio/releases/tag/v1.1.0
[1.0.0]: https://github.com/L-G99921/tw-portfolio/releases/tag/v1.0.0

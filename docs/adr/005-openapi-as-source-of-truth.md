---
id: 005-openapi-as-source-of-truth
slug: /adr/005-openapi-as-source-of-truth
title: "ADR-005 — OpenAPI specs are the single source of truth for API reference"
description: "Why every API reference page on this site is generated from an OpenAPI spec, and why none of the generated pages are edited by hand."
sidebar_label: ADR-005 — OpenAPI source of truth
sidebar_position: 5
tags: [adr, decisions, openapi, api-docs]
---

# ADR-005 — OpenAPI specs are the single source of truth for API reference

**Status:** Accepted (2026-04-24)

## Context

API reference content can be authored in two ways:

- **Spec-driven.** Maintain an OpenAPI spec, generate the reference pages from it. Every change to an endpoint flows through the spec; the rendered pages are derived artifacts.
- **Hand-authored.** Write the reference in Markdown directly, mirroring the spec by convention.

Hand-authored reference is faster to start and more flexible per page, but it inevitably drifts from the spec. The two diverge silently — a parameter is renamed in code, the spec is updated, the docs are not. Readers hit 400 responses they cannot explain.

## Decision

Use **OpenAPI 3.0.3 specs in `static/`** as the single source of truth for every API reference on the site. Generate the per-operation pages with `docusaurus-plugin-openapi-docs` 4.6.0. Treat the generated `.mdx` files under `docs/api/` as build artifacts — never edit them by hand.

Three specs live in the repository today: `openapi.json` (PowerBox), `usage-api-openapi.json` (Usage), `pix-api-openapi.json` (PIX sample).

## Consequences

- **Drift is structurally impossible.** A change to an endpoint *must* be a change to the spec. The rendered docs cannot lie about a contract.
- **Landing pages must be enriched in the spec.** The `info.description`, `info.contact`, `tags[].description`, and `servers[]` fields render as the API reference landing page. Empty or thin metadata produces an empty landing page — see ADR-006 in the future if this constraint changes.
- **Vale does not lint the generated content.** `.vale.ini` excludes `docs/api/**` because it is not authored prose. Vale runs against the spec via separate tooling (planned).
- **Regeneration is a deliberate step.** Authors run `npm run docusaurus -- clean-api-docs <id> && gen-api-docs <id>` after editing the spec. The generated files are committed alongside the spec change so the diff is reviewable.
- **The contract-first workflow scales beyond a portfolio.** The same model is used at production scale on the PIX integration documented in [the flagship blog post](/blog/documenting-pix-lessons) — the spec is the artifact reviewed by engineering, the docs follow.

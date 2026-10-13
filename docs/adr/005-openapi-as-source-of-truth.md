---
id: 005-openapi-as-source-of-truth
slug: /adr/005-openapi-as-source-of-truth
title: "ADR 005: OpenAPI specs as the source of the API reference"
description: "Why every API reference page on this site is generated from an OpenAPI spec, and why nobody edits the generated pages."
sidebar_label: "ADR 005: OpenAPI as the source of truth"
sidebar_position: 5
tags: [adr, decisions, openapi, api-docs]
---

# ADR 005: OpenAPI specs as the source of the API reference

**Status:** Accepted, 2026-04-24. Updated 2026-10-13 after the review described below.

## Context

API reference can be written two ways:

- **From the spec:** maintain an OpenAPI file and generate the pages from it.
- **By hand:** write the reference in Markdown and keep it in line with the spec by habit.

Hand-written reference is quicker to start and more flexible, but it drifts. A field gets renamed in the spec, and the page still shows the old name. Readers get `400` errors they can't explain.

## Decision

The OpenAPI 3.0 files in `static/` are the only source of the API reference: `openapi.json` (PowerBox), `usage-api-openapi.json` (Usage), and `pix-api-openapi.json` (PIX). `docusaurus-plugin-openapi-docs` generates one page per operation into `docs/api/`, and nobody edits those files by hand.

## Consequences

- **The reference can't drift from the spec**, because it's rebuilt from it. The API sandbox reads the same files ([ADR 006](/docs/adr/006-api-sandbox-in-the-browser)), so it can't drift either.
- **Hand-written guides still can.** A review in October 2026 found the integration guide showing a bind request with fields the spec didn't have. The fix went both ways: the guide now matches the spec, and the spec gained the login endpoint the guide described. When a guide and the spec disagree, the spec wins, and the guide is fixed in the same pull request.
- **The landing pages come from the spec.** `info.description`, `info.contact`, `tags[].description`, and `servers[]` become each API's overview page, so thin metadata means a thin page.
- **Vale doesn't check generated pages.** `.vale.ini` excludes `docs/api/**`. The prose inside the specs is reviewed by hand.
- **Regenerating is a deliberate step.** After editing a spec, run `npx docusaurus clean-api-docs all` and then `npx docusaurus gen-api-docs all`, and commit the generated files with the spec change so the diff can be reviewed.
- This is the same contract-first workflow I used on the PIX APIs at Itaú, described in [Documenting PIX](/blog/documenting-pix-lessons).

---
id: 002-google-style-over-microsoft
slug: /adr/002-google-style-over-microsoft
title: "ADR-002 — Google Developer Style Guide over Microsoft Writing Style Guide"
description: "Why the portfolio's Vale configuration lints against the Google Developer Documentation Style Guide rather than the Microsoft Writing Style Guide."
sidebar_label: ADR-002 — Google over Microsoft style
sidebar_position: 2
tags: [adr, decisions, vale, google-style, microsoft-style]
---

# ADR-002 — Google Developer Style Guide over Microsoft Writing Style Guide

**Status:** Accepted (2026-04-24, supersedes the original Microsoft setup imported from the Docusaurus base template)

## Context

Vale ships with packages for both major industry style guides:

- **[Google Developer Documentation Style Guide](https://developers.google.com/style)** via `errata-ai/Google`.
- **[Microsoft Writing Style Guide](https://learn.microsoft.com/style-guide)** via `errata-ai/Microsoft`.

The two overlap on most rules (active voice, second person, sentence case for headings, banned filler words) but diverge on specifics: Microsoft permits `please` in error messages, Google forbids it; Microsoft prefers Oxford comma optionality, Google requires it; Microsoft is friendlier to first person, Google is stricter.

The portfolio's first commit imported Microsoft style as a placeholder. The choice of which to keep had to be made before content authoring scaled.

## Decision

Switch the foundation to the **Google Developer Documentation Style Guide**, with selected per-path overrides documented in `.vale.ini`:

- `Google.Headings = NO` because heading capitalisation is reviewed in PRs and the heuristic raises noise on intentional product-name capitalisation.
- `Google.FirstPerson = NO` and `Google.We = NO` for `blog/` and `CONTRIBUTING.md`, because long-form blog posts and contributor docs have a different editorial voice than reference content.

## Consequences

- Reference and how-to content reads in the canonical Google voice — terse, second person, active.
- Blog posts can use first person without lint noise, which matches industry convention for technical-writing blogs (Stripe, Vercel, GitLab).
- Future contributors familiar with the Microsoft style guide need a brief orientation. The diff is small but real.
- The choice signals a preference legible to hiring managers — most large API-docs teams (Google, Stripe, Twilio, Cloudflare) lean Google-style; teams adjacent to Microsoft products (Azure docs, .NET ecosystem) lean Microsoft-style.

---
id: 003-diataxis-as-page-taxonomy
slug: /adr/003-diataxis-as-page-taxonomy
title: "ADR-003 — Diátaxis as page-level taxonomy, one type per page"
description: "Why every page in the portfolio is exactly one of the four Diátaxis types, and why the rule is enforced at the page level rather than at the section level."
sidebar_label: ADR-003 — Diátaxis taxonomy
sidebar_position: 3
tags: [adr, decisions, diataxis, content-strategy]
---

# ADR-003 — Diátaxis as page-level taxonomy, one type per page

**Status:** Accepted (2026-04-24)

## Context

Documentation sites that mix tutorial steps with reference tables and explanatory prose on the same page tend to confuse readers, who arrive with one of four mental modes — *teach me*, *show me how*, *tell me what this is*, *help me understand* — and bounce when the page tries to satisfy two or more at once.

The two realistic taxonomies for organising a documentation set:

- **[Diátaxis](https://diataxis.fr/)** by Daniele Procida — four types: tutorial, how-to, reference, explanation. Quadrant-based, popularised by Read the Docs, Django, GitLab, Cloudflare.
- **Divio's three-document model** (Procida's earlier work) — four types but presented as a softer guideline.

Both ask the same question; Diátaxis is sharper about the rule and has a larger adoption base in 2026.

## Decision

Adopt **Diátaxis** as the page-level taxonomy, with one rule enforced editorially: **every page is exactly one type**. If a page wants to be two things, it gets split.

The decision is enforced at the **page** level rather than the **section** level. A "PIX" section can contain pages of all four types; a single page within it cannot.

## Consequences

- The repository's folder structure groups by topic (`pix/`, `databridge/`, `billsense-ai/`), not by Diátaxis type. Pages within a folder are heterogeneous.
- The pre-publication checklist in [Writing Guideline § 1](/docs/writing-guideline) requires the author to declare the type before writing.
- The split rule occasionally produces small pages — accepted in exchange for predictable navigation.
- Reference content stays dry and complete. Tutorial pages stay narrow and outcome-driven. Explanation pages can branch and discuss trade-offs without colonising other pages.
- The site's incompleteness (a missing tutorial in the EnergyGrid cluster, tracked in an open issue) is visible *because* the taxonomy is enforced. That visibility is a feature, not a bug.

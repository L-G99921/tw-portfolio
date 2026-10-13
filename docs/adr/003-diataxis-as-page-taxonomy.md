---
id: 003-diataxis-as-page-taxonomy
slug: /adr/003-diataxis-as-page-taxonomy
title: "ADR 003: Diátaxis at the page level, one type per page"
description: "Why every page on this site is one of the four Diátaxis types, and why the rule applies to pages and not to sections."
sidebar_label: "ADR 003: Diátaxis as the page taxonomy"
sidebar_position: 3
tags: [adr, decisions, diataxis, content-strategy]
---

# ADR 003: Diátaxis at the page level, one type per page

**Status:** Accepted, 2026-04-24

## Context

Readers come to documentation with one of four needs: teach me, show me how, tell me what this is, or help me understand. A page that tries to serve two of them at once, such as steps mixed with reference tables, serves neither well.

[Diátaxis](https://diataxis.fr/), by Daniele Procida, names those four needs as four page types: tutorial, how-to guide, reference, and explanation. Its earlier version, [The Documentation System](https://documentation.divio.com/), described the same four types while Procida was at Divio. Diátaxis is the current, more detailed version, and projects like Canonical's Ubuntu documentation have adopted it.

The open question was where to apply the rule: to each page, or to each section.

## Decision

Use **Diátaxis**, and apply it to **pages**: every page is one type. A page that wants to be two things gets split.

A section can hold all four types. The PIX section has one of each. A single page can't.

## Consequences

- Folders group pages by topic (`pix/`, `databridge/`, `billsense-ai/`), not by type, so a folder can mix types.
- The [writing guideline](/docs/writing-guideline) asks the writer to choose the type before writing.
- The rule sometimes produces short pages. Predictable navigation is worth it.
- Reference pages stay complete and plain. Tutorials stay focused on one outcome. Explanations can discuss trade-offs without spilling into other pages.
- One documented exception: the [integration guide](/docs/integration-guide) keeps architecture and steps on one page, in separate sections, because integration teams read it from start to finish.

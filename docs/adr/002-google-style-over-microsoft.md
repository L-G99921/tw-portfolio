---
id: 002-google-style-over-microsoft
slug: /adr/002-google-style-over-microsoft
title: "ADR 002: Google developer style guide instead of Microsoft's"
description: "Why Vale on this site checks against the Google developer documentation style guide and not the Microsoft Writing Style Guide."
sidebar_label: "ADR 002: Google style over Microsoft"
sidebar_position: 2
tags: [adr, decisions, vale, google-style, microsoft-style]
---

# ADR 002: Google developer style guide instead of Microsoft's

**Status:** Accepted, 2026-04-24. Replaces the Microsoft setup that came with the original template.

## Context

Vale has packages for both major style guides:

- The [Google developer documentation style guide](https://developers.google.com/style), through `errata-ai/Google`.
- The [Microsoft Writing Style Guide](https://learn.microsoft.com/style-guide), through `errata-ai/Microsoft`.

They agree on most things: active voice, second person, sentence-case headings, and the Oxford comma. They differ in tone and in details. Microsoft's guide is warmer and more conversational, and allows `please` when you ask the reader to do something inconvenient. Google's is plainer and avoids `please` in instructions. Google's guide also has more rules aimed at API and developer documentation.

The first commit used Microsoft's package as a placeholder. The choice had to be made before most of the content was written.

## Decision

Use the **Google** package, with per-path exceptions documented in `.vale.ini`:

- `Google.Headings = NO`, because the heuristic flags product names like "DataBridge Hub" in headings. Heading case is checked in review instead.
- `Google.FirstPerson = NO` and `Google.We = NO` for `blog/` and `CONTRIBUTING.md`, which are written in the first person on purpose.

## Consequences

- Reference and how-to pages read in Google's voice: short, second person, and active.
- Blog posts can use "I" and "we" without lint errors, which is normal for engineering blogs.
- Contributors who know Microsoft's guide need a short orientation. The differences are small but real.
- API documentation teams often follow Google's guide or something close to it, so the choice is familiar to the people most likely to review this portfolio.

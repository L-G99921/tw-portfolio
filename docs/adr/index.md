---
title: Architecture decision records
description: "Index of the architecture decision records (ADRs) behind the tooling and content choices on this site."
sidebar_label: Overview
sidebar_position: 0
tags: [adr, decisions, meta]
---

# Architecture decision records

Some choices behind this site aren't obvious from the code: why Docusaurus and not MkDocs, why Google's style guide and not Microsoft's, why the API sandbox runs in the browser. Each one had a real alternative. They're recorded here as architecture decision records (ADRs), one short page per decision, so anyone reading the repository can see why things are the way they are.

The format follows [Michael Nygard's original ADR format](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions): status, context, decision, and consequences. Each record stays short, because the point is the trade-off.

## Why a portfolio has ADRs

A portfolio is a small product, and it has decisions like any other. Writing them down next to the code shows two things at once: the writing samples, and the reasoning behind the system that publishes them. If you're hiring, these pages show what I'd argue for in a planning meeting. If you maintain the site later, start here before changing direction.

## Index

| ADR | Decision | Status |
|-----|----------|--------|
| [001](/docs/adr/001-docusaurus-over-mkdocs) | Docusaurus 3 instead of MkDocs Material | Accepted |
| [002](/docs/adr/002-google-style-over-microsoft) | Google developer style guide instead of Microsoft's | Accepted |
| [003](/docs/adr/003-diataxis-as-page-taxonomy) | Diátaxis at the page level, one type per page | Accepted |
| [004](/docs/adr/004-vale-fail-on-error) | Vale errors fail the build | Accepted |
| [005](/docs/adr/005-openapi-as-source-of-truth) | OpenAPI specs as the source of the API reference | Accepted |
| [006](/docs/adr/006-api-sandbox-in-the-browser) | An API sandbox that runs in the browser | Accepted |

## Adding an ADR

1. Copy the structure of an existing ADR.
2. Number it next in sequence: `007`, `008`, and so on.
3. Set the status to **Proposed** while it's in review. Change it to **Accepted** when it merges, or to **Rejected** with a one-line reason.
4. If it replaces an older ADR, mark the older one **Superseded by ADR NNN** and link both ways.
5. Add it to the index above and to `sidebars.js`.

ADRs aren't deleted. A superseded or rejected record keeps the reasoning from its time.

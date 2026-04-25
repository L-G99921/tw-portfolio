---
title: Architecture decision records
description: "Index of the architecture decision records (ADRs) that document the non-obvious technology and content choices behind this portfolio."
sidebar_label: Overview
sidebar_position: 0
tags: [adr, decisions, meta]
---

# Architecture decision records

This portfolio makes several non-obvious choices about tooling, content structure, and editorial workflow. Each one was a real trade-off — Vale could have been `write-good`, Docusaurus could have been MkDocs, the Diátaxis split could have been Divio's three-way model. The decisions that stuck are recorded here as **architecture decision records** (ADRs), one short page per decision, so anyone reviewing the repository can read the *why* and not only the *what*.

The format follows [Michael Nygard's lightweight ADR template](https://github.com/joelparkerhenderson/architecture-decision-record/blob/main/locales/en/templates/decision-record-template-by-michael-nygard/index.md): **Status**, **Context**, **Decision**, **Consequences**. Each record is intentionally short — under 250 words — because the value is in capturing the trade-off, not in writing a thesis.

## Why ADRs in a documentation portfolio

A portfolio is itself a small product. Every product carries decisions that aren't legible from the code alone. Recording those decisions in the repository — alongside the code they shaped — turns the portfolio into a demonstration of two skills at once: the writing samples themselves, and the editorial reasoning behind the publication system that holds them.

If you're a hiring manager reviewing the portfolio: these ADRs are where you can read what I'd defend in a planning meeting. If you're a future maintainer (myself, in six months): these are the load-bearing arguments you should re-examine before changing direction.

## Index

| ADR | Title | Status |
|-----|-------|--------|
| [ADR-001](/docs/adr/001-docusaurus-over-mkdocs) | Docusaurus 3 over MkDocs Material | Accepted |
| [ADR-002](/docs/adr/002-google-style-over-microsoft) | Google Developer Style Guide over Microsoft Writing Style Guide | Accepted |
| [ADR-003](/docs/adr/003-diataxis-as-page-taxonomy) | Diátaxis as page-level taxonomy, one type per page | Accepted |
| [ADR-004](/docs/adr/004-vale-fail-on-error) | Vale CI blocks on error, not warning-only | Accepted |
| [ADR-005](/docs/adr/005-openapi-as-source-of-truth) | OpenAPI specs are the single source of truth for API reference | Accepted |

## Adding a new ADR

When a future change introduces another non-obvious decision:

1. Copy the structure of an existing ADR.
2. Number it sequentially (`006-...`, `007-...`).
3. Set the **Status** to `Proposed` until merged. Flip to `Accepted` on merge, or to `Rejected` with a one-line reason if the change is abandoned.
4. If a new ADR supersedes an older one, mark the older record as `Superseded by ADR-NNN` and link both ways.
5. Add the new entry to the index table above.

ADRs are not deleted. A `Superseded` or `Rejected` ADR still carries the historical reasoning and stays in the repository.

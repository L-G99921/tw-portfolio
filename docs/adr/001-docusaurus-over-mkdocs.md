---
id: 001-docusaurus-over-mkdocs
slug: /adr/001-docusaurus-over-mkdocs
title: "ADR-001 — Docusaurus 3 over MkDocs Material"
description: "Why this portfolio is built on Docusaurus 3 rather than MkDocs Material, the other strong contender for static documentation sites."
sidebar_label: ADR-001 — Docusaurus over MkDocs
sidebar_position: 1
tags: [adr, decisions, docusaurus, tooling]
---

# ADR-001 — Docusaurus 3 over MkDocs Material

**Status:** Accepted (2026-04-24)

## Context

The portfolio needs a static site framework that supports Markdown-first authoring, OpenAPI reference generation, multi-version content, search, dark mode, and a custom React-based landing page. The two realistic options were:

- **MkDocs Material** — Python-based, batteries-included, excellent default theme, large plugin ecosystem.
- **Docusaurus 3** — React-based, MDX-first, strong API-docs plugin (`docusaurus-plugin-openapi-docs`), full control over the React layer.

Both can produce a credible documentation site. The deciding factor is the landing page and the OpenAPI integration.

## Decision

Build on **Docusaurus 3** with React 19, SASS theming, and `docusaurus-plugin-openapi-docs` 4.6.0.

The deciding factors:

- **The landing page is a React component**, not a Markdown file. The portfolio uses a custom hero, a card grid, and animation that would be awkward to express in MkDocs Material's template overrides.
- **OpenAPI integration is first-class.** `docusaurus-plugin-openapi-docs` produces interactive `Try it out` panels, schema browsing, and per-operation pages from a single spec. The MkDocs equivalent (`mkdocs-render-swagger-plugin`) embeds Swagger UI as an iframe, which is less integrated with the rest of the site's navigation.
- **MDX lets reference content embed React.** Custom admonitions, schema tabs, and interactive examples are easier in MDX than in MkDocs's macros.

## Consequences

- The build chain is heavier — Node.js 20+, ~1500 npm packages, longer cold starts.
- Authors who prefer Python tooling will find the project less approachable.
- React-based theming means breaking changes in major Docusaurus versions cascade into the custom components — accepted in exchange for control.
- The site can host React-based interactive samples in the future without changing framework.

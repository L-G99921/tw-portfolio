---
id: 001-docusaurus-over-mkdocs
slug: /adr/001-docusaurus-over-mkdocs
title: "ADR 001: Docusaurus 3 instead of MkDocs Material"
description: "Why this site is built on Docusaurus 3 and not MkDocs Material, the other strong option for static documentation sites."
sidebar_label: "ADR 001: Docusaurus over MkDocs"
sidebar_position: 1
tags: [adr, decisions, docusaurus, tooling]
---

# ADR 001: Docusaurus 3 instead of MkDocs Material

**Status:** Accepted, 2026-04-24

## Context

The site needs Markdown authoring, API reference generated from OpenAPI, search, dark mode, and a custom home page. Two frameworks fit:

- **MkDocs Material:** Python, a very good default theme, and many plugins.
- **Docusaurus 3:** React and MDX, a strong OpenAPI plugin (`docusaurus-plugin-openapi-docs`), and full control over the page components.

Either would produce a credible docs site. The API reference and the home page decided it.

## Decision

Build on **Docusaurus 3**, with React 19 and `docusaurus-plugin-openapi-docs` 4.

- **The OpenAPI plugin is built in, not embedded.** It generates a page per operation with schema browsing and a request panel, all in the site's own navigation and theme. The common MkDocs options embed Swagger UI or Redoc as a separate block.
- **The home page is a React component.** It has a request card that calls the API sandbox (see [ADR 006](/docs/adr/006-api-sandbox-in-the-browser)), which would mean fighting the template system in MkDocs.
- **MDX lets pages use components** such as tabs and admonitions, without a macro language.

## Consequences

- The toolchain is heavier: Node.js 20 or later, more than a thousand npm packages, and slower cold starts.
- Writers who prefer Python tools will find the project less familiar.
- Customized components can break on major Docusaurus upgrades. That's the price of the control.
- Interactive samples, like the API sandbox, fit without changing frameworks.

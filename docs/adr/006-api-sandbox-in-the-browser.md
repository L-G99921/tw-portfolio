---
id: 006-api-sandbox-in-the-browser
slug: /adr/006-api-sandbox-in-the-browser
title: "ADR 006: An API sandbox that runs in the browser"
description: "Why the Send API Request panels on this site talk to a service worker built from the OpenAPI specs, instead of a hosted mock server."
sidebar_label: "ADR 006: API sandbox in the browser"
sidebar_position: 6
tags: [adr, decisions, openapi, api-docs, sandbox]
---

# ADR 006: An API sandbox that runs in the browser

**Status:** Accepted, 2026-10-13

## Context

Every API reference page has a **Send API Request** panel. The specs point to hosts that don't exist, like `sandbox.instant-payments.example`, because the APIs are samples. The button had nothing to call, and the most interactive part of the reference was broken.

The options:

- **Hosted mock server**, such as Prism or a cloud mock service. It needs hosting and an account, can go down or start costing money, and every request leaves the visitor's machine.
- **Point to a real public API.** There isn't one for fictional products, and a real PIX sandbox requires credentials.
- **Mock in the browser.** A service worker intercepts requests to the `.example` hosts and answers them locally, using the same OpenAPI files the pages are built from.

## Decision

Mock in the browser, with `static/api-sandbox-sw.js`, registered on every page by `src/theme/Root.js`.

For each request, the worker finds the operation in the specs and:

- Returns `401` when an operation requires a bearer token and there's none.
- Returns `400` when a path parameter doesn't match its pattern, like a `txid` that's too short, or when a required body is missing or invalid.
- Answers with the spec's example for a `2xx` status.
- Keeps state for the flows the tutorials walk through: PIX charges, payments, and webhooks, and PowerBox device binding. A second bind for the same meter returns `METER_ALREADY_BOUND`, as the docs say.

## Consequences

- The panels work on GitHub Pages, with no server, account, or cost.
- Nothing leaves the visitor's browser, which matters even for fake payment data.
- The sandbox follows the specs automatically. When a spec changes, the sandbox changes with it.
- It's a simulation. It doesn't check every schema rule, and webhooks can't be delivered to the visitor's own server. The note above each panel says so.
- Service workers need a first page load to activate, so the home page waits briefly for the worker before its first request.

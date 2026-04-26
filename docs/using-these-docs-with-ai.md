---
id: using-these-docs-with-ai
title: Using these docs with AI
description: "How this portfolio's documentation is structured for predictable LLM ingestion, why Diátaxis helps, and how to point a chatbot at the site."
sidebar_label: Using these docs with AI
sidebar_position: 6
tags: [ai, llms, llmstxt, diataxis, explanation]
---

# Using these docs with AI

Large language models read documentation the way readers do — they look for predictable shapes. A page that mixes tutorial steps with reference tables and explanatory prose is hard for a person to navigate; it's also hard for an LLM to retrieve from. The structural choices behind this portfolio (one Diátaxis type per page, sentence-case headings, explicit metadata in OpenAPI specs, structured admonitions) compound into a site that is easier for both audiences.

This page explains the deliberate AI-readiness choices, points to the artifacts a developer would use to integrate the site into a chatbot or a retrieval pipeline, and records the reasoning so that future changes can preserve the property.

## The artifacts

Two files exist specifically for AI consumption:

- **[`llms.txt`](pathname:///llms.txt)** at the site root, following the [llmstxt.org proposal](https://llmstxt.org/). It lists the canonical pages of the site grouped by purpose, with one-line descriptions and absolute URLs.
- **`llms-full.txt`** (planned) — the concatenated full text of the canonical pages, suitable for direct ingestion into a context window or a vector store.

A retrieval pipeline can:

1. Fetch `llms.txt` to discover the canonical URL set.
2. Fetch each linked page as Markdown via Docusaurus's standard URL conventions.
3. Index the result without parsing HTML.

## Why Diátaxis helps LLMs

The [Diátaxis Framework](https://diataxis.fr/) classifies every documentation page as exactly one of: tutorial, how-to, reference, explanation. The portfolio enforces this rule at the page level (see [ADR-003](/docs/adr/003-diataxis-as-page-taxonomy)), which produces three properties an LLM can rely on:

- **Predictable shape per page.** A page tagged `reference` is dry, complete, and lookup-oriented. A page tagged `tutorial` has narrow steps and a guaranteed outcome. The model does not have to guess the page's purpose from prose; it can read the front-matter `tags` and infer the structure.
- **Cleaner retrieval boundaries.** When a user asks "how do I do X", the retrieval layer can favour `how-to` pages. When the user asks "what is X", it can favour `reference` and `explanation` pages. The taxonomy maps onto the question types models receive.
- **No mixed signals.** Tutorial steps are not interspersed with reference tables, so a chunked excerpt of a `tutorial` page is still recognisably a tutorial and not a half-table fragment.

## Why structured OpenAPI specs help

Every API reference on this site is generated from an OpenAPI spec under `static/`, with the rule that no generated `.mdx` is hand-edited (see [ADR-005](/docs/adr/005-openapi-as-source-of-truth)). The specs carry rich top-level metadata:

- `info.description` — Markdown overview of the API: audience, authentication, base URL, conventions, versioning policy.
- `info.contact` — maintainer details (name, URL, email).
- `tags[].description` — purpose of each operation group.
- `servers[]` — production and staging base URLs.

For an LLM, this means **the spec itself is the canonical source**. A pipeline that ingests the OpenAPI spec gets the contract and the explanation in one document. The HTML reference page is a derived view of the same source — they cannot disagree.

## What this site demonstrates about documenting AI products

The [BillSense AI documentation cluster](/docs/billsense-ai/overview) is a worked example of documenting an AI-powered product *for the people who support it* — not for the engineers who built the model. The structural choices map onto a checklist that travels:

- A separate **how-to** page for the workflows support agents need to execute (escalating a low-confidence response, overriding an AI suggestion, handling a customer who disagrees with the AI's interpretation).
- A separate **reference** page for the AI's behaviour surface — what the model returns, what its confidence scores mean, where it abstains.
- A separate **explanation** page for the conceptual model — what the AI is doing, what it is not doing, what the failure modes look like.

Splitting these three jobs across three pages, rather than one long FAQ, is the same Diátaxis discipline applied to a domain (AI-product support documentation) where the temptation to mix is highest.

## Pointing a chatbot at this site

Three integration shapes work, in increasing order of fidelity:

1. **One-shot summary.** Paste `llms.txt` into the model's context. Useful when the user asks for a high-level orientation.
2. **Targeted retrieval.** Use `llms.txt` as a sitemap; fetch the specific pages whose URL paths match the user's question; insert the page Markdown into context.
3. **Vector store.** Ingest the full text of every canonical page as chunks, indexed by Diátaxis type. Filter retrieval by type when the question shape is clear.

The site does not currently ship `llms-full.txt`. The planned shape: a single text file that concatenates the Markdown source of every page in `llms.txt`, with H1 separators between pages, suitable for embedding without further preprocessing.

## What this is not

This page is **not** a claim that the portfolio uses AI to author its content. The writing is human. The AI-readiness choices are structural — they make the *output* easier for AI tools to consume, which is a different problem from using AI to produce the output.

## Further reading

- [llmstxt.org](https://llmstxt.org/) — the proposal this site implements.
- [Diátaxis](https://diataxis.fr/) — the taxonomy.
- [ADR-003](/docs/adr/003-diataxis-as-page-taxonomy) — why Diátaxis is enforced at the page level on this site.
- [ADR-005](/docs/adr/005-openapi-as-source-of-truth) — why API references are generated from specs.

---
id: using-these-docs-with-ai
title: Using these docs with AI
description: "How this site is structured for chatbots and retrieval pipelines: llms.txt, llms-full.txt, one Diátaxis type per page, and OpenAPI specs as the source."
sidebar_label: Using these docs with AI
sidebar_position: 6
tags: [ai, llms, llmstxt, diataxis, explanation]
---

# Using these docs with AI

More and more developers meet documentation through an AI assistant instead of a browser. The choices that make a page easy for a person to scan, like one purpose per page, clear headings, and complete metadata, also make it easier for a model to retrieve the right passage. This page explains what this site does for AI tools and how to connect one to it.

## Files for AI tools

- **[`llms.txt`](pathname:///llms.txt)** follows the [llmstxt.org proposal](https://llmstxt.org/). It lists the main pages, grouped by project, each with a one-line description, its Diátaxis type, and an absolute URL.
- **[`llms-full.txt`](pathname:///llms-full.txt)** has the Markdown source of every page in `llms.txt`, plus the description of each API, in one file. A small plugin (`plugins/llms-full.js`) rebuilds it on every deploy, so it always matches the site.
- **The OpenAPI specs**, [`openapi.json`](pathname:///openapi.json), [`usage-api-openapi.json`](pathname:///usage-api-openapi.json), and [`pix-api-openapi.json`](pathname:///pix-api-openapi.json), are the source of the API reference pages.

## Why one Diátaxis type per page helps

Every page on this site is one [Diátaxis](https://diataxis.fr/) type, and the type is in its front matter `tags` (see [ADR 003](/docs/adr/003-diataxis-as-page-taxonomy)). For a retrieval pipeline that means:

- **The page's job is known in advance.** A reference page is for looking things up, and a tutorial has steps with a fixed outcome. The pipeline can read the tag instead of guessing.
- **Questions map to page types.** "How do I…" questions can favor how-to pages, and "What is…" questions can favor reference and explanation.
- **Chunks stay coherent.** A tutorial has no reference tables mixed into its steps, so a chunk taken from it still reads as a tutorial.

## Why the OpenAPI specs help

The API pages are generated from the specs, and nobody edits the generated files by hand (see [ADR 005](/docs/adr/005-openapi-as-source-of-truth)). Each spec carries:

- `info.description`: who the API is for, authentication, base URL, conventions, and versioning.
- `info.contact`: who maintains it.
- `tags[].description`: what each group of operations does.
- `servers[]`: the base URLs.

A pipeline that reads a spec gets the contract and its explanation together, and the reference page can't disagree with it, because the page is built from it.

## Connecting a chatbot

From the simplest option to the most precise:

1. **Give it the overview.** Paste `llms.txt` into the conversation. It's enough for questions like "what's on this site?"
2. **Give it everything.** Paste or attach `llms-full.txt`. The site is small enough to fit in the context window of most current models.
3. **Index it.** Load `llms-full.txt` into a vector store, split at the `URL:` separators, and keep each page's URL and Diátaxis tag as metadata to filter on.

## Documenting an AI product

The [BillSense AI pages](/docs/billsense-ai/overview) document an AI feature for the support agents who explain it to customers, not for the engineers who built it. The content is split by job:

- An [overview](/docs/billsense-ai/overview) of what the feature does and its known limits, such as estimated kWh values that can differ slightly from the bill.
- A [user guide](/docs/billsense-ai) for walking a customer through their bill.
- A [troubleshooting reference](/docs/billsense-ai/troubleshooting) organized by symptom, with an escalation path when nothing works.

## Further reading

- [llmstxt.org](https://llmstxt.org/), the proposal this site follows
- [Diátaxis](https://diataxis.fr/)
- [ADR 003](/docs/adr/003-diataxis-as-page-taxonomy): why every page is one Diátaxis type
- [ADR 005](/docs/adr/005-openapi-as-source-of-truth): why the API pages are generated from the specs

---
title: "Documenting PIX: five lessons from the API docs for Brazil's instant payments"
description: "What I learned owning the PIX API documentation at Itaú: where integrators get stuck, why the webhook pages matter most, and the order I'd write the docs in next time."
slug: documenting-pix-lessons
tags: [pix, api-documentation, technical-writing, brazil, fintech]
authors: [leandro]
---

From 2022 to 2024, through Zup Innovation, I owned the official documentation for Itaú's PIX APIs: 37+ endpoint references, integration guides, release notes, and migration guides, all in a docs-as-code pipeline on Bitbucket. Most of what I learned there I learned the usual way, by writing the wrong version first. These are the five lessons I'd pass on to anyone documenting a payments API.

<!--truncate-->

## Some context

PIX is Brazil's instant-payments system, run by the central bank (Banco Central do Brasil, or BCB). It launched in November 2020 and now handles [billions of transactions a month](https://www.bcb.gov.br/en/financialstability/pix_en). Most adults in Brazil use it.

Only licensed institutions, called PSPs, connect to the central infrastructure. Merchants, marketplaces, and apps integrate through a PSP's API. The BCB publishes a [standard for that API](https://bacen.github.io/pix-api/), and every PSP implements it. What differs from bank to bank is the documentation on top of the standard. That's where my work was.

## 1. The reference pages get the most traffic

Writing guides often treat the API reference as the easy part: generate it from the spec, link to it, and put the real effort into tutorials. In my experience with PIX, the reference page for `PUT /cob/{txid}` was the page people opened most. It came up in support tickets, incident reviews, audits, and every new engineer's first week.

That meant the reference had to be right and easy to scan:

- **Every status code documented**, including the ones that "shouldn't happen." A `409` on `PUT /cob/{txid}` happens. A `503` happens too.
- **Realistic examples.** A charge for `"150.00"` with a `solicitacaoPagador` in Portuguese, the way a real merchant would send it. People copy examples straight into their code.
- **Current behavior only.** If the page describes what the API did two versions ago, engineers stop trusting it and read the raw spec instead.

None of that is writing, really. It's a pipeline: the OpenAPI spec is the source, the reference pages are generated from it, and nobody edits the output by hand. Building and maintaining that pipeline took more of our time than any single page of prose.

## 2. Idempotency belongs on every page

The usual structure for API docs is overview, authentication, quickstart, endpoints, webhooks, and errors. For PIX, that put idempotency in the wrong place, buried in the errors page.

In PIX it touches everything. The merchant chooses the `txid`, and the PSP keeps it unique for at least 365 days. Each payment has an `e2eId` that settles exactly once, but the webhook carrying it can arrive more than once. So:

- Every page about a write operation explains what happens when you send it twice.
- Every webhook page says that your system, not the sender, is responsible for ignoring duplicates.
- The quickstart ends when you've stored the `e2eId` and a second delivery changes nothing, not when the first webhook arrives.
- The errors page separates a repeated `txid` with the same body, which is safe, from a repeated `txid` with a different body, which is a bug in the client.

We gave idempotency its own concept page and linked to it from every reference page. In the six months after that restructure, level 1 tickets on the PIX integration queue fell by about 45%, going by the tags in our ticketing system.

## 3. Keep the field names in Portuguese

The PIX standard is in Portuguese, and so are the field names (`cob`, `chave`, `devedor`, `valor`), the statuses (`ATIVA`, `CONCLUIDA`), and the error codes. English-speaking engineers on partner teams kept asking us to translate them.

We decided not to. The fields on the wire are in Portuguese. If the docs show English names, the integrator writes code against them, gets a `400`, finds the real names in the spec, and from then on doubts everything else the docs say.

What we did instead:

- Field names, example payloads, and error codes stay exactly as they are on the wire.
- The concepts get English names next to them on first mention: "charge (`cob`)," "PIX key (`chave`)."
- A glossary maps each Portuguese term to the English concept, with a one-line definition.

When a system has a canonical language, the docs should help people work with it, not hide it.

## 4. Most support questions are about webhooks

Our first webhook page was short: we send a `POST` to the URL you register. Meanwhile the request side, how to authenticate and create a charge, got most of the attention. That was backward. Integrators usually got the request side right on day one. The long support threads were about webhooks, and the same questions kept coming, roughly in this order:

1. "We're not receiving webhooks." Usually the endpoint wasn't reachable from the internet, or the certificate wasn't trusted.
2. "We received the same payment twice." The listener didn't return `2xx` in time, and the PSP retried.
3. "We credited a customer twice when the database was slow." They checked for the payment with a `SELECT` before the `INSERT`, instead of relying on a unique key.
4. "We lost payments during a deploy." The listener was down for longer than the retry window.
5. "The signature check fails." They verified the parsed JSON instead of the raw body.

Each of those was a documentation gap. We split the webhook content into three pages: the contract (authentication, payload, expected response), the production problems (authenticate, respond fast, deduplicate, recover), and reconciliation through the API. After that change, developer satisfaction with the docs went from 3.8 to 4.6 out of 5 in our quarterly developer experience survey (60+ responses), and integrators started linking to specific sections from their own runbooks.

The takeaway: spend documentation effort where the support tickets are, not evenly across endpoints.

## 5. The quickstart decides the integration

Many of the engineers reading our docs had never integrated an instant-payments system. For them, the quickstart was the first real test of whether the integration would go smoothly. What we learned about it:

- **It has to end with a settled payment and a webhook**, in the sandbox. A token or a created charge doesn't prove the integration works.
- **Every command has to work the first time.** One typo in step 4 and the reader stops trusting the rest.
- **It has to be one page.** Readers drop off between pages. One page they can scroll and copy from works better.
- **It should take 15 to 30 minutes.** Shorter means it skipped the hard parts, like duplicates and webhook handling, and the reader meets them in production instead.

We reviewed the quickstart more than any other page, and had engineers who had never seen the API run it before each release.

## What I'd do differently

We wrote the docs in roughly this order: reference, quickstart, concepts, errors, a webhook rewrite, reconciliation, idempotency as its own page, and the glossary.

Next time I'd write the concepts first, because every other page refers to them. Then the quickstart, because it forces each concept to be testable in half an hour. Then webhooks and reconciliation, where integrations succeed or fail. Reference last: once the structure around it is right, generating and checking it is mostly mechanical.

## What carries over to other APIs

- **Systems with a canonical language:** keep the wire names in the docs, and translate the concepts around them.
- **Webhook-heavy APIs:** give webhooks more than one page, and recommend a unique key in the database for deduplication.
- **APIs that teams pick during an evaluation:** treat the quickstart as the most important page on the site.

Some of the specifics are particular to PIX. Most APIs assign IDs on the server instead of letting the client choose them. Most international standards are published in English first. And a 24-hour retry window for webhooks is long compared with many other APIs.

---

*I'm Leandro Gabriel, a senior technical writer. If you're documenting a payments API and want a second opinion, [find me on LinkedIn](https://www.linkedin.com/in/leandro-gabriel-8aab31167/). This site has a [PIX documentation set organized by Diátaxis](/docs/pix/about-pix), a [sample PIX API reference you can call from the browser](/docs/api/pix-api/instant-payments-api-pix-sample), and the [docs-as-code pipeline](https://github.com/L-G99921/tw-portfolio/blob/main/.github/workflows/docs-quality.yml) that runs Vale and Lychee on every change.*

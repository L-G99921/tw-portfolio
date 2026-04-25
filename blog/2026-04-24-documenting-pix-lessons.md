---
title: "Documenting PIX: lessons from scaling API docs for Brazil's instant-payments rail"
description: "Five lessons on writing API documentation for an instant-payments system that processes more than two billion transactions per month. What worked, what broke, and what nobody warned us about."
slug: documenting-pix-lessons
tags: [pix, api-documentation, technical-writing, brazil, fintech]
authors: [leandro]
---

PIX moves more money in a month than the United Kingdom's Faster Payments scheme moves in a quarter. It went from zero to one billion monthly transactions in twelve months. It is national infrastructure, free to consumers, mandatory for banks, and operated by a central bank that publishes the spec in Portuguese.

I owned the official PIX API documentation at Itaú Unibanco (via Zup Innovation, 2022–2024) — 37+ endpoint references, integration guides, release notes, and migration docs on a Bitbucket docs-as-code pipeline, for the PSP API serving the world's most-adopted instant-payments rail. This post is what I learned writing those docs at scale — five things that don't show up in Google's developer-docs guide, that I had to learn the way most documentation lessons get learned: by writing the wrong version first.

<!--truncate-->

## What "documenting PIX" actually means

A quick orientation. PIX is the instant-payments rail operated by Banco Central do Brasil. It went live in November 2020 and now [averages over 6 billion transactions per month](https://www.bcb.gov.br/en/financialstability/pix_en). Every Brazilian with a bank account uses it; most of them weekly.

The rail itself is closed. Only licensed PSPs — banks, fintechs, and a handful of payment institutions — talk to it directly. Everyone else (merchants, marketplaces, gig platforms, bill aggregators) integrates against a PSP's *PSP API*, which is a customer-facing wrapper over the rail's settlement messages.

There is a [public OpenAPI standard](https://bacen.github.io/pix-api/) for PSP APIs, published by Bacen. Every PSP implements that standard. But the docs each PSP ships on top of the standard are where developer experience actually happens — and where my work lived.

## Lesson 1 — reference is the floor, not the ceiling

Most developer documentation guides treat API reference as the boring part — the auto-generated thing you produce from an OpenAPI spec and link to. Your real value, the argument goes, lives in tutorials and concept docs.

That's true for hobbyist APIs. It is not true at PIX volume.

When you have hundreds of integrators hitting your endpoints at a few thousand requests per second each, the reference page for `PUT /cob/{txid}` is the most-loaded page on your docs site by an order of magnitude. It loads in support tickets, in incident postmortems, in compliance audits, in onboarding sessions for the new integrator's third backend engineer who joined last week. It has to be right, and it has to be *fast to scan*.

Three things matter on the reference page:

- **Every response code is documented.** Including the ones that "shouldn't happen." `409` on `PUT /cob/{txid}` happens. `503` from the rail happens. The webhook receiver returning `401` on a redelivered signature happens. If a code is in the spec, it has a row on the reference page with at least one realistic example body.
- **Examples are real, not placeholder.** Not `"valor": "100.00"` — `"valor": "150.00"` for a 150-real charge with a Portuguese-language `solicitacaoPagador`. Integrators copy from examples. Generic examples produce generic bugs.
- **The page reflects what the API does *now*, not what it did at v1.** This is the unglamorous compliance work that makes the difference between a docs site engineers respect and a docs site they distrust enough to read the OpenAPI spec instead.

The work isn't generating reference pages. The work is building the contract-first pipeline that keeps them in sync. OpenAPI spec is the source of truth; reference pages regenerate from it; nothing in the rendered output is hand-edited. We spent more engineering time on this pipeline than on any single piece of prose.

## Lesson 2 — idempotency at the rail boundary changes the page shape

A typical API doc structure looks something like this:

> **Overview** → **Authentication** → **Quickstart** → **Endpoints** → **Webhooks** → **Errors**

For PIX, that structure is wrong. Idempotency isn't an "errors" topic — it's an architectural property that shows up on every page.

PIX has a hard property: the rail will not deliver the same `e2eId` twice, but the PSP webhook layer might. The `txid` is supplied by the merchant; the PSP enforces uniqueness for at least 365 days. The `endToEndId` is supplied by the rail at settlement and is unique for the lifetime of the universe.

This means:

- Every reference page for a write endpoint has to explain idempotency behaviour, not just status codes.
- Every webhook page has to explain that the receiver is the dedupe authority — not the sender.
- The quickstart can't end at "received webhook." It has to end at "stored `e2eId`, returned 200, and a second delivery is a no-op."
- The errors page can't list `409` without explaining the difference between "duplicate `txid` with the same body" (idempotent re-create — fine) and "duplicate `txid` with a different body" (genuine conflict — fix the client).

We restructured the docs once we figured this out. The new shape:

> **About PIX (concept)** → **Quickstart** → **Idempotency model** → **Endpoints (with idempotency notes)** → **Webhooks (with replay handling)** → **Reconciliation patterns** → **Errors**

Idempotency went from a buried subsection to its own concept page, linked from every reference page. The before/after numbers showed up in the support ticket queue: L1 tickets on the PIX integration queue dropped about 45% in the six months after the restructure (measured via internal ticketing tags).

## Lesson 3 — localization isn't translation

The PIX standard is published in Portuguese. The field names are Portuguese: `cob`, `chave`, `devedor`, `valor`, `pagador`, `solicitacaoPagador`. The status codes are Portuguese: `ATIVA`, `CONCLUIDA`, `REMOVIDA_PELO_USUARIO_RECEBEDOR`. The error reason codes are Portuguese: `cobranca-nao-encontrada`, `chave-invalida`.

We had a recurring debate on the team: should we translate the field names in the docs? The English-speaking integrators on partner teams kept asking.

The answer ended up being no, with caveats. Here is why.

The OpenAPI spec is the contract. Integrators are calling endpoints whose payloads are in Portuguese. If we publish English field names in the docs that don't match the wire format, every integrator goes through this:

1. Read the docs in English.
2. Write the integration against the English names.
3. Get `400 Bad Request` when the request hits the rail.
4. Open the OpenAPI spec, find the Portuguese names, fix the code.
5. Lose trust in the docs.

Step 5 is the one that costs you. Once an integrator has caught the docs lying about the wire format, every other claim on the docs site is suspect.

What we did instead:

- **Wire-format names stay in Portuguese** on every reference page, every example, every payload snippet. Integrators copy real strings.
- **Concept words get translated.** "Charge" alongside `cob` (parenthetical on first mention), "received PIX" alongside `pix`, "key" alongside `chave`.
- **The standard's Portuguese terms are listed in a glossary**, with the English concept and a one-line definition. Integrators have a mental map without us lying about the contract.
- **Error reason codes ship as-is**, with the English explanation in the corresponding row of the errors table.

The lesson generalizes: when the underlying system has a canonical language, your job is to bridge to it, not paper over it. Hiding the canonical names is a leaky abstraction that costs you trust.

## Lesson 4 — webhook docs are 60% of integration support

Most integration teams I've seen invest most of their docs effort in the request side: how to authenticate, how to format a charge, how to read errors. The webhook side gets one page, late in the doc set, that says "we POST to a URL you give us."

That allocation is upside-down. At PIX volume, the request side is mostly correct on day one. Integrators sign up, copy a curl example, get a 200, and move on. The webhook side is where every long support ticket lives.

The questions integrators actually ask, in the order they ask them:

1. "We're not receiving webhooks." (Almost always: their endpoint isn't reachable from the public internet, or the TLS cert isn't trusted.)
2. "We're receiving the same payment twice." (Always: their listener returned a non-2xx and the PSP retried.)
3. "We're double-crediting customers when our database is slow." (Always: they're using `SELECT then INSERT` for dedupe instead of a primary-key constraint.)
4. "We're missing payments after a deploy." (Always: their listener was down past the retry window.)
5. "Webhook signatures are failing." (Almost always: they're verifying against parsed JSON, not the raw body.)

Every one of those is a docs problem, not a product problem. We rewrote our webhook page after we noticed the pattern. The new structure was:

- One page just for the endpoint contract (auth header, payload schema, expected response).
- One page for the four production problems (verify, ack fast, dedupe, recover).
- One page for the reconciler pattern (replay missed payments through the API).

Three pages instead of one. About 4× the words. Internal developer satisfaction with the docs portal moved from 3.8 to 4.6 out of 5 in the next quarterly DX survey (n=60+ respondents) — and integrators started linking to specific anchor sections in their own internal runbooks.

The general lesson: docs effort should follow ticket weight, not endpoint count.

## Lesson 5 — the quickstart is the product page

For an API where most integrators are Brazilian backend engineers who have never integrated a real-time payments rail before, the quickstart isn't an onboarding aid. It's the only page that sells your product.

The integrator's manager has approved the project. They have one afternoon to decide whether your PSP is the right one, or whether they should give the next one on the procurement list a try. They land on your docs site, click "quickstart," and decide.

What that means in practice:

- The quickstart must produce a settled payment, on the sandbox, end-to-end. Not a token. Not a charge. A *settled payment with a webhook callback*. If they don't see the rail close the loop, they don't know the integration works.
- The quickstart must work on the first try. Every command, every example, every credential. If step 4 of 7 has a typo, you've lost them.
- The quickstart must be a single page. Not a series of linked pages. Integrators close the tab between page two and page three. A single page they can scroll, copy from, and tick off in their head wins.
- The quickstart must take 15 to 30 minutes. Less than 15 means it skipped the hard parts (idempotency, webhook handling, signature verification) and the integrator will hit them in production. More than 30 means most readers bounce.

We invested heavily in the quickstart and treated it like a marketing page — multiple drafts, peer review, dogfooding by engineers who hadn't seen our API before, A/B variants on the landing CTA. The conversion rate from "viewed quickstart" to "shipped first production payment" was the single best leading indicator of integration success that we tracked.

## What I'd do differently next time

The biggest thing I'd change is the order. We wrote the docs in roughly this sequence:

> Reference → Quickstart → Concepts → Errors → Webhooks (re-write) → Reconciliation patterns → Idempotency concept (extracted) → Wire-format glossary

It would have been faster to get to the same place by writing in this order:

> Concepts → Quickstart → Webhooks (full) → Reconciliation patterns → Reference → Errors → Glossary

Concepts first, because every later page references them. Quickstart second, because writing it forces every concept to be testable in 30 minutes. Webhooks third, because they are the surface area where integration succeeds or fails. Reference last, because once the surrounding structure is right, the reference is mostly mechanical.

The mistake we made was treating reference as the foundation. It isn't. Reference is the load-bearing wall, but it goes up after the foundation is poured.

## What translates

Most of the lessons above generalize beyond PIX. The specifics that do:

- **Any rail-level integration**: the rail's canonical language belongs in your docs, not a translated abstraction. (PIX in Portuguese; SWIFT in English-with-codes; Open Banking in jurisdiction-specific JSON; CBDC pilots in whatever the local central bank publishes.)
- **Any high-volume webhook system**: the webhook page should be three pages, not one, and the dedupe pattern should be a primary-key constraint at the storage layer.
- **Any developer-facing product where adoption is procurement-driven**: the quickstart sells the product. Treat it like a landing page, with the same scrutiny you'd put on a hero block.

The specifics that don't:

- The `txid` model is unusual. Most APIs assign IDs server-side; PIX deliberately doesn't. If your API does, you have less to explain.
- The Portuguese-only standard is unusual. Most international standards publish in English first.
- The 24-hour webhook retry window is unusual. Most APIs cap retries at 30 minutes or less.

But those are mechanics. The structural lessons — reference is the floor, idempotency restructures the doc shape, localization isn't translation, webhooks are the support surface, the quickstart is the product page — those translate to anything with the same shape: a high-volume API with rail-level ground truth and a webhook callback model.

---

*About the author: I'm Leandro Gabriel, a Senior Technical Writer with 8+ years writing developer documentation across fintech, retail, and beauty data infrastructure. I owned the official PIX API documentation at Itaú Unibanco (via Zup Innovation, 2022–2024). If you're building docs for a payments rail or any high-volume API and want a second pair of eyes, [I'm reachable on LinkedIn](https://www.linkedin.com/in/leandro-gabriel-8aab31167/). The portfolio this article is published on includes the structural samples I'd use to start: a [Diátaxis-organized PIX section](/docs/pix/about-pix), a [PIX-inspired OpenAPI sample](/docs/api/pix-api/instant-payments-api-pix-sample), and the [docs-as-code pipeline](https://github.com/L-G99921/tw-portfolio/blob/main/.github/workflows/docs-quality.yml) running Vale and Lychee on every change.*

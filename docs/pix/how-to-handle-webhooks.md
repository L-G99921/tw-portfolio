---
title: Handle PIX webhook callbacks
description: "Production-ready webhook handling for PIX: signature verification, idempotency, replay safety, and outage recovery."
sidebar_label: How-to — webhooks
sidebar_position: 3
tags: [pix, how-to, webhooks, instant-payments]
---

# Handle PIX webhook callbacks

This how-to assumes you already issue charges and receive sandbox webhooks (see the [tutorial](./tutorial-first-payment)). It walks through the four problems every production webhook listener must solve:

1. Verify the request actually came from the PSP.
2. Acknowledge fast — under 5 seconds — even when downstream systems are slow.
3. Process exactly once, even when the PSP redelivers.
4. Recover from listener outages without losing payments.

The examples are in Node.js and Express, but the patterns translate to any HTTP stack.

## Verify the request signature

Every webhook from a PSP carries a signature header. The header name varies by PSP — common ones are `X-PSP-Signature`, `X-PIX-Signature`, or `X-Webhook-Signature`. The value is an HMAC-SHA256 of the raw request body, signed with a shared secret.

The signature must be verified against the **raw body bytes** — not the parsed JSON. JSON parsing canonicalises whitespace and field order, which breaks the HMAC.

1. **Capture the raw body before parsing**

    ```javascript
    const express = require('express');
    const crypto = require('crypto');

    const app = express();

    app.use('/pix-callback', express.raw({ type: 'application/json' }));
    ```

    `express.raw()` gives you a `Buffer` on `req.body`. The handler parses it manually after verification.

2. **Compute and compare the signature in constant time**

    ```javascript
    function verify(rawBody, headerSignature, secret) {
      const expected = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      const a = Buffer.from(expected);
      const b = Buffer.from(headerSignature || '', 'utf8');

      return a.length === b.length && crypto.timingSafeEqual(a, b);
    }
    ```

    Use `crypto.timingSafeEqual` — never `===` on strings. Direct comparison leaks the secret one byte at a time through response-time differences.

3. **Reject unverified requests with `401`**

    ```javascript
    app.post('/pix-callback', (req, res) => {
      const signature = req.header('X-PSP-Signature');
      const secret = process.env.PIX_WEBHOOK_SECRET;

      if (!verify(req.body, signature, secret)) {
        return res.status(401).json({ error: 'invalid signature' });
      }

      const payload = JSON.parse(req.body.toString('utf8'));
      // ... continue
    });
    ```

> **Warning:** A leaked webhook secret is a leaked payment-confirmation channel. Store it in a secret manager (AWS Secrets Manager, Hashicorp Vault, Doppler), not in environment files committed to source control. Rotate it whenever a developer with access leaves.

## Acknowledge fast, process async

The PSP gives the listener 5 seconds to return a `2xx`. After that, it retries with exponential backoff for up to 24 hours. A listener that does database writes, balance updates, and downstream notifications inline routinely blows the budget under load.

The fix is to ack first, process later.

1. **Push the payload onto a queue**

    ```javascript
    const { Queue } = require('bullmq');
    const pixQueue = new Queue('pix-webhooks', {
      connection: { host: process.env.REDIS_HOST }
    });

    app.post('/pix-callback', async (req, res) => {
      const signature = req.header('X-PSP-Signature');
      const secret = process.env.PIX_WEBHOOK_SECRET;

      if (!verify(req.body, signature, secret)) {
        return res.status(401).json({ error: 'invalid signature' });
      }

      const payload = JSON.parse(req.body.toString('utf8'));

      await pixQueue.add('process', payload, {
        jobId: payload.endToEndId,
        attempts: 5,
        backoff: { type: 'exponential', delay: 1000 }
      });

      return res.status(200).json({ received: true });
    });
    ```

    The handler does three things: verify, enqueue, ack. Anything heavier — database writes, balance reconciliation, customer notifications — runs in a worker.

2. **Process in a worker**

    ```javascript
    const { Worker } = require('bullmq');

    new Worker('pix-webhooks', async (job) => {
      await reconcilePayment(job.data);
    }, {
      connection: { host: process.env.REDIS_HOST },
      concurrency: 50
    });
    ```

    The worker can take all the time it needs. The PSP only sees the listener, and the listener already responded.

> **Note:** This pattern requires a queue with at-least-once delivery. Redis Streams, BullMQ, SQS, and Pub/Sub all qualify. The dedupe step in the next section makes the at-least-once guarantee safe.

## Guarantee idempotency

The rail will not deliver the same `e2eId` twice. The PSP webhook layer might — for any of these reasons:

- The first delivery timed out and the PSP retried.
- A network blip caused the PSP to lose the ack.
- A failover on the PSP side replayed in-flight messages.
- A worker crashed mid-process and the queue redelivered.

Treat the `e2eId` as the idempotency key. Persist it before doing anything that has external side effects.

1. **Use a unique constraint, not an `if exists`**

    ```sql
    CREATE TABLE pix_received (
      e2e_id           TEXT PRIMARY KEY,
      txid             TEXT,
      amount_cents     BIGINT NOT NULL,
      paid_at          TIMESTAMPTZ NOT NULL,
      payer_doc        TEXT NOT NULL,
      payer_name       TEXT NOT NULL,
      raw_payload      JSONB NOT NULL,
      processed_at     TIMESTAMPTZ
    );
    ```

    The primary-key constraint on `e2e_id` is the dedupe. Race conditions between two workers are resolved by the database, not by application logic.

2. **Insert first, branch on the result**

    ```javascript
    async function reconcilePayment(payload) {
      const { rowCount } = await db.query(
        `INSERT INTO pix_received
          (e2e_id, txid, amount_cents, paid_at, payer_doc, payer_name, raw_payload)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (e2e_id) DO NOTHING`,
        [
          payload.endToEndId,
          payload.txid || null,
          Math.round(parseFloat(payload.valor) * 100),
          payload.horario,
          payload.pagador.cpf || payload.pagador.cnpj,
          payload.pagador.nome,
          payload
        ]
      );

      if (rowCount === 0) {
        // Already processed — duplicate delivery.
        return;
      }

      await creditMerchant(payload);
      await notifyMerchantSystems(payload);
      await markProcessed(payload.endToEndId);
    }
    ```

    `INSERT ... ON CONFLICT DO NOTHING` is the cleanest pattern. The first delivery wins; subsequent deliveries become no-ops without an extra round trip.

> **Tip:** Storing `raw_payload` as `JSONB` is non-negotiable. When a payment dispute lands six months later, you'll need the original webhook body, not your post-processed view of it.

## Recover from a listener outage

Webhooks fail. The endpoint goes down for a deploy, the database is locked during a long migration, the certificate expires on the wrong Sunday morning. The PSP retries for 24 hours — but the merchant integration must not depend on the retry surviving the outage.

The recovery path is a reconciler that runs on a schedule and replays missing payments through the API.

1. **List received PIX since the last successful run**

    Most PSP APIs expose a `GET /pix?inicio=<ISO timestamp>&fim=<ISO timestamp>` that returns received payments in a window. The pseudocode below uses a hypothetical paged response.

    ```javascript
    async function reconcileSince(startIso) {
      let cursor = null;

      do {
        const url = new URL(`${process.env.PIX_BASE_URL}/pix`);
        url.searchParams.set('inicio', startIso);
        url.searchParams.set('fim', new Date().toISOString());
        if (cursor) url.searchParams.set('cursor', cursor);

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${await getToken()}` }
        });
        const page = await response.json();

        for (const pix of page.pix) {
          await reconcilePayment(pix);   // same handler — idempotent by design
        }

        cursor = page.nextCursor;
      } while (cursor);
    }
    ```

    Reuse the same `reconcilePayment` from [Step 2 above](#guarantee-idempotency). The dedupe on `e2e_id` makes it safe to replay every payment in the window — already-processed payments become no-ops.

2. **Schedule it conservatively**

    A typical cadence:

    | Cadence | Window | Purpose |
    | --- | --- | --- |
    | Every 5 minutes | Last 30 minutes | Catch missed webhooks during steady-state operation |
    | Hourly | Last 6 hours | Fill gaps during transient outages |
    | Daily | Last 26 hours | Final safety net before the rail's 24-hour retry window closes |

    The 30-minute window is wide enough to absorb a brief deploy outage; the daily 26-hour sweep catches anything the rail couldn't deliver. All three sweeps are safe to run concurrently because the dedupe is in the database.

3. **Alert on divergence**

    A reconciler that finds payments not already in your database is a signal that the live webhook path failed. Emit one of these per reconciler run:

    ```text
    pix.reconciler.replayed{outcome=new}      = N   # webhooks the listener missed
    pix.reconciler.replayed{outcome=existing} = M   # already deduped — expected
    pix.reconciler.lag_seconds                = K   # max age of a "new" payment
    ```

    Page on `outcome=new` rising above the daily baseline. Lag above 600 seconds means the live listener is degraded.

## Production checklist

- [ ] Raw body captured before parsing.
- [ ] HMAC verified with `timingSafeEqual`, not string comparison.
- [ ] Webhook responds `2xx` within 5 seconds in p99.
- [ ] Heavy work runs in a worker, not the request handler.
- [ ] `e2eId` is a primary key in the persistence layer.
- [ ] `INSERT ... ON CONFLICT DO NOTHING` (or equivalent) handles duplicates.
- [ ] Raw payload persisted as `JSONB` for auditability.
- [ ] Reconciler runs on at least three cadences (minutes, hourly, daily).
- [ ] Reconciler-replayed-new alert wired to on-call.
- [ ] Webhook secret stored in a secret manager and rotated on staff changes.

## Related

- [Send your first PIX payment](./tutorial-first-payment) — the sandbox happy path
- [About PIX](./about-pix) — why `e2eId` is the right idempotency key
- [Instant Payments API reference](/docs/api/pix-api/instant-payments-api-pix-sample) — the full webhook resource

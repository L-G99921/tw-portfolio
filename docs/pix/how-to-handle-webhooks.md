---
title: Handle PIX webhooks
description: "How to run a PIX webhook listener in production: authenticate requests, respond fast, process each payment once, and recover after an outage."
sidebar_label: "How-to: handle webhooks"
sidebar_position: 3
tags: [pix, how-to, webhooks, instant-payments]
---

# Handle PIX webhooks

This guide assumes you already create charges and receive webhooks in the sandbox. If you don't, start with the [tutorial](./tutorial-first-payment). A listener in production has to solve four problems:

1. Accept only requests that come from your PSP.
2. Respond within 5 seconds, even when your other systems are slow.
3. Process each payment once, even when the PSP delivers it twice.
4. Recover the payments it missed while it was down.

The examples use Node.js and Express. The same approach works in any stack.

## Know what arrives

Following the PIX standard, the PSP sends a `POST` to the URL you registered, with `/pix` added at the end. The body holds a list, because one call can carry several payments:

```json
{
  "pix": [
    {
      "endToEndId": "E12345678202604241832A1B2C3D4E5F",
      "txid": "tutorial20260424183205a1b2c3d4",
      "valor": "12.50",
      "horario": "2026-04-24T18:32:13Z",
      "infoPagador": "Order 4821"
    }
  ]
}
```

`txid` is empty for a PIX sent without a charge. The payer's name and tax ID aren't in the webhook. To get them, call `GET /pix/{e2eId}`.

## Authenticate the request

The PIX standard authenticates webhooks with **mutual TLS**: the PSP presents a client certificate, and your server accepts only certificates issued for your PSP. Set this up where TLS ends, usually in your load balancer or reverse proxy, and pass a header to the app saying the certificate checked out.

Many PSPs also sign each request with an HMAC of the body. If yours does, check the signature too.

1. **Keep the raw body**

    The HMAC covers the exact bytes the PSP sent. Parsing the JSON first changes spacing and key order, so the signature no longer matches.

    ```javascript
    const express = require('express');
    const crypto = require('crypto');

    const app = express();
    app.use('/pix-callback/pix', express.raw({ type: 'application/json' }));
    ```

2. **Compare signatures in constant time**

    ```javascript
    function verify(rawBody, headerSignature, secret) {
      const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
      const a = Buffer.from(expected);
      const b = Buffer.from(headerSignature || '', 'utf8');
      return a.length === b.length && crypto.timingSafeEqual(a, b);
    }
    ```

    Use `crypto.timingSafeEqual`, not `===`. A plain comparison returns faster when the first bytes differ, and an attacker can measure that to guess the signature.

3. **Reject what fails**

    The header name depends on the PSP. Check your PSP's documentation.

    ```javascript
    function authenticate(req) {
      const mtlsOk = req.header('X-Client-Cert-Verified') === 'SUCCESS'; // set by your proxy
      const signature = req.header('X-Webhook-Signature');
      return mtlsOk && verify(req.body, signature, process.env.PIX_WEBHOOK_SECRET);
    }
    ```

:::warning Protect the secret
Anyone with the webhook secret can fake a payment confirmation. Keep it in a secret manager such as AWS Secrets Manager or HashiCorp Vault, never in a file in the repository, and rotate it when someone with access leaves the team.
:::

## Respond fast, process later

The PSP waits 5 seconds for a `2xx`. After that, it retries with increasing delays for up to 24 hours. A listener that writes to the database, updates balances, and notifies other systems before responding misses that limit under load.

Respond first and do the work afterward.

1. **Put each payment on a queue**

    ```javascript
    const { Queue } = require('bullmq');
    const pixQueue = new Queue('pix-webhooks', { connection: { host: process.env.REDIS_HOST } });

    app.post('/pix-callback/pix', async (req, res) => {
      if (!authenticate(req)) {
        return res.status(401).json({ error: 'unauthorized' });
      }

      const { pix = [] } = JSON.parse(req.body.toString('utf8'));
      for (const payment of pix) {
        await pixQueue.add('process', payment, {
          jobId: payment.endToEndId, // the queue ignores a second job with the same ID
          attempts: 5,
          backoff: { type: 'exponential', delay: 1000 },
        });
      }

      return res.status(200).json({ received: pix.length });
    });
    ```

    The handler authenticates, queues, and responds. Everything else happens in a worker.

2. **Process in a worker**

    ```javascript
    const { Worker } = require('bullmq');

    new Worker('pix-webhooks', (job) => recordPayment(job.data), {
      connection: { host: process.env.REDIS_HOST },
      concurrency: 50,
    });
    ```

    The worker can take as long as it needs, because the PSP already got its response.

The queue needs at-least-once delivery. BullMQ, Redis Streams, Amazon SQS, and Google Pub/Sub all provide it. The next section makes the occasional duplicate harmless.

## Process each payment once

Each `e2eId` settles only once, but you can still receive it more than once:

- Your first response took too long, and the PSP retried.
- Your response got lost on the network.
- The PSP failed over and resent messages in flight.
- A worker crashed halfway and the queue delivered the job again.

Use the `e2eId` as the idempotency key, and save it before anything with side effects happens.

1. **Let the database reject duplicates**

    ```sql
    CREATE TABLE pix_received (
      e2e_id        TEXT PRIMARY KEY,
      txid          TEXT,
      amount_cents  BIGINT NOT NULL,
      paid_at       TIMESTAMPTZ NOT NULL,
      raw_payload   JSONB NOT NULL,
      processed_at  TIMESTAMPTZ
    );
    ```

    The primary key on `e2e_id` does the deduplication. If two workers race, the database decides, not your code.

2. **Insert first, then act on the result**

    ```javascript
    // "12.50" -> "1250". String math, no floating point. Returned as a string
    // so the driver passes it to the BIGINT column unchanged.
    function toCents(valor) {
      const [units, decimals = ''] = valor.split('.');
      return (BigInt(units) * 100n + BigInt(decimals.padEnd(2, '0').slice(0, 2))).toString();
    }

    async function recordPayment(payment) {
      const { rowCount } = await db.query(
        `INSERT INTO pix_received (e2e_id, txid, amount_cents, paid_at, raw_payload)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (e2e_id) DO NOTHING`,
        [payment.endToEndId, payment.txid || null, toCents(payment.valor), payment.horario, payment],
      );

      if (rowCount === 0) return; // seen before

      await creditMerchant(payment);
      await notifyMerchantSystems(payment);
      await markProcessed(payment.endToEndId);
    }
    ```

    `INSERT ... ON CONFLICT DO NOTHING` needs one round trip. The first delivery inserts the row, and any later one changes nothing.

:::tip Keep the original body
Store the payload as received, in `raw_payload`. If someone disputes a payment months later, you'll want the exact webhook, not your processed version of it.
:::

## Recover after an outage

Listeners go down: a deploy, a database lock during a migration, a certificate that expires on a Sunday. The PSP retries for 24 hours, but your system shouldn't depend on that. Run a reconciler on a schedule that asks the API for received payments and feeds them through the same `recordPayment`.

1. **List payments received in a time window**

    The PIX standard has `GET /pix` with `inicio` and `fim` for the window, and paginates with `paginacao.paginaAtual`:

    ```javascript
    async function reconcile(startIso, endIso) {
      for (let page = 0, total = 1; page < total; page++) {
        const url = new URL(`${process.env.PIX_BASE_URL}/pix`);
        url.searchParams.set('inicio', startIso);
        url.searchParams.set('fim', endIso);
        url.searchParams.set('paginacao.paginaAtual', page);

        const res = await fetch(url, { headers: { Authorization: `Bearer ${await getToken()}` } });
        const body = await res.json();
        total = body.parametros.paginacao.quantidadeDePaginas;

        for (const payment of body.pix) {
          await recordPayment(payment); // duplicates are skipped by the primary key
        }
      }
    }
    ```

    Because `recordPayment` ignores payments it has already stored, replaying a whole window is safe.

2. **Run it on three schedules**

    | Every | Window | Catches |
    | --- | --- | --- |
    | 5 minutes | Last 30 minutes | A webhook missed during normal operation |
    | Hour | Last 6 hours | Gaps from a short outage |
    | Day | Last 26 hours | Anything left before the PSP's 24-hour retries end |

    The three can overlap, because the database removes duplicates.

3. **Alert when the reconciler finds something new**

    If the reconciler stores a payment the webhook didn't, the live path failed. Record these on every run:

    ```text
    pix.reconciler.replayed{outcome=new}      = N   # payments the listener missed
    pix.reconciler.replayed{outcome=existing} = M   # already stored, which is normal
    pix.reconciler.lag_seconds                = K   # age of the oldest new payment
    ```

    Page someone when `outcome=new` goes above its usual daily level. A lag above 600 seconds means the listener is struggling.

## Production checklist

- [ ] mTLS required at the edge, and the HMAC checked if your PSP signs requests.
- [ ] Raw body kept until the signature check.
- [ ] Signatures compared with `timingSafeEqual`.
- [ ] Listener answers `2xx` within 5 seconds at p99.
- [ ] Each payment in the list queued with its `e2eId` as the job ID.
- [ ] `e2eId` is the primary key where payments are stored.
- [ ] Amounts converted from strings without floating point.
- [ ] Raw payload stored for audits.
- [ ] Reconciler running every 5 minutes, every hour, and every day.
- [ ] Alert on `outcome=new` routed to whoever is on call.
- [ ] Webhook secret in a secret manager, rotated when people leave.

## Related

- [Send your first PIX payment](./tutorial-first-payment), the sandbox flow from start to finish
- [About PIX](./about-pix), including why the `e2eId` is the right idempotency key
- [Instant Payments API reference](/docs/api/pix-api/instant-payments-api-pix-sample), with the webhook operations

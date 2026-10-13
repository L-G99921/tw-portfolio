/*
 * API sandbox (service worker)
 *
 * The OpenAPI specs on this site point at illustrative hosts such as
 * https://sandbox.instant-payments.example. Those hosts don't exist, so the
 * "Send API Request" button had nothing to talk to.
 *
 * This worker intercepts requests to any *.example host and answers them in
 * the browser, using the same OpenAPI specs the reference pages are built
 * from. Nothing leaves the visitor's machine.
 *
 *  - Routing, auth, path-parameter patterns, and required bodies are checked
 *    against the spec, and errors use the status codes the spec documents.
 *  - Responses use the spec examples, filled in from the request where it
 *    makes sense.
 *  - PIX charges and webhooks keep state (Cache Storage), so you can create a
 *    charge with PUT /cob/{txid}, read it back with GET, and update it with PATCH.
 */

const BASE = new URL(self.registration.scope).pathname; // e.g. /tw-portfolio/
const SPECS = ['openapi.json', 'usage-api-openapi.json', 'pix-api-openapi.json'];
const STATE_CACHE = 'api-sandbox-state-v1';

let specsPromise = null;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  let url;
  try {
    url = new URL(event.request.url);
  } catch {
    return;
  }
  if (!url.hostname.endsWith('.example')) return;
  event.respondWith(handle(event.request, url));
});

/* ---------- Spec loading and routing ---------- */

function loadSpecs() {
  if (!specsPromise) {
    specsPromise = Promise.all(
      SPECS.map((file) =>
        fetch(BASE + file)
          .then((r) => r.json())
          .catch(() => null),
      ),
    ).then((list) => list.filter(Boolean));
  }
  return specsPromise;
}

function deref(spec, node, depth = 0) {
  if (!node || depth > 12) return node;
  if (node.$ref) {
    const parts = node.$ref.replace(/^#\//, '').split('/');
    let target = spec;
    for (const p of parts) target = target && target[p];
    return deref(spec, target, depth + 1);
  }
  return node;
}

function findOperation(specs, url, method) {
  for (const spec of specs) {
    for (const server of spec.servers || []) {
      const base = new URL(server.url);
      if (base.host !== url.host) continue;
      const basePath = base.pathname.replace(/\/$/, '');
      if (!url.pathname.startsWith(basePath)) continue;
      const rest = url.pathname.slice(basePath.length) || '/';
      for (const [template, item] of Object.entries(spec.paths || {})) {
        const names = [];
        const regex = new RegExp(
          '^' +
            template.replace(/\{([^}]+)\}/g, (_, name) => {
              names.push(name);
              return '([^/]+)';
            }) +
            '/?$',
          'i',
        );
        const m = rest.match(regex);
        if (!m) continue;
        const op = item[method.toLowerCase()];
        if (!op) return {spec, template, item, op: null, params: {}, allowed: Object.keys(item)};
        const params = {};
        names.forEach((n, i) => (params[n] = decodeURIComponent(m[i + 1])));
        return {spec, template, item, op, params};
      }
    }
  }
  return null;
}

/* ---------- Example generation ---------- */

function sampleFor(name = '', schema = {}) {
  const n = name.toLowerCase();
  if (schema.format === 'date-time' || /(date|criacao|horario|timestamp)$/.test(n)) return new Date().toISOString();
  if (schema.format === 'date') return new Date().toISOString().slice(0, 10);
  if (schema.format === 'email' || n.includes('email')) return 'customer@example.com';
  if (schema.format === 'uri' || n.includes('url') || n === 'location') return 'https://sandbox.example/v2/loc/7d9f0335';
  if (n.includes('cpf')) return '12345678909';
  if (n.includes('cnpj')) return '12345678000195';
  if (n.includes('nome') || n === 'name') return 'Maria Silva';
  if (n.includes('valor') || n === 'original') return '150.00';
  if (n.includes('token')) return 'eyJhbGciOiJSUzI1NiJ9.sandbox';
  if (n.includes('id')) return 'a1b2c3d4';
  return 'string';
}

function fromSchema(spec, schema, name = '', depth = 0) {
  schema = deref(spec, schema);
  if (!schema || depth > 6) return null;
  if (schema.example !== undefined) return schema.example;
  if (schema.default !== undefined) return schema.default;
  if (schema.enum) return schema.enum[0];
  if (schema.allOf) return Object.assign({}, ...schema.allOf.map((s) => fromSchema(spec, s, name, depth + 1)));
  if (schema.oneOf || schema.anyOf) return fromSchema(spec, (schema.oneOf || schema.anyOf)[0], name, depth + 1);
  const type = schema.type || (schema.properties ? 'object' : schema.items ? 'array' : 'string');
  if (type === 'object') {
    const out = {};
    for (const [key, prop] of Object.entries(schema.properties || {})) out[key] = fromSchema(spec, prop, key, depth + 1);
    return out;
  }
  if (type === 'array') {
    if (/pix$/i.test(name)) return [];
    return [fromSchema(spec, schema.items, name, depth + 1)];
  }
  if (type === 'integer' || type === 'number') return /revisao/i.test(name) ? 0 : 1;
  if (type === 'boolean') return true;
  return sampleFor(name, schema);
}

function exampleFor(spec, response) {
  response = deref(spec, response);
  const content = response && response.content;
  if (!content) return {type: null, body: null};
  const [type, media] = Object.entries(content)[0];
  if (media.example !== undefined) return {type, body: media.example};
  if (media.examples) {
    const first = Object.values(media.examples)[0];
    const ex = deref(spec, first);
    if (ex && ex.value !== undefined) return {type, body: ex.value};
  }
  return {type, body: fromSchema(spec, media.schema)};
}

/* ---------- Responses ---------- */

function reply(status, body, contentType = 'application/json') {
  const headers = new Headers({
    'X-Sandbox': 'simulated-in-browser',
    'Access-Control-Allow-Origin': '*',
  });
  if (body === null || body === undefined || status === 204) {
    return new Response(null, {status, headers});
  }
  headers.set('Content-Type', contentType);
  return new Response(JSON.stringify(body, null, 2), {status, headers});
}

function problem(status, title, detail) {
  return reply(status, {type: `https://sandbox.example/problems/${status}`, title, status, detail}, 'application/problem+json');
}

// Errors use the status code the spec documents, with a message that explains
// this specific failure. (The specs reuse one generic example for every error,
// which would be misleading here.)
function documentedError(found, status, title, detail) {
  return problem(status, title, detail);
}

const delay = () => new Promise((r) => setTimeout(r, 180 + Math.random() * 220));

/* ---------- State (PIX charges and webhooks) ---------- */

async function stateGet(key) {
  const cache = await caches.open(STATE_CACHE);
  const hit = await cache.match('/__state/' + key);
  return hit ? hit.json() : null;
}
async function stateSet(key, value) {
  const cache = await caches.open(STATE_CACHE);
  await cache.put('/__state/' + key, new Response(JSON.stringify(value)));
}
async function stateDelete(key) {
  const cache = await caches.open(STATE_CACHE);
  await cache.delete('/__state/' + key);
}

async function pixHandlers(found, method, body) {
  const {template, params} = found;
  const now = new Date().toISOString();

  if (template === '/cob/{txid}') {
    const key = 'cob/' + params.txid;
    const existing = await stateGet(key);

    if (method === 'PUT') {
      if (existing) {
        const same = JSON.stringify(existing.request) === JSON.stringify(body);
        if (same) return reply(201, existing.charge);
        return problem(409, 'Charge already exists', `A charge with txid ${params.txid} already exists with a different body.`);
      }
      const charge = {
        txid: params.txid,
        revisao: 0,
        status: 'ATIVA',
        calendario: {criacao: now, expiracao: (body.calendario && body.calendario.expiracao) || 86400},
        devedor: body.devedor,
        valor: body.valor,
        chave: body.chave,
        solicitacaoPagador: body.solicitacaoPagador,
        loc: {id: Math.floor(Math.random() * 9000) + 1000, location: `sandbox.instant-payments.example/v2/loc/${params.txid.slice(0, 8)}`, tipoCob: 'cob'},
        pix: [],
      };
      Object.keys(charge).forEach((k) => charge[k] === undefined && delete charge[k]);
      await stateSet(key, {request: body, charge});
      return reply(201, charge);
    }

    if (!existing) {
      return problem(404, 'Charge not found', `No charge with txid ${params.txid}. Create it first with PUT /cob/${params.txid}.`);
    }

    if (method === 'GET') return reply(200, existing.charge);

    if (method === 'PATCH') {
      if (existing.charge.status !== 'ATIVA') {
        return problem(409, 'Charge cannot be changed', `The charge status is ${existing.charge.status}. Only ATIVA charges accept updates.`);
      }
      const updated = {...existing.charge, ...body, revisao: existing.charge.revisao + 1};
      if (body.calendario) updated.calendario = {...existing.charge.calendario, ...body.calendario};
      if (body.valor) updated.valor = {...existing.charge.valor, ...body.valor};
      await stateSet(key, {request: existing.request, charge: updated});
      return reply(200, updated);
    }
  }

  if (template === '/webhook/{chave}') {
    const key = 'webhook/' + params.chave;
    if (method === 'PUT') {
      const hook = {webhookUrl: body.webhookUrl, chave: params.chave, criacao: now};
      await stateSet(key, hook);
      return reply(201, hook);
    }
    const hook = await stateGet(key);
    if (!hook) return problem(404, 'Webhook not found', `No webhook registered for key ${params.chave}.`);
    if (method === 'GET') return reply(200, hook);
    if (method === 'DELETE') {
      await stateDelete(key);
      return reply(204, null);
    }
  }

  return null; // fall back to the spec example
}

/* ---------- Main handler ---------- */

async function handle(request, url) {
  await delay();
  const method = request.method.toUpperCase();
  if (method === 'OPTIONS') return reply(204, null);

  const specs = await loadSpecs();
  const found = findOperation(specs, url, method);
  if (!found) return problem(404, 'Not found', `${url.pathname} is not part of any API documented on this site.`);
  if (!found.op) return problem(405, 'Method not allowed', `${method} is not supported here. Allowed: ${found.allowed.join(', ').toUpperCase()}.`);

  const {spec, op} = found;

  // Authentication: any operation with a security requirement needs a bearer token.
  const security = op.security !== undefined ? op.security : spec.security;
  const needsAuth = Array.isArray(security) && security.length > 0;
  if (needsAuth) {
    const auth = request.headers.get('Authorization') || '';
    if (!/^Bearer\s+\S+/i.test(auth)) {
      return documentedError(found, 401, 'Unauthorized', 'Add a bearer token in the Auth field. Any non-empty value works in the sandbox.');
    }
  }

  // Path parameters must match their documented pattern.
  for (const p of op.parameters || []) {
    const param = deref(spec, p);
    if (param.in !== 'path') continue;
    const value = found.params[param.name];
    const pattern = param.schema && param.schema.pattern;
    if (pattern && !new RegExp(pattern).test(value)) {
      return documentedError(found, 400, 'Invalid path parameter', `${param.name} must match ${pattern}. Received "${value}".`);
    }
  }

  // Required body.
  let body = {};
  if (op.requestBody) {
    const raw = await request.text();
    if (raw.trim()) {
      try {
        body = JSON.parse(raw);
      } catch {
        return documentedError(found, 400, 'Invalid JSON', 'The request body is not valid JSON.');
      }
    } else if (deref(spec, op.requestBody).required) {
      return documentedError(found, 400, 'Missing body', 'This operation requires a JSON request body.');
    }
  }

  if (spec.info && /PIX/i.test(spec.info.title)) {
    const stateful = await pixHandlers(found, method, body);
    if (stateful) return stateful;
  }

  const [status, response] =
    Object.entries(op.responses || {}).find(([code]) => /^2/.test(code)) || ['200', null];
  if (!response) return reply(Number(status), null);
  const example = exampleFor(spec, response);
  return reply(Number(status), example.body, example.type || 'application/json');
}

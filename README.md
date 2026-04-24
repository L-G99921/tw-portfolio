# Leandro Gabriel — Technical Writer Portfolio

Personal portfolio site for **Leandro Gabriel Oliveira de Souza**, Technical Writer with 7+ years of experience building API references, integration guides, and AI-assisted documentation pipelines for enterprise teams in fintech, retail, and cybersecurity.

Built with [Docusaurus 3](https://docusaurus.io/) and deployed to GitHub Pages.

**Live site:** https://l-g99921.github.io/tw-portfolio/

---

## Featured project — EnergyGrid Docs

The portfolio is organized around a featured documentation project: **EnergyGrid**, a fictional utility platform documented end-to-end to demonstrate multi-audience technical writing.

Three audiences, three content types, one portal:

- **Utility integration engineers** — OAuth 2.0 / OIDC flow, CIS data synchronization, bulk MDM and billing ingestion via SFTP / object storage, rate information, hardware binding.
- **Field technicians / end users** — step-by-step installation guides for DataBridge Hub and SmartLink Plug smart-meter hardware.
- **Customer support agents** — BillSense AI user guide and troubleshooting reference for an AI-powered bill analysis tool.

---

## What the site showcases

| Sample | What it demonstrates |
|--------|----------------------|
| Integration Guide | Long-form developer docs, sequence diagrams, structured authoring |
| API Reference (OpenAPI) | Auto-generated interactive API docs from OpenAPI specs |
| Hardware Install Guides | Consumer-friendly UX writing — QR codes, Bluetooth pairing, Wi-Fi setup |
| BillSense AI Docs | AI-tool user guide + troubleshooting reference for support agents |
| Writing Style Guide | Voice, tone, UX patterns, pre-publication checklist (Google + Diátaxis applied) |
| Methodology | Deep-dive on Google Developer Documentation Style Guide and the Diátaxis Framework |
| Data Dictionary | Structured reference content with schema-style tables |

---

## Writing standards applied

- **[Google Developer Documentation Style Guide](https://developers.google.com/style)** — sentence case, active voice, second person, banned filler words ("simply", "just", "may"), realistic examples
- **[Diátaxis Framework](https://diataxis.fr/)** — every page is exactly one of: tutorial, how-to guide, reference, or explanation
- **Structured authoring** — consistent admonitions (note, tip, warning, caution, danger)
- **Docs-as-code** — Markdown/MDX, version-controlled in Git, reviewed as code
- **OpenAPI-driven API docs** — single source of truth from the spec, no manual duplication

See [Documentation Methodology](https://l-g99921.github.io/tw-portfolio/docs/methodology) for a deep dive on both frameworks and how they're applied across the site.

---

## Tech stack

| Tool | Purpose |
|------|---------|
| Docusaurus 3 | Static site framework |
| `docusaurus-plugin-openapi-docs` | Interactive API reference from OpenAPI specs |
| SASS | Custom theming |
| GitHub Pages + GitHub Actions | Hosting and CI/CD |

---

## Run locally

**Requirements:** Node.js 20+

```bash
npm install
npm start
```

The site runs at `http://localhost:3000`.

Build for production:

```bash
npm run build
npm run serve
```

---

## Deployment

Pushes to `main` trigger [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the site and publishes the output to the `gh-pages` branch. GitHub Pages serves from that branch at the `url` + `baseUrl` configured in [`docusaurus.config.js`](./docusaurus.config.js).

---

## Contact

- **LinkedIn:** [leandro-gabriel-8aab31167](https://www.linkedin.com/in/leandro-gabriel-8aab31167/)
- **Email:** lgos99921@gmail.com
- **Location:** João Pessoa, Brazil

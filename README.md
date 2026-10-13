# Leandro Gabriel, technical writing portfolio

Portfolio of **Leandro Gabriel Oliveira de Souza**, senior technical writer. For 6+ years I've written API references, integration guides, and support documentation for Itaú (the PIX instant-payments APIs), Sephora LATAM, L'Oréal France, and Crane Worldwide.

**Live site:** https://l-g99921.github.io/tw-portfolio/

Built with [Docusaurus 3](https://docusaurus.io/) and deployed to GitHub Pages.

## What's in it

**EnergyGrid** is a fictional utility platform, documented end to end for three audiences: backend engineers at a utility, people installing hardware at home, and support agents. **PIX** is a documentation set for Brazil's instant-payments system, with one page of each Diátaxis type.

| Sample | Type | What it shows |
|---|---|---|
| [Tutorial: first integration](https://l-g99921.github.io/tw-portfolio/docs/tutorial-first-integration) | Tutorial | A 30-minute path from credentials to a synced customer and a bound device |
| [Integration guide](https://l-g99921.github.io/tw-portfolio/docs/integration-guide) | How-to and explanation | OAuth and OIDC, customer sync, bulk data over SFTP, rates, and binding |
| [API reference](https://l-g99921.github.io/tw-portfolio/docs/api/powerbox-api) | Reference | Generated from OpenAPI, with a sandbox you can call from the browser |
| [Hardware install guides](https://l-g99921.github.io/tw-portfolio/docs/databridge/databridge-installation-guide-atlas-insight) | How-to | Consumer setup steps, in two utility-branded versions |
| [BillSense AI](https://l-g99921.github.io/tw-portfolio/docs/billsense-ai/overview) | Explanation, how-to, reference | Documentation of an AI feature for the agents who support it |
| [Data dictionary](https://l-g99921.github.io/tw-portfolio/docs/data-dictionary) | Reference | Where each data set lives, by integration type |
| [PIX](https://l-g99921.github.io/tw-portfolio/docs/pix/about-pix) | All four | Explanation, tutorial, how-to, and API reference for PIX |
| [Writing guideline](https://l-g99921.github.io/tw-portfolio/docs/writing-guideline) | Reference | The site's style guide |
| [Architecture decisions](https://l-g99921.github.io/tw-portfolio/docs/adr) | Explanation | Why the site is built the way it is |

## The API sandbox

The specs point to hosts that don't exist, so a service worker ([`static/api-sandbox-sw.js`](static/api-sandbox-sw.js)) answers the **Send API Request** panels in the browser, using the same OpenAPI files. It checks auth, path patterns, and required bodies, and keeps state for the flows the tutorials use: create a PIX charge, pay it, and read it back, or bind a device and see a second bind fail. The reasoning is in [ADR 006](docs/adr/006-api-sandbox-in-the-browser.md).

## Standards

- **[Google developer documentation style guide](https://developers.google.com/style)** for sentences: second person, active voice, present tense, and sentence case.
- **[Diátaxis](https://diataxis.fr/)** for pages: every page is a tutorial, a how-to, a reference, or an explanation.
- **OpenAPI as the source** of every reference page and of the sandbox.
- **Docs as code:** Markdown in Git, reviewed in pull requests, checked in CI.

The [methodology page](https://l-g99921.github.io/tw-portfolio/docs/methodology) explains how the two frameworks fit together.

## Docs-as-code pipeline

Every pull request that touches content runs [`docs-quality.yml`](.github/workflows/docs-quality.yml):

- **Vale** with the Google package and a project rule, [`Portfolio/WordsToAvoid`](.vale/styles/Portfolio/WordsToAvoid.yml), that turns the guideline's words to avoid into errors. Errors fail the check ([ADR 004](https://l-g99921.github.io/tw-portfolio/docs/adr/004-vale-fail-on-error)).
- **Build** with `onBrokenLinks: 'throw'`, so a broken internal link fails the build.
- **Lychee** checks external links.

The build also writes `llms-full.txt`, the full text of the site for AI tools ([`plugins/llms-full.js`](plugins/llms-full.js)), next to [`llms.txt`](static/llms.txt).

## Run it locally

Requires Node.js 20 or later.

```bash
npm install
npm start
```

The site runs at `http://localhost:3000/tw-portfolio/`. For a production build:

```bash
npm run build
npm run serve
```

After editing an OpenAPI spec, regenerate the reference pages:

```bash
npx docusaurus clean-api-docs all
npx docusaurus gen-api-docs all
```

## Design

The theme follows two references from [designsystems.one](https://www.designsystems.one/): **Stripe** for the base (navy on white, the `#635bff` accent, soft shadows) and **Primer** from GitHub for code blocks, labels, and the HTTP method colors. The typefaces are Geist and Geist Mono. It's light by default, with a dark mode.

## Deployment

A push to `main` runs [`deploy.yml`](.github/workflows/deploy.yml), which builds the site and publishes it to the `gh-pages` branch.

## Contact

- **LinkedIn:** [leandro-gabriel-8aab31167](https://www.linkedin.com/in/leandro-gabriel-8aab31167/)
- **Email:** lgos99921@gmail.com
- **Location:** João Pessoa, Brazil

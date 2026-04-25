# Contributing

Thanks for opening this file. This portfolio is a personal docs-as-code site, but the workflow mirrors how a real documentation team operates — every change goes through the same checks: prose lint, build, link check, style review. If you are reviewing the project as a hiring signal, this file shows how the pipeline is wired.

## Stack

- [Docusaurus 3](https://docusaurus.io/) — static site generator
- [`docusaurus-plugin-openapi-docs`](https://github.com/PaloAltoNetworks/docusaurus-openapi-docs) — interactive API reference from OpenAPI specs
- [Vale](https://vale.sh/) — prose linter, configured against the Google Developer Documentation Style Guide
- [Lychee](https://github.com/lycheeverse/lychee) — broken-link checker
- GitHub Pages + GitHub Actions for hosting and CI

## Repository layout

```
docs/                      Authored Markdown content (Diátaxis-organised)
  databridge/              Hardware install guides (how-to)
  smartlink/               Hardware install guides (how-to)
  billsense-ai/            User guide cluster (how-to + reference + explanation)
  pix/                     PIX docs (tutorial + how-to + reference + explanation)
  api/                     Auto-generated from OpenAPI specs — DO NOT edit by hand
  data-dictionary/         Data reference
  integration-guide.md
  methodology.md           Explanation of Google Style + Diátaxis
  writing-guideline.md     The applied style guide for this site
blog/                      Long-form posts
src/                       Custom React components and theme overrides
static/                    OpenAPI specs, images, CNAME, robots.txt
.vale/                     Vale styles + project vocabulary
.github/workflows/         CI pipelines
sidebars.js                Sidebar structure
docusaurus.config.js       Site config
```

## Run locally

Requirements: Node.js 20+.

```bash
npm install
npm start
```

The dev server runs at `http://localhost:3000`. Hot reload is on for Markdown, MDX, and React components.

Build for production:

```bash
npm run build
npm run serve
```

The build is strict: `onBrokenLinks: 'throw'` is set in `docusaurus.config.js`, so any broken internal link fails the build.

## Style and content rules

This site enforces two industry-standard frameworks:

- **[Google Developer Documentation Style Guide](https://developers.google.com/style)** — sentence-level rules: voice, tone, grammar, capitalisation.
- **[Diátaxis Framework](https://diataxis.fr/)** — page-level taxonomy: every page is exactly one of tutorial, how-to, reference, or explanation.

The applied version of both lives in [docs/writing-guideline.md](docs/writing-guideline.md). The reasoning behind the choice is in [docs/methodology.md](docs/methodology.md).

### One Diátaxis type per page

Before writing, decide which one of the four types the page is:

| Type | Reader's question | Example in this repo |
| --- | --- | --- |
| Tutorial | "Teach me." | `docs/pix/tutorial-first-payment.md` |
| How-to | "Show me how to do X." | `docs/databridge/databridge-installation-guide-atlas-insight.md` |
| Reference | "Tell me what this is." | `docs/data-dictionary/index.md`, OpenAPI references |
| Explanation | "Help me understand." | `docs/methodology.md`, `docs/pix/about-pix.md` |

If a page wants to be two things, split it.

### Prose checks (Vale)

This repo runs [Vale](https://vale.sh/) against the Google package on every PR. Install it locally before opening a PR:

```bash
# macOS
brew install vale

# Linux / Windows
# https://vale.sh/docs/install
```

First time only — sync the configured packages:

```bash
vale sync
```

Then check your changes:

```bash
vale docs blog CONTRIBUTING.md README.md
```

The CI mirrors this exact command. Project-specific vocabulary lives in `.vale/styles/config/vocabularies/Portfolio/`. Add product names, acronyms, and accepted jargon to `accept.txt`. Add words you want to flag as banned to `reject.txt`.

### Link checks (Lychee)

External links are validated by Lychee on every PR. Internal Docusaurus links are validated by the build step (`onBrokenLinks: 'throw'`). To run the link check locally:

```bash
# macOS
brew install lychee
lychee --no-progress 'docs/**/*.md' 'docs/**/*.mdx' 'blog/**/*.md' README.md CONTRIBUTING.md
```

## Branching and commits

- Branch from `main` for any change. Use a short topic name: `docs/fix-pix-webhook-typo`, `feat/add-glossary-page`.
- One logical change per PR. Don't bundle a typo fix with a structural rewrite.
- Commit messages: imperative mood, sentence case. "Add PIX webhook how-to", not "Added PIX webhook how-to".
- Sign-off and signing aren't required for this repo.

## PR checklist

Before requesting review:

- [ ] The page belongs to exactly one Diátaxis type. If unsure, see `docs/writing-guideline.md` § 1.
- [ ] Headings are sentence case. Proper nouns and acronyms keep their capitalisation.
- [ ] Active voice, second person, present tense.
- [ ] No banned fillers: `simply`, `just`, `obviously`, `easily`, `basically`, `please`. Use `can` (not `may`) for ability; `might` (not `may`) for possibility.
- [ ] All Markdown code fences declare a language (`bash`, `json`, `text`, …).
- [ ] All admonitions use a valid Docusaurus type: `note`, `tip`, `info`, `warning`, `caution`, `danger`. **`:::important` is not valid** and breaks rendering silently.
- [ ] Internal links use the absolute `/docs/<path>` form, not relative paths that break when files move.
- [ ] `npm run build` passes locally.
- [ ] `vale docs blog CONTRIBUTING.md README.md` passes locally.

## Adding a new page

1. **Pick the Diátaxis type and put the file in the right folder.**
   The folder names map to product/topic clusters. The file name maps to the URL slug.

2. **Add frontmatter.**
   At minimum:

   ```yaml
   ---
   title: <Sentence-case title>
   description: "<One-sentence summary, used for meta tags and search snippets>"
   sidebar_label: <Sentence-case nav label>
   sidebar_position: <integer>
   tags: [<topic-tag>, <type-tag>]
   ---
   ```

3. **Write to one Diátaxis type.**
   Don't mix imperative tutorial steps with reference lookup tables on the same page.

4. **Use the standard step format.**
   ```markdown
   1. **Step title in sentence case**

       Description of what to do and why.

       \`\`\`bash
       command --flag value
       \`\`\`
   ```

5. **Add cross-references via absolute paths.**
   `/docs/pix/about-pix` — not `./about-pix` or `../pix/about-pix`. Absolute paths survive folder renames.

6. **Open the PR.**
   The CI runs Vale, Lychee, and the Docusaurus build. Address any errors before requesting review.

## Adding a new OpenAPI reference

The plugin instances are configured in `docusaurus.config.js` under `docusaurus-plugin-openapi-docs`. To add a new API:

1. Drop the OpenAPI spec into `static/`.
2. Add a new entry under the plugin config (`config: { <id>: { specPath, outputDir, sidebarOptions } }`).
3. Run:

   ```bash
   npm run docusaurus -- gen-api-docs <id>
   ```

4. Add the generated category to `sidebars.js`.
5. Commit both the spec and the generated `.mdx` files.

To regenerate after editing the spec:

```bash
npm run docusaurus -- clean-api-docs <id>
npm run docusaurus -- gen-api-docs <id>
```

## Reporting issues

For typos, broken links, or factual errors: open a GitHub issue with the page URL and a short description. For larger structural suggestions (Diátaxis splits, IA changes), open an issue first to discuss before writing.

## License

Content is released under the MIT License unless noted otherwise on the page. Code samples are public-domain unless they carry their own header.

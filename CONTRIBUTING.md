# Contributing

This portfolio is a personal docs-as-code site, and it uses the same workflow a documentation team would: every change goes through prose lint, a build, a link check, and review. If you're evaluating the project, this file shows how that pipeline works.

## Stack

- [Docusaurus 3](https://docusaurus.io/): the static site generator
- [`docusaurus-plugin-openapi-docs`](https://github.com/PaloAltoNetworks/docusaurus-openapi-docs): API reference pages from OpenAPI specs
- [Vale](https://vale.sh/): prose linter, with the Google package and one project rule
- [Lychee](https://github.com/lycheeverse/lychee): external link checker
- GitHub Pages + GitHub Actions for hosting and CI

## Repository layout

```
docs/                      Authored Markdown content (Diátaxis-organised)
  databridge/              Hardware install guides (how-to)
  smartlink/               Hardware install guides (how-to)
  billsense-ai/            User guide cluster (how-to + reference + explanation)
  pix/                     PIX docs (tutorial + how-to + reference + explanation)
  api/                     Generated from the OpenAPI specs. Don't edit by hand.
  data-dictionary/         Data reference
  adr/                     Architecture decision records
  integration-guide.md
  methodology.md           Explanation of Google Style + Diátaxis
  writing-guideline.md     The applied style guide for this site
blog/                      Long-form posts
src/                       Home page, theme overrides, and components
static/                    OpenAPI specs, the API sandbox worker, llms.txt, images
plugins/                   Build plugins (llms-full.txt)
.vale/                     Vale config, project vocabulary, and the Portfolio rule
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

The dev server runs at `http://localhost:3000/tw-portfolio/`, and reloads on every change. Changes to `docusaurus.config.js` need a restart.

Build for production:

```bash
npm run build
npm run serve
```

The build is strict: `onBrokenLinks: 'throw'` is set in `docusaurus.config.js`, so any broken internal link fails the build.

## Style and content rules

This site enforces two industry-standard frameworks:

- **[Google developer documentation style guide](https://developers.google.com/style):** sentence-level rules for voice, tone, grammar, and capitalization.
- **[Diátaxis](https://diataxis.fr/):** page-level types. Every page is a tutorial, a how-to, a reference, or an explanation.

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

The first time, sync the configured packages:

```bash
vale sync
```

Then check your changes:

```bash
vale docs blog CONTRIBUTING.md README.md
```

CI runs the same check. Project vocabulary lives in `.vale/styles/config/vocabularies/Portfolio/`: add product names, acronyms, and accepted jargon to `accept.txt`, and words to flag to `reject.txt`.

The words to avoid from the writing guideline are enforced by `.vale/styles/Portfolio/WordsToAvoid.yml`. To mention one of those words on purpose, put it in code formatting, like `just`.

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

- [ ] The page is one Diátaxis type. If you're unsure, see section 1 of `docs/writing-guideline.md`.
- [ ] Headings are sentence case. Proper nouns and acronyms keep their capitalisation.
- [ ] Active voice, second person, present tense.
- [ ] No words to avoid: `simply`, `just`, `obviously`, `easily`, `please`. Use `can` for ability and `might` for possibility, not `may`.
- [ ] Every code fence declares a language, such as `bash`, `json`, or `text`.
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
   Write `/docs/pix/about-pix`, not `./about-pix` or `../pix/about-pix`. Absolute paths keep working when folders move.

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

4. Add the generated pages to `sidebars.js`. The sidebar is written by hand, with labels that match each operation's `summary`.
5. Commit the spec and the generated `.mdx` files together.

The API sandbox reads every spec listed in `SPECS` at the top of `static/api-sandbox-sw.js`. Add the new file there so its **Send API Request** panels work.

To regenerate after editing the spec:

```bash
npm run docusaurus -- clean-api-docs <id>
npm run docusaurus -- gen-api-docs <id>
```

## Reporting issues

For typos, broken links, or factual errors: open a GitHub issue with the page URL and a short description. For larger structural suggestions (Diátaxis splits, IA changes), open an issue first to discuss before writing.

## License

Content is released under the MIT License unless noted otherwise on the page. Code samples are public-domain unless they carry their own header.

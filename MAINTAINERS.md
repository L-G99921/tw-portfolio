# Maintainers

This file lists the people responsible for the `tw-portfolio` repository, their areas of ownership, and how to reach them. The format follows the convention used by the [Cloud Native Computing Foundation](https://github.com/cncf/foundation/blob/main/MAINTAINERS.md) and other open-source projects, scaled down for a solo-maintained portfolio.

## Active maintainers

| Name | GitHub | Areas of responsibility | Contact |
|------|--------|-------------------------|---------|
| Leandro Gabriel Oliveira de Souza | [@L-G99921](https://github.com/L-G99921) | All — content, Docusaurus theming, CI pipeline, style governance, OpenAPI specs | [LinkedIn](https://www.linkedin.com/in/leandro-gabriel-8aab31167/) · lgos99921@gmail.com |

## How decisions get made

This is a personal portfolio, so every decision is made by the sole maintainer. The following conventions are recorded here so that the workflow remains consistent over time and visible to anyone reviewing the repository:

- **Content changes** ship via pull request, not direct push to `main`. The CI (Vale, Lychee, Docusaurus build) must pass before merge.
- **Style guide changes** — additions to `.vale.ini`, vocabulary files, or banned-word lists — are documented in the commit message with a short rationale. The intent is that any future maintainer can read `git log .vale.ini` and understand why each rule exists.
- **Structural changes** — new top-level sections in `sidebars.js`, new Diátaxis clusters under `docs/`, new Docusaurus plugins — are preceded by an issue describing the motivation, the alternatives considered, and the chosen approach.
- **Breaking changes** to URLs (page renames, slug changes) are recorded in [`CHANGELOG.md`](CHANGELOG.md) so external links can be redirected.

## Adding a maintainer

If this repository ever grows beyond a single contributor:

1. The candidate opens a pull request adding themselves to the table above and to [`.github/CODEOWNERS`](.github/CODEOWNERS) for the areas they will own.
2. The current maintainer reviews the contribution history (merged PRs, issue triage, content quality) and approves or declines with a written reason.
3. On approval, the candidate gains write access to the repository and is added to the relevant CODEOWNERS rules.

## Removing a maintainer

A maintainer can step down at any time by opening a pull request that removes their entry from this file and from `.github/CODEOWNERS`. Inactivity (no merged contributions for 12 months) is grounds for removal by the remaining maintainers.

## Security and disclosure

For sensitive issues — accidental publication of credentials, broken authentication on a sample API, anything you would not want to discuss in a public issue — contact the maintainer directly via email rather than opening a GitHub issue.

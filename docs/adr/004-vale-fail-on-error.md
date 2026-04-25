---
id: 004-vale-fail-on-error
slug: /adr/004-vale-fail-on-error
title: "ADR-004 — Vale CI blocks on error, not warning-only"
description: "Why the Vale job in the docs-quality CI pipeline fails the pull request on prose-lint errors instead of surfacing them as warnings."
sidebar_label: ADR-004 — Vale fail-on-error
sidebar_position: 4
tags: [adr, decisions, vale, ci, governance]
---

# ADR-004 — Vale CI blocks on error, not warning-only

**Status:** Accepted (2026-04-24)

## Context

Vale's GitHub Action supports two modes for handling prose-lint findings:

- **Warning-only** — surface findings as PR comments without failing the build. Authors see them but can merge through.
- **Fail-on-error** — treat any finding at the `error` severity level as a build failure. The PR cannot merge until the prose passes.

Most teams adopting Vale start in warning-only mode to avoid friction. The risk: warnings get ignored, the lint config drifts, and the style guide becomes aspirational rather than enforced.

## Decision

Configure the Vale step in `.github/workflows/docs-quality.yml` with `fail_on_error: true` and `filter_mode: nofilter`:

```yaml
- name: Vale
  uses: errata-ai/vale-action@reviewdog
  with:
    fail_on_error: true
    filter_mode: nofilter
    reporter: github-pr-review
```

The Vale config (`.vale.ini`) classifies the Google package's most opinionated rules as `warning` rather than `error` (heading capitalisation, repetition heuristic) so that the *errors* that block merge are the rules the project genuinely defends — banned filler words, voice rules, mandatory front matter, code-fence languages.

## Consequences

- A typo in a heading or a banned filler word (`simply`, `just`, `obviously`) blocks merge until fixed. Friction is real but small — Vale's auto-suggestions usually resolve in seconds.
- The style guide is enforced, not aspirational. The portfolio's voice stays consistent across pages without a human reviewer line-editing every change.
- New contributors (including future-me) hit the rule on their first PR and learn the conventions through the failure rather than through prose.
- When a rule turns out to fight the project rather than help it, the response is to disable it explicitly in `.vale.ini` with a comment explaining why — not to lower the severity floor.
- The decision is the disciplinary signal a hiring manager looks for. Warning-only Vale is documentation theatre; fail-on-error Vale is documentation governance.

---
id: 004-vale-fail-on-error
slug: /adr/004-vale-fail-on-error
title: "ADR 004: Vale errors fail the build"
description: "Why the Vale job in CI fails a pull request on prose errors instead of only leaving comments."
sidebar_label: "ADR 004: Vale fails the build"
sidebar_position: 4
tags: [adr, decisions, vale, ci, governance]
---

# ADR 004: Vale errors fail the build

**Status:** Accepted, 2026-04-24

## Context

The Vale GitHub Action can handle findings in two ways:

- **Comments only:** findings appear on the pull request, and the author can still merge.
- **Fail on error:** any finding at `error` level fails the check, and the pull request can't merge until it's fixed.

Teams often start with comments only, to avoid friction. Over time the comments get ignored, the configuration drifts, and the style guide stops being enforced.

## Decision

Run Vale in `.github/workflows/docs-quality.yml` with `fail_on_error: true`:

```yaml
- name: Run Vale
  uses: errata-ai/vale-action@reviewdog
  with:
    version: 3.9.1
    fail_on_error: true
    filter_mode: nofilter
    reporter: github-pr-review
```

`.vale.ini` sets `MinAlertLevel = error`, so only errors are reported. That has a side effect: many Google rules, including its list of filler words, are warnings, so they'd never block anything. The site's own rule, `.vale/styles/Portfolio/WordsToAvoid.yml`, closes that gap. It raises the [words to avoid](/docs/writing-guideline#72-words-to-avoid) (`simply`, `just`, `easily`, `obviously`, `please`) to errors.

Rules that produce more noise than value here are turned off one by one in `.vale.ini`, each with a comment explaining why. `Google.Headings` is one, because it flags product names like "DataBridge Hub."

## Consequences

- A banned word blocks the merge until it's fixed. The friction is small, and the fix is usually obvious from the message.
- The style guide is enforced, so the voice stays consistent across pages without a reviewer editing every line.
- New contributors learn the rules from their first failed check.
- When a rule works against the site, the fix is to turn it off in `.vale.ini` with a comment, not to lower the alert level for everything.

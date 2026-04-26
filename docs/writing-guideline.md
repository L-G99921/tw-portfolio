---
id: writing-guideline
title: Writing guideline
description: "EnergyGrid documentation style guide — based on the Google Developer Documentation Style Guide and the Diátaxis Framework."
sidebar_label: Writing guideline
sidebar_position: 5
tags: [writing, style-guide, google-style, diataxis, standards]
---

# Writing guideline

This guide defines the standards for all product, technical, UX, and customer-facing documentation produced for the EnergyGrid platform. It is built on two industry-standard foundations:

- **[Google Developer Documentation Style Guide](https://developers.google.com/style)** — for voice, tone, grammar, and formatting.
- **[Diátaxis Framework](https://diataxis.fr/)** — for content type, structure, and information architecture.

For background on why these two frameworks were chosen, see [Documentation Methodology](/docs/methodology).

:::tip Quick rule
If this guide doesn't answer your question, defer to the Google Developer Documentation Style Guide. If the question is "where should this content live?", defer to Diátaxis.
:::

---

## 1. Content Types — Diátaxis

Every page in the documentation belongs to exactly one of four content types. Mixing types is the most common cause of confusing documentation.

| Type | Purpose | User question | Example in this site |
|------|---------|---------------|----------------------|
| **Tutorial** | Learning by doing | "Teach me." | [Your first EnergyGrid integration in 30 minutes](/docs/tutorial-first-integration) |
| **How-to guide** | Goal-oriented steps | "Show me how to do X." | [Hardware Install Guide](/docs/databridge/databridge-installation-guide-atlas-insight) |
| **Reference** | Information lookup | "Tell me what this is." | [API Reference](/docs/api/powerbox-api), [Data Dictionary](/docs/data-dictionary) |
| **Explanation** | Conceptual understanding | "Help me understand." | [Integration Guide](/docs/integration-guide) (architecture sections) |

### Rules

- **One type per page.** If a page is doing two jobs, split it.
- **Tutorials are for beginners.** They guarantee an outcome. They never link to reference until the end.
- **How-to guides assume competence.** They don't teach; they remind.
- **Reference is dry, accurate, and complete.** No prose, no opinions, no story.
- **Explanation gives context.** It can branch, compare, and discuss trade-offs.

For deeper guidance on each content type, see [Documentation Methodology](/docs/methodology#diátaxis-framework).

---

## 2. Voice and Tone

Per the Google Developer Documentation Style Guide:

- **Conversational, but not overly casual.** Friendly without being cute.
- **Confident, never condescending.** Don't say `obviously`, `simply`, `just`, or `easy`.
- **User-focused.** Use second person ("you") and active voice.

### Tone by audience

| Audience | Tone | Example |
|----------|------|---------|
| Developers (API, integration) | Direct, precise, terminology-heavy | "Authenticate the request with a Bearer token in JWT format." |
| End users (app, hardware) | Friendly, instructional, low-jargon | "Plug in the SmartLink. The light blinks blue when it's ready." |
| Support agents (BillSense AI) | Clear, scannable, action-oriented | "If the bill explanation is missing, check the customer's billing-cycle ID." |
| Disclaimers / legal | Direct, factual, plain-language | "Estimates are based on past usage and may vary." |

---

## 3. UX Writing — In-Product Text

Microcopy follows the same principles as long-form documentation: clarity first, predictability second.

### Patterns

- **Errors:** State what went wrong, then what to do. "Couldn't load your usage. Try again or contact support."
- **Success:** Past tense, specific. "Saved your changes."
- **Empty states:** Explain why and offer a next step. "No data yet. Connect your meter to get started."
- **Loading:** Be specific about what's loading. "Loading your usage history…"

### Buttons and links

- Lead with a verb: **View usage**, **Set budget**, **Reset password**.
- Use sentence case (per Google style — not Title Case).
- Make link text descriptive — never "click here" or "learn more" without context.
- Two to four words is ideal. If a button label is longer, the action is probably too complex for a button.

### Headings

- **Sentence case for everything.** "Manage your energy use" — not "Manage Your Energy Use".
- Use action verbs in tutorials and how-to guides. Use noun phrases in reference and explanation.
- Don't end headings with punctuation (except question marks, sparingly).

---

## 4. Data Presentation

### General

- Use visuals to simplify, not to decorate.
- Label every axis, legend, and unit.
- Provide a one-line takeaway above or below every chart.
- Right-align numerical columns in tables.

### Chart types

| Use this | When | Avoid |
|----------|------|-------|
| Line chart | Trends over time, continuous data | More than 4 lines on one axis |
| Bar chart | Comparing discrete categories | Decorative effects, 3D |
| Pie / donut | 2–5 segments, simple proportions | Anything where exact comparison matters — use bars instead |
| Area chart | Cumulative volume over time | Stacked areas with > 3 categories |
| Table | Precise values, dense reference data | Tables when a chart would tell the story |

---

## 5. Accessibility

- Every meaningful image has alt text. Decorative images have empty alt (`alt=""`).
- Color is never the only signal. Pair color with text, an icon, or a pattern.
- Headings follow a strict hierarchy: H1 → H2 → H3. Don't skip levels.
- Touch targets are at least 44×44 px.
- Language avoids idioms and culture-specific references that don't translate.

---

## 6. Naming Conventions

Use official product names exactly as defined. Don't invent variants.

**Correct:**
- DataBridge Hub (not DataBridge or Data Bridge)
- SmartLink Plug (not SmartLink or Smart Link)
- BillSense AI (not BillSense or Bill Sense AI)
- PowerBox API (not `Powerbox` or `Power Box API`)
- EnergyGrid (one word, capital E and G)

When introducing a product, use the full name. Subsequent mentions in the same section can use the short form if it's unambiguous.

---

## 7. Grammar and Mechanics

These rules align with the Google Developer Documentation Style Guide.

### 7.1 Voice and tense

- **Active voice.** "The system saves your changes" — not "Your changes are saved by the system."
- **Present tense for behavior.** "The endpoint returns a 200 response" — not "The endpoint will return…"
- **Imperative mood for instructions.** "Click Save" — not "You should click Save."

### 7.2 Words to avoid

- **`Please`** — don't use in instructions. ("Click Save" — not "Please click Save.")
- **`Simply`, `just`, `easily`, `obviously`** — they assume the reader's experience.
- **`May`** for ability — use **`can`**. ("You can configure the budget" — not "You may configure the budget.")
- **`Will`** for present behavior — use present tense. ("The API returns…" — not "The API will return…")
- **Latin abbreviations** — write out: `for example` (not e.g.), `that is` (not i.e.), `and so on` (not etc.).

### 7.3 Capitalization

- **Sentence case** for all headings, button labels, and UI strings.
- **Lowercase** for URLs, email addresses, and file extensions — `.json` (not `.JSON`) when referring to a file on disk. Capitalize the format name itself: JSON, YAML, XML.
- **Capitalize** product names, acronyms (API, JWT, OAuth), and the first word of sentences.

### 7.4 Acronyms

- Spell out on first use, with the acronym in parentheses: "Customer Information System (CIS)".
- Use the acronym alone for the rest of the page.
- Don't introduce an acronym you only use once.

### 7.5 Contractions

Contractions are encouraged in user-facing content (it's, don't, you're). They make text more conversational and accessible.

### 7.6 Numbers

- Use numerals for 10 and above; spell out zero through nine — except in technical contexts (port numbers, status codes, version numbers, measurements).
- Add commas to numbers 1,000 and above.
- For large round numbers, use abbreviations: 1k, 150k, 2M (only when space is constrained).

### 7.7 Dates and times

- **Long form:** April 24, 2026.
- **In tables:** 2026-04-24 (ISO 8601).
- **12-hour clock:** 9 am, 10:30 pm (lowercase, no period).
- Include the time zone when relevant: "9 am UTC".

### 7.8 Punctuation

- **Oxford comma:** always.
- **Em dash** (—): for breaks in thought, no spaces around it.
- **En dash** (–): for ranges, no spaces. "20–30 users", "Mon–Fri".
- **Hyphen** (-): for compound modifiers. "real-time data", "low-power radio".
- **Exclamation points:** rarely. Never in error messages.

### 7.9 Pronouns

- Use **"they/them"** as the default singular pronoun.
- Use **"you"** to address the reader.
- Use **"we"** for the team's recommendations only when needed; default to imperative.

### 7.10 Lists

- Use a bulleted list when order doesn't matter.
- Use a numbered list when order matters.
- Each item starts with a capital letter.
- End each item with a period if any item is a complete sentence; otherwise no terminal punctuation.
- Keep items grammatically parallel.

### 7.11 Code formatting

- **Inline code** for parameters, properties, file names, and command names: `meterId`, `package.json`, `npm install`.
- **Code blocks** with a language hint for runnable code:
  ```bash
  curl https://api.example.com/v1/users
  ```
- Show realistic, runnable examples. Don't use `foo`, `bar`, or `baz` in user-facing samples.

### 7.12 Currency, percentages, and units

- Use the symbol with the numeral, no space: $20.00, 75%, 72°F.
- Use SI units in technical contexts; add the imperial equivalent in parentheses for user-facing content if relevant.

### 7.13 Phone numbers and URLs

- **Phone:** +1-555-123-4567 (with country code, dashes).
- **URLs:** lowercase, no "www." unless required by the host. Don't underline; the link styling handles that.

---

## 8. Pre-publication Checklist

Run through this before publishing any page.

### Content type (Diátaxis)

- [ ] The page is exactly one Diátaxis type — tutorial, how-to, reference, or explanation.
- [ ] If it's drifting between types, it's been split into separate pages.

### Audience and purpose

- [ ] The target audience is identified in the first paragraph.
- [ ] The page solves a real task or answers a real question.
- [ ] Out-of-scope topics are explicitly excluded or linked elsewhere.

### Structure

- [ ] H1 → H2 → H3 hierarchy with no skipped levels.
- [ ] Sections are scannable in under 30 seconds.
- [ ] Related pages and next steps are linked.

### Voice and grammar

- [ ] Active voice, present tense, second person.
- [ ] No `please`, `simply`, `just`, `obviously`, `easily`.
- [ ] `Can` instead of `may`; present tense instead of `will`.
- [ ] Sentence case for all headings and UI strings.
- [ ] Oxford commas, em/en dash usage correct.

### Technical accuracy

- [ ] Every UI label, parameter, and code sample matches the current product.
- [ ] API examples have been run; status codes and payloads are real.
- [ ] Screenshots are dated within the last release cycle.

### Accessibility

- [ ] All images have descriptive alt text.
- [ ] Color isn't the sole carrier of meaning.
- [ ] Tables have header rows; complex tables have captions.

### Code quality

- [ ] Code blocks have language hints.
- [ ] Examples are realistic, not placeholder.
- [ ] Long examples link to a runnable repo or sandbox if possible.

### Publication

- [ ] Owner and last-updated date are present.
- [ ] All review checks (SME, engineering, UX, legal) are complete.
- [ ] No drafts, TODOs, or placeholder text remain.
- [ ] Release notes are logged if the change is user-visible.

---

## 9. Where to look first

When in doubt:

1. Check this guide.
2. Check the [Google Developer Documentation Style Guide](https://developers.google.com/style).
3. Check the [Diátaxis Framework](https://diataxis.fr/) for content-type questions.
4. Ask in the docs review channel.

For a deeper introduction to why these two frameworks anchor everything in this portal, see [Documentation Methodology](/docs/methodology).

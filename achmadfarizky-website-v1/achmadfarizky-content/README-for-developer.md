# Content handoff: achmadfarizky.com

Hi! This package contains all the written content for Achmad Farizky's portfolio website. It's content only: layout, style and animation are up to you and Achmad.

## What's inside

```
portfolio.md              ← the main "About me" page (single long page or split into sections)
stories/
  index.md                ← list of all 33 stories (titles, phases, themes, LinkedIn sources)
  <slug>.md × 33          ← one file per story
README-for-developer.md   ← this file
```

## portfolio.md

- **Sections, in order:** header (name, headline, location, intro) → Three threads → My story (7 phases) → Portfolio (12 featured projects) → What I write about (9 topics) → Community & recognition → Passions → Tips → Skills, tools & certificates → Let's connect.
- **Hidden comment at the top** (`<!-- … -->`): contains a one-line, third-person **bio for the meta description / Open Graph** text. It is not meant to be shown on the page.
- **Thread bullets** (the ones that start with a thread lesson, e.g. "Thread 1 again." or "Learn what you love…") mark one of Achmad's three recurring "threads" (lessons). There is no emoji for them in the text. Feel free to style them (e.g. a small tag).
- **Links to stories** use relative paths like `stories/freeskates.md`. Map them to your story URLs (e.g. `/stories/freeskates`).
- **LinkedIn links** use the format `https://www.linkedin.com/feed/update/urn:li:<type>:<id>/`. They are all tested.
- Some report/download links are still LinkedIn short links (`https://lnkd.in/...`). They work as-is.

## Stories

Every story starts with a YAML frontmatter block:

```yaml
---
title: "Taking a break to skate"
slug: freeskates                 # = file name, use for the URL
date: 2025-07-08                 # main publish date (use for sorting)
phase: Life                      # career phase the story belongs to
themes: [Life beyond data]       # one or more of the 9 topics below
linkedin_posts:                  # original LinkedIn post(s) the story is based on
  - date: 2025-07-08
    note: optional label
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:.../
reading_time: 2 min
assets:                          # images/videos/links the page needs (to be supplied by Achmad)
  - Photo of the JMKRIDE freeskates
status: draft                    # draft → ready when Achmad approves
---
```

**The 9 themes** (used for the "What I write about" menu and for filtering):
Power BI design craft · Data engineering & Fabric · Data management & the CDMP road · Automation & clever tricks · Data storytelling · Career & learning journey · Creative design · Healthcare analytics · Life beyond data

**Suggestions:**
- Achmad wants each story to be able to have **its own layout/design**. One idea: a default story template driven by the frontmatter, with an option to override per story.
- New stories will keep coming in the **same format**, so a file-based setup (one `.md` per story, no database) fits well.

## Images & media

The text is complete, but **images, screenshots and videos are not included**. Each story's `assets` list says what it needs. Achmad will supply them (photos, Power BI screenshots, certificate badges, videos).

## Writing conventions (please keep)

- English, first person, Achmad's own voice. Please don't "polish" the wording.
- Quotes from other people are kept **word for word**, including their grammar.
- Normal Markdown **bold**/*italic* only. Please don't add LinkedIn-style Unicode bold letters on the website.

## Status

All content is **draft v1** (November 2026). Achmad may still adjust wording and decide whether some people stay named before launch.

---
title: "Small Power BI tricks I love"
slug: small-power-bi-tricks
date: 2025-11-22
phase: Learning through community (2025) → JHAH
themes: [Automation & clever tricks, Power BI design craft]
linkedin_posts:
  - date: 2025-07-25
    note: Interactive KPI cards
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7354412147298185217/
  - date: 2025-07-28
    note: The art of beautiful code
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7355467133578788864/
  - date: 2025-08-16
    note: Microsoft agrees: it's magic
    url: https://www.linkedin.com/feed/update/urn:li:share:7362344139222413312/
  - date: 2025-09-16
    note: The invisible character
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7373724912143896576/
  - date: 2025-09-17
    note: Tab menu with a button slicer
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7374081678702620673/
  - date: 2025-11-01
    note: Segoe UI Semibold on Mac
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7390466712531517440/
  - date: 2025-11-22
    note: Vertical alignment "hiding" in the Nov 2025 update
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7397872613039005697/
reading_time: 5 min
assets:
  - Screenshots for each trick
  - Report with tab menu and invisible character: https://lnkd.in/djjvv6eG
  - Mac font report: https://lnkd.in/dTjx3sf7
status: draft
---

# Small Power BI tricks I love

Not every lesson needs a big project. Here are some small tricks that made a big difference in my reports.

## 1. KPI cards as buttons

KPI cards that also work as buttons are one of my favorite techniques. People already know this pattern from websites and mobile apps, so it feels natural. I think it should come even before normal filters.

Many experts have shown their own versions: Iwa Sanjaya (with very detailed documentation), Robert Mika in Qlik, and Gustaw Dudek. I built my first versions in Power BI Park, in my Electronic Sales and HR Overview dashboards.

## 2. The magic of the invisible character 🪄

The **invisible character (Unicode 8203)** is a small trick with a big impact on Power BI design.

- **Moving chart titles.** I wanted to shift a chart's title to the right to make room for an icon. Putting the invisible character between spaces lets you create several spaces in a row. I learned this from Gustaw Dudek in The Data Vis Forge.
- **Unique labels for identical text.** If you label months by their first letter, "A" is both April and August, "J" is June and July, and "M" is March and May. Adding the invisible character makes each label unique. (Thanks to Murat for reminding me. And if you use Melissa de Korte's Power Query calendar script, it's already built in!)

## 3. A tab menu from a button slicer 🔘

A simple tab menu: a button slicer on top of a straight horizontal line.
- **Default state:** no border, transparent fill.
- **Selected state:** a border in the same color as the line, a white background, and a thick white bottom bar that "cuts" the line, so the selected tab looks connected to the page.

Credit to Injae Park, who taught me many button slicer tricks.

## 4. Segoe UI Semibold on a Mac 💡

As a Mac user working in the Power BI Service, I had two font problems. Some standard fonts didn't show correctly, and setting "Segoe UI Semibold" in a JSON theme didn't work.

The fix: in the JSON theme, use `wf_segoe-ui_semibold` as the font name. It worked! Finally, I could use this popular font.

## 5. The vertical alignment that "disappeared"

One day, Power BI Desktop updated itself from the October to the November 2025 version. I opened the report I'd worked on the night before, and the text alignment on my KPI cards was broken. And I had to present that report to my director the next day!

I searched for hours. The vertical alignment option was nowhere to be found.

Finally, I found it: the **vertical alignment option only appears when the "Divider" is turned on**, and Divider had moved to a different section. The fix:
1. Go to **Cards** → turn **Divider ON**.
2. Go to **Reference labels layout** → set **Vertical alignment to TOP**.
3. Go back to **Cards** → turn **Divider OFF**.

Fixed, and ready to present!

The twist: this wasn't a bug. Long ago, I had set the vertical alignment to "bottom" in my JSON theme. It did nothing in the old version, so I forgot about it. The November update made it work. **The update didn't break my report. It fixed my theme!**

## 6. Beautiful code

I love how Gustaw Dudek writes DAX: with **extra spaces** that make the code clean and easy to read. His visuals look great, and so does his code. I do the same in my own code. It really helps my eyes.

Another style I use: putting **commas at the start of the line** when listing items. It makes it much easier to comment lines in and out. I learned this from Will Needham in the Fabric Dojo.

Protect your eyes: make your code beautiful!

## 7. Even Microsoft says it's magic

I always call some people's Power BI tricks "magic." That's not an exaggeration. Even Microsoft uses the word in its documentation! Thank you to the BI magicians I learn from: Michel van Schaik, Gustaw Dudek, Injae Park and Mateusz Sochor.

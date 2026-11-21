---
title: "The reality of a data analyst, and why Power Query became my main tool"
slug: why-power-query
date: 2023-08-24
phase: Ericsson → Kanzway
themes: [Automation & clever tricks, Career & learning journey]
linkedin_posts:
  - date: 2023-08-24
    note: The reality of working as a data analyst
    url: https://www.linkedin.com/feed/update/urn:li:share:7100360334183407616/
  - date: 2023-08-22
    note: Slicer for highlighting a matrix
    url: https://www.linkedin.com/feed/update/urn:li:share:7099623383633416193/
  - date: 2024-05-18
    note: Ordered "The Definitive Guide to Power Query (M)"
    url: https://www.linkedin.com/feed/update/urn:li:share:7197479596794007552/
  - date: 2024-10-11
    note: Complex fill down and fill up in Power Query
    url: https://www.linkedin.com/feed/update/urn:li:share:7250390342053617664/
  - date: 2025-07-11
    note: Bought "DAX for Humans"
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7349247187731525632/
reading_time: 3 min
assets:
  - Screenshot of the fill down / fill up example (input vs. expected result)
  - Photos of the two books
status: draft
---

# The reality of a data analyst

I've watched many videos and memes about "the reality of working as a data analyst." I agree with all of them. Here's my version.

## 1. You learn many tools. Users want Excel.

I've learned a lot of analytics tools and programming languages. But in the end, what most users really need is basic Microsoft Excel.

That's exactly why I started learning **Power Query and the M language**, and made them my main data transformation tool. Power Query lives inside Excel *and* Power BI. So I can do serious data work and still hand over something people already know how to open.

## 2. The data is never clean

Duplicates. Blanks. Wrong information. Every dataset has them.

One example: I once had data where a simple "fill down" or "fill up" in Power Query wasn't enough, because some cells needed to stay empty when they were "blocked" by the cell on their left. Little puzzles like that are a normal day for a data analyst.

## 3. Finding the data takes longer than analyzing it

I've spent many days with clients and other stakeholders just to find where the data is, and to agree on the right format. In many cases, the stakeholders themselves don't know what's inside their own data.

## My Power Query bookshelf

Over the years, I kept investing in this tool:
- **The Definitive Guide to Power Query (M)** by Gregory Deckler, Rick de Groot and Melissa de Korte, ordered in 2024 and shipped all the way to Saudi Arabia.
- **DAX for Humans** by Greg Deckler, bought on Kindle in 2025. I'm a "no-CALCULATE" lover, so I'd wanted this book for a long time.

And I learned many tricks from YouTube. One of my favorites is from Chandeep Chhabra: a slicer that **highlights** values in a matrix instead of filtering them, and also highlights other labels with the same properties. I had been looking for that trick for a long time.

## What I learned

- **Build with what you have.** Excel is already on everyone's computer. Power Query makes it powerful.
- Real data work is 80% finding, cleaning and agreeing, and 20% charts. Be ready for that.

→ Related: [Sending hundreds of emails at once?](power-query-email-trick.md)

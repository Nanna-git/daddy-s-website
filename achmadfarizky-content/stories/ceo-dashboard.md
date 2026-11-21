---
title: "Rebuilding Nick Desbarats' CEO dashboard"
slug: ceo-dashboard
date: 2025-07-15
phase: Learning through community (2025)
themes: [Power BI design craft]
linkedin_posts:
  - date: 2025-07-05
    note: Part 1 (entity dashboard)
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7347197268795482113/
  - date: 2025-07-15
    note: Final version
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7350742169269239808/
reading_time: 3 min
assets:
  - Screenshots of the role, area and entity dashboards
  - PBIX + dataset: https://lnkd.in/d6BZRBTA
  - Part 1 dataset: https://lnkd.in/ddDeG7MN
  - Video reference: https://lnkd.in/dXUTJADU
status: draft
---

# Rebuilding Nick Desbarats' CEO dashboard

In July 2025, Gustaw Dudek shared a YouTube video in The Data Vis Forge: *"How to Rescue Your Failing Dashboard"*, an interview with Nick Desbarats by Rupe. Gustaw recommended it, so I knew it would be good. And it was.

The ideas really clicked with my years in telecom. At Ericsson, we always needed to show tons of metrics and dimensions, clearly, to top management. I had built similar high-level dashboards before, in SAP BusinessObjects.

So I decided to rebuild the CEO dashboard from the video, in Power BI.

## The goal

- The users are the top managers of a company.
- They need to see information across many dimensions in about **three seconds.**
- Important things must stand out.

The dashboard has three layers: a **role** dashboard, an **area** dashboard and an **entity** dashboard.

## My solution

The coolest part of the entity dashboard is showing **all the data dimensions on one page, with just one matrix visual.**

Here's how:
- No deep analysis is needed at this level, so all the aggregated metrics are calculated in the data model.
- I unpivoted all the categories and metrics in the data model.

Now I can show many dimensions and metrics from different datasets in one column, in one visual, and pivot them horizontally and vertically at the same time.

My effort was **70% Power Query** for the data model and only **30% DAX** for the visual design.

## Try it yourself

I shared the PBIX file and the dataset, so anyone can download it and try. Watch the video too. It has more ideas than I mentioned here.

## What I learned

- A great dashboard often starts with a great data model, not with a great chart.
- Experience transfers: what I learned for telecom executives fit perfectly into this exercise.

Thank you, Nick Desbarats (Practical Reporting), Ian Stuart (Rupe) and Gustaw Dudek, for letting me do this.

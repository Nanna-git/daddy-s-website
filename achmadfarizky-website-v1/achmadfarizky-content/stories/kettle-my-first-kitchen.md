---
title: "Kettle, Pentaho and my first data warehouse"
slug: kettle-my-first-kitchen
date: 2023-07-05
phase: Telkomsel → Ericsson
themes: [Data engineering & Fabric, Automation & clever tricks]
linkedin_posts:
  - date: 2023-07-05
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7082221695008202752/
reading_time: 3 min
assets:
  - Screenshot of a Kettle (Spoon) transformation, if one without confidential data is available
status: draft
---

# Kettle, Pentaho and my first data warehouse

## The kitchen

Since 2009, my favorite free, open-source tool for data transformation (ETL: extract, transform, load) has been **Kettle**.

Kettle is the old name. Today it's called **Pentaho Data Integration (PDI)**. And yes, everything in it has kitchen names:
- **Spoon** is the visual, no-code designer where you build your data flows.
- **Kitchen** and **Pan** run your jobs and transformations from the command line.

## My first data warehouse

I used Kettle for the first time in my last year at Telkomsel, to build a data warehouse. We collected network performance data from all our equipment vendors into one place, so we could build complete dashboards and reports on top of it.

My manager, Akhmad Madces, brought me into that project. Reza Lesmana, a solution architect at Nokia, designed it with him, and Feris Thia, the CEO of Pentaho Indonesia, mentored me through it.

I was amazed at how easy it was to build, and how easy it was to understand the flow, even for a complex scenario. I still use the concepts from that project today.

After that, I used Kettle again, and again, and again, for many different cases. The last time was at the end of 2022, for reporting. Today I mostly use Power Query and Power BI for data transformation and reporting.

## Why I kept using it

When I'm asked to build a data solution and hand it over to someone else, Kettle has one big advantage: **it's a no-code visual tool.**

You can create a data pipeline in minutes, and anyone can see what it does just by looking at the flow. That's much easier to understand than scripts in Excel VBA or Python. So my non-programmer colleagues could keep maintaining the solutions I delivered, even after I moved on.

PDI is very flexible, too. It can import, process, clean, export and archive data in many formats.

## What I learned

- **Build with what you have.** Kettle was free. The value came from how we used it.
- **A solution is only good if someone else can maintain it.** That's why I often chose a simple visual tool over clever code.

Special thanks to Akhmad Madces, Reza Lesmana and Feris Thia for introducing me to this "kitchen."

→ Related: [Find your community](find-your-community.md) · [Road to CDMP Master](road-to-cdmp-master.md)

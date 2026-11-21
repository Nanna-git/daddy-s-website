---
title: "Side projects with friends"
slug: side-projects-with-friends
date: 2025-09-07
phase: Learning through community (2025)
themes: [Power BI design craft]
linkedin_posts:
  - date: 2025-03-13
    note: Small-business ROI planner
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7305921652414939136/
  - date: 2025-08-10
    note: "Events in progress" dataset with Geir Forsmo
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7360287559320485888/
  - date: 2025-08-12
    note: Trello data to a smart Power BI dashboard
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7361010035000336384/
  - date: 2025-09-07
    note: Track your superheroes
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7370358012236099585/
reading_time: 4 min
assets:
  - Screenshots of each project
  - Events in progress report: https://lnkd.in/dWDqqeTQ
  - Trello report: https://lnkd.in/dg2GrXET · PBIX: https://lnkd.in/d76J4msE
  - Superhero tracker live demo: https://lnkd.in/d2FxbtKk
status: draft
---

# Side projects with friends

Some of my favorite Power BI projects didn't come from a class. They came from a friend with a real question.

## 1. A financial planner for a small business 🚀

A friend of mine was launching a small business, and he needed a clear financial roadmap. He had two big questions:
- How fast will I get my investment back?
- What's the minimum capital I need to start?

I researched the key numbers (employee costs, operating expenses and revenue projections), built the dataset with Power Query, and wrote the ROI and investment calculations in DAX.

The best part? Seeing my friend's reaction. He was genuinely excited to use the dashboard, and he felt confident making decisions with it. That's why I love this work.

*(The ROI and number formatting techniques came from Power BI Park, where Injae Park teaches them.)*

## 2. "Events in progress" with Geir Forsmo

Geir Forsmo, a data engineering expert I met in Power BI Park, and I worked together on ticket data that came in an event-based format.

First, we used Power Query to turn the raw events into daily snapshots. Then we calculated the number of open tickets for each month in Power BI. The work was 70% data modeling and Power Query, and only 30% visualization. It was great to do end-to-end reporting together, from understanding the need to the final visuals.

*(The trick for highlighting line charts came from Michel van Schaik. If you want to learn this pattern, read the "Events in progress" article on daxpatterns.com.)*

## 3. Trello data to a smart timeline

The normal Trello dashboard is a bit simple. It shows what you're doing now, not what you did before. But Trello's exported JSON file is full of information.

So I built a Power BI report that's useful for two kinds of people:
- **Team members** can show their work clearly, with a calendar of the hours they worked and the tasks they did.
- **Managers** can see how each project is going, and whether anyone is overloaded, juggling too many things, or switching tasks too fast.

The design was inspired by the Notion app. The effort: 20% understanding the JSON structure, 30% building the scenario, 30% Power Query, 20% visualization.

I built that Gantt-style timeline by hand in August 2025. A year later, Power BI released a built-in Gantt chart visual, and I smiled.

*(Thanks to the BlueSky software house team, Pria P and Rega Adhitya, and to Fauzan Erich Emmerling and Arsalan Ahmed Ansari, for introducing me to Trello.)*

## 4. Track your superheroes 🛻🛵🚲

A friend asked how Power BI could track field teams: delivery drivers, maintenance crews, or just for fun, a superhero moving through the city.

So I built a demo that shows:
- where the team is right now,
- what task they're doing,
- and their history over the last few hours, with a time slider to see more.

It uses the "path layer" in Azure Maps to draw and animate routes over time. I learned how from Bas Dohmen's (How to Power BI) video, and many other techniques from The Data Vis Forge.

## What I learned

- **🧵 Stay close to people who see the business.** Every one of these projects started with someone else's real need.
- The best feedback isn't a "like." It's a friend saying, "Can I use this?"

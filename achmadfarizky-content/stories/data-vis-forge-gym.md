---
title: "The Data Vis Forge gym"
slug: data-vis-forge-gym
date: 2025-08-14
phase: Learning through community (2025)
themes: [Power BI design craft]
linkedin_posts:
  - date: 2025-05-06
    note: "#001 Dynamic granularity (field parameters)"
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7325419281880363008/
  - date: 2025-05-12
    note: "#002 Visual calculations"
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7327617017316818946/
  - date: 2025-05-14
    note: "#003 Dynamic hierarchy"
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7328328261631889408/
  - date: 2025-05-15
    note: "#004 Dynamic hierarchy II"
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7328591527583047680/
  - date: 2025-05-15
    note: "#005 Heatmap & dynamic hierarchy III"
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7328807517554130944/
  - date: 2025-05-27
    note: "#006 KPI cards"
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7333000668531658752/
  - date: 2025-05-27
    note: "#006 KPI cards with line chart"
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7333184393076707330/
  - date: 2025-05-29
    note: Dynamic subtitles
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7333924756947116034/
  - date: 2025-06-03
    note: "#007 & #008 Dynamic waterfall (challenge)"
    url: https://www.linkedin.com/feed/update/urn:li:share:7335577012918542336/
  - date: 2025-06-03
    note: "#007 & #008 Dynamic waterfall (solution)"
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7335780310644580353/
  - date: 2025-06-05
    note: WHAT, WHY, HOW
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7336448836489375745/
  - date: 2025-06-07
    note: "#009 & #010 Number formatting"
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7337048309838065665/
  - date: 2025-06-30
    note: Pareto chart
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7345353270841729024/
  - date: 2025-07-21
    note: The four colors (art and magic)
    url: https://www.linkedin.com/feed/update/urn:li:share:7353047929856655360/
  - date: 2025-07-22
    note: "#012 Quadrant chart"
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7353400124804411393/
  - date: 2025-08-14
    note: "#015 ABC segmentation"
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7361736556413444097/
reading_time: 6 min
assets:
  - Screenshot or GIF of each workout result
  - PBIX downloads: waterfall https://lnkd.in/dwkBAvzX · number formatting https://lnkd.in/dNPbgvzb · dynamic subtitle https://lnkd.in/gQXbmDxh
status: draft
---

# The Data Vis Forge gym 🏋️

After three months in Power BI Park, I wanted to sharpen my front-end skills even more. So in May 2025, I joined **The Data Vis Forge**, Gustaw Dudek's community.

What makes it special is the **"advanced workout"** section. There aren't many how-to videos. Instead, you get:
- screenshots of a report,
- an interactive demo, so you can see how it works for users,
- and the dataset.

From just those, you have to answer three questions:
- **WHAT** visuals are these, and what do the numbers mean?
- **WHY** did Gustaw build them this way? How do they help the user?
- **HOW** do I build them?

The platform also gives you the solution PBIX file. I chose not to open it until I'd finished my own version. That made the difficulty level go from easy, normal, hard… to **EXTREME.** (If you want an easier experience, you can always study the solution first.)

## The workout log

- **#001 Dynamic granularity.** Several field parameters working together to control columns across many visuals. Done in one day.
- **#002 Visual calculations.** A matrix with many complex calculated columns, plus padding and borders for visual grouping. It looked simple, but it felt like a two-hour full-body workout.
- **#003–#005 Dynamic hierarchy, in three parts.** Users choose the order of the table breakdown. In the third one, I added a heatmap on/off switch and spent a lot of effort keeping the column widths right whatever the user picks. (Thanks to Iwa Sanjaya for the tip!) If #001 and #002 built my upper and lower body strength, #003 built my mobility and flexibility. #004 felt like a yoga session.
- **#006 KPI cards.** With extra UX touches like radio buttons and colored card borders. I spent hours designing the radio button in PowerPoint. Then I added a year-over-year line chart that highlights the selected period, solved with help from Michel van Schaik.
- **Dynamic subtitles.** A DAX measure that shows the active period in a short, readable way: "Mar 13 – 28, 2025," or "Dec 25, 2024 – Jan 4, 2025."
- **#007–#008 Dynamic waterfall.** Turning a whole page of waterfall charts into one dynamic chart, where users choose the KPI, the breakdown, the period, the comparison and where the Y-axis starts.
- **#009–#010 Number formatting.** Users choose the unit (thousands, millions, billions). I added my own extra: users can also choose how many decimals to see. I designed it as a small "widget," inspired by Nicholas Lea-Trengrouse.
- **Pareto chart.** I'd built Pareto charts before, but Gustaw's approach made my technique stronger. My honest opinion: horizontal Pareto charts get ugly with more than 20 items. A table, a quadrant chart or a vertical Pareto works better.
- **The four colors.** I could rebuild the whole scatter chart, except its four background colors. When I finally opened Gustaw's file, it wasn't a chart feature, or even DAX. It was a clever mix of color theory, **a mix of art and magic.**
- **#012 Quadrant chart.** I tried a "retro" grayscale version. *(Update: I prefer the original. It still looks better.)*
- **#015 ABC segmentation.** Customers grouped into A, B and C by revenue, changing with the filters. Michel van Schaik helped me with the hard parts. I also tried a new Notion-inspired design, with a 100% white canvas, and made my own icons in Figma to match.

## What I learned

- **Rebuild, don't copy.** By rebuilding Gustaw's work myself, I found "hidden treasures" I would have missed in the finished file.
- The Forge gave me the **corporate layer**: not just DAX, but naming conventions, variables, measure grouping, UX and enterprise-style reporting. I used many of these techniques later at JHAH.
- Thank you, Gustaw Dudek, "the BI visual mentalist," and Michel van Schaik, "the BI visual magician." Dziękuję!

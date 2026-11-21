---
title: "My own Power BI theme machine"
slug: power-bi-theme-machine
date: 2025-06-12
phase: Learning through community (2025)
themes: [Automation & clever tricks, Power BI design craft]
linkedin_posts:
  - date: 2025-05-31
    note: Build your own theme generator (v1)
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7334655181541797888/
  - date: 2025-06-11
    note: Python code for themes got better (v2)
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7338476340116881408/
  - date: 2025-06-12
    note: Done with report.json
    url: https://www.linkedin.com/feed/update/urn:li:share:7338862209726308357/
reading_time: 3 min
assets:
  - Demo video of the process (from the June 11 post)
  - Python code + PBIX: https://lnkd.in/d9DQTQkN
status: draft
---

# My own Power BI theme machine 🎨

In Power BI, a **JSON theme** file controls how your visuals look: colors, fonts, backgrounds, legends and more. A good theme means you don't have to format every visual by hand.

There are tools that create JSON themes for you. They're useful. But my advice is to still try to **understand the JSON code they create.** Knowing what's inside gives you much more control.

So I built my own theme generator.

## How it works

1. Format your visuals by hand in a Power BI report, the way you like them.
2. Save the report in **PBIP format** (Power BI project).
3. Open the `report.json` file inside the project's `.Report` folder.
4. Use Python to read each visual's formatting and turn it into theme settings.
5. Copy the result into your JSON theme file.

Done! Your own theme, built from your own formatting.

## Version 2

A week later, I improved it. The new version handles even more: the new KPI card, and the hover and selected effects of the new slicer.

My process now:
- start with a base theme that only sets the colors,
- format the visuals I use most often,
- save as PBIP,
- run my Python script, and apply the new theme.

I'm happy with the results. This saves me so much time. I think I now spend only about **20% of my time** in the Format pane. My visuals look the way I want, without much effort.

I was also looking forward to Injae Park's version. I believed his would go even further, because of his deep understanding of Power BI visuals.

## Knowing when to stop

After finishing the `report.json` parsing, I stopped. I had already done more than I planned. If I kept going, it would become too much to manage. Time for my next learning journey.

## What I learned

- **🧵 Learn what you love, even outside your job.** Python isn't "part of Power BI," but it turned a boring task into a two-minute job.
- If you use a tool, try to understand what it produces.
- A big thank you to Kurt Buhler (SQLBI) for his video on the benefits of JSON themes, and to Injae Park for inspiring this experiment.

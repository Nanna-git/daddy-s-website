# Story · The Data Vis Forge gym

**Phase:** Learning through community (2025) · **Topics:** [Power BI design craft] · **Reading time:** 6 min  
**Assets to illustrate:** Screenshot or GIF of each workout result; PBIX downloads: waterfall https://lnkd.in/dwkBAvzX · number formatting https://lnkd.in/dNPbgvzb · dynamic subtitle https://lnkd.in/gQXbmDxh

**Scene:** a separate diorama for this story, themed on its content (designer to propose); light and dark versions.

**Views:** 14

### V01 · T1 Hero · 36 words

````md
# The Data Vis Forge gym 🏋️

After three months in Power BI Park, I wanted to sharpen my front-end skills even more. So in May 2025, I joined **The Data Vis Forge**, Gustaw Dudek's community.
````

### V02 · T2 Text+Scene · 39 words

````md
What makes it special is the **"advanced workout"** section. There aren't many how-to videos. Instead, you get:
- screenshots of a report,
- an interactive demo, so you can see how it works for users,
- and the dataset.
````

### V03 · T2 Text+Scene · 40 words

````md
From just those, you have to answer three questions:
- **WHAT** visuals are these, and what do the numbers mean?
- **WHY** did Gustaw build them this way? How do they help the user?
- **HOW** do I build them?
````

### V04 · T2 Text+Scene · 46 words

````md
The platform also gives you the solution PBIX file. I chose not to open it until I'd finished my own version. That made the difficulty level go from easy, normal, hard… to **EXTREME.** (If you want an easier experience, you can always study the solution first.)
````

### V05 · T2 Text+Scene · 52 words

````md
## The workout log

- **#001 Dynamic granularity.** Several field parameters working together to control columns across many visuals. Done in one day.
- **#002 Visual calculations.** A matrix with many complex calculated columns, plus padding and borders for visual grouping. It looked simple, but it felt like a two-hour full-body workout.
````

### V06 · T2 Text+Scene · 70 words

````md
- **#003–#005 Dynamic hierarchy, in three parts.** Users choose the order of the table breakdown. In the third one, I added a heatmap on/off switch and spent a lot of effort keeping the column widths right whatever the user picks. (Thanks to Iwa Sanjaya for the tip!) If #001 and #002 built my upper and lower body strength, #003 built my mobility and flexibility. #004 felt like a yoga session.
````

### V07 · T2 Text+Scene · 43 words

````md
- **#006 KPI cards.** With extra UX touches like radio buttons and colored card borders. I spent hours designing the radio button in PowerPoint. Then I added a year-over-year line chart that highlights the selected period, solved with help from Michel van Schaik.
````

### V08 · T2 Text+Scene · 60 words

````md
- **Dynamic subtitles.** A DAX measure that shows the active period in a short, readable way: "Mar 13 – 28, 2025," or "Dec 25, 2024 – Jan 4, 2025."
- **#007–#008 Dynamic waterfall.** Turning a whole page of waterfall charts into one dynamic chart, where users choose the KPI, the breakdown, the period, the comparison and where the Y-axis starts.
````

### V09 · T2 Text+Scene · 36 words

````md
- **#009–#010 Number formatting.** Users choose the unit (thousands, millions, billions). I added my own extra: users can also choose how many decimals to see. I designed it as a small "widget," inspired by Nicholas Lea-Trengrouse.
````

### V10 · T2 Text+Scene · 39 words

````md
- **Pareto chart.** I'd built Pareto charts before, but Gustaw's approach made my technique stronger. My honest opinion: horizontal Pareto charts get ugly with more than 20 items. A table, a quadrant chart or a vertical Pareto works better.
````

### V11 · T2 Text+Scene · 63 words

````md
- **The four colors.** I could rebuild the whole scatter chart, except its four background colors. When I finally opened Gustaw's file, it wasn't a chart feature, or even DAX. It was a clever mix of color theory, **a mix of art and magic.**
- **#012 Quadrant chart.** I tried a "retro" grayscale version. *(Update: I prefer the original. It still looks better.)*
````

### V12 · T2 Text+Scene · 47 words

````md
- **#015 ABC segmentation.** Customers grouped into A, B and C by revenue, changing with the filters. Michel van Schaik helped me with the hard parts. I also tried a new Notion-inspired design, with a 100% white canvas, and made my own icons in Figma to match.
````

### V13 · T2 Text+Scene · 55 words

````md
## What I learned

- **Rebuild, don't copy.** By rebuilding Gustaw's work myself, I found "hidden treasures" I would have missed in the finished file.
- The Forge gave me the **corporate layer**: not just DAX, but naming conventions, variables, measure grouping, UX and enterprise-style reporting. I used many of these techniques later at JHAH.
````

### V14 · T2 Text+Scene · 18 words

````md
- Thank you, Gustaw Dudek, "the BI visual mentalist," and Michel van Schaik, "the BI visual magician." Dziękuję!
````

# Story · My own Power BI theme machine

**Phase:** Learning through community (2025) · **Topics:** [Automation & clever tricks, Power BI design craft] · **Reading time:** 3 min  
**Assets to illustrate:** Demo video of the process (from the June 11 post); Python code + PBIX: https://lnkd.in/d9DQTQkN

**Scene:** a separate diorama for this story, themed on its content (designer to propose); light and dark versions.

**Views:** 9

### V01 · T1 Hero · 39 words

````md
# My own Power BI theme machine 🎨

In Power BI, a **JSON theme** file controls how your visuals look: colors, fonts, backgrounds, legends and more. A good theme means you don't have to format every visual by hand.
````

### V02 · T2 Text+Scene · 40 words

````md
There are tools that create JSON themes for you. They're useful. But my advice is to still try to **understand the JSON code they create.** Knowing what's inside gives you much more control.

So I built my own theme generator.
````

### V03 · T2 Text+Scene · 63 words

````md
## How it works

1. Format your visuals by hand in a Power BI report, the way you like them.
2. Save the report in **PBIP format** (Power BI project).
3. Open the `report.json` file inside the project's `.Report` folder.
4. Use Python to read each visual's formatting and turn it into theme settings.
5. Copy the result into your JSON theme file.
````

### V04 · T2 Text+Scene · 9 words

````md
Done! Your own theme, built from your own formatting.
````

### V05 · T2 Text+Scene · 65 words

````md
## Version 2

A week later, I improved it. The new version handles even more: the new KPI card, and the hover and selected effects of the new slicer.

My process now:
- start with a base theme that only sets the colors,
- format the visuals I use most often,
- save as PBIP,
- run my Python script, and apply the new theme.
````

### V06 · T2 Text+Scene · 61 words

````md
I'm happy with the results. This saves me so much time. I think I now spend only about **20% of my time** in the Format pane. My visuals look the way I want, without much effort.

I was also looking forward to Injae Park's version. I believed his would go even further, because of his deep understanding of Power BI visuals.
````

### V07 · T2 Text+Scene · 37 words

````md
## Knowing when to stop

After finishing the `report.json` parsing, I stopped. I had already done more than I planned. If I kept going, it would become too much to manage. Time for my next learning journey.
````

### V08 · T2 Text+Scene + thread tag · 30 words

````md
## What I learned

- **Learn what you love, even outside your job.** Python isn't "part of Power BI," but it turned a boring task into a two-minute job.
````

### V09 · T2 Text+Scene · 38 words

````md
- If you use a tool, try to understand what it produces.
- A big thank you to Kurt Buhler (SQLBI) for his video on the benefits of JSON themes, and to Injae Park for inspiring this experiment.
````

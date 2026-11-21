# Story · Small Power BI tricks I love

**Phase:** Learning through community (2025) → JHAH · **Topics:** [Automation & clever tricks, Power BI design craft] · **Reading time:** 5 min  
**Assets to illustrate:** Screenshots for each trick; Report with tab menu and invisible character: https://lnkd.in/djjvv6eG; Mac font report: https://lnkd.in/dTjx3sf7

**Scene:** a separate diorama for this story, themed on its content (designer to propose); light and dark versions.

**Views:** 15

### V01 · T1 Hero · 27 words

````md
# Small Power BI tricks I love

Not every lesson needs a big project. Here are some small tricks that made a big difference in my reports.
````

### V02 · T2 Text+Scene · 42 words

````md
## 1. KPI cards as buttons

KPI cards that also work as buttons are one of my favorite techniques. People already know this pattern from websites and mobile apps, so it feels natural. I think it should come even before normal filters.
````

### V03 · T2 Text+Scene · 37 words

````md
Many experts have shown their own versions: Iwa Sanjaya (with very detailed documentation), Robert Mika in Qlik, and Gustaw Dudek. I built my first versions in Power BI Park, in my Electronic Sales and HR Overview dashboards.
````

### V04 · T2 Text+Scene · 26 words

````md
## 2. The magic of the invisible character 🪄

The **invisible character (Unicode 8203)** is a small trick with a big impact on Power BI design.
````

### V05 · T2 Text+Scene · 45 words

````md
- **Moving chart titles.** I wanted to shift a chart's title to the right to make room for an icon. Putting the invisible character between spaces lets you create several spaces in a row. I learned this from Gustaw Dudek in The Data Vis Forge.
````

### V06 · T2 Text+Scene · 60 words

````md
- **Unique labels for identical text.** If you label months by their first letter, "A" is both April and August, "J" is June and July, and "M" is March and May. Adding the invisible character makes each label unique. (Thanks to Murat for reminding me. And if you use Melissa de Korte's Power Query calendar script, it's already built in!)
````

### V07 · T2 Text+Scene · 65 words

````md
## 3. A tab menu from a button slicer 🔘

A simple tab menu: a button slicer on top of a straight horizontal line.
- **Default state:** no border, transparent fill.
- **Selected state:** a border in the same color as the line, a white background, and a thick white bottom bar that "cuts" the line, so the selected tab looks connected to the page.
````

### V08 · T2 Text+Scene · 11 words

````md
Credit to Injae Park, who taught me many button slicer tricks.
````

### V09 · T2 Text+Scene · 62 words

````md
## 4. Segoe UI Semibold on a Mac 💡

As a Mac user working in the Power BI Service, I had two font problems. Some standard fonts didn't show correctly, and setting "Segoe UI Semibold" in a JSON theme didn't work.

The fix: in the JSON theme, use `wf_segoe-ui_semibold` as the font name. It worked! Finally, I could use this popular font.
````

### V10 · T2 Text+Scene · 68 words

````md
## 5. The vertical alignment that "disappeared"

One day, Power BI Desktop updated itself from the October to the November 2025 version. I opened the report I'd worked on the night before, and the text alignment on my KPI cards was broken. And I had to present that report to my director the next day!

I searched for hours. The vertical alignment option was nowhere to be found.
````

### V11 · T2 Text+Scene · 60 words

````md
Finally, I found it: the **vertical alignment option only appears when the "Divider" is turned on**, and Divider had moved to a different section. The fix:
1. Go to **Cards** → turn **Divider ON**.
2. Go to **Reference labels layout** → set **Vertical alignment to TOP**.
3. Go back to **Cards** → turn **Divider OFF**.

Fixed, and ready to present!
````

### V12 · T2 Text+Scene · 48 words

````md
The twist: this wasn't a bug. Long ago, I had set the vertical alignment to "bottom" in my JSON theme. It did nothing in the old version, so I forgot about it. The November update made it work. **The update didn't break my report. It fixed my theme!**
````

### V13 · T2 Text+Scene · 45 words

````md
## 6. Beautiful code

I love how Gustaw Dudek writes DAX: with **extra spaces** that make the code clean and easy to read. His visuals look great, and so does his code. I do the same in my own code. It really helps my eyes.
````

### V14 · T2 Text+Scene · 43 words

````md
Another style I use: putting **commas at the start of the line** when listing items. It makes it much easier to comment lines in and out. I learned this from Will Needham in the Fabric Dojo.

Protect your eyes: make your code beautiful!
````

### V15 · T2 Text+Scene · 47 words

````md
## 7. Even Microsoft says it's magic

I always call some people's Power BI tricks "magic." That's not an exaggeration. Even Microsoft uses the word in its documentation! Thank you to the BI magicians I learn from: Michel van Schaik, Gustaw Dudek, Injae Park and Mateusz Sochor.
````

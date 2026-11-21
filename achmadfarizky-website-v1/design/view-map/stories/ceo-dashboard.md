# Story · Rebuilding Nick Desbarats' CEO dashboard

**Phase:** Learning through community (2025) · **Topics:** [Power BI design craft] · **Reading time:** 3 min  
**Assets to illustrate:** Screenshots of the role, area and entity dashboards; PBIX + dataset: https://lnkd.in/d6BZRBTA; Part 1 dataset: https://lnkd.in/ddDeG7MN; Video reference: https://lnkd.in/dXUTJADU

**Scene:** a separate diorama for this story, themed on its content (designer to propose); light and dark versions.

**Views:** 7

### V01 · T1 Hero · 46 words

````md
# Rebuilding Nick Desbarats' CEO dashboard

In July 2025, Gustaw Dudek shared a YouTube video in The Data Vis Forge: *"How to Rescue Your Failing Dashboard"*, an interview with Nick Desbarats by Rupe. Gustaw recommended it, so I knew it would be good. And it was.
````

### V02 · T2 Text+Scene · 49 words

````md
The ideas really clicked with my years in telecom. At Ericsson, we always needed to show tons of metrics and dimensions, clearly, to top management. I had built similar high-level dashboards before, in SAP BusinessObjects.

So I decided to rebuild the CEO dashboard from the video, in Power BI.
````

### V03 · T2 Text+Scene · 47 words

````md
## The goal

- The users are the top managers of a company.
- They need to see information across many dimensions in about **three seconds.**
- Important things must stand out.

The dashboard has three layers: a **role** dashboard, an **area** dashboard and an **entity** dashboard.
````

### V04 · T2 Text+Scene · 58 words

````md
## My solution

The coolest part of the entity dashboard is showing **all the data dimensions on one page, with just one matrix visual.**

Here's how:
- No deep analysis is needed at this level, so all the aggregated metrics are calculated in the data model.
- I unpivoted all the categories and metrics in the data model.
````

### V05 · T2 Text+Scene · 45 words

````md
Now I can show many dimensions and metrics from different datasets in one column, in one visual, and pivot them horizontally and vertically at the same time.

My effort was **70% Power Query** for the data model and only **30% DAX** for the visual design.
````

### V06 · T2 Text+Scene · 31 words

````md
## Try it yourself

I shared the PBIX file and the dataset, so anyone can download it and try. Watch the video too. It has more ideas than I mentioned here.
````

### V07 · T2 Text+Scene · 51 words

````md
## What I learned

- A great dashboard often starts with a great data model, not with a great chart.
- Experience transfers: what I learned for telecom executives fit perfectly into this exercise.

Thank you, Nick Desbarats (Practical Reporting), Ian Stuart (Rupe) and Gustaw Dudek, for letting me do this.
````

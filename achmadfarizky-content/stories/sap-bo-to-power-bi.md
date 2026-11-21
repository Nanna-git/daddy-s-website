---
title: "From SAP BO to Power BI: web-style BI or BI-style web?"
slug: sap-bo-to-power-bi
date: 2025-04-04
phase: Learning through community (2025)
themes: [Career & learning journey, Power BI design craft]
linkedin_posts:
  - date: 2025-04-02
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7313061273976410112/
  - date: 2025-04-04
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7313778618269089792/
reading_time: 4 min
assets:
  - Video of the ReactJS reporting website (from the LinkedIn post)
  - Demo link: https://lnkd.in/dw29GDkB
status: draft
---

# From SAP BO to Power BI

## 2010: more than a report builder

Back in 2010, when I joined Ericsson in Saudi Arabia, I went deep into SAP BusinessObjects. Not just as a user. I wanted to see what else it could do.

So I built things it wasn't really designed for:
- a way to share documents publicly with the people who needed them,
- alerts that warned us when the network showed unusual behavior,
- and data shown on Google Earth and Google Maps, so people could see problems on a map instead of a table.

All of it needed serious work behind the scenes: enhancing the data model (the "universe"), building the visuals, and writing automation scripts. And it all came from one question: **"What else can we do?"**

## 2025: same question, new tool

Fifteen years later, I started a new adventure with Power BI. And I brought the same question with me.

That's why I jumped into Injae Park's **Power BI Park** community. It's a great place to learn and solve problems together, and I offered to help other members with Power Query, data modeling, DAX and visualization.

## Web-style BI, or BI-style web?

In the Power BI world, many people talk about making reports look more like websites, with better UI/UX. People like Nicholas Lea-Trengrouse, Naresh Suglani, Armand van Amersfoort and Iwa Sanjaya are doing amazing work on this.

I love one line from Nicholas:

> "You're not just designing for analysts – you're designing for adoption. If your users don't 'get it' in under 5 seconds, they won't come back."

But I had a question the other way around: **what if we bring the power of BI tools into a website?**

A few years ago, I tried exactly that. I built a reporting website for management using ReactJS, as a side project. I wanted that "BI feeling" on the web: filtering, drilling down and dynamic visuals.

Behind the scenes:
- an ETL process pulled data from several sources,
- transformed it into JavaScript objects and saved them as .js files,
- and the React app simply read those files and showed the data.

Even the time intelligence (comparing periods) was calculated in the ETL, before the data reached the web page.

It was a design experiment, not a finished product. But it taught me a lot. I learned React from Adrian Hajdin's YouTube tutorials, and later took his Next.js Pro course at JavaScript Mastery.

## What I learned

- **🧵 Learn what you love, even outside your job.** I'm not a web developer, but my web skills from university keep coming back to help my data work.
- The tool changes. The question "what else can we do?" doesn't.

*(And yes: the website you're reading now is the next step of that experiment.)*

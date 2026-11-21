---
title: "I cheated! (But it turned out okay.)"
slug: i-cheated-time-offset
date: 2025-07-20
phase: Ericsson (Mobily)
themes: [Career & learning journey, Automation & clever tricks]
linkedin_posts:
  - date: 2025-07-20
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7352685363707936769/
reading_time: 3 min
assets:
  - Image from the LinkedIn post
  - Optional: a simple diagram of "today vs. yesterday" using a time offset
status: draft
---

# I cheated! (But it turned out okay.)

More than ten years ago, at Mobily, I had a problem with SAP BusinessObjects.

The network operations team needed to compare data over time: today vs. yesterday, this hour vs. the same hour last week, sometimes even minute by minute. It sounds simple. But the tools we had didn't make it easy at all.

## The "duct tape"

So I cheated.

I added **"time offset"** calculations directly into our main data model on the production server. (In SAP BusinessObjects, this model is called a *universe*. It keeps calculations consistent for every user.)

The idea was simple: for every time period, also store how far it is from "now." Then comparing any two periods becomes easy.

But I was worried. It felt like covering a hole with duct tape, not a "proper" solution. I was afraid someone would look at it and think I didn't know what I was doing.

## It just kept working

The solution worked really well. It handled all kinds of time comparisons, and we used it for years. As far as I know, it's still in use today.

## The surprise

Then, many years later, I saw posts from Brian Julius, a well-known BI expert, together with Melissa de Korte and Greg Deckler. They were using **the exact same "offset" idea** for time intelligence in Power BI.

And they didn't call it a cheat. They called it a superpower.

**My "cheat" had been an expert trick all along. I just didn't know it.**

## What I learned

Sometimes what feels like a quick fix is actually a smart solution. You just don't have the words for it yet.

That realization gave me more confidence in my own ideas, and in sharing them. Since then, I've started posting even my small insights, hoping they might help someone else. This website is part of that.

Thank you, Brian, Melissa and Greg, for sharing so generously.

**Want to learn the offset technique?**
- *DAX for Humans* by Greg Deckler
- Melissa de Korte's Power Query calendar script, with advanced offsets, on her GitHub
- Brian Julius's posts on LinkedIn about this "superpower"

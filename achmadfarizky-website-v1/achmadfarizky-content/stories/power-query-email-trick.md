---
title: "Sending hundreds of emails at once? A Power Query trick"
slug: power-query-email-trick
date: 2025-05-09
phase: Learning through community (2025)
themes: [Automation & clever tricks]
linkedin_posts:
  - date: 2025-05-09
    url: https://www.linkedin.com/feed/update/urn:li:ugcPost:7326583605067956224/
reading_time: 2 min
assets:
  - Screenshot of the employee activity report (from the LinkedIn post)
status: draft
---

# Sending hundreds of emails at once? 📨

## The problem

A new client needed to send me hundreds of PDF files with information for analysis. Each PDF was in a separate email. That meant forwarding them to me one by one.

Hundreds of emails. By hand.

## The trick

Fortunately, I could make this simple with **Power Query**, using only the menus, without writing any M code.

1. I guided my client to connect Power Query to his mailbox and read all the emails at once.
2. The PDF attachments were converted into binary text.
3. Everything was saved into **one single Excel file**, which he sent to me.
4. On my side, I used Python to turn the binary text back into individual PDF files.

The tools:
- **Power Query**, to connect to email and read the data: `Exchange.Contents("your@email-address.corp")`
- **Python**, to convert the base64 text back into files: `import base64`

## Not the first time

The year before, I had used the same technique to read emails with Power Query and turn them into a simple Power BI dashboard of employee activity.

I learned it from a YouTube video by Chandeep Chhabra, about automatically importing data from email attachments into one Excel file, instead of copying and pasting from many files by hand.

## What I learned

**Build with what you already have.** My client didn't need to install anything new. Excel, which he already had, did the hard part. A small trick saved hours of boring work.

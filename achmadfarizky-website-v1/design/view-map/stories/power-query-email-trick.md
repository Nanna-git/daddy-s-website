# Story · Sending hundreds of emails at once? A Power Query trick

**Phase:** Learning through community (2025) · **Topics:** [Automation & clever tricks] · **Reading time:** 2 min  
**Assets to illustrate:** Screenshot of the employee activity report (from the LinkedIn post)

**Scene:** a separate diorama for this story, themed on its content (designer to propose); light and dark versions.

**Views:** 5

### V01 · T1 Hero · 47 words

````md
# Sending hundreds of emails at once? 📨

## The problem

A new client needed to send me hundreds of PDF files with information for analysis. Each PDF was in a separate email. That meant forwarding them to me one by one.

Hundreds of emails. By hand.
````

### V02 · T2 Text+Scene · 63 words

````md
## The trick

Fortunately, I could make this simple with **Power Query**, using only the menus, without writing any M code.

1. I guided my client to connect Power Query to his mailbox and read all the emails at once.
2. The PDF attachments were converted into binary text.
3. Everything was saved into **one single Excel file**, which he sent to me.
````

### V03 · T2 Text+Scene · 43 words

````md
4. On my side, I used Python to turn the binary text back into individual PDF files.

The tools:
- **Power Query**, to connect to email and read the data: `Exchange.Contents("your@email-address.corp")`
- **Python**, to convert the base64 text back into files: `import base64`
````

### V04 · T2 Text+Scene · 63 words

````md
## Not the first time

The year before, I had used the same technique to read emails with Power Query and turn them into a simple Power BI dashboard of employee activity.

I learned it from a YouTube video by Chandeep Chhabra, about automatically importing data from email attachments into one Excel file, instead of copying and pasting from many files by hand.
````

### V05 · T2 Text+Scene + thread tag · 36 words

````md
## What I learned

**Build with what you already have.** My client didn't need to install anything new. Excel, which he already had, did the hard part. A small trick saved hours of boring work.
````

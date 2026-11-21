# Claude Design prompt: Achmad Farizky's story-telling website

> Paste this whole file into Claude Design. Attach: (1) the two Sunday Driver screenshots, (2) the `design/view-map/` folder (or the files named in "Content"). Everything below is the brief.

---

## 1. What we are making

A personal website for **Achmad Farizky**, a data specialist and data storyteller (21 years in telecom, retail and healthcare data; CDMP Master; Johns Hopkins Aramco Healthcare, Saudi Arabia). It is **not** a normal scrolling page. It is a **story-telling presentation** where the reader sees **one small piece of the story at a time**.

- A **view** = the smallest piece of information shown at once: a few lines of text plus **an image or animation that supports the text** (every view has both).
- A **section** = a group of views that tells one story (one place, one chapter).
- Each section lives in **its own 3D cartoon scene** (a small diorama) whose props follow the topic: telecom towers, Power BI dashboards, a hospital, a student's room, and so on.

Audience: engineers from other fields, mid-career learners, and people starting over; also recruiters and managers who land from LinkedIn. **Desktop first**, with phone and tablet supported in a simpler form.

Tone of the design: calm, friendly, professional. A toy-model city that a thoughtful adult enjoys, not a children's game.

## 2. Content (do not change a word)

All text is Achmad's own writing, split into views in `design/view-map/`.
- **Use the text exactly as written.** Do not reword, shorten, "polish" or invent copy. Quotes from other people stay word for word, including their grammar.
- Normal bold and italic only.
- If you need extra UI labels (button names, menu items), keep them to one or two plain English words.
- Images, photos and screenshots do not exist yet. Show **labelled placeholders** where a real photo or screenshot will go (for example "Photo: JMKRIDE freeskates").

### Site map

| # | Section | Views | Scene |
|---|---|---|---|
| 1 | Home (intro + the three threads) | 5 | Student's room |
| 2 | My story: **7 sub-sections**, one per career phase | 59+ | One scene each (see table) |
| 3 | Portfolio (12 projects) | 13 | Gallery street |
| 4 | What I write about (9 topics, also the library filters) | 5 | Library street |
| 5 | Community & recognition | 6 | Gym / dojo / park |
| 6 | Passions | 5 | Mountain village |
| 7 | Tips for people with a background like mine | 11 | Hilltop |
| 8 | Skills, tools & certificates | 6 | Hilltop with workshop shelf |
| 9 | Let's connect | 1 | Hilltop with a lit window |
| + | **33 stories**, each one a section on its own long page, split into views (350 views in total) | 5–18 each | A separate scene per story |

Per-section view counts and every view's exact text: `design/view-map/README.md` and the files next to it. Each view is already tagged with a suggested layout template (T1–T5).

## 3. Scenes: one diorama per section, light and dark versions

Every scene is a self-contained floating diorama. **Scenes are separate, not one connected world.** Each scene has a **light (day) version and a dark (night) version**. Weather and mood stay with the scene in both modes.

| Section | Place and props | Light mode | Dark mode |
|---|---|---|---|
| Home | **Student's room**: desk, stacked books, laptop, notebooks, a window onto a city. Shows someone who loves learning | Sunny window, open books | Desk-lamp glow, city lights outside |
| 2.1 University | Campus and design studio: Photoshop, CorelDraw, Flash, a university calendar | Bright afternoon | Late-night studio, screens on |
| 2.2 Telkomsel | Radio tower, desk with spreadsheets, a rural site, a Google Earth screen | Early dawn | 2 AM test call, night sky |
| 2.3 A year of trying | Empty road, desk with applications, a plane to Riyadh | Light fog | Foggy night, runway lights |
| 2.4 Ericsson | Saudi city with telecom towers, a Hajj dashboard room, a data-leader desk | Hot clear day | Dusk, glowing towers |
| 2.5 Kanzway | Warehouse with industrial-tool catalog shelves, an ERD board, a small team | Overcast daylight | Warehouse lights on |
| 2.6 Learning through community | Gym / dojo / park for three communities | Light rain, clearing | Rain with neon glow |
| 2.7 JHAH | Hospital with data office, meeting room, Epic screens | Clean daylight | Calm night, lit windows |
| Portfolio | Gallery street with framed dashboards | Golden hour | Lit gallery at night |
| Passions | Mountain village: skating, hiking, languages, LEGO | Sunny day | Starry night |
| Tips, Skills, Connect | Hilltop view (shelf of tools and certificates; a lit window and a path) | Morning | Dusk |
| Library | Street of small dioramas, one per story | Day | Night |
| **Each story** | **Its own environment**, themed on the story (for example the 2 AM test call = a night road and a tower; "I cheated!" = a server room with a clock). Design a repeatable approach: one base stage per career phase with a small prop set per story | Day | Night |

## 4. Visual language (from the two Sunday Driver screenshots)

Copy the **look**, not the game.

- **Style:** low-poly 3D cartoon. Flat-coloured shapes (boxes, cones, cylinders), no textures, soft single-light shading, simple shadows, toy-model / diorama feel. Hazy depth fog. Simple silhouettes that read at a glance.
- **Palette (starting point; refine):** ink navy `#13203A`, coral accent `#FF6A4D`, haze blue-grey `#B9C4D6`, plus warm lights (lamp yellow) and desaturated scene colours. Coral is the single accent for interactive elements.
- **Chrome:** pill-shaped chips, rounded corners, a small corner HUD, a big friendly primary button with a soft drop-shadow, keyboard hints (for example "or press Enter").
- **Typography (professional, replaces Sunday Driver's rounded display font):** **Manrope** for headings, section names and chips. **Inter** for body text and controls. Reading text must be large, calm and high-contrast: 20–24 px on desktop, comfortable line length.
- **Light and dark modes:** the UI palette and the 3D lighting switch together. Follow the system setting on first visit, with a manual toggle that remembers the choice. Check contrast in both modes (WCAG AA for text).

## 5. View anatomy and layout templates

Every view has: **a text zone, a visual zone (animated 3D scene or vector animation), and a motion type.** Sections can look different because they pick different templates.

| Code | Template | Used for |
|---|---|---|
| T1 | **Hero** | First view of Home and of every story: big title, scene fills the screen |
| T2 | **Text + Scene** | Default: text on one side, scene on the other (side alternates). Adds a small thread tag for the three threads |
| T3 | **Scene + Caption** | Full scene with a short caption, for example "A moment I'm proud of" |
| T4 | **Quote** | Quotes from other people, with name and role |
| T5 | **Grid / List** | Tools, projects, certificate rows, related-story cards |

The **three threads** is a recurring motif: (1) Learn what you love, even outside your job. (2) Stay close to people who see the business. (3) Build it cheap, with what you already have. Give each thread a distinct small icon and tint, and show it as a tag on any view where it appears.

## 6. Motion

Motion is a main feature. Specify durations, easings and what moves.

1. **Between views (inside a section):** the camera dollies and focuses on a different part of the diorama; the previous text exits and the next enters; props animate to support the text (a tower blinks, a laptop opens, rain starts). Smooth, about 0.6–0.9 s, no jumps.
2. **Between sections:** the current diorama **pulls up and out and shrinks away** like a toy on a turntable; the next diorama slides in and the camera **drops into it**. Jumping through the timeline spine uses the same move, faster.
3. **Light/dark toggle:** the scene's time of day animates (lights turn on, sky shifts) while the UI recolours.
4. **Idle life:** gentle ambient motion (drifting clouds, flickering windows, a slow camera sway) that stays calm.
5. **Reduced motion:** a calm fallback with simple cross-fades.

Navigation input: scroll (one view per step, snapping), arrow keys, swipe, and a visible "next" cue. Nothing auto-advances.

## 7. Navigation and controls

Reuse Sunday Driver's HUD look with new jobs:

| Sunday Driver | In this site |
|---|---|
| Location chip ("Mountain Village 04:06") | Section name and years |
| Mini-map | **Timeline spine** (2000 → now) that is also the section menu |
| Weather buttons | **Light / dark toggle** |
| Speed dial | Progress through the section |
| "Outside / Driver" toggle | **"Scene / Read as article"** |

Also: a chapter menu; each view has its own shareable link; a **story library page** (grid of story cards, each with a tiny diorama, filterable by the 9 topics from "What I write about"); related-story cards at the end of each phase; a "next story" card at the end of each story.

## 8. Fallbacks (show them in the mockup)

- **Read as article:** the same text as a normal scrolling page.
- **Reduced motion.**
- **A still illustration** when 3D can't load.
- **Phone / tablet:** simpler and lighter 3D, same views and text. Desktop is the primary design.

## 9. What to deliver

1. **Design system:** colours (light and dark), type scale, spacing, chips and buttons, icons (including the three threads), 3D art rules (shape language, lighting, fog, shadows) and a prop kit.
2. **The five templates (T1–T5)** in light and dark, desktop, with one phone example.
3. **Full view-by-view visuals for three sections:**
   - **Home** (5 views, student's room)
   - **University** (11 views, section 2.1)
   - **One story:** `i-cheated-time-offset` (8 views)

   For every view: the layout, the scene composition, which props animate and how, and the exact text from the view map.
4. **One key frame per remaining section** (light and dark) showing its scene and a representative view, so the 3D art direction is set for the whole site. The remaining sections will be designed later, in batches, using the same system and the view map.
5. **Transition storyboards:** view to view, section to section, timeline-spine jump, light/dark switch.
6. **Story library page**, the **timeline spine and chapter menu**, and **Read as article** mode.
7. **Motion spec** per transition (duration, easing, what moves, camera path) in a form a front-end developer can implement.

## 10. Handoff to Claude Code

Claude Code will build the live site from your designs, using Three.js (the same stack as Sunday Driver: plain ES modules, Three.js 0.170, no build step). Please keep the 3D art **buildable from simple primitives and flat materials**, give every scene a list of its objects and animations, and name colours, type styles and components so they map directly to CSS variables and code.

## 11. Rules

- Exact text, no copy changes.
- Placeholders for photos and screenshots; never invent images of real people.
- Keep it accessible (contrast, keyboard use, reduced motion).
- Do not copy anything else from the Sunday Driver game: no driving, accounts, multiplayer or game UI.

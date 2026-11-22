# achmadfarizky.com

Achmad Farizky's story-telling website. It has **Home** (V01–V06), **University** and **Telkomsel**, built from the design canvas (Claude Design) in `design/` and its view map.

## Run it

No build step. Serve the folder with any static server, for example:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/>. Views have their own links: `#/home/1` … `#/home/6`.

## What's here

| Path | What it is |
|---|---|
| `index.html` | Home V01–V06, HUD, Chapters sheet, Story library, Read as article |
| `assets/css/site.css` | Design tokens (light/dark), layout for desktop, tablet and phone |
| `assets/js/app.js` | Home's six views (scene props copied from boards H01–H05), input (wheel, keys, swipe), theme, reduced motion, menus, library, article mode |
| `assets/js/board.js` | Turns a canvas scene into HTML; used by Home and the section pages |
| `assets/js/diorama.js` | Older port of the scene library, used only by `still.js` |
| `assets/js/still.js` | SVG renderer for library thumbnails and the article illustration |
| `assets/js/data.js` | Stories (33), topics (9), career phases and sections used by the menus |
| `achmadfarizky-content/` | All written content (source of truth for the text) |
| `design/` | Design brief and view-by-view content map |

All story and section links point to `#` for now.

## My story · University

`university.html` is section 2.1 (V1.01–V1.09, links `#/university/1` … `#/university/9`). Home's last view, its article and the Chapters sheet link to it.

Each view is drawn by the design canvas's own scene engine, so it matches the boards exactly:

| Path | What it is |
|---|---|
| `university.html` | The nine views, HUD, timeline, phone layout |
| `assets/js/section.js` | Views, input, theme; turns the scene into HTML (shared with Telkomsel) |
| `assets/css/university.css` | Scene covers the screen, text and cards fit inside it; phone puts the text in a sheet |
| `assets/js/canvas-diorama.js`, `assets/css/diorama.css` | Generated copy of the canvas scene engine (`project/Diorama.dc.html`) |
| `tools/sync-diorama.mjs` | Regenerates those two files after the canvas changes |

## My story · Telkomsel

`telkomsel.html` is section 2.2 (V2.01–V2.10, links `#/telkomsel/1` … `#/telkomsel/10`), built the same way from boards TK01–TK10. It shares `section.js` and `university.css`; the page picks its section with `<body data-section="telkomsel">`. University's last view, the timeline and Home's Chapters sheet link to it. Everything after Telkomsel points to `#`.

After changing the campus or the Telkomsel set on the canvas, download `project/Diorama.dc.html` and run:

```bash
node tools/sync-diorama.mjs path/to/Diorama.dc.html
```

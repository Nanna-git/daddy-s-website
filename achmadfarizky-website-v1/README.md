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
| `assets/js/board.js` | Turns a canvas scene into HTML and moves the camera between two views; used by Home and the section pages |
| `assets/js/diorama.js` | Older port of the scene library, used only by `still.js` |
| `assets/js/still.js` | SVG renderer for library thumbnails and the article illustration |
| `assets/js/data.js` | Stories (33), topics (9), career phases and sections used by the menus |
| `achmadfarizky-content/` | All written content (source of truth for the text) |
| `design/` | Design brief and view-by-view content map |

All story and section links point to `#` for now.

### Camera moves

Going to the next or previous view, the camera travels from one view's position to the other in 1.5 s (`CAMERA` in `app.js`). The old view's text stays painted in the room while the camera leaves. When it arrives, the new view's own things come in: loose things, then papers put up one by one (slightly curled, smoothed down from the top), then labels, then the text line by line (`tag()` in `board.js`, `ev-*` rules in `university.css`).

`HOME_MOVES` at the top of `app.js` has one entry per move: `'travel'`, `'travel-clear'` (the old text and papers fade out as the camera leaves, for two views of the same spot) or `'fade'` (a plain cross-fade). With reduced motion on, or on a device that cannot keep up, views cross-fade. On the first visit in a tab, Home opens with one slow step into the room.

University and Telkomsel move the same way. Each has a `moves` list in `section.js`: `'travel'` (1.5 s), `'cut'` for spots too far apart (walk, cut, walk in 1.8 s: the old picture steps forward and fades while the new one fades in and settles, without redrawing), `'crane'` for the slow rise to the last view (2.4 s) or `'fade'`. A move that a device cannot keep up with cross-fades from then on.

### The slate (between pages)

Going from one page to another plays a film slate instead of a plain page load: a clapperboard is lifted into the frame, the lights go down, the sticks clap, the next page loads behind the closed board, then the board drops away, the lights come up and the first view's text comes in. The board reads the page it is going to ("Scene 2 · Telkomsel · 2005–2009", director Achmad Farizky; Home reads "Home").

`assets/js/slate.js` is a plain script loaded at the top of `<body>` on every page; its `PAGES` list holds what the board reads and its timings are at the top. The styles are the "slate" block at the end of `site.css`. It plays on any link between the pages, always lands on the first view, and does not play on a first visit, a refresh, a direct link or the Back button. With reduced motion on, the pages fade through the paper colour.

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

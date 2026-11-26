# achmadfarizky.com

Achmad Farizky's story-telling website. It has **Home** (V01–V06), **University**, **Telkomsel**, **A year of trying**, **Ericsson**, **Kanzway** and **Learning through community**, built from the design canvas (Claude Design) in `design/` and its view map.

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

Since 2026-11-26 University 1 → 2 and 2 → 3 and every Telkomsel move are one take, with no cut: `route` walks (through the gate and up to the lab; across the lawn into the studio; on Telkomsel an arc to the rural site with `watch: true`, which keeps the camera looking at where it is going, and a backing-out slide from the meeting room to the office with `fixed: true`, which keeps it facing the walls), a `fly` from the rural site into the office, and longer `travel`s inside the office. A `route` keeps an even pace along its whole path, however far apart its points are. Ericsson 4 → 5 is a `drone` (`dronePath` in `board.js`): it turns left on the spot as it lifts off, flies an arc over the operations room through the ground points `c1`, `c2`, and spins on round to the left (about 270°) as it glides down onto view 5.

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

## My story · Kanzway

`kanzway.html` is section 2.5 (V5.01–V5.07, links `#/kanzway/1` … `#/kanzway/7`), built the same way from boards KZ01–KZ07 and the `kz` scene: one paved yard with the warehouse front on the left, the data office across the back and the goods-out dock on the right. Ericsson's last view, the timeline on every section page and Home's Chapters sheet link to it.

Its camera moves are in the `kanzway` entry of `SECTIONS` in `section.js`. The three sets stand side by side, so the camera slides from one to the next and always faces the walls:

| Move | What the camera does |
|---|---|
| 1 → 2 | `slide`: along the road, past the corner of the warehouse, then in on the data office (3.2 s) |
| 2 → 3, 3 → 4 | `travel`: along the office wall (1.5 s) |
| 4 → 5 | `slide`: back out of the office, then along the road to the dock (3.4 s) |
| 5 → 6 | `travel`: a step to the right and closer to the pallet (1.5 s) |
| 6 → 7 | `travel`: back and up over the road, to the whole yard (2.6 s) |

`slide` is a move kind added for this page (`slidePath` in `board.js`): for two views that face the same way, one of them standing further in. The camera goes sideways along the line of the view that stands further back, and in or out of the other one, with the corner rounded so it is one take.

In the `kz` scene a few things depend on where the camera stands (the two halves of the warehouse roof, and the order the office furniture is drawn in), because the engine does not sort by depth. The scene reads the camera from its own camera list, or from `pov` during a move.

## My story · Learning through community

`community.html` is section 2.6 (V6.01–V6.09, links `#/community/1` … `#/community/9`), built the same way from boards LC01–LC09 and the `lc` scene: a park lot with four places standing apart, each on its own patch of ground: the park gate, the painted park wall on its lawn, the hall (dojo, forge, locker room) and the street front. Kanzway's last view, the timeline on every section page, the slate and Home's Chapters sheet link to it. Everything after it points to `#`.

Its camera moves are in the `community` entry of `SECTIONS` in `section.js`:

| Move | What the camera does |
|---|---|
| 1 → 2 | `route`: on foot through the gate, beside Achmad, up the path and round to the park wall (5 s) |
| 2 → 3 | `slide`: back from the wall, then sideways past the lawn to the hall (4.2 s) |
| 3 → 4 | `fly`, backwards: up out of the hall, over the roof of the street building and down in front of it (3.6 s) |
| 4 → 5 | `fly`: over that roof, across the lot, down to the middle of the park wall (4.2 s) |
| 5 → 6 | `travel`: along the park wall (1.5 s) |
| 6 → 7 | `cut`: walk, cut, walk; the street is too far to walk to (1.8 s) |
| 7 → 8 | `fly`: over the roof of the street building, down in front of the locker room (3.4 s) |
| 8 → 9 | `travel`: back and up over the street building, to the whole lot (3 s) |

`route` is a move kind added for this page (`routePath` in `board.js`): a walk in one take through given points on the ground (`via`, here the gate opening and a bend of the path), so the camera can go through an opening instead of through a wall. Going back, the same path is walked backwards. It is also used on University and Telkomsel (see above).

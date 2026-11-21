# achmadfarizky.com

Achmad Farizky's story-telling website. This first build is the **Home** section (views V01–V06), built from the design canvas (Claude Design) in `design/` and its view map.

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
| `assets/js/app.js` | Views and input (wheel, keys, swipe), theme, reduced motion, menus, library, article mode |
| `assets/js/scene.js` | Three.js student's room at eye level: cameras, day/night, props in motion |
| `assets/js/diorama.js` | Scene library ported from the design canvas: every diorama's objects, colours and cameras |
| `assets/js/still.js` | SVG renderer for the same scenes: library thumbnails, article illustration, no-WebGL still |
| `assets/js/data.js` | Stories (33), topics (9), career phases and sections used by the menus |
| `assets/vendor/three/` | Three.js 0.170 (MIT) |
| `achmadfarizky-content/` | All written content (source of truth for the text) |
| `design/` | Design brief and view-by-view content map |

All story and section links point to `#` for now.

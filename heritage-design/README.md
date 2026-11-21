# Achmad Farizky portfolio: Heritage design

Chosen direction: **Heritage** (ivory #FAF6EC, forest green #1F4A3A, brass #8A6A1F / #D9B66A, Lora + Lato).

## Where it lives
- Live design canvas (private, owner only): https://claude.ai/artifact/LQVGL7kx974tKD4ycRSwhi
  - Board "V7 · Heritage" = `Heritage.dc.html` (calm and interactive: tabs, gallery, no scroll story)
  - Board "V9 · Heritage Motion" = `HeritageMotion.dc.html` (V7 + dad's requests)
  - Other boards V1–V6, V8 are alternative themes (V3 Editorial also liked; V8 Cinematic Story = Rockstar/Apple-style dark).
- Local copies in this folder: `V7-Heritage.dc.html`, `V9-HeritageMotion.dc.html`
  (files are Design Component `.dc.html` sources, not plain HTML; they need the canvas runtime `support.js` to render, so edit them through the artifact).

## Dad's feature list (the brief for V9)
Animated, graphics, storytelling, graphic motion, stickman motion, 3D effects and motions. Inspiration: apple.com, rockstargames.com.

## V9 features
- Hero: 3D layered dashboard rig that follows the mouse, spinning cube.
- Scroll story: walking detailed faceless stickman along a career road (4 chapters), click to jump.
- Corner "narrator" stickman: pushes the intro up, points along the story, pulls the Catalog chapter up with a rope (CSS scroll-driven animations, needs recent Chrome/Edge/Safari).
- Experience tabs with 3D flip, 3D project carousel, orbiting skill chips, seated typing stickman, waving stickman in contact, copy-email button.

## Content source
Taken from https://achmad-farizky-8rkrhqd.gamma.site (education not listed there). Email achmadfarizky@gmail.com, LinkedIn linkedin.com/in/achmad-farizky.
All dashboard previews are redrawn illustrations, not real screenshots; real screenshots/photo were never supplied.

## Known caveats
- Never visually verified in a browser; scroll timing assumes a ~800px-tall window.
- Root wrapper uses `overflow:clip` (not hidden) so sticky + scroll-driven animations work.

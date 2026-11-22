// My story sections (2.1 University, 2.2 Telkomsel). Each view is the canvas board: the scene
// drawn by the canvas engine (canvas-diorama.js) at 1440 × 900, plus that board's overlay.
// The page picks its section with <body data-section="…">.
import { sceneHTML, cameraMove, viaMove, povOf, warm } from './board.js';

// cam / uv / ut are copied from the boards U01…U11 and TK01…TK10 (ut = the text painted into the scene).
// moves: how the camera gets from each view to the next one:
//   'travel'  it really goes there (1.5 s); the old view's text stays where it is
//   'cut'     walk, cut, walk: for spots too far apart (1.8 s). The two pictures are moved, not redrawn:
//             the old one steps forward and fades, the new one fades in and settles (university.css)
//   'crane'   a slow rise to a view from above (2.4 s)
//   'fade'    a plain cross-fade
//   { kind: 'via', turn, walk, via, dur }  turn ('left' / 'right'), walk `walk` units, cut, then walk the last
//             stretch to the view, starting where view number via + 1 stands (or a little before the view).
//             Going back the other way it turns the short way and starts a little before the view.
const DURATION = { travel: 1500, cut: 1800, crane: 2400 };
const SECTIONS = {
  // 2→3: turn left towards the studio, walk a little, cut to where view 6 stands, walk on to view 3
  university: { scene: 'uni', moves: ['travel', { kind: 'via', turn: 'left', walk: 6, via: 5, dur: 3000 }, 'travel', 'travel', 'travel', 'travel', 'travel', 'crane'], views: [
  { cam: 'u1', uv: 1, ut: '1. University: an engineer|who loved design (2000–2005)||In 2000, I started studying Telecommunication Engineering at Telkom University in Bandung, Indonesia. (Back then, it was called Sekolah Tinggi Teknologi Telkom, or STT Telkom.)' },
  { cam: 'u2', uv: 2, ut: 'My classes were real engineering stuff: switching techniques, traffic engineering, transmission lines, antenna and propagation, digital signal processing, and optical and satellite communication systems.||There was a lot of calculus, physics and lab work, and I enjoyed it. Programming was only a small part: one introduction to computers and one programming lab.' },
  { cam: 'u3', uv: 3, ut: 'But outside the classroom, I spent a lot of my time on something else: design. I taught myself Adobe Photoshop and CorelDraw, then web design with HTML, CSS and JavaScript, and animation with Macromedia Flash.||Nobody asked me to. I just liked making things look good.' },
  { cam: 'u4', uv: 4, ut: 'I had a friend, Jockie Heruseon, who was much better than me at networking. He always knew where the opportunities were. So we teamed up: he found them, and I did the design work.||We joined web design competitions, and we got projects to design the university\'s yearly academic book and the university calendar. Together, we learned how the real world works, long before we graduated.' },
  { cam: 'u5', uv: 5, ut: 'I also had a best "art friend" on campus, Fakhrudin. He was a famous animator and designer among the students, and we pushed each other to make better work. Years later, when I made animated SVG visuals in Power BI, it took me straight back to those Flash days.' },
  { cam: 'u6t', uv: 6, ut: '' },
  { cam: 'u7t', uv: 7, ut: '' },
  { cam: 'u9', uv: 9, ut: "A moment I'm proud of||Getting paid, as a student, to design my own university's calendar and its academic book. Those were my first real design clients." },
  { cam: 'u11', uv: 11, ut: '' },
  ] },
  // 1→2: turn left until the rural site is in view, cut, walk in. 2→3: turn right, walk on for a while, cut to
  // some way back from the desk, walk in on it. 5→6 (Thread 1 → Thread 2): a quicker glide across the floor.
  telkomsel: { scene: 'tsel', moves: [{ kind: 'via', turn: 'left', walk: 0, dur: 3000 }, { kind: 'via', turn: 'right', walk: 20, back: 14, dolly: true, dur: 3400 }, 'travel', 'travel', { kind: 'travel', dur: 1100 }, 'cut', 'travel', 'travel', 'crane'], views: [
  { cam: 't1', uv: 1, ut: "2. Telkomsel: the desk guy|who discovered data (2005–2009)||After graduating in 2005, I joined Telkomsel, Indonesia's biggest mobile operator, as a radio network engineer in operations and network performance, first in Medan and later in Jakarta." },
  { cam: 't2', uv: 2, ut: 'Honestly, I was a bit jealous in my first years. My colleagues travelled for technical training and went to the field with drive test tools. I stayed at my desk with spreadsheets.||One night I begged to join them, and they sent me to a rural site at 2 AM just to make a test call. I was so happy, like a kid in an amusement park.' },
  { cam: 't3', uv: 3, ut: 'At my desk, I started doing more than delivering numbers. I learned UNIX scripting by myself and used it to build small automations for our daily work. I used my old web skills to build a web dashboard for network performance. Then I combined Google Earth with UNIX scripts to build a live GIS view of our 2G radio network, so management could see how the network was running from their own workstations.' },
  { cam: 't4', uv: 4, ut: 'In my last year, my manager, Akhmad Madces, brought me into a big data warehouse project. We collected network performance data from all our equipment vendors (Ericsson, Siemens, Nokia, Huawei and more) into one place, and built the dashboards and reports on top of it with Pentaho. I had two great mentors on that project: Reza Lesmana, a solution architect at Nokia, and Feris Thia, CEO of Pentaho Indonesia. It was my first time learning what a data warehouse is, and I still use those concepts today.' },
  { cam: 't5', uv: 5, ut: "Thread 1 again.||Very few people around me knew even a little programming. That small skill made me useful in a way I didn't expect." },
  { cam: 't6', uv: 6, ut: 'Thread 2 again.||My team leaders, Petrus Sila and Sorpa EA Togatorop, kept me at my desk with Excel. At the time I didn\'t understand why. Later I realized they saw where my work created real value before I did. I wasn\'t just their "calculator guy." I was helping guide their decisions.' },
  { cam: 't7', uv: 7, ut: 'Thread 3, for the first time.||Google Earth and a few scripts became a live monitoring tool. No big budget, just tools we already had.' },
  { cam: 't8', uv: 8, ut: "A moment I'm proud of||In 2009, after the earthquake in West Sumatra, my GIS live monitoring tool was used during the network recovery. I received official appreciation from the company's directors and VPs. I was also named best employee of the service quality assurance team in 2007." },
  { cam: 't9', uv: 9, ut: '' },
  { cam: 't10', uv: 10, ut: '' },
  ] },
};
const SLUG = document.body.dataset.section;
const { scene: SCENE, views: VIEWS, moves: MOVES } = SECTIONS[SLUG];
const TOTAL = VIEWS.length;

const root = document.documentElement;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};
const phoneQuery = matchMedia('(max-width: 819px)');
const isDark = () => root.dataset.theme === 'dark';
const reduced = () => root.classList.contains('reduce-motion');

/* ================================================================ drawing the views */
const views = $$('.u-view');
const drawn = new Map(); // view index → theme it was drawn in
const viewProps = (i) => { const v = VIEWS[i]; return { scene: SCENE, cam: v.cam, side: 'center', nofog: 'true', uv: v.uv, ut: v.ut, dark: isDark(), w: 1440, h: 900 }; };
function draw(i) {
  if (i < 0 || i >= TOTAL) return;
  const mode = isDark() ? 'dark' : 'light';
  if (drawn.get(i) === mode) return;
  $('.u-board', views[i]).innerHTML = sceneHTML(viewProps(i));
  $$('.u-thumb', views[i]).forEach((el) => { el.innerHTML = sceneHTML({ scene: el.dataset.scene, cam: el.dataset.cam, dark: el.dataset.dark ? true : isDark(), w: +el.dataset.w || 284, h: +el.dataset.h || 124, inset: false }); });
  drawn.set(i, mode);
}

// The scene covers its box (like a background photo); the overlay is fitted inside the
// viewport so its text is never cut off. Both use the board's 1440 × 900 coordinates.
function fit() {
  const sc = $('.u-scene', views[0]);
  const w = sc.clientWidth, h = sc.clientHeight;
  root.style.setProperty('--cover', Math.max(w / 1440, h / 900));
  root.style.setProperty('--contain', Math.min(window.innerWidth / 1440, window.innerHeight / 900));
}
window.addEventListener('resize', fit);

/* ================================================================ theme / reduced motion */
function applyTheme(theme, save) {
  root.dataset.theme = theme;
  $$('[data-theme-set]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.themeSet === theme)));
  $$('[data-theme-toggle]').forEach((b) => {
    b.setAttribute('aria-label', theme === 'dark' ? 'Switch to day' : 'Switch to night');
    $('use', b).setAttribute('href', theme === 'dark' ? '#i-sun' : '#i-moon');
  });
  $('meta[name="theme-color"]').setAttribute('content', theme === 'dark' ? '#0B1222' : '#F4F1EA');
  if (save) store.set('theme', theme);
  [active - 1, active, active + 1].forEach(draw);
}
$$('[data-theme-set]').forEach((b) => b.addEventListener('click', () => applyTheme(b.dataset.themeSet, true)));
$$('[data-theme-toggle]').forEach((b) => b.addEventListener('click', () => applyTheme(isDark() ? 'light' : 'dark', true)));
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => { if (!store.get('theme')) applyTheme(e.matches ? 'dark' : 'light'); });

/* ================================================================ moving between views */
const circ = 2 * Math.PI * 26;
let active = -1, lockUntil = 0;
function setActive(i, { focus = false } = {}) {
  i = Math.max(0, Math.min(TOTAL - 1, i));
  if (i === active) return;
  const prev = active;
  active = i;
  draw(i);
  views.forEach((v, k) => {
    const on = k === i;
    v.classList.toggle('is-active', on);
    v.toggleAttribute('inert', !on);
    v.setAttribute('aria-hidden', String(!on));
  });
  $$('[data-idx]').forEach((el) => (el.textContent = i + 1));
  $('#dial').setAttribute('aria-label', `View ${i + 1} of ${TOTAL}`);
  $('.dial-fill').style.strokeDasharray = `${(circ * (i + 1) / TOTAL).toFixed(1)} 999`;
  $$('.phone-dots span').forEach((d, k) => d.classList.toggle('on', k === i));
  const last = i === TOTAL - 1;
  $('[data-phone-next]').hidden = last;
  $('[data-phone-section]').hidden = !last;
  if (prev >= 0) $('#announce').textContent = `View ${i + 1} of ${TOTAL}`;
  const hash = `#/${SLUG}/${i + 1}`;
  if (location.hash !== hash) history.replaceState(null, '', hash);
  if (phoneQuery.matches) $('#views').scrollTop = 0;
  // draw the neighbours once this view is up, so the next move is instant
  setTimeout(() => {
    if (root.classList.contains('is-moving')) return;
    draw(i + 1); draw(i - 1);
    if (!reduced()) [i, i + 1, i - 1].forEach((k) => { if (k >= 0 && k < TOTAL) warm(viewProps(k)); }); // so a move starts on time
  }, reduced() ? 0 : 700);
  if (focus) {
    const t = $('h1, h2, h3, .u-copy', views[i]);
    if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1');
    setTimeout(() => t.focus({ preventScroll: true }), reduced() ? 0 : 650);
  }
}
function step(dir, opts) {
  const now = performance.now();
  if (now < lockUntil) return;
  const next = active + dir;
  if (next < 0 || next >= TOTAL) return;
  const pair = Math.min(active, next), move = typeof MOVES[pair] === 'string' ? { kind: MOVES[pair] } : MOVES[pair];
  if (!reduced() && !heavy.has(pair) && heavy.size < 2 && move.kind !== 'fade') { moveTo(next, opts, move, pair); return; }
  lockUntil = now + (reduced() ? 250 : 1050);
  setActive(next, opts);
}

// Camera move to a neighbouring view. It plays inside the old view, then the next view takes over at
// the same camera and its text comes in line by line.
const heavy = new Set(); // moves this device could not keep up with: they cross-fade from then on (all of them after two)
function moveTo(next, opts, move, pair) {
  const prev = active, kind = move.kind, dur = move.dur || DURATION[kind];
  lockUntil = performance.now() + dur + 200;
  root.classList.add('is-moving'); // the laid-over text, cards and the Next link fade out
  const arrive = () => {
    drawn.delete(next);
    draw(next); // also its story pictures
    $('.u-board', views[next]).innerHTML = sceneHTML({ ...viewProps(next), enter: true });
    setActive(next, opts);
    views[next].getBoundingClientRect(); // the views swap at once, then the laid-over text fades in
    root.classList.remove('is-moving');
  };
  if (kind === 'cut') {
    // walk, cut, walk without redrawing: the old picture steps forward and fades, the new one fades in and settles
    $('.u-board', views[next]).innerHTML = sceneHTML({ ...viewProps(next), evo: 0 }); // its words come in on arrival
    views[prev].classList.add('cut-out'); views[next].classList.add('cut-in');
    setTimeout(() => { arrive(); views[prev].classList.remove('cut-out'); views[next].classList.remove('cut-in'); }, dur);
    return;
  }
  const board = $('.u-board', views[prev]), a = viewProps(prev), b = viewProps(next);
  const forward = next > prev; // the turn hand and the cut-in spot are written for going forward
  const playing = kind === 'via'
    ? viaMove(board, a, b, forward ? { ...move, viaEye: move.via == null ? null : povOf(viewProps(move.via)).eye } : { walk: move.walk }, dur)
    : cameraMove(board, a, b, 'travel', dur);
  playing.then((smooth) => {
    if (!smooth) heavy.add(pair);
    drawn.delete(prev); // the old board is left at the new camera; it is redrawn as a neighbour
    arrive();
  });
}
$$('[data-next]').forEach((b) => b.addEventListener('click', () => step(1, { focus: true })));

let wheelSum = 0, wheelTimer = 0;
window.addEventListener('wheel', (e) => {
  if (phoneQuery.matches) return;
  e.preventDefault();
  if (performance.now() < lockUntil) { wheelSum = 0; return; }
  wheelSum += e.deltaY;
  clearTimeout(wheelTimer);
  wheelTimer = setTimeout(() => (wheelSum = 0), 200);
  if (Math.abs(wheelSum) >= 60) { step(wheelSum > 0 ? 1 : -1); wheelSum = 0; }
}, { passive: false });

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeHudMenu(); return; }
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  const onControl = e.target.closest('button, a, [role="button"]');
  switch (e.key) {
    case 'ArrowDown': case 'ArrowRight': case 'PageDown': e.preventDefault(); step(1, { focus: true }); break;
    case ' ': if (onControl) return; e.preventDefault(); step(e.shiftKey ? -1 : 1, { focus: true }); break;
    case 'Enter': if (onControl) return; e.preventDefault(); if (active === TOTAL - 1) $('a.next-link', views[active]).click(); else step(1, { focus: true }); break;
    case 'ArrowUp': case 'ArrowLeft': case 'PageUp': e.preventDefault(); step(-1, { focus: true }); break;
    case 'Home': e.preventDefault(); lockUntil = 0; setActive(0, { focus: true }); break;
    case 'End': e.preventDefault(); lockUntil = 0; setActive(TOTAL - 1, { focus: true }); break;
  }
});

let touch = null;
document.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) touch = { y: e.touches[0].clientY, x: e.touches[0].clientX, t: performance.now(), top: $('#views').scrollTop };
}, { passive: true });
document.addEventListener('touchend', (e) => {
  if (!touch) return;
  const p = e.changedTouches[0], dy = touch.y - p.clientY, dx = touch.x - p.clientX, dt = performance.now() - touch.t, st = touch;
  touch = null;
  if (Math.abs(dy) < 40 || Math.abs(dy) < Math.abs(dx) || Math.abs(dy) / dt < 0.3) return;
  const sheet = $('#views');
  if (phoneQuery.matches && e.target.closest('#views')) {
    const atEnd = sheet.scrollTop + sheet.clientHeight >= sheet.scrollHeight - 2;
    if ((dy > 0 && !atEnd) || (dy < 0 && !(st.top <= 0 && sheet.scrollTop <= 0))) return;
  }
  step(dy > 0 ? 1 : -1);
}, { passive: true });

/* ================================================================ HUD menu */
const hudMenu = $('#hud-menu'), hudBtn = $('.hud-menu-btn');
function closeHudMenu() { hudMenu.classList.remove('is-open'); hudBtn.setAttribute('aria-expanded', 'false'); }
hudBtn.addEventListener('click', () => {
  const open = !hudMenu.classList.contains('is-open');
  hudMenu.classList.toggle('is-open', open);
  hudBtn.setAttribute('aria-expanded', String(open));
});
document.addEventListener('pointerdown', (e) => { if (!hudMenu.contains(e.target)) closeHudMenu(); });

/* ================================================================ start */
const viewHash = new RegExp(`^#/${SLUG}/(\\d+)$`);
const fromHash = () => { const m = viewHash.exec(location.hash); return m ? Math.min(TOTAL, Math.max(1, +m[1])) - 1 : 0; };
window.addEventListener('hashchange', () => { if (viewHash.test(location.hash)) { lockUntil = 0; setActive(fromHash()); } });
// links to pages that don't exist yet point to '#': stay on this view
document.addEventListener('click', (e) => { if (e.target.closest('a[href="#"]')) e.preventDefault(); });
const start = fromHash();
fit();
active = start; // so applyTheme draws the right views
applyTheme(root.dataset.theme);
active = -1;
setActive(start);
// Arriving behind the slate (slate.js): as the board drops away, this view's text comes in.
const slate = window.Slate;
if (slate?.arriving && !reduced()) root.classList.add('is-moving');
slate?.land(() => {
  if (!root.classList.contains('is-moving')) return;
  $('.u-board', views[active]).innerHTML = sceneHTML({ ...viewProps(active), enter: true });
  root.classList.remove('is-moving');
});
requestAnimationFrame(() => root.classList.add('u-ready'));

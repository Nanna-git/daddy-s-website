import { TOPICS, STORIES, PHASES, MORE, TOC } from './data.js';
import { renderDiorama } from './still.js';

// Camera per Home view (same names as the design boards and scene.js).
const HOME_CAMS = ['pov', 'povShelfR', 'povWindow', 'povLaptop', 'povBoard', 'povLamp'];
// Scene view → article section (V02 and V03 share one article section).
const ART_FOR_VIEW = ['a-home-1', 'a-home-2', 'a-home-2', 'a-home-3', 'a-home-4', 'a-home-5'];

const root = document.documentElement;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};
const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
const darkQuery = matchMedia('(prefers-color-scheme: dark)');
const phoneQuery = matchMedia('(max-width: 819px)');
const isDark = () => root.dataset.theme === 'dark';
const reduced = () => root.classList.contains('reduce-motion');

const sceneMode = $('#scene-mode');
const viewsEl = $('#views');
const views = $$('.view', viewsEl);
const threadsLeft = $('#threads-left');
const TOTAL = views.length;
let active = -1;
let lockUntil = 0;
let scene = null;

/* ================================================================ theme */
function applyTheme(theme, { save = false, instant = false } = {}) {
  root.dataset.theme = theme;
  $$('[data-theme-set]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.themeSet === theme)));
  $$('[data-theme-toggle]').forEach((b) => {
    b.setAttribute('aria-label', theme === 'dark' ? 'Switch to day' : 'Switch to night');
    $('use', b).setAttribute('href', theme === 'dark' ? '#i-sun' : '#i-moon');
  });
  $('meta[name="theme-color"]').setAttribute('content', theme === 'dark' ? '#0B1222' : '#F4F1EA');
  if (save) store.set('theme', theme);
  scene?.setNight(theme === 'dark', instant || reduced());
  refreshDrawings();
}
$$('[data-theme-set]').forEach((b) => b.addEventListener('click', () => applyTheme(b.dataset.themeSet, { save: true })));
$$('[data-theme-toggle]').forEach((b) => b.addEventListener('click', () => applyTheme(isDark() ? 'light' : 'dark', { save: true })));
darkQuery.addEventListener('change', (e) => { if (!store.get('theme')) applyTheme(e.matches ? 'dark' : 'light'); });

/* ================================================================ reduced motion */
function applyReduce(on, { save = false } = {}) {
  root.classList.toggle('reduce-motion', on);
  $('#reduce-toggle').checked = on;
  if (save) store.set('af-reduce', on ? '1' : '0');
  scene?.setReducedMotion(on);
}
$('#reduce-toggle').addEventListener('change', (e) => applyReduce(e.target.checked, { save: true }));
motionQuery.addEventListener('change', (e) => { if (store.get('af-reduce') === null) applyReduce(e.matches); });

/* ================================================================ scene ⇄ article */
function applyMode(mode, { save = false } = {}) {
  root.dataset.mode = mode;
  $$('[data-mode-set]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.modeSet === mode)));
  if (save) store.set('af-mode', mode);
  if (mode === 'article') {
    renderArticleStill();
    const target = document.getElementById(ART_FOR_VIEW[Math.max(0, active)]);
    requestAnimationFrame(() => { if (active > 0) target?.scrollIntoView({ block: 'start' }); else window.scrollTo(0, 0); });
  } else {
    window.scrollTo(0, 0);
    initScene();
  }
}
$$('[data-mode-set]').forEach((b) => b.addEventListener('click', () => { closeHudMenu(); applyMode(b.dataset.modeSet, { save: true }); }));

/* ================================================================ views */
const circ = 2 * Math.PI * 26;
const announce = $('#announce');

function setActive(i, { focus = false, instant = false } = {}) {
  i = Math.max(0, Math.min(TOTAL - 1, i));
  if (i === active) return;
  const prev = active;
  active = i;
  views.forEach((v, k) => {
    const on = k === i;
    v.classList.toggle('is-active', on);
    v.toggleAttribute('inert', !on);
    v.setAttribute('aria-hidden', String(!on));
  });
  const threads = i >= 3;
  threadsLeft.classList.toggle('is-held', threads && prev >= 3);
  threadsLeft.classList.toggle('is-active', threads);
  threadsLeft.classList.toggle('is-first', i === 3);
  threadsLeft.toggleAttribute('inert', !threads);
  const last = i === TOTAL - 1;
  $('[data-next-threads]').hidden = last;
  $('[data-next-section]').hidden = !last;
  $('[data-phone-next]').hidden = last;
  $('[data-phone-section]').hidden = !last;

  sceneMode.dataset.scrim = i < 3 ? 'side' : 'full';
  $$('[data-idx]').forEach((el) => (el.textContent = i + 1));
  $('#dial').setAttribute('aria-label', `View ${i + 1} of ${TOTAL}`);
  $('.dial-fill').style.strokeDasharray = `${(circ * (i + 1) / TOTAL).toFixed(1)} 999`;
  $$('.phone-dots span').forEach((d, k) => d.classList.toggle('on', k === i));
  if (prev >= 0) announce.textContent = `View ${i + 1} of ${TOTAL}`;
  const hash = `#/home/${i + 1}`;
  if (location.hash !== hash) history.replaceState(null, '', hash);

  if (scene) {
    if (reduced() && prev >= 0) { root.classList.add('cam-cut'); setTimeout(() => root.classList.remove('cam-cut'), 110); }
    scene.goTo(i, instant);
  }
  if (root.classList.contains('no-webgl')) renderSceneStill();
  if (phoneQuery.matches) viewsEl.scrollTop = 0;
  if (focus) {
    const h = views[i].querySelector('h1, h2, h3') || (i >= 3 ? $('#threads-title') : null);
    const target = h || views[i];
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    setTimeout(() => target.focus({ preventScroll: true }), reduced() ? 0 : 650);
  }
}

function step(dir, opts = {}) {
  const now = performance.now();
  if (now < lockUntil) return; // inputs during a move are ignored
  const next = active + dir;
  if (next < 0 || next >= TOTAL) return;
  lockUntil = now + (reduced() ? 250 : 900 + 150);
  setActive(next, opts);
}

$$('[data-next]').forEach((b) => b.addEventListener('click', () => step(1, { focus: true })));

// Wheel / trackpad: one step per 60 px, then locked until the move ends + 150 ms.
let wheelSum = 0, wheelTimer = 0;
window.addEventListener('wheel', (e) => {
  if (root.dataset.mode !== 'scene' || overlayOpen() || phoneQuery.matches) return;
  e.preventDefault();
  if (performance.now() < lockUntil) { wheelSum = 0; return; }
  wheelSum += e.deltaY;
  clearTimeout(wheelTimer);
  wheelTimer = setTimeout(() => (wheelSum = 0), 200);
  if (Math.abs(wheelSum) >= 60) { step(wheelSum > 0 ? 1 : -1); wheelSum = 0; }
}, { passive: false });

// Keys: ↓ → Space PageDown Enter = next · ↑ ← PageUp = previous · Home/End · Esc closes menus.
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { if (closeLibrary() || closeChapters() || closeHudMenu()) e.preventDefault(); return; }
  if (root.dataset.mode !== 'scene' || overlayOpen() || e.altKey || e.ctrlKey || e.metaKey) return;
  const t = e.target;
  if (t.closest('input, textarea, select, [contenteditable="true"]')) return;
  const onControl = t.closest('button, a, [role="button"]');
  switch (e.key) {
    case 'ArrowDown': case 'ArrowRight': case 'PageDown': e.preventDefault(); step(1, { focus: true }); break;
    case ' ': if (onControl) return; e.preventDefault(); step(e.shiftKey ? -1 : 1, { focus: true }); break;
    case 'Enter': if (onControl) return; e.preventDefault(); step(1, { focus: true }); break;
    case 'ArrowUp': case 'ArrowLeft': case 'PageUp': e.preventDefault(); step(-1, { focus: true }); break;
    case 'Home': e.preventDefault(); lockUntil = 0; setActive(0, { focus: true }); break;
    case 'End': e.preventDefault(); lockUntil = 0; setActive(TOTAL - 1, { focus: true }); break;
  }
});

// Swipe: vertical ≥ 40 px and ≥ 0.3 px/ms. Inside the phone sheet, only at its scroll end.
let touch = null;
sceneMode.addEventListener('touchstart', (e) => {
  if (e.touches.length !== 1) return;
  touch = { y: e.touches[0].clientY, x: e.touches[0].clientX, t: performance.now(), top: viewsEl.scrollTop };
}, { passive: true });
sceneMode.addEventListener('touchend', (e) => {
  if (!touch || overlayOpen()) return;
  const p = e.changedTouches[0], dy = touch.y - p.clientY, dx = touch.x - p.clientX, dt = performance.now() - touch.t;
  const st = touch; touch = null;
  if (Math.abs(dy) < 40 || Math.abs(dy) < Math.abs(dx) || Math.abs(dy) / dt < 0.3) return;
  if (phoneQuery.matches && e.target.closest('#views')) {
    const atEnd = viewsEl.scrollTop + viewsEl.clientHeight >= viewsEl.scrollHeight - 2;
    const atTop = st.top <= 0 && viewsEl.scrollTop <= 0;
    if ((dy > 0 && !atEnd) || (dy < 0 && !atTop)) return;
  }
  step(dy > 0 ? 1 : -1);
}, { passive: true });

/* ================================================================ HUD menu (hover or tap) */
const hudMenu = $('#hud-menu');
const hudBtn = $('.hud-menu-btn');
function closeHudMenu() {
  if (!hudMenu.classList.contains('is-open')) return false;
  hudMenu.classList.remove('is-open'); hudBtn.setAttribute('aria-expanded', 'false');
  return true;
}
hudBtn.addEventListener('click', () => {
  const open = !hudMenu.classList.contains('is-open');
  hudMenu.classList.toggle('is-open', open);
  hudBtn.setAttribute('aria-expanded', String(open));
  if (open) $('.hud-menu-items button', hudMenu).focus();
});
document.addEventListener('pointerdown', (e) => { if (!hudMenu.contains(e.target)) closeHudMenu(); });

/* ================================================================ dialogs: shared focus handling */
let lastFocus = null;
function trapFocus(container, e) {
  if (e.key !== 'Tab') return;
  const f = $$('a[href], button:not([disabled]), input:not([disabled])', container).filter((el) => el.offsetParent !== null && !el.closest('[hidden]'));
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
const overlayOpen = () => !$('#chapters').hidden || !$('#library').hidden;
function setBackgroundInert(on) {
  [sceneMode, $('#article-mode')].forEach((el) => el.toggleAttribute('inert', on));
}

/* ================================================================ Chapters sheet */
const chapters = $('#chapters');
$('#phase-list').innerHTML = PHASES.map((p) =>
  `<a class="phase-row" href="#"><span class="phase-dot" aria-hidden="true"></span><span class="phase-name">${esc(p.name)}</span><span class="phase-years">${p.years}</span></a>`).join('');
$('#more-grid').innerHTML = MORE.map((m) => `<a href="#">${esc(m.name)}</a>`).join('');

function openChapters() {
  closeHudMenu();
  lastFocus = document.activeElement;
  chapters.hidden = false;
  chapters.classList.remove('is-closing');
  setBackgroundInert(true);
  $('.chapters-sheet [data-close-chapters]').focus();
}
function closeChapters({ restore = true } = {}) {
  if (chapters.hidden) return false;
  setBackgroundInert(false);
  const done = () => { chapters.hidden = true; chapters.classList.remove('is-closing'); };
  if (reduced()) done(); else { chapters.classList.add('is-closing'); setTimeout(done, 240); }
  if (restore) lastFocus?.focus?.({ preventScroll: true });
  return true;
}
$$('[data-open-chapters]').forEach((b) => b.addEventListener('click', openChapters));
$$('[data-close-chapters]').forEach((b) => b.addEventListener('click', () => closeChapters()));
chapters.addEventListener('keydown', (e) => trapFocus($('.chapters-sheet'), e));
chapters.addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if (!a) return;
  if (a.matches('[data-home-link]')) {
    e.preventDefault(); closeChapters({ restore: false });
    if (root.dataset.mode === 'article') { document.getElementById('a-home-1').scrollIntoView(); return; }
    lockUntil = 0; setActive(0, { focus: true });
  } else if (a.matches('[data-mode-link]')) {
    e.preventDefault(); closeChapters({ restore: false }); applyMode('article', { save: true });
  } else closeChapters({ restore: false }); // sections and phases: '#' for now
});
$('[data-open-library]').addEventListener('click', () => { closeChapters({ restore: false }); openLibrary(); });

/* ================================================================ Story library */
const library = $('#library');
const libGrid = $('#lib-grid');
const libMore = $('#lib-more');
const libState = { topic: 'all', all: false };
$('#lib-chips').innerHTML = [{ id: 'all', name: 'All' }, ...TOPICS].map((t) =>
  `<button type="button" class="topic-chip" data-topic="${t.id}" aria-pressed="${t.id === 'all'}">${esc(t.name)}</button>`).join('');

const thumbObserver = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { drawThumb(en.target); thumbObserver.unobserve(en.target); } });
}, { root: library, rootMargin: '200px' }) : null;
function drawThumb(el) {
  el.innerHTML = renderDiorama({ scene: el.dataset.scene, cam: el.dataset.cam, dark: isDark(), w: 306, h: 170, inset: false, decorative: true });
  el.dataset.drawn = isDark() ? 'dark' : 'light';
}
function renderLibrary() {
  const list = STORIES.filter((s) => libState.topic === 'all' || s.topics.includes(libState.topic));
  const shown = libState.all || libState.topic !== 'all' ? list : list.slice(0, 12);
  libGrid.innerHTML = shown.length ? shown.map((s, n) => `
    <a class="story-card" href="${s.href}" style="--n:${n % 12}">
      <div class="story-thumb" data-scene="${s.scene}" data-cam="${s.cam}"></div>
      <div class="story-body">
        <div class="story-chips"><span>${esc(s.chip)}</span><span>${s.views} views</span></div>
        <strong class="story-title">${esc(s.title)}</strong>
      </div>
    </a>`).join('') : '<p class="lib-empty">0 stories</p>';
  libMore.hidden = shown.length >= list.length;
  $$('.topic-chip').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.topic === libState.topic)));
  $$('.story-thumb', libGrid).forEach((el) => (thumbObserver ? thumbObserver.observe(el) : drawThumb(el)));
}
$('#lib-chips').addEventListener('click', (e) => {
  const b = e.target.closest('.topic-chip'); if (!b) return;
  libState.topic = b.dataset.topic; renderLibrary();
});
libMore.addEventListener('click', () => { libState.all = true; renderLibrary(); });
function drawLibraryHero() {
  $('#lib-hero-scene').innerHTML = renderDiorama({ scene: 'library', cam: 'wide', side: 'right', dark: isDark(), w: 1440, h: 340, inset: false });
}
function openLibrary() {
  lastFocus = lastFocus || document.activeElement;
  library.hidden = false;
  library.scrollTop = 0;
  setBackgroundInert(true);
  drawLibraryHero();
  renderLibrary();
  $('[data-close-library]').focus();
}
function closeLibrary() {
  if (library.hidden) return false;
  library.hidden = true;
  setBackgroundInert(false);
  lastFocus?.focus?.({ preventScroll: true });
  lastFocus = null;
  return true;
}
$('[data-close-library]').addEventListener('click', closeLibrary);
library.addEventListener('keydown', (e) => trapFocus(library, e));

/* ================================================================ Article mode */
$('#art-toc').innerHTML = TOC.map((t) =>
  `<li><a href="${t.id === 'home' ? '#a-home-1' : '#'}"${t.id === 'home' ? ' aria-current="true"' : ''}>${esc(t.name)}</a></li>`).join('');
function renderArticleStill() {
  $('#art-still').innerHTML = renderDiorama({ scene: 'room', cam: 'wide', dark: isDark(), w: 700, h: 220, inset: false });
}

/* ================================================================ drawings that follow the theme */
function refreshDrawings() {
  if (root.dataset.mode === 'article') renderArticleStill();
  if (!library.hidden) {
    drawLibraryHero();
    const mode = isDark() ? 'dark' : 'light';
    $$('.story-thumb[data-drawn]', libGrid).forEach((el) => { if (el.dataset.drawn !== mode) drawThumb(el); });
  }
  if (root.classList.contains('no-webgl')) renderSceneStill();
}

/* ================================================================ 3D scene / still fallback */
function renderSceneStill() {
  if (active < 0) return;
  const phone = phoneQuery.matches;
  const w = window.innerWidth, h = phone ? Math.round(window.innerHeight * 0.44) : window.innerHeight;
  const svg = renderDiorama({ scene: 'room', cam: HOME_CAMS[active], dark: isDark(), w, h, off: phone ? 0 : undefined, decorative: true });
  $('#still').innerHTML = svg;
}
function toStill() {
  root.classList.add('no-webgl');
  scene?.dispose?.(); scene = null;
  renderSceneStill();
}
function webgl2() {
  try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; }
}
let sceneLoading = false;
async function initScene() {
  if (scene || sceneLoading || root.dataset.mode !== 'scene' || root.classList.contains('no-webgl')) return;
  if (!webgl2()) { toStill(); return; }
  sceneLoading = true;
  const slow = setTimeout(() => { if (!scene) toStill(); }, 4000); // first frame must come within 4 s
  try {
    const { createScene } = await import('./scene.js');
    if (root.classList.contains('no-webgl')) return;
    scene = createScene($('#scene-canvas'), { reducedMotion: reduced(), onLost: toStill, startView: Math.max(0, active) });
    scene.setNight(isDark(), true);
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('scene-ready')));
  } catch (err) {
    console.warn('3D scene unavailable; showing the still illustration.', err);
    toStill();
  } finally {
    clearTimeout(slow);
    sceneLoading = false;
  }
}
window.addEventListener('resize', () => { if (root.classList.contains('no-webgl')) renderSceneStill(); });

/* ================================================================ start */
const m = /^#\/home\/(\d)$/.exec(location.hash);
const start = m ? Math.min(TOTAL, Math.max(1, +m[1])) - 1 : 0;
applyTheme(root.dataset.theme, { instant: true });
applyReduce(root.classList.contains('reduce-motion'));
if (start === 0 && !reduced()) {
  root.classList.add('intro-pending', 'is-intro');
  setTimeout(() => root.classList.remove('intro-pending'), 30);
  setTimeout(() => root.classList.remove('is-intro'), 2600);
}
setActive(start, { instant: true });
applyMode(root.dataset.mode === 'article' ? 'article' : 'scene');

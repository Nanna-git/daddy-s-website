// My story · 2.1 University (V1.01–V1.09). Each view is the canvas board: the campus scene
// drawn by the canvas engine (canvas-diorama.js) at 1440 × 900, plus that board's overlay.
import { CanvasDiorama } from './canvas-diorama.js';

// cam / uv / ut are copied from the boards U01…U11 (ut = the text painted into the scene).
const VIEWS = [
  { cam: 'u1', uv: 1, ut: '1. University: an engineer|who loved design (2000–2005)||In 2000, I started studying Telecommunication Engineering at Telkom University in Bandung, Indonesia. (Back then, it was called Sekolah Tinggi Teknologi Telkom, or STT Telkom.)' },
  { cam: 'u2', uv: 2, ut: 'My classes were real engineering stuff: switching techniques, traffic engineering, transmission lines, antenna and propagation, digital signal processing, and optical and satellite communication systems.||There was a lot of calculus, physics and lab work, and I enjoyed it. Programming was only a small part: one introduction to computers and one programming lab.' },
  { cam: 'u3', uv: 3, ut: 'But outside the classroom, I spent a lot of my time on something else: design. I taught myself Adobe Photoshop and CorelDraw, then web design with HTML, CSS and JavaScript, and animation with Macromedia Flash.||Nobody asked me to. I just liked making things look good.' },
  { cam: 'u4', uv: 4, ut: 'I had a friend, Jockie Heruseon, who was much better than me at networking. He always knew where the opportunities were. So we teamed up: he found them, and I did the design work.||We joined web design competitions, and we got projects to design the university\'s yearly academic book and the university calendar. Together, we learned how the real world works, long before we graduated.' },
  { cam: 'u5', uv: 5, ut: 'I also had a best "art friend" on campus, Fakhrudin. He was a famous animator and designer among the students, and we pushed each other to make better work. Years later, when I made animated SVG visuals in Power BI, it took me straight back to those Flash days.' },
  { cam: 'u6t', uv: 6, ut: '' },
  { cam: 'u7t', uv: 7, ut: '' },
  { cam: 'u9', uv: 9, ut: "A moment I'm proud of||Getting paid, as a student, to design my own university's calendar and its academic book. Those were my first real design clients." },
  { cam: 'u11', uv: 11, ut: '' },
];
const TOTAL = VIEWS.length;

const root = document.documentElement;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};
const phoneQuery = matchMedia('(max-width: 819px)');
const isDark = () => root.dataset.theme === 'dark';
const reduced = () => root.classList.contains('reduce-motion');

/* ================================================================ scene → HTML (same markup as the Diorama board) */
export function sceneHTML(props) {
  const v = new CanvasDiorama(props).renderVals();
  const box = `position:absolute;left:0;top:0;width:${v.W}px;height:${v.H}px`;
  let h = `<div class="${v.rootCls}" aria-hidden="true" style="position:relative;width:${v.W}px;height:${v.H}px;overflow:hidden;background:${v.skyBg}">`;
  if (v.orb.on) h += `<div style="position:absolute;left:${v.orb.l}px;top:${v.orb.t}px;width:${v.orb.s}px;height:${v.orb.s}px;border-radius:50%;background:${v.orb.bg}"></div>`;
  v.stars.forEach((s) => { h += `<div class="dz-twinkle" style="position:absolute;left:${s.l}px;top:${s.t}px;width:${s.s}px;height:${s.s}px;border-radius:50%;background:#F4F1E6;opacity:${s.o};animation-delay:${s.dl}s"></div>`; });
  v.clouds.forEach((q) => { h += `<div class="dz-cloud" style="position:absolute;left:${q.l}px;top:${q.t}px;width:${q.w}px;height:${q.h}px;border-radius:50%;background:${q.bg};animation-duration:${q.dur}s"></div>`; });
  h += `<div style="${box};transform:${v.camT};transform-origin:0 0"><div class="dz-sway" style="${box}">`;
  v.faces.forEach((f) => {
    h += `<div class="${f.cls}" style="position:absolute;left:${f.l}px;top:${f.t}px;width:${f.w}px;height:${f.h}px;clip-path:${f.clip};background:${f.bg};border-radius:${f.br};opacity:${f.o};transform:${f.tf};transform-origin:0 0">`;
    if (f.txt) h += `<span style="position:absolute;left:0;top:0;transform:translate(${f.tx},-50%);white-space:nowrap;font:${f.fw} 20px/1 ${f.ff};color:${f.fc};text-shadow:${f.ts}">${esc(f.txt)}</span>`;
    h += '</div>';
  });
  h += `</div></div><div style="${box};background:${v.fogBg};pointer-events:none"></div>`;
  if (v.rain) h += `<div class="dz-rain" style="${box};background-image:${v.rainBg};pointer-events:none"></div>`;
  return h + '</div>';
}

/* ================================================================ drawing the views */
const views = $$('.u-view');
const drawn = new Map(); // view index → theme it was drawn in
function draw(i) {
  if (i < 0 || i >= TOTAL) return;
  const mode = isDark() ? 'dark' : 'light';
  if (drawn.get(i) === mode) return;
  const v = VIEWS[i];
  $('.u-board', views[i]).innerHTML = sceneHTML({ scene: 'uni', cam: v.cam, side: 'center', nofog: 'true', uv: v.uv, ut: v.ut, dark: isDark(), w: 1440, h: 900 });
  $$('.u-thumb', views[i]).forEach((el) => { el.innerHTML = sceneHTML({ scene: 'campus', cam: el.dataset.cam, dark: isDark(), w: 284, h: 124, inset: false }); });
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
  const hash = `#/university/${i + 1}`;
  if (location.hash !== hash) history.replaceState(null, '', hash);
  if (phoneQuery.matches) $('#views').scrollTop = 0;
  // draw the neighbours once this view is up, so the next move is instant
  setTimeout(() => { draw(i + 1); draw(i - 1); }, reduced() ? 0 : 700);
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
  lockUntil = now + (reduced() ? 250 : 1050);
  setActive(next, opts);
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
    case 'Enter': if (onControl) return; e.preventDefault(); step(1, { focus: true }); break;
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
const fromHash = () => { const m = /^#\/university\/(\d+)$/.exec(location.hash); return m ? Math.min(TOTAL, Math.max(1, +m[1])) - 1 : 0; };
window.addEventListener('hashchange', () => { lockUntil = 0; setActive(fromHash()); });
const start = fromHash();
fit();
active = start; // so applyTheme draws the right views
applyTheme(root.dataset.theme);
active = -1;
setActive(start);
requestAnimationFrame(() => root.classList.add('u-ready'));

// Story pages and the story index (written by tools/build-stories.mjs): article mode only.
// Theme switch (same keys as Home), the still illustrations, the "In this story" highlight, the topic filter.
import { renderDiorama } from './still.js';

const root = document.documentElement;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const isDark = () => root.dataset.theme === 'dark';
const store = (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } };
const saved = () => { try { return localStorage.getItem('theme'); } catch { return null; } };

/* ---------------------------------------------------------------- still illustrations (drawn once, when they come near the screen) */
function draw(el) {
  const d = el.dataset;
  el.innerHTML = renderDiorama({ scene: d.scene, cam: d.cam, side: d.side, dark: isDark(), w: +d.w, h: +d.h, inset: false, decorative: true });
  d.drawn = isDark() ? 'dark' : 'light';
}
const pics = $$('[data-scene]');
const near = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { draw(en.target); near.unobserve(en.target); } });
}, { rootMargin: '300px' }) : null;
pics.forEach((el) => (near ? near.observe(el) : draw(el)));

/* ---------------------------------------------------------------- theme */
function applyTheme(theme, save) {
  root.dataset.theme = theme;
  $$('[data-theme-toggle]').forEach((b) => {
    b.setAttribute('aria-label', theme === 'dark' ? 'Switch to day' : 'Switch to night');
    $('use', b).setAttribute('href', theme === 'dark' ? '#i-sun' : '#i-moon');
  });
  $('meta[name="theme-color"]').setAttribute('content', theme === 'dark' ? '#0B1222' : '#F4F1EA');
  if (save) store('theme', theme);
  pics.forEach((el) => { if (el.dataset.drawn && el.dataset.drawn !== theme) draw(el); });
}
$$('[data-theme-toggle]').forEach((b) => b.addEventListener('click', () => applyTheme(isDark() ? 'light' : 'dark', true)));
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => { if (!saved()) applyTheme(e.matches ? 'dark' : 'light'); });
applyTheme(root.dataset.theme);

/* ---------------------------------------------------------------- story page: highlight the section being read */
const toc = $$('.art-toc a');
if (toc.length && 'IntersectionObserver' in window) {
  const secs = toc.map((a) => document.getElementById(a.hash.slice(1)));
  const mark = () => {
    // the last section whose top has passed the reading line (a third down the screen)
    const line = window.innerHeight / 3;
    let i = 0;
    secs.forEach((s, k) => { if (s.getBoundingClientRect().top <= line) i = k; });
    toc.forEach((a, k) => (k === i ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
  };
  let queued = false;
  window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; mark(); }); } }, { passive: true });
  mark();
}

/* ---------------------------------------------------------------- story index: filter by topic */
const chips = $$('.topic-chip');
if (chips.length) {
  const cards = $$('.story-card');
  const filter = (topic) => {
    chips.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.topic === topic)));
    let n = 0;
    cards.forEach((c) => { const on = topic === 'all' || c.dataset.topics.split(' ').includes(topic); c.hidden = !on; if (on) n++; });
    $('#announce').textContent = `${n} stories`;
  };
  $('.lib-chips').addEventListener('click', (e) => { const b = e.target.closest('.topic-chip'); if (b) filter(b.dataset.topic); });
}

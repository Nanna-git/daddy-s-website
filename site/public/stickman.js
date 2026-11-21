// One corner stickman. He runs to the middle of the screen to "present" things, then runs home.
(() => {
  const sm = document.getElementById('sm');
  if (!sm) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v) => Math.min(1, Math.max(0, v));
  const set = (x, facing, pose, run, prop) => {
    sm.style.setProperty('--x', `${x}px`);
    sm.style.setProperty('--f', facing);
    sm.dataset.pose = pose;
    run ? sm.setAttribute('data-run', '') : sm.removeAttribute('data-run');
    prop ? (sm.dataset.prop = prop) : delete sm.dataset.prop;
  };
  const reach = () => -(innerWidth / 2 - 60); // corner -> middle

  // ---- scroll-driven, but the stickman is the cause ----
  // Scroll only tells him how far along he is. Content stays hidden (or in place) until his
  // hands/foot actually reach it; then it moves with his move.
  const kick = document.querySelector('[data-kick]');
  const acts = [...document.querySelectorAll('[data-act]')];
  const H = () => sm.querySelector('svg').getBoundingClientRect().height;
  const ease = (u) => u * u * (3 - 2 * u);
  function place(el, ty, extra = '', op = 1) { el._ty = ty; el.style.transform = `translateY(${ty}px) ${extra}`; el.style.opacity = op; }
  function onScroll() {
    const vh = innerHeight;
    let done = false;
    for (const el of acts) {
      const base = el.getBoundingClientRect().top - (el._ty || 0); // where it sits with no transform
      const t = clamp((vh * 0.95 - base) / (vh * 0.55));          // his progress for this section
      const u = ease(clamp((t - 0.3) / 0.4));                      // 0 until he grabs it, 1 once pulled up
      if (!still) place(el, (1 - u) * 130, '', u);
      if (!done && t > 0 && t < 1) {
        done = true;
        const grab = t > 0.25 && t < 0.75;
        // hands stay on the top edge of the section he is pulling
        const y = grab ? Math.min(0, el.getBoundingClientRect().top + 24 - (vh - 10 - H() * 0.5)) : 0;
        sm.style.setProperty('--y', `${y}px`);
        set(reach() * Math.sin(Math.PI * t), t < 0.5 ? 1 : -1, grab ? (el.dataset.pose || 'pull') : 'idle', !grab, grab ? el.dataset.prop : null);
      }
    }
    if (kick) {
      const s = clamp(scrollY / (vh * 0.6));
      const u = ease(clamp((s - 0.3) / 0.4));                      // hero only leaves while he kicks
      if (!still) place(kick, -u * 260, `rotate(${-u * 6}deg)`, 1 - u);
      if (!done && s > 0 && s < 1) {
        done = true;
        const hit = s > 0.25 && s < 0.75;
        sm.style.setProperty('--y', `${hit ? Math.min(0, kick.getBoundingClientRect().bottom - (vh - 10)) : 0}px`);
        set(reach() * Math.sin(Math.PI * s), s < 0.5 ? 1 : -1, hit ? 'kick' : 'idle', !hit);
      }
    }
    if (!done) { sm.style.setProperty('--y', '0px'); set(0, 1, document.body.dataset.idle || 'idle', false); }
  }
  if (acts.length || kick) { addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); onScroll(); }
  else set(0, 1, document.body.dataset.idle || 'idle', false);

  // ---- reading progress (story pages) ----
  const bar = document.getElementById('progress');
  if (bar) addEventListener('scroll', () => bar.style.transform = `scaleX(${clamp(scrollY / (document.documentElement.scrollHeight - innerHeight))})`, { passive: true });

  // ---- project carousel: stickman swaps the cards ----
  const car = document.getElementById('carousel');
  if (car) {
    const slides = [...car.querySelectorAll('.slide')];
    const counter = document.getElementById('count');
    let i = 0, busy = false;
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    slides.forEach((s, k) => (s.hidden = k !== i));
    async function go(dir) {
      if (busy) return; busy = true;
      const cur = slides[i]; i = (i + dir + slides.length) % slides.length; const nxt = slides[i];
      if (still) { cur.hidden = true; nxt.hidden = false; counter.textContent = `${i + 1} / ${slides.length}`; busy = false; return; }
      sm.style.transition = 'transform .7s cubic-bezier(.4,0,.2,1)';
      // stand at card level (his feet on the card's bottom edge), not at the screen bottom
      sm.style.setProperty('--y', `${Math.min(0, cur.getBoundingClientRect().bottom - innerHeight + 10)}px`);
      set(reach() * 0.75, 1, 'idle', true); await wait(750);       // run to the middle
      set(reach() * 0.75, 1, 'push', false);
      cur.animate([{ transform: 'none', opacity: 1 }, { transform: `translateX(${-dir * 90}px)`, opacity: 0 }], { duration: 450, fill: 'forwards' });
      await wait(420);
      cur.hidden = true; counter.textContent = `${i + 1} / ${slides.length}`;
      nxt.hidden = false; set(reach() * 0.75, -1, 'pull', false);   // grab the next one
      nxt.animate([{ transform: `translateX(${dir * 90}px)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 500, fill: 'both' });
      await wait(520);
      sm.style.setProperty('--y', '0px'); set(0, -1, 'idle', true); await wait(750);   // run home
      sm.style.transition = ''; set(0, 1, 'idle', false); busy = false;
    }
    document.getElementById('prev').onclick = () => go(-1);
    document.getElementById('next').onclick = () => go(1);
    counter.textContent = `1 / ${slides.length}`;
  }
})();

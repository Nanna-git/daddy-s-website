// Draws a design-canvas scene (canvas-diorama.js) as HTML. Used by Home and the My story sections.
import { CanvasDiorama } from './canvas-diorama.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// The engine's cameras are fixed per view. For a camera move, props.pov ({ eye, at, fov, off })
// replaces the view's camera for one render; the generated engine file stays untouched.
class Cam extends CanvasDiorama {
  scene(id, opt) {
    const sc = super.scene(id, opt), P = this.props;
    if (P.pov && sc.cams) sc.cams[P.cam] = { pov: P.pov };
    this.pov = sc.cams?.[P.cam]?.pov || null;
    if (P.enter || P.evo != null) this.tag(id, opt, sc.items, P.enter);
    return sc;
  }

  // Marks the items that belong to this view only (its text, papers, labels) with the class "ev",
  // found by building the same scene without the view's text. With `enter`, each one also gets
  // its entrance, in this order: loose things, then papers put up one by one, then what sits on
  // the papers, then labels, then the text line by line. The delay rides in the class name (evd-<ms>).
  tag(id, opt, items, enter) {
    // the answer depends on the scene's options only, not on the camera: work it out once (a move asks every frame)
    const memo = id + (enter ? '+' : '-') + JSON.stringify(opt);
    if (!TAGS.has(memo)) TAGS.set(memo, this.findOwn(id, opt, items, enter));
    TAGS.get(memo).forEach((cls, i) => { items[i].a = (items[i].a ? items[i].a + ' ' : '') + cls; });
  }

  findOwn(id, opt, items, enter) {
    const key = (it) => JSON.stringify(it);
    // the tool corner (V06) is furniture: it stays, only its words are taken out
    const bare = { ...opt, swb: { lesson: '', page: '' }, tools: opt.tools ? { lesson: '', page: '', title: '' } : null, uv: 0, ut: '' };
    VIEW_TEXT.forEach((k) => { bare[k] = ''; });
    const kept = new Set(super.scene(id, bare).items.map(key));           // drawn with the view's focus, without its text
    const base = new Set(super.scene(id, { ...bare, focus: '' }).items.map(key));
    const mine = new Set(items.filter((it) => !base.has(key(it)) && !/dz-say/.test(it.a || ''))); // speech bubbles keep their own loop
    const box = (it) => (it.t === 's' ? [[it.x - it.r, it.x + it.r], [it.y - it.r, it.y + it.r], [it.z - it.r, it.z + it.r]] : [[it.x, it.x + (+it.w || 0)], [it.y, it.y + (+it.d || 0)], [it.z, it.z + (+it.h || 0)]]);
    const on = (it, p) => { const a = box(it), b = box(p); return a.every((r, k) => r[0] <= b[k][1] + 0.08 && r[1] >= b[k][0] - 0.08); };
    const sheet = (it) => { const d = [it.w, it.d, it.h].map(Number).sort((x, y) => x - y); return it.t !== 't' && it.t !== 's' && d[0] <= 0.05 && d[1] >= 0.5 && d[2] <= 3; };
    const texts = [...mine].filter((it) => it.t === 't');
    // the tool corner's sheet is kept as furniture above, but it only carries this view's words: it comes in with them
    if (opt.tools) {
      const without = new Set(super.scene(id, { ...bare, tools: null, focus: '' }).items.map(key));
      items.forEach((it) => { if (!without.has(key(it)) && sheet(it) && texts.some((t) => on(t, it))) mine.add(it); });
    }
    const all = items.filter((it) => mine.has(it)); // scene order
    const papers = all.filter(sheet), things = all.filter((it) => it.t !== 't' && !sheet(it));
    const loose = things.filter((it) => !papers.some((p) => on(it, p))), stuck = things.filter((it) => papers.some((p) => on(it, p)));
    const labels = texts.filter((it) => kept.has(key(it))), lines = texts.filter((it) => !kept.has(key(it))); // labels come with the focus (book spines, the map); lines are the view's words
    const t1 = loose.length ? Math.min(400, loose.length * 15) + 250 : 0;
    const t2 = t1 + (papers.length ? (papers.length - 1) * 260 + 650 : 0);
    const t3 = t2 + (labels.length ? 150 + labels.length * 20 + 200 : 0);
    const gap = Math.max(45, Math.min(140, 1600 / Math.max(1, lines.length)));
    const found = new Map(); // item index → classes
    const mark = (list, kind, at) => list.forEach((it, i) => found.set(items.indexOf(it), 'ev' + (enter ? ` ev-${kind} evd-${Math.round(at(i))}` : '')));
    mark(loose, 'o', (i) => Math.min(400, i * 15));
    mark(papers, 'p', (i) => t1 + i * 260);
    mark(stuck, 'o', (i) => t2 + i * 15);
    mark(labels, 't', (i) => t2 + 150 + i * 20);
    mark(lines, 't', (i) => t3 + i * gap);
    return found;
  }
}
const TAGS = new Map();
const VIEW_TEXT = ['wall', 'bwall', 'screen', 'glass', 'btext', 'fly', 'greet', 'shelftitle', 'ubwall', 'slide', 'slate', 'say', 'rtitle', 'wtitle', 'blabels', 'art'];

// A paper being put up: its face cut into bands, each hinged to the one above, so the sheet
// really curls (like a sticky note) and is smoothed down from the top. CSS runs the motion.
const BANDS = 6;
function curledPaper(f, o, delay) {
  const pts = [...f.clip.matchAll(/(-?[\d.]+)px (-?[\d.]+)px/g)].map((m) => [+m[1], +m[2]]);
  if (pts.length !== 4 || f.h < 24) return '';
  const byY = [...pts].sort((p, q) => p[1] - q[1]), top = byY.slice(0, 2).sort((p, q) => p[0] - q[0]), bot = byY.slice(2).sort((p, q) => p[0] - q[0]);
  const at = (a, c, s) => [a[0] + (c[0] - a[0]) * s, a[1] + (c[1] - a[1]) * s];
  let inner = '';
  for (let k = BANDS - 1; k >= 0; k--) {
    const s0 = k / BANDS, s1 = Math.min(1, (k + 1) / BANDS + 0.012); // a hair of overlap hides the seams
    const band = [at(top[0], bot[0], s0), at(top[1], bot[1], s0), at(top[1], bot[1], s1), at(top[0], bot[0], s1)];
    const y = (band[0][1] + band[1][1]) / 2;
    inner = `<div class="${k ? 'ev-h' : 'ev-h0'}" style="position:absolute;left:0;top:0;width:100%;height:100%;transform-origin:50% ${y.toFixed(1)}px;--k:${k}"><div class="ev-l" style="position:absolute;left:0;top:0;width:100%;height:100%;clip-path:polygon(${band.map((p) => p[0].toFixed(1) + 'px ' + p[1].toFixed(1) + 'px').join(', ')});background:${f.bg}"></div>${inner}</div>`;
  }
  return `<div class="${f.cls} ev-curl" style="position:absolute;left:${f.l}px;top:${f.t}px;width:${f.w}px;height:${f.h}px;opacity:${o};--d:${delay}ms">${inner}</div>`;
}

/* ================================================================ scene → HTML (same markup as the Diorama board) */
export function sceneHTML(props) {
  const v = new Cam(props).renderVals();
  const box = `position:absolute;left:0;top:0;width:${v.W}px;height:${v.H}px`;
  let h = `<div class="${v.rootCls}" aria-hidden="true" style="position:relative;width:${v.W}px;height:${v.H}px;overflow:hidden;background:${v.skyBg}">`;
  if (v.orb.on) h += `<div style="position:absolute;left:${v.orb.l}px;top:${v.orb.t}px;width:${v.orb.s}px;height:${v.orb.s}px;border-radius:50%;background:${v.orb.bg}"></div>`;
  v.stars.forEach((s) => { h += `<div class="dz-twinkle" style="position:absolute;left:${s.l}px;top:${s.t}px;width:${s.s}px;height:${s.s}px;border-radius:50%;background:#F4F1E6;opacity:${s.o};animation-delay:${s.dl}s"></div>`; });
  v.clouds.forEach((q) => { h += `<div class="dz-cloud" style="position:absolute;left:${q.l}px;top:${q.t}px;width:${q.w}px;height:${q.h}px;border-radius:50%;background:${q.bg};animation-duration:${q.dur}s"></div>`; });
  h += `<div style="${box};transform:${v.camT};transform-origin:0 0"><div class="dz-sway" style="${box}">`;
  v.faces.forEach((f) => {
    const ev = f.cls.includes(' ev'), delay = ev && / evd-(\d+)/.exec(f.cls);
    const o = ev && props.evo != null ? f.o * props.evo : f.o; // evo fades the view's own items (0–1)
    const curled = delay && f.cls.includes(' ev-p') ? curledPaper(f, o, delay[1]) : '';
    if (curled) { h += curled; return; }
    h += `<div class="${f.cls}" style="position:absolute;left:${f.l}px;top:${f.t}px;width:${f.w}px;height:${f.h}px;clip-path:${f.clip};background:${f.bg};border-radius:${f.br};opacity:${o};transform:${f.tf};transform-origin:0 0${delay ? `;--d:${delay[1]}ms` : ''}">`;
    if (f.txt) h += `<span style="position:absolute;left:0;top:0;transform:translate(${f.tx},-50%);white-space:nowrap;font:${f.fw} 20px/1 ${f.ff};color:${f.fc};text-shadow:${f.ts}">${esc(f.txt)}</span>`;
    h += '</div>';
  });
  h += `</div></div><div style="${box};background:${v.fogBg};pointer-events:none"></div>`;
  if (v.rain) h += `<div class="dz-rain" style="${box};background-image:${v.rainBg};pointer-events:none"></div>`;
  return h + '</div>';
}

/* ================================================================ camera moves */
// The camera of a view (null for the older fixed-angle scenes, which cannot travel).
export function povOf(props) { const d = new Cam(props); d.renderVals(); return d.pov; }

const inOutSine = (t) => (1 - Math.cos(Math.PI * t)) / 2; // a gentle start and stop
const lerp = (a, b, t) => a + (b - a) * t;
const gaze = (p) => { const d = [0, 1, 2].map((k) => p.at[k] - p.eye[k]); return { yaw: Math.atan2(d[1], d[0]), pitch: Math.atan2(d[2], Math.hypot(d[0], d[1])) }; };
// Camera between a and b at t (0–1): the eye goes in a straight line, the head turns by angle (the short way round).
export function povBetween(a, b, t) {
  const A = gaze(a), B = gaze(b);
  const turn = ((B.yaw - A.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  const yaw = A.yaw + turn * t, pitch = lerp(A.pitch, B.pitch, t);
  const eye = [0, 1, 2].map((k) => lerp(a.eye[k], b.eye[k], t));
  return { eye, at: [eye[0] + 10 * Math.cos(pitch) * Math.cos(yaw), eye[1] + 10 * Math.cos(pitch) * Math.sin(yaw), eye[2] + 10 * Math.sin(pitch)], fov: lerp(a.fov || 70, b.fov || 70, t), off: lerp(a.off || 0, b.off || 0, t) };
}
// Redraws `el` every frame while the camera goes from a to b. Resolves true when the move was smooth,
// false when it was stopped early because the device could not keep up (the caller then stops using moves).
// clear: the view's own text and papers fade out during the first part of the move.
// then:  a second set of props that the picture dissolves into early in the move (when the two views
//        are built differently, like the film crew and the tool corner), so nothing pops in on arrival.
export function travel(el, props, a, b, dur, { ease = inOutSine, clear = false, then = null } = {}) {
  return new Promise((done) => {
    let t0 = 0, last = 0, n = 0, slow = 0;
    const frame = (now) => {
      if (!t0) t0 = last = now;
      const t = Math.min(1, (now - t0) / dur), pov = povBetween(a, b, ease(t)), mix = then ? Math.min(1, t / 0.35) : 0;
      let html = mix < 1 ? sceneHTML({ ...props, pov, ...(clear ? { evo: Math.max(0, 1 - t * 3) } : null) }) : '';
      if (then) html += `<div style="position:absolute;left:0;top:0;opacity:${mix}">${sceneHTML({ ...then, pov, evo: 0 })}</div>`;
      el.innerHTML = html;
      n += 1; if (now - last > 70) slow += 1; // under about 14 frames a second last = now;
      const choppy = n >= 8 && slow > n / 2;
      if (t < 1 && !choppy) requestAnimationFrame(frame); else done(!choppy);
    };
    requestAnimationFrame(frame);
  });
}

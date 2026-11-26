// Draws a design-canvas scene (canvas-diorama.js) as HTML. Used by Home and the My story sections.
import { CanvasDiorama } from './canvas-diorama.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// The engine's cameras are fixed per view. For a camera move, props.pov ({ eye, at, fov, off })
// replaces the view's camera for one render; the generated engine file stays untouched.
class Cam extends CanvasDiorama {
  scene(id, opt) {
    const sc = super.scene(id, opt), P = this.props, home = sc.cams?.[P.cam]?.pov; // home: where this view stands
    if (P.pov && sc.cams) sc.cams[P.cam] = { pov: P.pov };
    this.pov = sc.cams?.[P.cam]?.pov || null;
    if (P.enter || P.evo != null) this.tag(id, opt, sc.items, P.enter, home);
    if (P.probe) this.sig = JSON.stringify(super.scene(id, { ...Cam.bare(opt), focus: '', studio: true }).items);
    return sc;
  }

  // The scene's options with the view's words taken out. The tool corner (V06) is furniture: it stays.
  static bare(opt) {
    const bare = { ...opt, swb: { lesson: '', page: '' }, tools: opt.tools ? { lesson: '', page: '', title: '' } : null, ut: '' };
    VIEW_TEXT.forEach((k) => { bare[k] = ''; });
    return bare;
  }

  // Marks the items that belong to this view only (its text, papers, labels) with the class "ev",
  // found by building the same scene without the view's text. With `enter`, each one also gets
  // its entrance, in this order: loose things, then papers put up one by one, then what sits on
  // the papers, then labels, then the text line by line. The delay rides in the class name (evd-<ms>).
  tag(id, opt, items, enter, home) {
    // the answer depends on the scene's options only, not on the camera: work it out once (a move asks every frame)
    const memo = id + (enter ? '+' : '-') + JSON.stringify(opt);
    if (!TAGS.has(memo)) TAGS.set(memo, this.findOwn(id, opt, items, enter, home));
    TAGS.get(memo).forEach((cls, i) => { items[i].a = (items[i].a ? items[i].a + ' ' : '') + cls; });
  }

  findOwn(id, opt, items, enter, home) {
    const key = (it) => JSON.stringify(it);
    // a wall and what hangs on it can be in the scene twice (engine: vx / vy), each copy drawn from one side only:
    // the copy this view never shows is left out, or the view's words would be counted twice and come in late
    const shown = (it) => !home || ['vx', 'vy'].every((k, n) => !it[k] || (home.eye[n] >= it[k][0] && home.eye[n] < it[k][1]));
    const bare = Cam.bare(opt);
    const kept = new Set(super.scene(id, bare).items.map(key));           // drawn with the view's focus, without its text
    const base = new Set(super.scene(id, { ...bare, focus: '' }).items.map(key));
    const mine = new Set(items.filter((it) => !base.has(key(it)) && !/dz-say/.test(it.a || '') && shown(it))); // speech bubbles keep their own loop
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
// Calls html(t) every frame for `dur` ms (t goes 0–1) and puts the result in `el`. Resolves true when
// it ran smoothly, false when it was stopped early because the device could not keep up.
function play(el, dur, html) {
  return new Promise((done) => {
    let t0 = 0, last = 0, n = 0, slow = 0;
    const frame = (now) => {
      if (!t0) t0 = last = now;
      const t = Math.min(1, (now - t0) / dur);
      el.innerHTML = html(t);
      n += 1;
      if (now - last > 70) slow += 1; // under about 14 frames a second
      last = now;
      const choppy = n >= 8 && slow > n / 2;
      if (t < 1 && !choppy) requestAnimationFrame(frame); else done(!choppy);
    };
    requestAnimationFrame(frame);
  });
}
const over = (html, opacity) => `<div style="position:absolute;left:0;top:0;opacity:${opacity}">${html}</div>`;

// The camera goes from a to b while `props` is drawn.
// clear: the view's own text and papers fade out during the first part of the move.
// then:  a second set of props that the picture dissolves into early in the move (when the two views
//        are built differently, like the film crew and the tool corner), so nothing pops in on arrival.
// path:  a function of t that gives the camera, instead of the straight line from a to b.
export function travel(el, props, a, b, dur, { ease = inOutSine, clear = false, then = null, path = null } = {}) {
  return play(el, dur, (t) => {
    const pov = path ? path(t) : povBetween(a, b, ease(t)), mix = then ? Math.min(1, t / 0.25) : 0; // two pictures are drawn while it dissolves: keep it short
    return (mix < 1 ? sceneHTML({ ...props, pov, ...(clear ? { evo: Math.max(0, 1 - t * 3) } : null) }) : '')
      + (then ? over(sceneHTML({ ...then, pov, evo: 0 }), mix) : '');
  });
}

// One camera move from view a to view b (their scene props), drawn in `el`.
//   'travel'        the camera really goes there; a's text stays where it is
//   'travel-clear'  same, but a's text and papers fade out as it leaves (both views show the same spot)
//   'walk'          the long way on foot, in one take: see walkPath (back: how far behind b's standing point it turns to face b)
//   'fly'           up, along a curve and down, in one take: see flyPath (flip: the move is being played backwards)
//   'slide'         sideways along the front of the sets and in or out of one, in one take: see slidePath
//   'route'         on foot through given points (a gate, a door), in one take: see routePath (via: the points)
//   'drone'         turn on the spot, fly a curve, spin round onto b, in one take: see dronePath
export function cameraMove(el, a, b, kind, dur, { back = 10, flip = false, ...opt } = {}) {
  const from = povOf(a), to = povOf(b);
  // the film set is there while the camera turns to it or away from it; anything else that is built
  // differently in the two views dissolves from one to the other early in the move
  const during = { ...a, studio: a.studio || b.studio };
  return travel(el, during, from, to, dur, { clear: kind === 'travel-clear', then: built(a) === built(b) ? null : b, path: kind === 'walk' ? walkPath(from, to, back) : kind === 'fly' ? flight(from, to, opt, flip) : kind === 'slide' ? slidePath(from, to) : kind === 'route' ? route(from, to, opt, flip) : kind === 'drone' ? drone(from, to, opt, flip) : null });
}
// A walk in one take through given points on the ground (via: [[x, y], …], for a gate or a door): the camera follows a smooth
// curve from a through the points to b. It turns to where it is going as it sets off, and to what b looks at over the last
// part of the way. Played backwards (flip) it is the same path, walked backwards.
// fixed: the camera keeps facing the way both views face (it backs out, steps sideways and goes in) instead of turning to the path.
// watch: it looks at what b looks at the whole way, instead of where it is going (an arc round the place it walks to).
export function routePath(from, to, via, { fixed = false, watch = false } = {}) {
  const P = [from.eye, ...via.map((p) => [p[0], p[1], p[2] ?? from.eye[2]]), to.eye], n = P.length - 1, A = gaze(from), B = gaze(to);
  const short = (d) => Math.atan2(Math.sin(d), Math.cos(d)); // the short way round
  const on = (u, k) => { // a curve through every point (Catmull-Rom)
    const i = Math.min(n - 1, Math.floor(u * n)), f = u * n - i, p0 = P[Math.max(0, i - 1)][k], p1 = P[i][k], p2 = P[i + 1][k], p3 = P[Math.min(n, i + 2)][k];
    return 0.5 * (2 * p1 + (p2 - p0) * f + (2 * p0 - 5 * p1 + 4 * p2 - p3) * f * f + (3 * p1 - p0 - 3 * p2 + p3) * f ** 3);
  };
  const at = byLength((u) => [0, 1, 2].map((k) => on(u, k))); // steady pace, however far apart the points are
  return (t) => {
    const s = inOutSine(t), eye = [0, 1, 2].map((k) => on(at(s), k)), s0 = Math.max(0, Math.min(0.96, s - 0.02)), u0 = at(s0), u1 = at(s0 + 0.04); // a short stretch of the path around here, kept inside it
    const ahead = watch ? Math.atan2(to.at[1] - eye[1], to.at[0] - eye[0]) : Math.atan2(on(u1, 1) - on(u0, 1), on(u1, 0) - on(u0, 0)); // which way the path runs here
    const lead = fixed ? 0 : inOutSine(Math.min(1, s / 0.2)), land = fixed ? s : inOutSine(Math.max(0, (s - 0.6) / 0.4));
    let yaw = A.yaw + short(ahead - A.yaw) * lead; yaw += short(B.yaw - yaw) * land;
    const pitch = lerp(A.pitch * (1 - lead), B.pitch, land);
    return { eye, at: [eye[0] + 10 * Math.cos(pitch) * Math.cos(yaw), eye[1] + 10 * Math.cos(pitch) * Math.sin(yaw), eye[2] + 10 * Math.sin(pitch)], fov: lerp(from.fov || 70, to.fov || 70, s), off: lerp(from.off || 0, to.off || 0, s) };
  };
}
// For a curve p(u) (u 0–1): the u that is a given share (0–1) of the way along it, so the camera moves at an even speed.
function byLength(p, N = 240) {
  const acc = [0]; let q = p(0);
  for (let i = 1; i <= N; i++) { const r = p(i / N); acc.push(acc[i - 1] + Math.hypot(r[0] - q[0], r[1] - q[1], r[2] - q[2])); q = r; }
  return (s) => { const L = Math.max(0, Math.min(1, s)) * acc[N]; let i = 1; while (i < N && acc[i] < L) i++; return (i - 1 + (L - acc[i - 1]) / ((acc[i] - acc[i - 1]) || 1)) / N; };
}
const route = (from, to, opt, flip) => { const path = flip ? routePath(to, from, opt.via || [], opt) : routePath(from, to, opt.via || [], opt); return (t) => path(flip ? 1 - t : t); }; // via is written for going forward
// A drone shot in one take: it turns on the spot as it lifts off (first, radians, < 0 a turn to the left), flies a curve through the
// ground points c1 and c2 high over the sets, and spins on round as it glides down onto b (spin: about how far, < 0 to the left; it is
// trued so the camera ends looking where b looks). Each part eases in and out and overlaps the next, so it never stops on the way.
export function dronePath(from, to, { c1, c2, up = 18, first = -Math.PI / 2, spin = -1.5 * Math.PI, tilt = 0.3 } = {}) {
  const A = gaze(from), B = gaze(to), r = B.yaw - A.yaw - first - spin, turn = spin + Math.atan2(Math.sin(r), Math.cos(r));
  const P = [from.eye, c1, c2, to.eye], bez = (u, k) => (1 - u) ** 3 * P[0][k] + 3 * (1 - u) ** 2 * u * P[1][k] + 3 * (1 - u) * u * u * P[2][k] + u ** 3 * P[3][k];
  const at = byLength((u) => [bez(u, 0), bez(u, 1), 0]), part = (t, t0, len) => inOutSine(Math.max(0, Math.min(1, (t - t0) / len)));
  return (t) => {
    const turn1 = part(t, 0, 0.3), go = part(t, 0.12, 0.78), turn2 = part(t, 0.48, 0.52), high = part(t, 0.04, 0.36) * (1 - part(t, 0.6, 0.4)), u = at(go);
    const eye = [bez(u, 0), bez(u, 1), lerp(from.eye[2], to.eye[2], go) + up * high];
    const yaw = A.yaw + first * turn1 + turn * turn2, pitch = lerp(A.pitch, B.pitch, go) - tilt * high;
    return { eye, at: [eye[0] + 10 * Math.cos(pitch) * Math.cos(yaw), eye[1] + 10 * Math.cos(pitch) * Math.sin(yaw), eye[2] + 10 * Math.sin(pitch)], fov: lerp(from.fov || 70, to.fov || 70, go), off: lerp(from.off || 0, to.off || 0, go) };
  };
}
const drone = (from, to, opt, flip) => { const path = flip ? dronePath(to, from, opt) : dronePath(from, to, opt); return (t) => path(flip ? 1 - t : t); }; // written for going forward
// A slide between two views that face the same way but stand at different depths (one of them inside a set): the camera
// keeps facing the walls the whole way. It goes sideways along the line of the view that stands further back, and in or
// out of the other one: back out first when it starts inside, in last when it ends inside. The corner between the two
// legs is rounded (a curve with both handles on the corner), so it is one move, not two. Played backwards it is the same path.
export function slidePath(from, to) {
  const A = gaze(from), B = gaze(to), fx = Math.cos(A.yaw), fy = Math.sin(A.yaw);
  const depth = (p) => p.eye[0] * fx + p.eye[1] * fy, side = (p) => -p.eye[0] * fy + p.eye[1] * fx; // along the line of sight, and across it
  const inward = depth(to) > depth(from), d = inward ? depth(from) : depth(to), w = inward ? side(to) : side(from);
  const corner = [d * fx - w * fy, d * fy + w * fx];
  return (t) => {
    const s = inOutSine(t), u = 1 - s, yaw = A.yaw + (((B.yaw - A.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI) * s, pitch = lerp(A.pitch, B.pitch, s);
    const at = (k) => u ** 3 * from.eye[k] + (1 - u ** 3 - s ** 3) * corner[k] + s ** 3 * to.eye[k];
    const eye = [at(0), at(1), lerp(from.eye[2], to.eye[2], s)];
    return { eye, at: [eye[0] + 10 * Math.cos(pitch) * Math.cos(yaw), eye[1] + 10 * Math.cos(pitch) * Math.sin(yaw), eye[2] + 10 * Math.sin(pitch)], fov: lerp(from.fov || 70, to.fov || 70, s), off: lerp(from.off || 0, to.off || 0, s) };
  };
}
// Turn, walk, turn, walk, with no cut: the camera turns to face where it is going, walks to a spot `back` units straight
// behind b's standing point, turns to face what b looks at, and walks in. Each part starts and stops gently and overlaps
// the next one, so the camera never stands dead still on the way. The second turn is long and starts halfway down the
// walk: the place it is going to stays in the picture instead of sliding out of it while the camera looks straight ahead.
export function walkPath(from, to, back) {
  const g = gaze(from), gb = gaze(to), short = (d) => Math.atan2(Math.sin(d), Math.cos(d)); // the short way round
  const mid = [to.eye[0] - Math.cos(gb.yaw) * back, to.eye[1] - Math.sin(gb.yaw) * back, to.eye[2]];
  const d1 = short(Math.atan2(mid[1] - from.eye[1], mid[0] - from.eye[0]) - g.yaw), d2 = short(gb.yaw - g.yaw - d1);
  const part = (t, t0, len) => inOutSine(Math.max(0, Math.min(1, (t - t0) / len)));
  return (t) => {
    const turn1 = part(t, 0, 0.26), walk1 = part(t, 0.12, 0.52), turn2 = part(t, 0.32, 0.48), walk2 = part(t, 0.74, 0.26), s = inOutSine(t);
    const eye = [0, 1, 2].map((k) => from.eye[k] + (mid[k] - from.eye[k]) * walk1 + (to.eye[k] - mid[k]) * walk2);
    const yaw = g.yaw + d1 * turn1 + d2 * turn2, pitch = g.pitch * (1 - turn1) + gb.pitch * turn2;
    return { eye, at: [eye[0] + 10 * Math.cos(pitch) * Math.cos(yaw), eye[1] + 10 * Math.cos(pitch) * Math.sin(yaw), eye[2] + 10 * Math.sin(pitch)], fov: lerp(from.fov || 70, to.fov || 70, s), off: lerp(from.off || 0, to.off || 0, s) };
  };
}
// A flight in one take: the camera climbs, flies along a curve and glides down. It leaves along its own line of sight and
// arrives along b's, so it never swings round on the spot. u is how far along the curve it is (0–1).
//   up       how high above the straight line it flies
//   climb    the stretch of ground (units) over which it gets up there; glide: the last part of the way (0–1), spent coming down
//   out, in  how far it keeps going straight after leaving and before arriving (units): they shape the curve
//   reverse  it flies backwards the whole way, looking at where it came from (a drone pulling out)
//   tilt     how far it looks down while it is up (radians)
export function flyPath(from, to, { up = 14, climb = 12, glide = 0.45, out = 20, in: inn = 20, reverse = false, tilt = 0.22 } = {}) {
  const A = gaze(from), B = gaze(to), s = reverse ? -1 : 1;
  const P = [from.eye, [from.eye[0] + s * out * Math.cos(A.yaw), from.eye[1] + s * out * Math.sin(A.yaw)], [to.eye[0] - s * inn * Math.cos(B.yaw), to.eye[1] - s * inn * Math.sin(B.yaw)], to.eye];
  const curve = (u, k) => (1 - u) ** 3 * P[0][k] + 3 * (1 - u) ** 2 * u * P[1][k] + 3 * (1 - u) * u * u * P[2][k] + u ** 3 * P[3][k];
  const along = (u, k) => (1 - u) ** 2 * (P[1][k] - P[0][k]) + 2 * (1 - u) * u * (P[2][k] - P[1][k]) + u * u * (P[3][k] - P[2][k]); // which way the curve runs
  const len = Math.hypot(to.eye[0] - from.eye[0], to.eye[1] - from.eye[1]) || 1, part = (x) => inOutSine(Math.max(0, Math.min(1, x)));
  return (u) => {
    const high = part(u * len / climb) * (1 - part((u - 1 + glide) / glide));
    const eye = [curve(u, 0), curve(u, 1), lerp(from.eye[2], to.eye[2], u) + up * high];
    const yaw = Math.atan2(s * along(u, 1), s * along(u, 0)), pitch = lerp(A.pitch, B.pitch, u) - tilt * high;
    return { eye, at: [eye[0] + 10 * Math.cos(pitch) * Math.cos(yaw), eye[1] + 10 * Math.cos(pitch) * Math.sin(yaw), eye[2] + 10 * Math.sin(pitch)], fov: lerp(from.fov || 70, to.fov || 70, u), off: lerp(from.off || 0, to.off || 0, u) };
  };
}
// flyPath against time (0–1): a gentle start and a long slow-down. Going back (flip), the same curve is flown the other way.
export function flight(from, to, opt, flip) {
  const path = flip ? flyPath(to, from, opt) : flyPath(from, to, opt), pace = (t) => inOutSine(1 - Math.pow(1 - t, 1.5));
  return (t) => path(flip ? 1 - pace(t) : pace(t));
}
// Turn, walk, cut, walk: for a spot that is too far to walk to in one go. The camera turns towards
// it (turn: 'left' or 'right' forces the hand, otherwise the short way), walks `walk` units, the
// picture cuts, and the camera walks the last stretch to b. That stretch starts at `viaEye` (an eye
// point) when given, otherwise `back` units before b. a's text stays in place until the cut.
// dolly: the last stretch starts `back` units straight behind b's standing point and walks in on what b
// looks at (the picture grows), instead of coming in along the line from a.
// out: before it turns, the camera first backs `out` units straight out of the room it is in.
export function viaMove(el, a, b, { turn, walk = 5, viaEye = null, back = 10, dolly = false, out = 0 }, dur) {
  const from = povOf(a), to = povOf(b), g = gaze(from);
  const door = [from.eye[0] - Math.cos(g.yaw) * out, from.eye[1] - Math.sin(g.yaw) * out]; // where it stands once it has backed out
  const way = [to.eye[0] - door[0], to.eye[1] - door[1]], len = Math.hypot(way[0], way[1]) || 1, lead = out ? 0.24 : 0;
  const head = Math.atan2(way[1], way[0]), full = Math.PI * 2;
  // In this world a growing angle is a turn to the right (x runs to the right and y to the left on the set).
  let swing = ((head - g.yaw) % full + full) % full;            // turning right, 0–360°
  if (turn === 'left' || (!turn && swing > Math.PI)) swing -= full;
  const look = (eye, yaw, pitch, like) => ({ eye, at: [eye[0] + 10 * Math.cos(pitch) * Math.cos(yaw), eye[1] + 10 * Math.cos(pitch) * Math.sin(yaw), eye[2] + 10 * Math.sin(pitch)], fov: like.fov, off: like.off });
  const gb = gaze(to);
  const startB = viaEye || (dolly ? [to.eye[0] - Math.cos(gb.yaw) * back, to.eye[1] - Math.sin(gb.yaw) * back, to.eye[2]] : [to.eye[0] - way[0] / len * back, to.eye[1] - way[1] / len * back, to.eye[2]]);
  const entry = dolly && !viaEye ? look(startB, gb.yaw, gb.pitch, to)
    : look(startB, Math.atan2(to.eye[1] - startB[1], to.eye[0] - startB[0]), 0, to); // walking in, looking where it goes
  return play(el, dur, (time) => {
    const t = Math.max(0, (time - lead) / (1 - lead)), gone = out ? inOutSine(Math.min(1, time / (lead + 0.08))) : 0; // backing out runs a little into the turn
    const mix = Math.max(0, Math.min(1, (t - 0.46) / 0.1));
    let html = '';
    if (mix < 1) {
      const u = Math.min(1, t / 0.52), turned = inOutSine(Math.min(1, u / 0.7)), step = u < 0.45 ? 0 : Math.pow((u - 0.45) / 0.55, 2) * walk;
      const eye = [lerp(from.eye[0], door[0], gone) + way[0] / len * step, lerp(from.eye[1], door[1], gone) + way[1] / len * step, from.eye[2]];
      html = sceneHTML({ ...a, pov: look(eye, g.yaw + swing * turned, lerp(g.pitch, 0, turned), from) });
    }
    if (mix > 0) { const v = Math.max(0, (t - 0.5) / 0.5); html += over(sceneHTML({ ...b, pov: povBetween(entry, to, 1 - (1 - v) * (1 - v)), evo: 0 }), mix); }
    return html;
  });
}

// What a view is made of apart from its words, its focus and the film set (compared between two views).
function built(props) {
  const memo = JSON.stringify({ ...props, dark: 0, pov: 0 });
  if (!BUILT.has(memo)) { const d = new Cam({ ...props, probe: true }); d.renderVals(); BUILT.set(memo, d.sig); }
  return BUILT.get(memo);
}
const BUILT = new Map();
// Works out ahead of time what a move to view b will need (it is remembered), so its first frame is not late.
export function warm(b) { built(b); sceneHTML({ ...b, evo: 0 }); sceneHTML({ ...b, enter: true }); }

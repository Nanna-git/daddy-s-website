// Scene library: every diorama is a list of boxes (B), cylinders (C), cones (K),
// spheres (S), discs (D) and night glows (G), in z-up units (1 unit ≈ 30 cm).
// Ported from the design canvas (Diorama board) so the site, the stills and the
// library thumbnails all draw the same objects with the same colours and cameras.
/* eslint-disable */
export class Diorama {
  h2r(c) { let s = String(c || '#888888').replace('#', ''); if (s.length === 3) { s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2]; } const n = parseInt(s, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  css(a, al) { const r = a.map(function (v) { return Math.max(0, Math.min(255, Math.round(v))); }); return al == null ? 'rgb(' + r.join(',') + ')' : 'rgba(' + r.join(',') + ',' + al + ')'; }
  mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  sh(a, f) { return f >= 1 ? this.mix(a, [255, 255, 255], Math.min(1, f - 1)) : [a[0] * f, a[1] * f, a[2] * f]; }

  // ---------- PROP KIT: every prop is boxes (B), cylinders (C), cones (K), spheres (S) and night glows (G) ----------
  lib() {
    const B = (x, y, z, w, d, h, c, o) => Object.assign({ t: 'b', x: x, y: y, z: z, w: w, d: d, h: h, c: c }, o || {});
    const C = (x, y, z, r, h, c, o) => Object.assign({ t: 'c', x: x, y: y, z: z, r: r, h: h, c: c, n: 10 }, o || {});
    const K = (x, y, z, r, h, c, o) => Object.assign({ t: 'k', x: x, y: y, z: z, r: r, h: h, c: c, n: 8 }, o || {});
    const S = (x, y, z, r, c, o) => Object.assign({ t: 's', x: x, y: y, z: z, r: r, c: c }, o || {});
    const G = (x, y, z, r, c, o) => Object.assign({ t: 'g', x: x, y: y, z: z, r: r, c: c }, o || {});
    const D = (x, y, z, r, c, o) => Object.assign({ t: 'd', x: x, y: y, z: z, r: r, c: c, n: 16 }, o || {});
    const Q = Math.PI / 4, GL = '#A9C6E8', LIT = '#FFD27A', DIM = '#2A3858';
    const L = { B: B, C: C, K: K, S: S, G: G, D: D };
    L.island = (x, y, w, d, top, soil) => [B(x, y, -1.5, w, d, 1.3, soil), B(x, y, -0.2, w, d, 0.2, top)];
    L.room = (w, d, h, fl, wa, wb, so) => [B(0, 0, -1.45, w, d, 1.2, so), B(0, 0, -0.25, w, d, 0.25, fl), B(0, 0, 0, 0.3, d, h, wa), B(0.3, 0, 0, w - 0.3, 0.3, h, wb)];
    L.desk = (x, y, z, w, d, h, c) => { const lc = '#8C6A4A', t = 0.22, g = 0.2; return [
      B(x + 0.1, y + 0.1, z, g, g, h - t, lc), B(x + w - 0.1 - g, y + 0.1, z, g, g, h - t, lc),
      B(x + 0.1, y + d - 0.1 - g, z, g, g, h - t, lc), B(x + w - 0.1 - g, y + d - 0.1 - g, z, g, g, h - t, lc),
      B(x, y, z + h - t, w, d, t, c || '#B98B5E')]; };
    L.chair = (x, y, z, c) => { c = c || '#5C6E91'; const lg = function (a, b) { return B(x + a, y + b, z, 0.13, 0.13, 1.1, '#3D4A63'); }; return [lg(0.1, 0.1), lg(1.17, 0.1), lg(0.1, 1.17), lg(1.17, 1.17), B(x, y, z + 1.1, 1.4, 1.4, 0.2, c), B(x, y + 1.25, z + 1.3, 1.4, 0.18, 1.35, c)]; };
    L.laptop = (x, y, z) => [B(x, y, z, 1.8, 1.25, 0.08, '#C9CED8'), B(x, y - 0.06, z + 0.08, 1.8, 0.08, 1.2, '#596379'), B(x + 0.1, y + 0.02, z + 0.18, 1.6, 0.02, 1.0, GL, { nc: '#BFE3FF', e: 1 })];
    L.monitor = (x, y, z, w, h) => { w = w || 1.8; h = h || 1.15; return [B(x + w / 2 - 0.12, y - 0.3, z, 0.24, 0.24, 0.5, '#4A5468'), B(x, y, z + 0.45, w, 0.12, h, '#3D4A63'), B(x + 0.08, y + 0.12, z + 0.53, w - 0.16, 0.02, h - 0.16, GL, { nc: '#9FD4FF', e: 1 })]; };
    L.crt = (x, y, z) => [B(x, y, z, 1.2, 1.0, 0.95, '#D9D4C7'), B(x + 0.1, y + 1.0, z + 0.12, 1.0, 0.03, 0.72, GL, { nc: '#9FD4FF', e: 1 }), B(x + 0.18, y + 1.035, z + 0.58, 0.4, 0.01, 0.14, '#C7A35A', { nc: '#E0A84A' }), B(x + 0.18, y + 1.035, z + 0.3, 0.3, 0.01, 0.14, '#6E9C8F', { nc: '#5FC7B0' }), B(x + 0.6, y + 1.035, z + 0.3, 0.4, 0.01, 0.14, '#9C6B6B', { nc: '#E07A6A' })];
    L.lamp = (x, y, z) => [C(x, y, z, 0.28, 0.08, '#3D4A63', { n: 8 }), B(x - 0.05, y - 0.05, z + 0.08, 0.1, 0.1, 1.3, '#3D4A63'), K(x, y + 0.15, z + 1.15, 0.38, 0.45, '#3D4A63', { n: 8 }), S(x, y + 0.15, z + 1.1, 0.12, '#FFE7A8', { e: 1, a: 'dz-pulse' }), G(x, y + 0.5, z + 0.7, 2.8, '#FFD27A')];
    L.books = (x, y, z, n, cols) => { const o = []; let zz = z; for (let i = 0; i < n; i++) { const hh = 0.2 + (i % 2) * 0.06; o.push(B(x + ((i * 13) % 3) * 0.06, y + ((i * 7) % 3) * 0.05, zz, 1.25 - (i % 3) * 0.1, 0.9, hh, cols[i % cols.length])); zz += hh; } return o; };
    L.pine = (x, y, z, s) => [C(x, y, z, 0.13 * s, 0.6 * s, '#8C6A4A', { n: 6 }), K(x, y, z + 0.5 * s, 0.8 * s, 1.4 * s, '#5E8A5A', { n: 7 }), K(x, y, z + 1.25 * s, 0.58 * s, 1.15 * s, '#6E9A66', { n: 7 })];
    L.tree = (x, y, z, s) => [C(x, y, z, 0.14 * s, 0.8 * s, '#8C6A4A', { n: 6 }), C(x, y, z + 0.7 * s, 0.85 * s, 0.75 * s, '#7FA36B', { n: 7 }), K(x, y, z + 1.45 * s, 0.85 * s, 0.8 * s, '#8DB27A', { n: 7 })];
    L.palm = (x, y, z, s) => [C(x, y, z, 0.13 * s, 2.2 * s, '#9C7A55', { n: 6 }), K(x, y, z + 2.1 * s, 1.3 * s, 0.5 * s, '#6F9A5C', { n: 6, rot: 0.3 }), K(x, y, z + 2.4 * s, 0.7 * s, 0.4 * s, '#82AD6A', { n: 5 })];
    L.tower = (x, y, z, h) => [B(x - 0.65, y + 0.3, z + h * 0.72, 0.5, 0.1, 0.8, '#E8E2D6'), B(x + 0.3, y - 0.65, z + h * 0.72, 0.1, 0.5, 0.8, '#E8E2D6'), K(x, y, z, 0.95, h, '#AEB5C1', { n: 4, rot: Q }), B(x + 0.2, y + 0.35, z + h * 0.64, 0.45, 0.1, 0.75, '#E8E2D6'), S(x, y, z + h + 0.1, 0.15, '#D9573F', { e: 1, nc: '#FF6B5A', a: 'dz-blink' }), G(x, y, z + h, 1.8, '#FF6B5A', { a: 'dz-blink' })];
    L.rack = (x, y, z) => { const o = [B(x, y, z, 1.3, 1.8, 4.0, '#3D4A63')]; for (let j = 0; j < 5; j++) for (let k = 0; k < 3; k++) o.push(B(x + 1.3, y + 0.25 + k * 0.5, z + 0.5 + j * 0.7, 0.03, 0.14, 0.07, k % 2 ? '#7FD8A0' : '#9FD4FF', { e: 1, a: (j + k) % 3 === 0 ? 'dz-blink' : '' })); return o; };
    L.building = (x, y, z, w, d, h, c, roof, rows, cols) => { const o = [B(x, y, z, w, d, h, c), B(x - 0.15, y - 0.15, z + h, w + 0.3, d + 0.3, 0.22, roof)];
      const cw = (w - 0.6) / cols, rh = (h - 0.6) / rows, ww = Math.min(0.75, cw * 0.62), wh = Math.min(0.9, rh * 0.6);
      for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) { const lit = ((r * 3 + q * 5) % 4) !== 0; o.push(B(x + 0.3 + q * cw + (cw - ww) / 2, y + d, z + 0.4 + r * rh, ww, 0.03, wh, GL, { nc: lit ? LIT : DIM, e: lit ? 1 : 0, a: lit && (r + q) % 5 === 2 ? 'dz-flicker' : '' })); }
      const c2 = Math.max(1, Math.round((d - 0.6) / 1.1)), cd = (d - 0.6) / c2, wd = Math.min(0.75, cd * 0.62);
      for (let r = 0; r < rows; r++) for (let q = 0; q < c2; q++) { const lit = ((r * 5 + q * 3) % 3) !== 0; o.push(B(x + w, y + 0.3 + q * cd + (cd - wd) / 2, z + 0.4 + r * rh, 0.03, wd, wh, GL, { nc: lit ? LIT : DIM, e: lit ? 1 : 0 })); }
      return o; };
    L.house = (x, y, z, w, d, h, c, roof) => [B(x, y, z, w, d, h, c), K(x + w / 2, y + d / 2, z + h, Math.max(w, d) * 0.78, h * 0.75, roof, { n: 4, rot: Q }), B(x + w * 0.22, y + d, z, 0.45, 0.03, 0.8, '#8C6A4A'), B(x + w * 0.62, y + d, z + 0.55, 0.36, 0.03, 0.36, GL, { nc: LIT, e: 1 }), B(x + w, y + d * 0.35, z + 0.55, 0.03, 0.36, 0.36, GL, { nc: LIT, e: 1 })];
    L.plane = (x, y, z) => { const a = 'dz-bob'; return [B(x + 1.2, y - 1.4, z + 0.2, 0.9, 1.4, 0.08, '#D9D4C7', { a: a }), B(x, y, z, 3.2, 0.6, 0.6, '#EDEAE2', { a: a }), B(x, y + 0.25, z + 0.6, 0.55, 0.1, 0.75, '#7A93B8', { a: a }), B(x + 3.2, y + 0.1, z + 0.1, 0.35, 0.4, 0.4, '#E3DFD5', { a: a }), B(x + 2.9, y + 0.6, z + 0.32, 0.3, 0.01, 0.16, '#9FB3C9', { a: a, nc: '#FFE7A8', e: 1 }), B(x + 0.8, y + 0.6, z + 0.32, 1.7, 0.01, 0.12, '#B9C4D6', { a: a, nc: LIT, e: 1 }), B(x + 1.2, y + 0.6, z + 0.2, 0.9, 1.4, 0.08, '#D9D4C7', { a: a }), G(x + 3.7, y + 0.3, z + 0.3, 1.4, '#FFE7A8', { a: a })]; };
    L.car = (x, y, z, c) => [B(x + 0.25, y + 0.85, z, 0.4, 0.12, 0.3, '#2B3A5C'), B(x + 1.25, y + 0.85, z, 0.4, 0.12, 0.3, '#2B3A5C'), B(x, y, z + 0.15, 1.9, 0.95, 0.5, c || '#E8E2D6'), B(x + 0.45, y + 0.08, z + 0.65, 1.0, 0.8, 0.42, '#9FB3C9', { nc: '#3A4D75' }), G(x + 2.2, y + 0.5, z + 0.4, 1.6, '#FFE7A8')];
    L.lampPost = (x, y, z, h) => [C(x, y, z, 0.07, h, '#3D4A63', { n: 6 }), S(x, y, z + h + 0.12, 0.17, '#FFE7A8', { e: 1 }), G(x, y, z + h, 2.2, '#FFD27A')];
    L.bench = (x, y, z, c) => { c = c || '#B98B5E'; return [B(x, y - 0.05, z + 0.62, 1.8, 0.1, 0.55, c), B(x, y, z, 0.15, 0.6, 0.5, '#3D4A63'), B(x + 1.65, y, z, 0.15, 0.6, 0.5, '#3D4A63'), B(x, y, z + 0.5, 1.8, 0.7, 0.12, c)]; };
    L.frame = (x, y, z, w, h, k) => { const o = [B(x + w / 2 - 0.08, y - 0.25, z, 0.16, 0.2, h * 0.6, '#3D4A63'), B(x, y, z + h * 0.35, w, 0.12, h, '#2B3A5C'), B(x + 0.1, y + 0.12, z + h * 0.35 + 0.1, w - 0.2, 0.02, h - 0.2, '#F4EEDF', { nc: '#E8E2D6' })];
      const bw = (w - 0.6) / 4; for (let i = 0; i < 4; i++) { const cc = i % 2 ? '#7A93B8' : '#C7A35A'; o.push(B(x + 0.3 + i * bw, y + 0.145, z + h * 0.35 + 0.25, bw * 0.62, 0.01, (0.25 + ((i + k) % 4) * 0.17) * h * 0.55, cc, { nc: cc })); }
      o.push(B(x + 0.3, y + 0.145, z + h * 0.35 + h - 0.42, w * 0.35, 0.01, 0.1, '#13203A', { nc: '#13203A' })); return o; };
    L.brick = (x, y, z, c) => [B(x, y, z, 2, 1, 0.6, c), C(x + 0.5, y + 0.5, z + 0.6, 0.24, 0.16, c, { n: 10 }), C(x + 1.5, y + 0.5, z + 0.6, 0.24, 0.16, c, { n: 10 })];
    L.tent = (x, y, z, s) => [K(x, y, z, 1.1 * s, 1.2 * s, '#C7A35A', { n: 3, rot: 0.6 }), G(x, y, z + 0.3, 1.5 * s, '#FFD27A')];
    L.calendar = (x, y, z) => { const o = [B(x, y, z, 2.2, 0.05, 1.8, '#F7F3EA'), B(x, y + 0.05, z + 1.5, 2.2, 0.02, 0.3, '#7A93B8')]; for (let j = 0; j < 3; j++) for (let i = 0; i < 5; i++) o.push(B(x + 0.15 + i * 0.4, y + 0.05, z + 0.2 + j * 0.42, 0.3, 0.015, 0.3, (i + j * 5) === 7 ? '#C9785E' : '#E3DCCD')); return o; };
    L.board = (x, y, z, w, h) => { const o = [B(x, y, z, w, 0.06, h, '#F7F3EA', { nc: '#C9CFDA' }), B(x - 0.08, y, z - 0.1, w + 0.16, 0.25, 0.1, '#9AA3B2')]; const a = [0.6, 0.9, 0.7, 1.2, 1.0], b = [0.5, 0.8, 0.95, 0.9, 0.75]; const n = Math.floor((w - 0.3) / 0.68);
      for (let i = 0; i < n; i++) { o.push(B(x + 0.3 + i * 0.68, y + 0.06, z + 0.25, 0.24, 0.015, a[i % 5] * h * 0.6, '#2B3A5C', { nc: '#3C5A9C' })); o.push(B(x + 0.55 + i * 0.68, y + 0.06, z + 0.25, 0.24, 0.015, b[i % 5] * h * 0.6, '#A9B6CA', { nc: '#7F8FB0' })); } return o; };
    L.clock = (x, y, z, r) => [S(x, y, z, r, '#F7F3EA', { nc: '#D6DCE8' }), B(x - 0.03, y + 0.06, z, 0.06, 0.02, r * 0.7, '#13203A', { nc: '#13203A' }), B(x - 0.03, y + 0.06, z - 0.03, r * 0.55, 0.02, 0.06, '#13203A', { nc: '#13203A', a: 'dz-pulse' }), S(x, y + 0.08, z, 0.06, '#C9785E')];
    L.tape = (x, y, z) => [B(x - 0.95, y + 0.2, z, 0.85, 0.3, 0.012, '#C9CDD6'), C(x, y, z, 0.36, 0.3, '#B5B9C2', { n: 12 }), C(x, y, z + 0.3, 0.15, 0.006, '#5C6475', { n: 10 })];
    L.racking = (x, y, z, len, lv, seed) => { const o = [], cols = ['#C7A35A', '#B97A62', '#7A93B8', '#6E9C8F', '#D8CBB0'], H = lv * 1.0 + 0.3;
      o.push(B(x, y, z, 0.12, 0.12, H, '#4A5468'), B(x + len - 0.12, y, z, 0.12, 0.12, H, '#4A5468'));
      for (let l = 0; l < lv; l++) { const zz = z + 0.2 + l * 1.0; o.push(B(x, y, zz, len, 1.0, 0.06, '#C98A5A')); const m = Math.floor((len - 0.2) / 0.8);
        for (let i = 0; i < m; i++) { if ((i * 3 + l + seed) % 5 === 4) continue; o.push(B(x + 0.15 + i * 0.8, y + 0.12, zz + 0.06, 0.62, 0.78, 0.36 + ((i + l + seed) % 3) * 0.12, cols[(i + l * 2 + seed) % 5])); } }
      o.push(B(x, y + 0.88, z, 0.12, 0.12, H, '#4A5468'), B(x + len - 0.12, y + 0.88, z, 0.12, 0.12, H, '#4A5468')); return o; };
    L.erd = (x, y, z, w, h) => [B(x, y, z, w, 0.06, h, '#F7F3EA', { nc: '#C9CFDA' }), B(x + 0.3, y + 0.06, z + h - 0.9, 0.9, 0.015, 0.6, '#7A93B8'), B(x + w - 1.2, y + 0.06, z + h - 1.0, 0.9, 0.015, 0.6, '#6E9C8F'), B(x + w / 2 - 0.45, y + 0.06, z + 0.3, 0.9, 0.015, 0.6, '#C7A35A'), B(x + 1.2, y + 0.065, z + h - 0.65, w - 2.4, 0.01, 0.05, '#3D4A63'), B(x + w / 2 - 0.025, y + 0.065, z + 0.9, 0.05, 0.01, h - 1.55, '#3D4A63')];
    L.neon = (x, y, z, w, h, c) => [B(x, y, z, w, 0.05, h, '#4A5468', { nc: '#1E2A44' }), B(x + 0.1, y + 0.05, z + 0.1, w - 0.2, 0.02, h - 0.2, c, { e: 1, nc: c, a: 'dz-flicker' }), G(x + w / 2, y + 0.3, z + h / 2, Math.max(w, h) * 1.2, c, { a: 'dz-flicker' })];
    L.cross = (x, y, z, s, c) => [B(x - 0.15 * s, y, z, 0.3 * s, 0.05, 0.9 * s, c, { e: 1, nc: '#7FD8CB' }), B(x - 0.45 * s, y, z + 0.3 * s, 0.9 * s, 0.05, 0.3 * s, c, { e: 1, nc: '#7FD8CB' })];
    L.mountain = (x, y, r, h, c) => [K(x, y, 0, r, h, c, { n: 6, rot: 0.25 })];
    return L;
  }

  // ---------- SCENES: authored back to front; each has cameras (focus point + zoom) ----------
  scene(id, opt) {
    const L = this.lib(), B = L.B, C = L.C, K = L.K, S = L.S, G = L.G, I = [];
    const add = function () { const push = function (x) { if (Array.isArray(x)) x.forEach(push); else if (x) I.push(x); }; for (let i = 0; i < arguments.length; i++) push(arguments[i]); };
    const bc = ['#7A93B8', '#C7A35A', '#9C6B6B', '#6E9C8F', '#D8CBB0', '#8E7AA8'];
    const Q = Math.PI / 4;
    const def = { items: I, fog: 0.22, cams: {} };

    if (id.indexOf('p-') === 0) {
      def.kit = true; def.fog = 0; def.label = 'Prop: ' + id.slice(2);
      const m = { desk: () => L.desk(0, 0, 0, 3, 1.6, 1.6), chair: () => L.chair(0, 0, 0), laptop: () => L.laptop(0, 0.1, 0), monitor: () => L.monitor(0, 0.4, 0, 1.8, 1.15), crt: () => L.crt(0, 0, 0), lamp: () => L.lamp(0, 0, 0), books: () => L.books(0, 0, 0, 5, bc), pine: () => L.pine(0, 0, 0, 1), tree: () => L.tree(0, 0, 0, 1), palm: () => L.palm(0, 0, 0, 1), tower: () => L.tower(0, 0, 0, 6), rack: () => L.rack(0, 0, 0), building: () => L.building(0, 0, 0, 3, 2.4, 3.6, '#E6D9C3', '#B97A62', 3, 2), house: () => L.house(0, 0, 0, 2, 1.6, 1.4, '#EADCC2', '#8C5A48'), plane: () => L.plane(0, 0, 0), car: () => L.car(0, 0, 0), lamppost: () => L.lampPost(0, 0, 0, 3), bench: () => L.bench(0, 0, 0), frame: () => L.frame(0, 0, 0, 1.9, 1.5, 1), brick: () => L.brick(0, 0, 0, '#D9A441'), tent: () => L.tent(0, 0, 0, 1), calendar: () => L.calendar(0, 0, 0), board: () => L.board(0, 0, 0, 3.8, 2.4), clock: () => L.clock(0, 0, 0, 0.8), tape: () => L.tape(1, 0, 0), racking: () => L.racking(0, 0, 0, 4, 3, 1), erd: () => L.erd(0, 0, 0, 4.2, 2.6), neon: () => L.neon(0, 0, 0, 2, 0.6, '#4FD1C5'), mountain: () => L.mountain(0, 0, 2, 3.2, '#B79E80') };
      add((m[id.slice(2)] || m.desk)());
      return def;
    }

    if (id === 'room') {
      def.label = 'Student’s room diorama: a desk with books and a laptop, a bookshelf, a pinboard and a window onto a city';
      def.sky = ['#E4ECF5', '#F6F2EA']; def.nsky = ['#0F1A33', '#22325A']; def.fog = 0.12;
      add(opt && opt.fill ? L.room(17, 15, 11, '#D8C09C', '#E7DFD0', '#EFE8DA', '#9C8670') : L.room(12, 10, 6.2, '#D8C09C', '#E7DFD0', '#EFE8DA', '#9C8670'));
      add(B(3.0, 4.7, 0, 6.4, 4.0, 0.03, '#C8CFDC'), B(4.6, 3.5, 0.03, 4.6, 2.6, 0.005, '#FFF1C4', { dn: 'd', op: 0.6 }));
      add(B(1.1, 0.3, 2.9, 2.7, 0.06, 1.9, '#C4A27A'));
      add(L.D(2.45, 0.31, 5.45, 0.44, '#3D4A63'), L.D(2.45, 0.33, 5.45, 0.37, '#F7F3EA', { nc: '#D9DEE8' }), B(2.425, 0.34, 5.45, 0.05, 0.005, 0.24, '#13203A'), B(2.45, 0.34, 5.425, 0.3, 0.005, 0.05, '#13203A'), L.D(2.45, 0.35, 5.45, 0.045, '#13203A', { n: 8 }));
      add(B(1.3, 0.36, 3.95, 0.55, 0.02, 0.55, '#F2D98A', { a: 'dz-bob' }), B(2.0, 0.36, 4.05, 0.55, 0.02, 0.55, '#BFD8C9'), B(2.75, 0.36, 3.9, 0.8, 0.02, 0.65, '#F7F3EA'), B(1.35, 0.36, 3.1, 0.8, 0.02, 0.6, '#C9D6EE'), B(2.3, 0.36, 3.05, 0.55, 0.02, 0.55, '#F4C4B8'));
      add(B(5.0, 0.3, 2.3, 4.6, 0.06, 3.1, '#F7F3EA'), B(5.2, 0.36, 2.5, 4.2, 0.02, 2.7, '#BBD7EE', { nc: '#1C2B50' }));
      add(S(8.5, 0.37, 4.55, 0.32, '#FFF3CF', { dn: 'd' }), S(8.4, 0.37, 4.6, 0.22, '#E9EDF5', { dn: 'n', nc: '#E9EDF5', e: 1 }));
      [[5.25, 0.55, 0.9], [5.85, 0.5, 1.5], [6.4, 0.7, 0.7], [7.15, 0.5, 1.7], [7.7, 0.6, 1.1], [8.35, 0.45, 1.35], [8.85, 0.5, 0.8]].forEach(function (b, i) {
        add(B(b[0], 0.385, 2.5, b[1], 0.01, b[2], '#A6B8CC', { nc: '#2A3B63' }));
        add(B(b[0] + 0.12, 0.396, 2.5 + b[2] - 0.42, 0.1, 0.004, 0.12, '#A6B8CC', { nc: '#FFD27A', e: 1, dn: 'n', a: i % 2 ? 'dz-flicker' : '' }));
        add(B(b[0] + 0.3, 0.396, 2.5 + b[2] * 0.45, 0.1, 0.004, 0.12, '#A6B8CC', { nc: '#FFD27A', e: 1, dn: 'n' }));
      });
      add(B(7.25, 0.4, 2.5, 0.1, 0.02, 2.7, '#F7F3EA'), B(5.2, 0.4, 3.75, 4.2, 0.02, 0.1, '#F7F3EA'), B(4.9, 0.36, 2.2, 4.8, 0.4, 0.12, '#F7F3EA'));
      add(B(0.3, 1.3, 0, 1.25, 3.5, 5.0, '#A77E57'));
      for (let s = 0; s < 4; s++) { add(B(1.55, 1.35, 0.25 + s * 1.2, 0.05, 3.4, 0.06, '#8C6A4A')); for (let i = 0; i < 8; i++) { if ((i + s * 3) % 7 === 6) continue; add(B(1.55, 1.45 + i * 0.4, 0.31 + s * 1.2, 0.06, 0.32, 0.62 + ((i * 7 + s * 3) % 4) * 0.09, bc[(i + s) % 6])); } }
      add(B(0.3, 6.1, 2.8, 0.06, 1.7, 1.25, '#F4EEDF'), B(0.36, 6.25, 2.95, 0.02, 1.4, 0.95, '#C9D6EE'));
      add(L.desk(4.0, 0.6, 0, 6.6, 2.5, 2.4));
      add(B(8.3, 0.7, 2.405, 2.3, 2.1, 0.004, '#FFE2A0', { dn: 'n', nc: '#B8924F', op: 0.55 }));
      add(L.books(4.3, 0.85, 2.4, 4, bc));
      add(L.laptop(6.3, 1.35, 2.4));
      add(B(6.55, 1.395, 2.75, 0.25, 0.01, 0.3, '#6E8FB8', { nc: '#2F5C99' }), B(6.9, 1.395, 2.75, 0.25, 0.01, 0.5, '#6E8FB8', { nc: '#2F5C99' }), B(7.25, 1.395, 2.75, 0.25, 0.01, 0.7, '#C7A35A', { nc: '#B07A2A' }), B(7.6, 1.395, 3.3, 0.3, 0.01, 0.08, '#9FB0C8', { nc: '#4A6FA8' }));
      add(B(8.55, 1.5, 2.4, 0.8, 1.1, 0.05, '#F4EEDF'), B(9.37, 1.5, 2.4, 0.8, 1.1, 0.05, '#ECE4D2'));
      add(C(8.3, 2.75, 2.4, 0.17, 0.32, '#E8E2D6', { n: 10 }));
      add(L.lamp(10.05, 1.0, 2.4));
      add(L.chair(6.5, 3.6, 0, '#5C6E91'));
      add(B(10.6, 3.4, 0, 1.1, 0.65, 0.55, '#B97A62'), B(10.95, 3.65, 0.55, 0.4, 0.12, 0.14, '#3D4A63'));
      add(L.books(9.6, 7.0, 0, 3, bc));
      add(C(1.3, 8.5, 0, 0.45, 0.7, '#B97A62', { n: 8 }), K(1.3, 8.5, 0.7, 0.75, 1.5, '#7FA36B', { n: 7 }), K(1.3, 8.5, 1.55, 0.52, 1.1, '#8DB27A', { n: 7 }));
      def.cams = { desk: { x: 7.2, y: 1.8, z: 2.8, zoom: 1.45 }, window: { x: 7.3, y: 0.4, z: 3.8, zoom: 1.75 }, shelf: { x: 1.5, y: 3.0, z: 2.6, zoom: 1.75 }, laptop: { x: 7.2, y: 1.6, z: 3.0, zoom: 2.2 }, board: { x: 2.4, y: 0.4, z: 3.9, zoom: 2.1 }, lamp: { x: 9.6, y: 1.4, z: 3.1, zoom: 1.95 }, tools: { x: 10.4, y: 3.5, z: 1.0, zoom: 1.9 }, fill: { fill: [2.0, 2.4, 17] }, pov: { pov: { eye: [12.6, 10.8, 4.4], at: [4.0, 2.2, 3.0], fov: 74 } }, povShelf: { pov: { eye: [8.8, 6.6, 4.4], at: [0.9, 2.6, 3.3], fov: 70, off: -0.27 } }, povLaptop: { pov: { eye: [8.4, 6.6, 4.0], at: [6.9, 1.4, 2.9], fov: 60, off: 0.2 } }, povBoard: { pov: { eye: [7.2, 8.0, 4.4], at: [2.45, 0.3, 4.2], fov: 64, off: -0.2 } }, povLamp: { pov: { eye: [13.4, 9.0, 4.3], at: [10.4, 2.4, 1.5], fov: 68, off: 0.18 } }, povShelfR: { pov: { eye: [8.8, 6.6, 4.4], at: [0.9, 2.6, 3.3], fov: 70, off: 0.22 } }, povWindow: { pov: { eye: [9.6, 7.4, 4.3], at: [7.3, 0.4, 3.6], fov: 66, off: 0.2 } } };
    } else if (id === 'campus') {
      def.label = 'University campus diorama: a lecture building with a clock tower, an antenna lab and a design studio with a CRT, a wall calendar and an academic book';
      def.sky = ['#CFE1F2', '#F5EFE3']; def.nsky = ['#0D1631', '#283A66']; def.orb = true; def.clouds = true; def.stars = true; def.fog = 0.2;
      add(L.island(-1, -1, 16, 14, '#A9C08F', '#A88C72'));
      add(B(6.2, -1, 0, 1.8, 14, 0.02, '#E4DCCB'));
      add(L.building(0, 0, 0, 5.2, 3.6, 4.4, '#E6D9C3', '#B97A62', 3, 3));
      add(B(1.9, 1.2, 4.62, 1.4, 1.2, 1.4, '#E6D9C3'), K(2.6, 1.8, 6.02, 1.05, 1.0, '#8C5A48', { n: 4, rot: Q }), S(2.6, 2.42, 5.3, 0.32, '#F7F3EA', { nc: '#FFE7A8', e: 1 }));
      add(L.pine(9.2, 1.0, 0, 1.1));
      add(B(10.5, 0.6, 0, 2.4, 2.0, 1.6, '#DCD3C2'), B(10.4, 0.5, 1.6, 2.6, 2.2, 0.18, '#9AA3B2'));
      add(L.tower(13.4, 2.2, 0, 7.5));
      add(L.pine(0.6, 5.0, 0, 1.0), L.tree(3.2, 5.6, 0, 1.0), L.pine(14.4, 5.4, 0, 0.9));
      add(B(7.6, 5.4, 0, 6.6, 5.8, 0.25, '#D8C09C'));
      add(B(7.6, 5.4, 0.25, 0.25, 5.8, 3.0, '#EFE8DA'), B(7.85, 5.4, 0.25, 6.35, 0.25, 3.0, '#E7DFD0'));
      add(L.calendar(8.6, 5.65, 1.2));
      add(L.desk(10.6, 5.9, 0.25, 3.2, 1.5, 1.4));
      add(B(10.8, 6.1, 1.65, 0.45, 0.9, 1.05, '#CFC9BC'));
      add(L.crt(11.3, 6.05, 1.65));
      add(B(11.4, 7.08, 1.65, 1.1, 0.3, 0.05, '#E8E2D6'), B(12.75, 6.9, 1.65, 0.65, 0.45, 0.04, '#3D4A63'));
      add(L.desk(8.2, 7.6, 0.25, 2.2, 1.4, 1.3));
      add(B(8.4, 7.8, 1.55, 0.9, 1.0, 0.35, '#7A93B8'), B(8.45, 7.85, 1.9, 0.85, 0.95, 0.12, '#F4EEDF'), B(9.5, 7.9, 1.55, 0.7, 0.95, 0.04, '#C7A35A'));
      add(L.chair(11.4, 7.5, 0.25, '#5C6E91'), L.chair(8.7, 9.2, 0.25, '#6E9C8F'));
      add(B(12.9, 9.6, 0.25, 0.9, 0.9, 0.5, '#D8CBB0'), S(13.35, 10.05, 1.35, 0.32, '#C9785E', { a: 'dz-bob' }));
      add(L.lampPost(5.6, 6.5, 0, 3.2), L.lampPost(5.6, 11.5, 0, 3.2));
      add(L.tree(2.2, 10.5, 0, 1.1), L.pine(4.2, 12.2, 0, 0.8));
      def.cams = { lecture: { x: 2.6, y: 2.0, z: 3.0, zoom: 1.7 }, lab: { x: 12.4, y: 1.8, z: 3.0, zoom: 1.6 }, studio: { x: 11.9, y: 6.6, z: 2.2, zoom: 2.1 }, calendar: { x: 9.7, y: 5.7, z: 2.1, zoom: 2.3 }, duo: { x: 10.0, y: 8.4, z: 1.4, zoom: 1.7 }, flash: { x: 12.9, y: 9.6, z: 1.0, zoom: 2.2 }, pavilion: { x: 10.6, y: 7.6, z: 1.4, zoom: 1.35 }, proud: { x: 9.3, y: 7.0, z: 1.8, zoom: 1.7 } };
    } else if (id === 'server') {
      def.label = 'Server room diorama: server racks, a wall clock, a today vs. yesterday board, a desk with a roll of duct tape and three post cards on a small stage';
      def.sky = ['#F1DFC4', '#F6EFE3']; def.nsky = ['#0E1530', '#2A2F55']; def.fog = 0.12;
      add(L.room(13, 10.5, 5.6, '#C9CDD6', '#DAD4C8', '#E6E0D3', '#B59A7A'));
      for (let i = 0; i < 4; i++) add(L.rack(0.55, 0.9 + i * 2.2, 0));
      add(L.clock(5.6, 0.3, 3.9, 0.8));
      add(L.board(7.6, 0.3, 1.4, 3.8, 2.4));
      add(B(11.3, 0.3, 0, 1.5, 0.7, 2.6, '#A77E57'));
      for (let i = 0; i < 4; i++) add(B(11.42 + i * 0.33, 1.0, 1.4, 0.26, 0.05, 0.85 - (i % 2) * 0.12, bc[i]), B(11.42 + i * 0.33, 1.0, 0.3, 0.26, 0.05, 0.8 - ((i + 1) % 2) * 0.1, bc[i + 2]));
      add(L.desk(4.6, 4.0, 0, 3.8, 1.7, 2.0));
      add(L.monitor(5.4, 4.35, 2.0, 2.1, 1.25));
      add(B(5.7, 4.495, 3.2, 0.35, 0.01, 0.22, '#C7A35A', { nc: '#F0B860' }), B(6.4, 4.495, 2.75, 0.35, 0.01, 0.22, '#6E9C8F', { nc: '#6FD0C2' }), B(6.95, 4.495, 3.25, 0.35, 0.01, 0.22, '#7A93B8', { nc: '#93A8FF' }), B(6.05, 4.497, 3.29, 0.9, 0.006, 0.03, '#9AA3B2'), B(6.55, 4.497, 2.97, 0.03, 0.006, 0.3, '#9AA3B2'));
      add(B(4.85, 4.95, 2.0, 0.9, 0.6, 0.03, '#F4EEDF'));
      add(L.tape(7.75, 5.0, 2.0));
      add(L.chair(5.7, 6.0, 0, '#5C6E91'));
      add(B(9.2, 6.4, 0, 3.4, 3.4, 0.3, '#7A93B8'));
      for (let i = 0; i < 3; i++) { add(B(9.45 + i * 1.05, 7.0 + i * 0.35, 0.3, 0.85, 0.08, 1.2, '#F7F3EA', { nc: '#E3E7EF' })); add(B(9.6 + i * 1.05, 7.08 + i * 0.35, 0.95, 0.55, 0.01, 0.35, '#C9D6EE'), B(9.6 + i * 1.05, 7.08 + i * 0.35, 0.55, 0.4, 0.01, 0.06, '#9AA3B2')); }
      add(S(10.95, 8.6, 2.3, 0.24, '#E8B84A', { e: 1, nc: '#FFD27A', a: 'dz-pulse' }), G(10.95, 8.6, 2.3, 1.7, '#F0C060', { day: 1, a: 'dz-pulse' }));
      def.cams = { racks: { x: 1.4, y: 4.2, z: 2.2, zoom: 1.6 }, desk: { x: 6.5, y: 4.6, z: 2.9, zoom: 2.0 }, tape: { x: 7.4, y: 5.0, z: 2.2, zoom: 2.5 }, clock: { x: 5.6, y: 0.4, z: 3.9, zoom: 2.2 }, board: { x: 9.5, y: 0.4, z: 2.6, zoom: 1.9 }, stage: { x: 10.8, y: 7.8, z: 1.0, zoom: 1.8 }, books: { x: 12.0, y: 0.9, z: 1.6, zoom: 2.2 } };
    } else if (id === 'telkomsel') {
      def.label = 'Telkomsel diorama: a radio tower, an operations office with a spreadsheet screen and a Google Earth screen, a rural road with a drive-test car and a hut';
      def.sky = ['#F3C8A8', '#F7E8D6']; def.nsky = ['#070E24', '#1B2A52']; def.orb = true; def.stars = true; def.fog = 0.25; def.haze = '#F2DCC8';
      add(L.island(-1, -1, 16, 13, '#9DB884', '#9C8268'));
      add(B(-1, 7.2, 0, 16, 1.8, 0.02, '#8E949E'));
      for (let i = 0; i < 6; i++) add(B(-0.5 + i * 2.8, 8.0, 0.02, 1.2, 0.15, 0.005, '#EDE7D8'));
      add(B(0.6, 4.6, 0, 4.4, 2.2, 0.12, '#D8C09C'));
      add(L.building(0.2, 0.4, 0, 5.4, 3.6, 3.2, '#DCD3C2', '#7A8597', 2, 4));
      add(L.palm(7.6, 1.0, 0, 1.0));
      add(B(9.0, 1.6, 0, 1.8, 1.4, 1.3, '#E8E2D6'), B(8.9, 1.5, 1.3, 2.0, 1.6, 0.12, '#9AA3B2'));
      add(L.tower(11.6, 2.6, 0, 9.0));
      add(L.desk(1.0, 4.8, 0.12, 3.2, 1.2, 1.4));
      add(L.monitor(1.3, 5.0, 1.52, 1.4, 0.95));
      for (let r = 0; r < 4; r++) for (let q = 0; q < 4; q++) add(B(1.42 + q * 0.29, 5.145, 2.12 + r * 0.17, 0.25, 0.005, 0.12, r === 3 ? '#6E8FB8' : '#EEF3F8', { nc: r === 3 ? '#4A6FA8' : '#CFE6FF' }));
      add(L.monitor(2.9, 5.0, 1.52, 1.1, 0.95));
      add(S(3.45, 5.16, 2.45, 0.3, '#5E9A7A', { nc: '#4FB08A', e: 1 }));
      add(B(4.4, 4.75, 0.12, 0.55, 0.8, 1.6, '#3D4A63'));
      for (let j = 0; j < 4; j++) add(B(4.95, 4.85 + (j % 2) * 0.3, 0.45 + j * 0.3, 0.03, 0.12, 0.06, j % 2 ? '#7FD8A0' : '#9FD4FF', { e: 1, a: j === 1 ? 'dz-blink' : '' }));
      add(L.chair(1.8, 6.2, 0.12, '#5C6E91'));
      add(L.palm(14.0, 5.6, 0, 1.1));
      add(L.car(6.2, 7.4, 0, '#E8E2D6'));
      add(L.house(12.2, 9.6, 0, 2.0, 1.6, 1.4, '#E2D2B6', '#8C5A48'));
      add(L.palm(0.8, 10.6, 0, 0.9), L.tree(5.6, 10.8, 0, 1.0));
      def.cams = { tower: { x: 11.4, y: 2.4, z: 5.0, zoom: 1.4 }, desk: { x: 2.4, y: 5.2, z: 2.0, zoom: 2.0 }, road: { x: 7.0, y: 8.0, z: 0.6, zoom: 1.6 }, office: { x: 2.9, y: 2.6, z: 1.8, zoom: 1.5 }, earth: { x: 3.45, y: 5.1, z: 2.3, zoom: 2.4 }, team: { x: 2.6, y: 5.6, z: 1.0, zoom: 1.45 }, dw: { x: 4.4, y: 5.1, z: 1.2, zoom: 2.1 }, hut: { x: 12.0, y: 9.4, z: 1.0, zoom: 1.8 } };
    } else if (id === 'trying') {
      def.label = 'A year of trying: an empty road, a desk of job applications and a plane over a runway';
      def.sky = ['#DDE3EA', '#EEF0F1']; def.nsky = ['#101A33', '#2B3A5E']; def.fog = 0.5; def.haze = '#E6EAEF'; def.nhaze = '#25325A';
      add(L.island(-1, -1, 16, 13, '#AFC0A4', '#9C8A78'));
      add(B(6.5, -0.5, 0, 8, 2.6, 0.02, '#5C6575'));
      add(B(-1, 5.0, 0, 16, 2.0, 0.02, '#8E949E'));
      for (let i = 0; i < 6; i++) add(B(-0.5 + i * 2.8, 5.95, 0.02, 1.2, 0.12, 0.005, '#EDE7D8'));
      add(B(1.0, 8.2, 0, 5.0, 3.2, 0.15, '#D8C09C'));
      for (let i = 0; i < 9; i++) add(S(6.8 + i * 0.9, -0.3, 0.1, 0.07, '#E8E2D6', { nc: '#FFE7A8', e: 1, a: i % 2 ? 'dz-blink' : '' }), S(6.8 + i * 0.9, 1.9, 0.1, 0.07, '#E8E2D6', { nc: '#FFE7A8', e: 1 }));
      add(L.house(0.5, 0.3, 0, 2.4, 2.0, 1.8, '#E2D9CA', '#7A8597'));
      add(L.plane(9.0, 0.4, 1.6));
      add(L.lampPost(6.5, 4.6, 0, 3.0), L.lampPost(12.5, 4.6, 0, 3.0));
      add(L.desk(1.6, 8.5, 0.15, 3.4, 1.5, 1.4));
      for (let i = 0; i < 3; i++) add(B(1.9 + i * 0.75, 8.75, 1.55, 0.6, 0.85, 0.08 + i * 0.07, '#F7F3EA'));
      add(B(4.1, 9.4, 1.55, 0.6, 0.4, 0.03, '#E8D9B0'));
      add(L.lamp(4.6, 8.6, 1.55));
      add(L.chair(2.6, 10.2, 0.15, '#5C6E91'), L.books(4.5, 10.2, 0.15, 4, ['#7A93B8', '#C7A35A', '#6E9C8F', '#9C6B6B']));
      add(C(9.5, 7.6, 0, 0.07, 2.2, '#8C6A4A', { n: 6 }), B(9.5, 7.5, 1.7, 1.4, 0.1, 0.35, '#E8E2D6'), B(8.7, 7.65, 1.25, 1.0, 0.1, 0.32, '#E8E2D6'));
      add(L.pine(13.0, 8.5, 0, 1.1), L.pine(14.0, 10.0, 0, 0.9), L.tree(7.4, 10.6, 0, 1.0));
      def.cams = { desk: { x: 3.4, y: 9.4, z: 1.6, zoom: 1.9 }, plane: { x: 10.6, y: 0.6, z: 1.8, zoom: 1.8 }, road: { x: 7.0, y: 6.0, z: 0.5, zoom: 1.5 }, house: { x: 1.7, y: 1.3, z: 1.2, zoom: 2.0 }, sign: { x: 9.3, y: 7.6, z: 1.4, zoom: 2.2 } };
    } else if (id === 'ericsson') {
      def.label = 'Ericsson years: a Saudi city with flat-roofed buildings, telecom towers and palms, and a Hajj dashboard room with a video wall';
      def.sky = ['#BFD8EE', '#F6EAD6']; def.nsky = ['#2A2550', '#D98B6A']; def.nmix = '#3A2E55'; def.orb = true; def.fog = 0.28; def.haze = '#F1E4CC'; def.nhaze = '#6A4E6A';
      add(L.island(-1, -1, 17, 13, '#E2CFA8', '#B59A7A'));
      add(B(-1, 9.6, 0, 9, 1.8, 0.02, '#A7A29A'));
      add(B(8.4, 5.4, 0, 7.0, 5.6, 0.2, '#D6D0C4'));
      [[0, 0, 2.2, 2, 3.2], [2.6, 0.2, 1.8, 1.8, 4.6], [4.8, 0, 2.4, 1.6, 2.6], [7.6, 0.3, 1.6, 1.6, 5.4], [0.2, 2.6, 1.8, 1.6, 2.2]].forEach(function (b, i) { add(L.building(b[0], b[1], 0, b[2], b[3], b[4], i % 2 ? '#EADCC2' : '#E3D2B4', '#CDB892', Math.max(1, Math.floor(b[4] / 1.2)), 2)); });
      add(L.tower(10.6, 1.2, 0, 8.5), L.tower(14.6, 3.2, 0, 6.5));
      for (let tx = 0; tx < 5; tx++) for (let ty = 0; ty < 2; ty++) add(K(0.7 + tx * 0.95, 7.7 + ty * 0.95, 0, 0.5, 0.75, '#F4F1EA', { n: 4, rot: Q, nc: '#FFE2A0', e: 1, a: (tx + ty) % 3 === 0 ? 'dz-flicker' : '' }));
      add(L.palm(6.8, 5.2, 0, 1.2));
      add(L.desk(2.2, 4.6, 0, 2.6, 1.3, 1.4), L.laptop(2.8, 4.85, 1.4), L.lamp(4.4, 4.8, 1.4), L.chair(2.8, 5.95, 0, '#5C6E91'));
      add(B(0.5, 4.8, 0, 0.8, 0.45, 0.65, '#9C6B6B'), B(0.75, 4.95, 0.65, 0.3, 0.12, 0.12, '#3D4A63'), B(1.4, 5.1, 0, 0.6, 0.4, 0.5, '#7A93B8'), B(1.58, 5.22, 0.5, 0.24, 0.1, 0.1, '#3D4A63'), L.palm(7.3, 8.0, 0, 1.1));
      add(B(8.4, 5.4, 0.2, 0.25, 5.6, 3.2, '#EFE8DA'), B(8.65, 5.4, 0.2, 6.75, 0.25, 3.2, '#E7DFD0'));
      add(B(9.2, 5.65, 0.9, 5.4, 0.06, 2.2, '#2B3A5C'));
      for (let i = 0; i < 3; i++) add(B(9.35 + i * 1.75, 5.71, 1.05, 1.6, 0.02, 1.9, '#A9C6E8', { nc: '#9FD4FF', e: 1, a: i === 1 ? 'dz-pulse' : '' }));
      for (let i = 0; i < 4; i++) add(B(9.5 + i * 0.36, 5.735, 1.25, 0.22, 0.01, 0.3 + (i % 3) * 0.35, '#2F5C99'));
      add(B(11.2, 5.735, 1.3, 1.1, 0.01, 1.3, '#7FA36B', { nc: '#2E7A5A' }), S(11.5, 5.74, 2.0, 0.08, '#D9573F', { e: 1, a: 'dz-blink' }), S(11.95, 5.74, 1.7, 0.08, '#D9573F', { e: 1 }));
      for (let i = 0; i < 4; i++) add(B(12.95 + i * 0.36, 5.735, 1.25, 0.22, 0.01, 0.9 - (i % 3) * 0.25, '#C7A35A', { nc: '#F0B860' }));
      add(L.desk(9.6, 7.6, 0.2, 4.2, 1.5, 1.35));
      add(L.monitor(10.0, 7.85, 1.55, 1.3, 0.85), L.monitor(11.6, 7.85, 1.55, 1.3, 0.85));
      add(L.chair(10.4, 9.3, 0.2, '#5C6E91'), L.chair(12.0, 9.3, 0.2, '#6E9C8F'));
      add(L.car(2.2, 9.9, 0, '#E8E2D6'));
      def.cams = { room: { x: 11.8, y: 7.0, z: 2.0, zoom: 1.55 }, wall: { x: 11.9, y: 5.7, z: 2.0, zoom: 2.0 }, towers: { x: 11.0, y: 2.0, z: 4.5, zoom: 1.4 }, city: { x: 4.0, y: 1.2, z: 2.6, zoom: 1.5 }, tents: { x: 2.6, y: 8.2, z: 0.4, zoom: 1.9 }, leader: { x: 3.4, y: 5.1, z: 1.6, zoom: 2.0 }, console: { x: 11.4, y: 8.0, z: 1.7, zoom: 2.0 }, bags: { x: 1.3, y: 5.1, z: 0.5, zoom: 2.1 } };
    } else if (id === 'kanzway') {
      def.label = 'Kanzway warehouse: catalog shelves of industrial tools, an ERD board, a pallet and a small team at three desks';
      def.sky = ['#D5DAE0', '#EDEDEB']; def.nsky = ['#141B2E', '#2A3450']; def.fog = 0.15; def.haze = '#E3E6EA';
      add(L.room(14, 11, 6, '#C9C4BA', '#D6D0C4', '#DED8CC', '#9A8C7C'));
      add(B(1.0, 7.4, 0, 3.6, 2.2, 0.01, '#E3C86A', { op: 0.6 }));
      add(L.racking(0.6, 0.6, 0, 5.6, 4, 0), L.racking(0.6, 2.6, 0, 5.6, 4, 2), L.racking(0.6, 4.6, 0, 5.6, 3, 1));
      add(L.erd(7.2, 0.3, 1.4, 4.2, 2.6));
      add(L.desk(7.4, 5.2, 0, 2.6, 1.3, 1.5), L.monitor(7.9, 5.4, 1.5, 1.4, 0.9), L.chair(8.0, 6.7, 0, '#5C6E91'));
      add(L.desk(10.6, 5.2, 0, 2.6, 1.3, 1.5), L.monitor(11.1, 5.4, 1.5, 1.4, 0.9), L.chair(11.2, 6.7, 0, '#6E9C8F'));
      add(B(2.0, 7.6, 0, 2.2, 1.6, 0.25, '#B98B5E'), B(2.2, 7.8, 0.25, 0.9, 0.7, 0.7, '#C7A35A'), B(3.15, 7.8, 0.25, 0.85, 0.7, 0.55, '#B97A62'), B(2.4, 8.55, 0.25, 1.5, 0.6, 0.5, '#D8CBB0'));
      add(L.desk(7.4, 8.0, 0, 2.6, 1.3, 1.5), L.laptop(7.8, 8.3, 1.5), L.chair(8.0, 9.4, 0, '#C7A35A'));
      for (let i = 0; i < 3; i++) add(C(4.0 + i * 3.5, 5.0, 5.4, 0.03, 0.6, '#3D4A63', { n: 4 }), K(4.0 + i * 3.5, 5.0, 4.9, 0.45, 0.5, '#5C6E91', { n: 8 }), S(4.0 + i * 3.5, 5.0, 4.85, 0.12, '#FFE7A8', { e: 1 }), G(4.0 + i * 3.5, 5.0, 3.0, 3.4, '#FFD27A'));
      def.cams = { erd: { x: 9.3, y: 0.4, z: 2.7, zoom: 1.9 }, shelves: { x: 3.4, y: 3.0, z: 2.2, zoom: 1.5 }, team: { x: 9.9, y: 6.5, z: 1.5, zoom: 1.7 } };
    } else if (id === 'community') {
      def.label = 'Learning through community: a park with a bar-chart sculpture, a dojo and a gym, in light rain';
      def.sky = ['#C9D3DE', '#E9ECEE']; def.nsky = ['#0B1026', '#1F1B45']; def.nmix = '#24204A'; def.rain = true; def.fog = 0.3; def.haze = '#DCE2E8'; def.nhaze = '#231F4A'; def.clouds = true;
      add(L.island(-1, -1, 17, 13, '#9FB98A', '#9C8268'));
      add(B(1.0, 3.2, 0, 3.6, 2.6, 0.03, '#B7C9A2'), B(-1, 7.6, 0, 17, 1.4, 0.02, '#C9C2B4'), B(11.6, 6.4, 0, 2.8, 1.0, 0.06, '#5C6E91'));
      add(B(5.2, 6.0, 0, 1.8, 1.0, 0.012, '#AFC3D9', { nc: '#4B3F8C', op: 0.85 }), B(8.6, 8.4, 0.02, 1.4, 0.8, 0.012, '#AFC3D9', { nc: '#2E6C7A', op: 0.85 }));
      add(L.tree(1.0, 1.0, 0, 1.2), L.tree(3.2, 0.6, 0, 1.0));
      add(B(6.2, 0.6, 0, 4.2, 3.4, 0.35, '#B98B5E'), B(6.5, 0.9, 0.35, 3.6, 2.8, 2.4, '#EFE8DA'), K(8.3, 2.3, 2.75, 3.2, 1.6, '#5C6E91', { n: 4, rot: Q }));
      add(B(7.7, 3.7, 0.35, 1.2, 0.03, 1.8, '#8C6A4A'), B(9.3, 3.7, 1.2, 0.6, 0.03, 0.22, '#4F6BD8'));
      add(L.neon(6.9, 3.73, 2.15, 2.4, 0.45, '#4FD1C5'));
      add(L.building(11.4, 0.8, 0, 3.6, 3.0, 3.0, '#DCD3C2', '#7A8597', 2, 2));
      add(L.neon(11.9, 3.83, 2.35, 2.4, 0.45, '#F0B860'));
      add(B(1.6, 3.8, 0.03, 0.6, 0.6, 1.0, '#C7A35A'), B(2.4, 3.8, 0.03, 0.6, 0.6, 1.7, '#C7A35A'), B(3.2, 3.8, 0.03, 0.6, 0.6, 2.4, '#C7A35A'));
      add(B(12.0, 5.0, 0, 2.2, 0.6, 0.9, '#4A5468'));
      for (let i = 0; i < 3; i++) add(C(12.4 + i * 0.7, 5.3, 0.9, 0.22, 0.18, '#2B3A5C', { n: 10 }));
      add(L.bench(1.4, 6.2, 0, '#B98B5E'));
      add(L.lampPost(4.8, 9.4, 0, 3.0), L.lampPost(10.6, 9.4, 0, 3.0), L.bench(7.0, 10.0, 0), L.tree(2.0, 10.4, 0, 1.0), L.pine(14.6, 10.2, 0, 1.0));
      def.cams = { park: { x: 2.6, y: 4.0, z: 1.5, zoom: 1.6 }, dojo: { x: 8.3, y: 2.3, z: 2.0, zoom: 1.7 }, gym: { x: 12.8, y: 3.8, z: 1.6, zoom: 1.6 } };
    } else if (id === 'jhah') {
      def.label = 'Healthcare years: a hospital building, a data office with two large clinical screens and a meeting room table';
      def.sky = ['#D6E6F2', '#F4F6F4']; def.nsky = ['#0C1530', '#1E3054']; def.orb = true; def.stars = true; def.clouds = true; def.fog = 0.18;
      add(L.island(-1, -1, 17, 13, '#A9C29A', '#A08A72'));
      add(B(-1, 8.0, 0, 17, 1.6, 0.02, '#C9C9C4'), B(8.0, 0.8, 0, 7.4, 6.2, 0.2, '#D9D6CE'));
      add(L.building(0, 0, 0, 6.2, 3.6, 5.2, '#F2F1EC', '#B9C4D6', 3, 5));
      add(B(2.2, 3.6, 1.6, 2.0, 0.9, 0.12, '#B9C4D6'), L.cross(3.2, 3.62, 3.9, 1.0, '#4C9F94'));
      add(B(8.0, 0.8, 0.2, 0.25, 6.2, 3.0, '#EEF0EE'), B(8.25, 0.8, 0.2, 7.15, 0.25, 3.0, '#E6E9E7'));
      add(B(9.0, 1.05, 1.3, 2.2, 0.05, 1.3, '#3D4A63'), B(9.1, 1.1, 1.4, 2.0, 0.02, 1.1, '#A9C6E8', { nc: '#9FD4FF', e: 1 }), B(11.6, 1.05, 1.3, 2.2, 0.05, 1.3, '#3D4A63'), B(11.7, 1.1, 1.4, 2.0, 0.02, 1.1, '#A9C6E8', { nc: '#9FD4FF', e: 1 }));
      for (let r = 0; r < 4; r++) add(B(9.25, 1.125, 1.55 + r * 0.22, 1.2 - (r % 2) * 0.4, 0.005, 0.1, '#EEF3F8', { nc: '#CFE6FF' }), B(11.85 + r * 0.42, 1.125, 1.55, 0.25, 0.005, 0.3 + r * 0.15, '#4C9F94', { nc: '#7FD8CB' }));
      add(L.desk(9.0, 2.4, 0.2, 3.0, 1.3, 1.35), L.monitor(9.6, 2.6, 1.55, 1.5, 0.9), L.chair(9.8, 3.9, 0.2, '#5C6E91'));
      add(L.desk(11.6, 3.4, 0.2, 2.8, 1.8, 1.2, '#D8CBB0'), L.laptop(12.4, 3.8, 1.4));
      add(L.chair(11.8, 5.4, 0.2, '#6E9C8F'), L.chair(13.3, 5.4, 0.2, '#6E9C8F'));
      add(L.tree(7.0, 6.0, 0, 1.0), L.tree(1.0, 5.5, 0, 1.1), L.lampPost(6.5, 7.6, 0, 3.0), L.bench(2.5, 10.2, 0), L.tree(14.4, 10.4, 0, 1.0));
      def.cams = { office: { x: 11.0, y: 3.0, z: 1.8, zoom: 1.6 }, hospital: { x: 3.0, y: 2.0, z: 3.0, zoom: 1.5 } };
    } else if (id === 'gallery') {
      def.label = 'Portfolio gallery street: gallery buildings and five framed dashboards on easels along the pavement';
      def.sky = ['#F2C79A', '#F8E7CF']; def.nsky = ['#101632', '#2B2F5A']; def.orb = true; def.stars = true; def.fog = 0.22; def.haze = '#F5DFC4';
      add(L.island(-1, -1, 17, 12, '#C7BFAE', '#9C8A78'));
      add(B(-1, 5.6, 0, 17, 2.2, 0.02, '#8E949E'));
      add(L.building(0, 0, 0, 4.2, 3.2, 4.0, '#E9DCC6', '#B97A62', 2, 2), L.building(4.6, 0.2, 0, 3.6, 3.0, 3.2, '#DCE1E6', '#7A8597', 2, 2), L.building(8.6, 0, 0, 4.6, 3.2, 4.6, '#EADFD0', '#8C5A48', 3, 3), L.building(13.6, 0.4, 0, 2.2, 2.6, 3.0, '#E3D2B4', '#B97A62', 2, 1));
      for (let i = 0; i < 5; i++) { add(L.frame(0.6 + i * 3.0, 4.0, 0, 1.9, 1.5, i)); add(G(1.55 + i * 3.0, 4.4, 2.4, 1.6, '#FFE2A0')); }
      add(L.lampPost(2.0, 8.3, 0, 3.0), L.bench(4.4, 8.8, 0), L.lampPost(8.0, 8.3, 0, 3.0), L.tree(11.2, 9.0, 0, 1.1), L.lampPost(14.0, 8.3, 0, 3.0));
      def.cams = { frames: { x: 6.0, y: 4.2, z: 1.2, zoom: 1.6 }, first: { x: 1.5, y: 4.1, z: 1.3, zoom: 2.2 } };
    } else if (id === 'library') {
      def.label = 'Library street: a library building and ten plinths, each holding a tiny diorama for a story';
      def.sky = ['#D9E5EE', '#F4EFE6']; def.nsky = ['#0E1631', '#25335C']; def.orb = true; def.stars = true; def.clouds = true; def.fog = 0.2;
      add(L.island(-1, -1, 17, 12.5, '#B9C9A8', '#9C8A78'));
      add(B(-1, 4.4, 0, 17, 1.6, 0.02, '#D8CFC0'));
      add(L.tree(1.2, 1.2, 0, 1.2));
      add(L.building(3.6, 0, 0, 7.4, 3.0, 3.8, '#E6DCCB', '#7A93B8', 2, 5));
      for (let i = 0; i < 4; i++) add(B(4.2 + i * 2.0, 3.05, 0, 0.35, 0.35, 3.0, '#F4EEDF'));
      add(L.pine(13.4, 1.0, 0, 1.2));
      add(L.lampPost(1.0, 4.2, 0, 2.8), L.lampPost(8.0, 4.2, 0, 2.8), L.lampPost(14.8, 4.2, 0, 2.8));
      const minis = [
        (x, y, z) => L.tower(x + 0.8, y + 0.8, z, 2.2),
        (x, y, z) => L.house(x + 0.3, y + 0.3, z, 1.0, 1.0, 0.8, '#EADCC2', '#8C5A48'),
        (x, y, z) => L.books(x + 0.2, y + 0.35, z, 4, bc),
        (x, y, z) => [B(x + 0.45, y + 0.4, z, 0.7, 0.8, 1.6, '#3D4A63'), B(x + 1.15, y + 0.6, z + 0.5, 0.03, 0.12, 0.07, '#7FD8A0', { e: 1, a: 'dz-blink' }), B(x + 1.15, y + 0.9, z + 0.9, 0.03, 0.12, 0.07, '#9FD4FF', { e: 1 })],
        (x, y, z) => L.pine(x + 0.8, y + 0.8, z, 0.9),
        (x, y, z) => [K(x + 0.8, y + 0.8, z, 0.75, 1.6, '#B79E80', { n: 6, rot: 0.3 }), L.tent(x + 1.2, y + 1.3, z, 0.4)],
        (x, y, z) => [B(x + 0.3, y + 0.4, z, 1.0, 0.6, 0.5, '#D9A441'), C(x + 0.55, y + 0.7, z + 0.5, 0.13, 0.1, '#D9A441', { n: 8 }), C(x + 1.05, y + 0.7, z + 0.5, 0.13, 0.1, '#D9A441', { n: 8 })],
        (x, y, z) => L.frame(x + 0.25, y + 0.7, z, 1.1, 0.9, 2),
        (x, y, z) => L.crt(x + 0.2, y + 0.3, z),
        (x, y, z) => L.palm(x + 0.8, y + 0.8, z, 0.7)
      ];
      for (let i = 0; i < 10; i++) { const r = Math.floor(i / 5), q = i % 5, x = 0.4 + q * 3.1 + r * 0.9, y = 6.6 + r * 3.0; add(B(x, y, 0, 1.6, 1.6, 0.6, '#E8E2D6')); add(minis[i](x, y, 0.6)); }
      def.cams = { plinths: { x: 8.0, y: 8.5, z: 0.8, zoom: 1.4 } };
    } else if (id === 'village') {
      def.label = 'Passions: a mountain village with a skate path and freeskates, a hiking tent, a language signpost and a LEGO brick';
      def.sky = ['#BFDDF2', '#F3EFE2']; def.nsky = ['#060B20', '#1A254C']; def.orb = true; def.stars = true; def.clouds = true; def.fog = 0.32;
      add(L.island(-1, -1, 17, 13, '#A9C08F', '#A88C72'));
      add(B(0.2, 6.2, 0, 7.0, 1.4, 0.03, '#C9C2B4'), B(5.8, 7.6, 0, 1.4, 3.6, 0.03, '#C9C2B4'));
      add(K(2.6, 1.6, 0, 3.2, 5.6, '#B79E80', { n: 6, rot: 0.2 }), K(7.2, 1.0, 0, 3.9, 7.2, '#A88E72', { n: 6, rot: 0.5 }), K(12.2, 1.6, 0, 3.0, 4.8, '#BDA585', { n: 6 }));
      add(L.pine(0.5, 4.8, 0, 0.9), L.tent(9.8, 4.4, 0, 1.0), L.pine(14.6, 4.2, 0, 1.1));
      add(B(3.6, 6.5, 0.03, 0.55, 0.26, 0.22, '#4F6BD8'), B(3.6, 6.95, 0.03, 0.55, 0.26, 0.22, '#4F6BD8'));
      add(L.house(9.8, 6.4, 0, 2.2, 1.8, 1.6, '#EADCC2', '#B97A62'), L.house(12.8, 7.6, 0, 1.8, 1.6, 1.4, '#E3D2B4', '#8C5A48'));
      add(B(1.0, 8.2, 0, 2.4, 1.4, 0.35, '#9AA3B2'), B(1.0, 8.2, 0.35, 2.4, 0.6, 0.45, '#9AA3B2'));
      add(L.lampPost(7.8, 9.0, 0, 2.8), L.house(10.2, 9.6, 0, 1.8, 1.6, 1.3, '#EFE8DA', '#7A8597'));
      add(C(4.4, 10.0, 0, 0.07, 2.2, '#8C6A4A', { n: 6 }), B(4.4, 9.95, 1.75, 1.3, 0.1, 0.32, '#E8E2D6'), B(3.5, 10.05, 1.35, 1.0, 0.1, 0.3, '#C9D6EE'), B(4.4, 9.95, 0.95, 1.1, 0.1, 0.3, '#F2D98A'));
      add(L.brick(1.2, 10.6, 0, '#D9A441'), L.tree(8.4, 11.2, 0, 0.9));
      def.cams = { skate: { x: 3.0, y: 7.0, z: 0.6, zoom: 1.9 }, hike: { x: 9.0, y: 3.5, z: 1.5, zoom: 1.5 }, words: { x: 4.4, y: 10.0, z: 1.4, zoom: 2.1 }, lego: { x: 2.2, y: 11.0, z: 0.5, zoom: 2.2 } };
    } else if (id === 'hill' || id === 'workshop' || id === 'cabin') {
      def.label = id === 'hill' ? 'Hilltop view with a bench, a tree, a signpost and a small town below' : (id === 'workshop' ? 'Hilltop with a workshop shelf of tools and certificate frames, and a workbench' : 'Hilltop with a small house, a lit window, a lantern and a path');
      def.sky = ['#CFE2F0', '#F7EEDD']; def.nsky = ['#2A2A58', '#E0956E']; def.nmix = '#2E2A55'; def.orb = true; def.clouds = true; def.stars = true; def.fog = 0.3; def.haze = '#F1E6D6'; def.nhaze = '#4A3F66';
      add(L.island(-1, -1, 15, 13, '#A9C08F', '#A88C72'));
      add(C(6.5, 5.5, 0, 6.0, 0.8, '#9DB884', { n: 12 }), C(6.3, 5.3, 0.8, 4.4, 0.8, '#A9C08F', { n: 11 }), C(6.1, 5.1, 1.6, 2.9, 0.7, '#B3C99A', { n: 10 }));
      add(B(8.6, 9.4, 0.8, 1.2, 1.9, 0.03, '#D8CFC0'), B(7.4, 8.4, 1.6, 1.0, 1.3, 0.03, '#D8CFC0'));
      for (let i = 0; i < 7; i++) add(B(-0.6 + i * 0.95, 10.0 + ((i * 7) % 3) * 0.5, 0, 0.7, 0.7, 0.5 + ((i * 5) % 4) * 0.35, i % 2 ? '#E3D2B4' : '#DCD3C2'), B(-0.6 + i * 0.95 + 0.2, 10.7 + ((i * 7) % 3) * 0.5, 0.25, 0.2, 0.02, 0.15, '#A9C6E8', { nc: '#FFD27A', e: 1 }));
      const z = 2.3;
      if (id === 'hill') { add(L.tree(5.0, 4.0, z, 1.2), L.bench(5.6, 5.6, z), C(7.2, 6.0, z, 0.07, 2.0, '#8C6A4A', { n: 6 }), B(7.2, 5.95, z + 1.5, 1.2, 0.1, 0.32, '#E8E2D6'), B(6.3, 6.05, z + 1.1, 1.0, 0.1, 0.3, '#E8E2D6')); def.cams = { top: { x: 6.0, y: 5.2, z: 3.0, zoom: 1.6 }, bench: { x: 6.4, y: 5.8, z: 2.9, zoom: 2.1 } }; }
      if (id === 'workshop') {
        add(B(4.6, 3.4, z, 3.4, 0.7, 2.6, '#A77E57'));
        for (let s = 0; s < 3; s++) add(B(4.6, 4.1, z + 0.3 + s * 0.8, 3.4, 0.06, 0.06, '#8C6A4A'));
        add(B(4.9, 4.12, z + 0.4, 0.5, 0.03, 0.12, '#9AA3B2'), B(5.6, 4.12, z + 0.36, 0.12, 0.03, 0.4, '#9AA3B2'), B(6.1, 4.12, z + 0.38, 0.6, 0.03, 0.18, '#C9785E'), B(7.0, 4.12, z + 0.36, 0.5, 0.03, 0.3, '#6E9C8F'));
        for (let i = 0; i < 3; i++) add(B(4.8 + i * 1.05, 4.12, z + 1.2, 0.8, 0.03, 0.6, '#F4EEDF'), B(4.9 + i * 1.05, 4.15, z + 1.3, 0.6, 0.01, 0.4, i === 0 ? '#C7A35A' : '#C9D6EE'));
        for (let i = 0; i < 5; i++) add(B(4.8 + i * 0.55, 4.12, z + 1.96, 0.4, 0.03, 0.5 - (i % 2) * 0.1, bc[i]));
        add(L.desk(5.0, 5.4, z, 2.6, 1.1, 1.2), B(5.4, 5.6, z + 1.2, 1.0, 0.6, 0.45, '#B97A62'), L.lamp(7.0, 5.6, z + 1.2));
        def.cams = { shelf: { x: 6.3, y: 4.1, z: 3.6, zoom: 1.9 } };
      }
      if (id === 'cabin') { add(L.pine(4.4, 6.2, z, 0.8), L.house(5.0, 3.8, z, 2.4, 2.0, 1.8, '#EADCC2', '#8C5A48'), B(6.488, 5.81, z + 0.55, 0.36, 0.01, 0.36, '#FFD98A', { e: 1, nc: '#FFD27A' }), G(6.6, 6.0, z + 0.7, 1.7, '#FFD27A', { day: 1, a: 'dz-pulse' }), B(6.0, 5.8, z, 0.6, 1.4, 0.03, '#D8CFC0'), L.lampPost(7.8, 6.2, z, 1.6)); def.cams = { window: { x: 6.4, y: 5.6, z: 3.2, zoom: 2.0 } }; }
    }
    return def;
  }

}

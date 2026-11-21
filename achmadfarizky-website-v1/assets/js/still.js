// Flat SVG renderer for the diorama scenes (same projection, face shading,
// night mix and fog as the design canvas). Used for the story-library
// thumbnails, the article-mode illustration and the still image shown when
// WebGL is not available.
import { Diorama } from './diorama.js';

const D = new Diorama();
let uid = 0;

/**
 * @param {object} o
 * @param {string} o.scene  scene id (room, campus, telkomsel …)
 * @param {string} [o.cam]  camera id from the scene (zoom, fill or pov camera); 'wide' = whole island
 * @param {boolean} [o.dark]
 * @param {number} [o.w] @param {number} [o.h]
 * @param {'center'|'left'|'right'} [o.side]
 * @param {boolean} [o.inset] keep the island in the upper 76 % (room for a caption)
 * @param {number} [o.pad]
 * @param {boolean} [o.animate] keep the idle loops (blink, flicker, bob)
 * @param {string} [o.label]
 */
export function renderDiorama(o) {
  const W = o.w ?? 1440, H = o.h ?? 900, dark = !!o.dark, side = o.side ?? 'center', camId = o.cam ?? 'wide';
  const id = 'dz' + (++uid);
  const sc = D.scene(o.scene ?? 'room', { fill: camId === 'fill' || String(camId).indexOf('pov') === 0 });
  const inset = o.inset == null ? W >= 900 : !!o.inset;
  const items = sc.items.filter((it) => !it.dn || ((it.dn === 'n') === dark));
  const pr = (x, y, z) => [(x - y) * 0.8660254, (x + y) * 0.5 - z];
  let minD = 1e9, maxD = -1e9;
  items.forEach((it) => { const d = it.x + (it.w || 0) / 2 + it.y + (it.d || 0) / 2; it._d = d; if (d < minD) minD = d; if (d > maxD) maxD = d; });
  const faces = [];
  const camDef = sc.cams ? sc.cams[camId] : null, pov = camDef && camDef.pov ? camDef.pov : null;
  let toC = null, scr = null, Ex = null;
  const clip2 = (ps) => {
    const M = 60, edges = [[0, -M, 1], [0, W + M, -1], [1, -M, 1], [1, H + M, -1]];
    edges.forEach((e) => { const out = []; for (let i = 0; i < ps.length; i++) { const a = ps[i], b = ps[(i + 1) % ps.length], ia = (a[e[0]] - e[1]) * e[2] >= 0, ib = (b[e[0]] - e[1]) * e[2] >= 0; if (ia) out.push(a); if (ia !== ib) { const t = (e[1] - a[e[0]]) / (b[e[0]] - a[e[0]]); out.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]); } } ps = out; });
    return ps;
  };
  if (pov) {
    const E = pov.eye, T = pov.at, nz = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
    const fw = nz([T[0] - E[0], T[1] - E[1], T[2] - E[2]]), rt = nz([fw[1], -fw[0], 0]);
    const up = [rt[1] * fw[2] - rt[2] * fw[1], rt[2] * fw[0] - rt[0] * fw[2], rt[0] * fw[1] - rt[1] * fw[0]];
    const F = (W / 2) / Math.tan((pov.fov || 70) * Math.PI / 360);
    Ex = E;
    toC = (p) => { const d = [p[0] - E[0], p[1] - E[1], p[2] - E[2]]; return [d[0] * rt[0] + d[1] * rt[1] + d[2] * rt[2], d[0] * up[0] + d[1] * up[1] + d[2] * up[2], d[0] * fw[0] + d[1] * fw[1] + d[2] * fw[2]]; };
    const PX = W * (0.5 + (o.off ?? pov.off ?? 0));
    scr = (c) => [PX - F * c[0] / c[2], H / 2 - F * c[1] / c[2]];
    scr.F = F;
  }
  const NEAR = 0.35;
  const addF = (it, pts, f, n) => {
    if (!pov) { faces.push({ it, pts: pts.map((p) => pr(p[0], p[1], p[2])), f }); return; }
    let cx = 0, cy = 0, cz = 0; pts.forEach((p) => { cx += p[0]; cy += p[1]; cz += p[2]; }); cx /= pts.length; cy /= pts.length; cz /= pts.length;
    if (n && n[0] * (Ex[0] - cx) + n[1] * (Ex[1] - cy) + n[2] * (Ex[2] - cz) <= 0.001) return;
    const cs = pts.map(toC), out = [];
    for (let i = 0; i < cs.length; i++) { const a = cs[i], b = cs[(i + 1) % cs.length], ia = a[2] >= NEAR, ib = b[2] >= NEAR; if (ia) out.push(a); if (ia !== ib) { const t = (NEAR - a[2]) / (b[2] - a[2]); out.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1]), NEAR]); } }
    if (out.length < 3) return;
    const sp = clip2(out.map(scr));
    if (sp.length < 3) return;
    faces.push({ it, pts: sp, f });
  };
  items.forEach((it) => {
    if (it.t === 'b') {
      const { x, y, z, w, d, h } = it;
      addF(it, [[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], 0.9, [0, 1, 0]);
      addF(it, [[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], 0.74, [1, 0, 0]);
      addF(it, [[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], 1.07, [0, 0, 1]);
    } else if (it.t === 'c' || it.t === 'k') {
      const n = it.n || 8, r = it.r, rot = it.rot || 0, cx = it.x, cy = it.y, z = it.z, h = it.h, v = [];
      for (let i = 0; i < n; i++) { const a = rot + i * 2 * Math.PI / n; v.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
      for (let i = 0; i < n; i++) {
        const a = v[i], b = v[(i + 1) % n], m = rot + (i + 0.5) * 2 * Math.PI / n, nx = Math.cos(m), ny = Math.sin(m);
        if (it.t === 'c') { if (!pov && nx + ny <= 0.01) continue; addF(it, [[a[0], a[1], z], [b[0], b[1], z], [b[0], b[1], z + h], [a[0], a[1], z + h]], 0.82 + 0.09 * (ny - nx), [nx, ny, 0]); }
        else { if (!pov && h * (nx + ny) + r <= 0.01) continue; addF(it, [[a[0], a[1], z], [b[0], b[1], z], [cx, cy, z + h]], 0.9 + 0.09 * (ny - nx), [nx * h, ny * h, r]); }
      }
      if (it.t === 'c') addF(it, v.map((p) => [p[0], p[1], z + h]), 1.07, [0, 0, 1]);
    } else if (it.t === 'd') {
      const n = it.n || 16, v = [];
      for (let i = 0; i < n; i++) { const a = i * 2 * Math.PI / n; v.push([it.x + it.r * Math.cos(a), it.y, it.z + it.r * Math.sin(a)]); }
      addF(it, v, 0.95, [0, 1, 0]);
    } else if (pov) {
      const c3 = toC([it.x, it.y, it.z]);
      if (c3[2] < NEAR) return;
      faces.push({ it, round: true, pt: scr(c3), rr: scr.F * it.r / c3[2] });
    } else {
      faces.push({ it, round: true, pt: pr(it.x, it.y, it.z) });
    }
  });
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  const grow = (px, py) => { if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py; };
  faces.forEach((fc) => { if (fc.round) { if (fc.it.t === 'g') return; grow(fc.pt[0] - fc.it.r, fc.pt[1] - fc.it.r); grow(fc.pt[0] + fc.it.r, fc.pt[1] + fc.it.r); } else fc.pts.forEach((p) => grow(p[0], p[1])); });
  if (x1 <= x0) { x0 = 0; x1 = 1; y0 = 0; y1 = 1; }
  let rx = 0, ry = 0, rw = W, rh = H;
  if (side === 'right') { rx = W * 0.4; rw = W * 0.6; } else if (side === 'left') { rw = W * 0.6; }
  if (inset) { ry = H * 0.05; rh = H * 0.76; }
  const pad = o.pad ?? 0.88;
  const k = pov ? 1 : Math.min(rw * pad / (x1 - x0), rh * pad / (y1 - y0));
  const ox = pov ? 0 : rx + rw / 2 - k * (x0 + x1) / 2, oy = pov ? 0 : ry + rh / 2 - k * (y0 + y1) / 2;

  const nm = D.h2r(sc.nmix || '#1E2A4A');
  const haze = D.h2r(dark ? (sc.nhaze || '#1C2848') : (sc.haze || '#DCE3EC'));
  const fogA = sc.fog == null ? 0.22 : sc.fog;
  const span = Math.max(0.001, maxD - minD);
  const colOf = (it, f) => {
    let base;
    if (dark) { if (it.nc) base = D.h2r(it.nc); else if (it.e) base = [255, 210, 122]; else base = D.mix(D.h2r(it.c), nm, 0.56); }
    else base = D.h2r(it.c);
    const col = (dark && it.e) ? D.sh(base, f > 1 ? 1.03 : 0.95) : D.sh(base, f);
    let ft = fogA * (1 - (it._d - minD) / span); if (dark && it.e) ft *= 0.25;
    return D.mix(col, haze, ft);
  };
  const anim = (it) => (o.animate && it.a ? ` class="${it.a}"` : '');

  const defs = [];
  const body = [];
  if (!pov) {
    const sw = k * (x1 - x0) * 0.92, shh = Math.max(20, sw * 0.14), scx = ox + k * (x0 + x1) / 2, scy = oy + k * y1;
    defs.push(`<radialGradient id="${id}sh"><stop offset="0" stop-color="${dark ? 'rgba(0,0,0,0.38)' : 'rgba(19,32,58,0.2)'}"/><stop offset="0.7" stop-color="rgba(19,32,58,0)"/></radialGradient>`);
    body.push(`<ellipse cx="${scx.toFixed(1)}" cy="${(scy - shh * 0.05).toFixed(1)}" rx="${(sw / 2).toFixed(1)}" ry="${(shh / 2).toFixed(1)}" fill="url(#${id}sh)"/>`);
  }
  let g = 0;
  faces.forEach((fc) => {
    const it = fc.it, op = it.op == null ? '' : ` opacity="${it.op}"`;
    if (fc.round) {
      const cx = ox + k * fc.pt[0], cy = oy + k * fc.pt[1], r = fc.rr != null ? fc.rr : it.r * k;
      if (it.t === 'g') {
        if (!dark && !it.day) return;
        const c = D.h2r(it.c), a = dark ? 0.5 : 0.35, gid = `${id}g${g++}`;
        defs.push(`<radialGradient id="${gid}"><stop offset="0" stop-color="${D.css(c, a)}"/><stop offset="0.38" stop-color="${D.css(c, a * 0.35)}"/><stop offset="0.7" stop-color="${D.css(c, 0)}"/></radialGradient>`);
        body.push(`<circle${anim(it)} cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="url(#${gid})"${op}/>`);
        return;
      }
      const c = colOf(it, 1), gid = `${id}g${g++}`;
      defs.push(`<radialGradient id="${gid}" cx="0.35" cy="0.3" r="0.75"><stop offset="0" stop-color="${D.css(D.sh(c, 1.12))}"/><stop offset="0.55" stop-color="${D.css(c)}"/><stop offset="1" stop-color="${D.css(D.sh(c, 0.82))}"/></radialGradient>`);
      body.push(`<circle${anim(it)} cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="url(#${gid})"${op}/>`);
      return;
    }
    const pts = fc.pts.map((p) => `${(ox + k * p[0]).toFixed(1)},${(oy + k * p[1]).toFixed(1)}`).join(' ');
    const col = D.css(colOf(it, fc.f));
    body.push(`<polygon${anim(it)} points="${pts}" fill="${col}" stroke="${col}" stroke-width="0.7" stroke-linejoin="round"${op}/>`);
  });

  let camT = '';
  if (!pov && camDef && camDef.fill) { const q = camDef.fill, s2 = W / (k * q[2]); camT = `translate(${(W / 2 - s2 * (ox + k * q[0])).toFixed(1)} ${(H / 2 - s2 * (oy + k * q[1])).toFixed(1)}) scale(${s2.toFixed(4)})`; }
  else if (!pov && camDef && camDef.zoom) { const p = pr(camDef.x, camDef.y, camDef.z), fx = ox + k * p[0], fy = oy + k * p[1]; camT = `translate(${(rx + rw / 2 - camDef.zoom * fx).toFixed(1)} ${(ry + rh / 2 - camDef.zoom * fy).toFixed(1)}) scale(${camDef.zoom})`; }

  const sky = dark ? (sc.nsky || ['#0E1730', '#26365E']) : (sc.sky || ['#DCE6F2', '#F4F1EA']);
  defs.push(`<linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient>`);
  defs.push(`<linearGradient id="${id}fog" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${D.css(haze, Math.min(0.6, fogA * 1.1))}"/><stop offset="0.42" stop-color="${D.css(haze, 0)}"/></linearGradient>`);
  const back = [`<rect width="${W}" height="${H}" fill="url(#${id}sky)"/>`];
  if (sc.orb) {
    const os = Math.min(W, H) * (dark ? 0.12 : 0.3), orbX = side === 'left' ? W * 0.5 : W * 0.8, oyy = H * (dark ? 0.12 : 0.04);
    defs.push(dark
      ? `<radialGradient id="${id}orb" cx="0.42" cy="0.4"><stop offset="0" stop-color="#F6F3EA"/><stop offset="0.58" stop-color="#E6E9F0"/><stop offset="0.7" stop-color="rgba(230,233,240,0)"/></radialGradient>`
      : `<radialGradient id="${id}orb"><stop offset="0" stop-color="rgba(255,247,222,0.95)"/><stop offset="0.22" stop-color="rgba(255,240,205,0.55)"/><stop offset="0.68" stop-color="rgba(255,240,205,0)"/></radialGradient>`);
    back.push(`<circle cx="${orbX.toFixed(1)}" cy="${(oyy + os / 2).toFixed(1)}" r="${(os / 2).toFixed(1)}" fill="url(#${id}orb)"/>`);
  }
  if (dark && sc.stars) for (let i = 0; i < 46; i++) back.push(`<circle cx="${(((i * 73) % 97) / 97 * W).toFixed(1)}" cy="${(((i * 37) % 53) / 53 * H * 0.5).toFixed(1)}" r="${((1.5 + (i % 3)) / 2).toFixed(1)}" fill="#F4F1E6" opacity="${0.35 + (i % 5) * 0.12}"/>`);
  if (!dark && sc.clouds) {
    defs.push(`<radialGradient id="${id}cl"><stop offset="0" stop-color="rgba(255,255,255,0.85)"/><stop offset="0.7" stop-color="rgba(255,255,255,0)"/></radialGradient>`);
    [[0.06, 0.12, 1], [0.5, 0.07, 0.8], [0.78, 0.2, 0.65], [0.3, 0.24, 0.55]].forEach((q) => { const cw = 260 * q[2] * (W / 1440), ch = 70 * q[2] * (W / 1440); back.push(`<ellipse cx="${(q[0] * W + cw / 2).toFixed(1)}" cy="${(q[1] * H + ch / 2).toFixed(1)}" rx="${(cw / 2).toFixed(1)}" ry="${(ch / 2).toFixed(1)}" fill="url(#${id}cl)"/>`); });
  }
  const label = o.label ?? ((sc.label || 'Scene') + (dark ? ', at night' : ', by day'));
  const role = o.decorative ? 'aria-hidden="true"' : `role="img" aria-label="${label.replace(/"/g, '&quot;')}"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" ${role}><defs>${defs.join('')}</defs>${back.join('')}<g${camT ? ` transform="${camT}"` : ''}>${body.join('')}</g><rect width="${W}" height="${H}" fill="url(#${id}fog)" pointer-events="none"/></svg>`;
}

export function sceneLabel(id) { return D.scene(id, {}).label || 'Scene'; }

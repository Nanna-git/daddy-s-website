// Home scene: the student's room at eye level (Three.js 0.170, no build step).
// The objects, colours and cameras come from the design canvas (diorama.js).
// Faces are flat-coloured like the design: top 107 %, front 90 %, side 74 %
// of the base colour, a little haze at the back, and at night every material
// mixes 56 % toward #1E2A4A while lit parts switch to their night colour.
import * as THREE from 'three';
import { Diorama } from './diorama.js';

const D = new Diorama();
const TAU = Math.PI * 2;
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const inOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const outCubic = (t) => 1 - Math.pow(1 - t, 3);
const outBack = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const inOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

// design (x, y, z-up) → three (x, z, y). The design's projection draws the
// world mirrored, so this swap (not a rotation) gives the same picture.
const P3 = (x, y, z) => new THREE.Vector3(x, z, y);

// The six Home views: camera names from the design (cam="…" on each board).
export const HOME_CAMS = ['pov', 'povShelfR', 'povWindow', 'povLaptop', 'povBoard', 'povLamp'];

// ------------------------------------------------------------ geometry baking
const NM = D.h2r('#1E2A4A');
const HAZE_D = D.h2r('#DCE3EC');
const HAZE_N = D.h2r('#1C2848');

function itemColors(it, f, fogA, ft0) {
  const day = D.mix(D.sh(D.h2r(it.c), f), HAZE_D, ft0);
  let nb;
  if (it.nc) nb = D.h2r(it.nc); else if (it.e) nb = [255, 210, 122]; else nb = D.mix(D.h2r(it.c), NM, 0.56);
  const ncol = it.e ? D.sh(nb, f > 1 ? 1.03 : 0.95) : D.sh(nb, f);
  const night = D.mix(ncol, HAZE_N, it.e ? ft0 * 0.25 : ft0);
  return [day.map((v) => clamp01(v / 255)), night.map((v) => clamp01(v / 255))];
}

class Baker {
  constructor(origin) { this.o = origin || new THREE.Vector3(); this.pos = []; this.cd = []; this.cn = []; this.al = []; this.fx = []; }
  tri(a, b, c, it, f, ctx) {
    const [cd, cn] = itemColors(it, f, ctx.fogA, ctx.ft(it));
    const op = it.op == null ? 1 : it.op;
    const ad = it.dn === 'n' ? 0 : op, an = it.dn === 'd' ? 0 : op;
    const flick = it.a === 'dz-flicker' ? 1 : it.a === 'dz-pulse' ? 2 : it.a === 'dz-blink' ? 3 : 0;
    const em = it.e ? 1 : 0;
    for (const p of [a, b, c]) {
      this.pos.push(p.x - this.o.x, p.y - this.o.y, p.z - this.o.z);
      this.cd.push(...cd); this.cn.push(...cn); this.al.push(ad, an);
      this.fx.push(flick, em, ctx.delay(it));
    }
  }
  build(material) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('cDay', new THREE.Float32BufferAttribute(this.cd, 3));
    g.setAttribute('cNight', new THREE.Float32BufferAttribute(this.cn, 3));
    g.setAttribute('aAlpha', new THREE.Float32BufferAttribute(this.al, 2));
    g.setAttribute('aFx', new THREE.Float32BufferAttribute(this.fx, 3));
    g.computeBoundingSphere();
    const m = new THREE.Mesh(g, material);
    m.position.copy(this.o);
    return m;
  }
}

// Box faces with the design's shading. Winding: outward normals in three space.
function addBox(bk, it, ctx) {
  const { x, y, z, w, d, h } = it;
  const X0 = x, X1 = x + w, Y0 = y, Y1 = y + d, Z0 = z, Z1 = z + h;
  const F = [
    [[[X0, Y1, Z0], [X1, Y1, Z0], [X1, Y1, Z1], [X0, Y1, Z1]], 0.9],   // +y (front)
    [[[X1, Y0, Z0], [X1, Y1, Z0], [X1, Y1, Z1], [X1, Y0, Z1]], 0.74],  // +x (right side)
    [[[X0, Y0, Z1], [X1, Y0, Z1], [X1, Y1, Z1], [X0, Y1, Z1]], 1.07],  // +z (top)
    [[[X0, Y1, Z0], [X0, Y1, Z1], [X0, Y0, Z1], [X0, Y0, Z0]], 0.86],  // -x
    [[[X1, Y0, Z0], [X0, Y0, Z0], [X0, Y0, Z1], [X1, Y0, Z1]], 0.8],   // -y
    [[[X0, Y0, Z0], [X0, Y1, Z0], [X1, Y1, Z0], [X1, Y0, Z0]], 0.6],   // -z
  ];
  for (const [pts, f] of F) bk.poly(orient(pts), it, f, ctx);
}
// polygon + its centre (three space), for the winding check in Baker.poly
function orient(pts) {
  const v = pts.map((p) => P3(p[0], p[1], p[2]));
  const c = v.reduce((a, b) => a.add(b), new THREE.Vector3()).multiplyScalar(1 / v.length);
  return { pts, c };
}
function addPrism(bk, it, ctx) {
  const n = it.n || 8, r = it.r, rot = it.rot || 0, cx = it.x, cy = it.y, z = it.z, h = it.h, v = [];
  for (let i = 0; i < n; i++) { const a = rot + i * TAU / n; v.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  for (let i = 0; i < n; i++) {
    const a = v[i], b = v[(i + 1) % n], m = rot + (i + 0.5) * TAU / n, nx = Math.cos(m), ny = Math.sin(m);
    if (it.t === 'c') bk.poly(orient([[a[0], a[1], z], [b[0], b[1], z], [b[0], b[1], z + h], [a[0], a[1], z + h]]), it, 0.82 + 0.09 * (ny - nx), ctx);
    else bk.poly(orient([[a[0], a[1], z], [b[0], b[1], z], [cx, cy, z + h]]), it, 0.9 + 0.09 * (ny - nx), ctx);
  }
  if (it.t === 'c') bk.poly(orient(v.map((p) => [p[0], p[1], z + h])), it, 1.07, ctx);
  bk.poly(orient(v.map((p) => [p[0], p[1], z])), it, 0.6, ctx);
}
function addDisc(bk, it, ctx) {
  const n = it.n || 16, v = [];
  for (let i = 0; i < n; i++) { const a = i * TAU / n; v.push([it.x + it.r * Math.cos(a), it.y, it.z + it.r * Math.sin(a)]); }
  bk.poly(orient(v), it, 0.95, ctx);
}

// Polygon in design coordinates, wound so its normal points away from the item's centre.
Baker.prototype.poly = function (o, it, f, ctx) {
  const v = o.pts.map((p) => P3(p[0], p[1], p[2]));
  const n = new THREE.Vector3().subVectors(v[1], v[0]).cross(new THREE.Vector3().subVectors(v[2], v[0]));
  // outward = away from the item's own centre
  const ic = itemCentre(it);
  const flip = n.dot(new THREE.Vector3().subVectors(o.c, ic)) < 0;
  for (let i = 1; i < v.length - 1; i++) {
    if (flip) this.tri(v[0], v[i + 1], v[i], it, f, ctx); else this.tri(v[0], v[i], v[i + 1], it, f, ctx);
  }
};
function itemCentre(it) {
  if (it._c) return it._c;
  if (it.t === 'b') it._c = P3(it.x + it.w / 2, it.y + it.d / 2, it.z + it.h / 2);
  else if (it.t === 'd') it._c = P3(it.x, it.y - 1, it.z); // disc faces +y
  else it._c = P3(it.x, it.y, it.z + (it.h || 0) / 2);
  return it._c;
}

const VERT = /* glsl */`
attribute vec3 cDay; attribute vec3 cNight; attribute vec2 aAlpha; attribute vec3 aFx;
uniform float uNight; uniform float uNightRaw; uniform float uTime; uniform float uIdle;
varying vec3 vCol; varying float vA;
float flicker(float t){ t = fract(t);
  if (t < 0.4) return mix(1.0, 0.72, t / 0.4);
  if (t < 0.55) return mix(0.72, 1.0, (t - 0.4) / 0.15);
  if (t < 0.7) return mix(1.0, 0.84, (t - 0.55) / 0.15);
  return mix(0.84, 1.0, (t - 0.7) / 0.3); }
void main(){
  float n = uNight;
  if (aFx.y > 0.5) n = smoothstep(aFx.z, aFx.z + 0.12, uNightRaw); // lit parts switch on one by one
  vCol = mix(cDay, cNight, n);
  float k = 1.0;
  if (aFx.x > 0.5 && aFx.x < 1.5) k = mix(1.0, flicker(uTime / 3.6 + aFx.z * 7.0), uIdle * n);
  if (aFx.x > 1.5 && aFx.x < 2.5) k = mix(1.0, 0.85 + 0.15 * cos(uTime * 6.2832 / 3.2), uIdle);
  if (aFx.x > 2.5) k = mix(1.0, step(0.5, fract(uTime / 2.2)) * 0.8 + 0.2, uIdle);
  vCol *= k;
  vA = mix(aAlpha.x, aAlpha.y, n);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
const FRAG = /* glsl */`
uniform float uOpacity;
varying vec3 vCol; varying float vA;
void main(){ if (vA * uOpacity < 0.004) discard; gl_FragColor = vec4(vCol, vA * uOpacity); }`;

function glowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.38, 'rgba(255,255,255,0.35)'); r.addColorStop(0.7, 'rgba(255,255,255,0)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.NoColorSpace; return t;
}
function ballTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(45, 38, 0, 64, 64, 64);
  r.addColorStop(0, 'rgb(255,255,255)'); r.addColorStop(0.55, 'rgb(228,228,228)'); r.addColorStop(0.98, 'rgb(187,187,187)'); r.addColorStop(1, 'rgba(187,187,187,0)');
  g.fillStyle = r; g.beginPath(); g.arc(64, 64, 64, 0, TAU); g.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.NoColorSpace; return t;
}

// ------------------------------------------------------------ the scene
export function createScene(canvas, opts = {}) {
  let reduced = !!opts.reducedMotion;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // colours are authored in sRGB and written as-is
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.3, 120);

  const sc = D.scene('room', { fill: true });
  const items = sc.items;
  let minD = 1e9, maxD = -1e9;
  items.forEach((it) => { const d = it.x + (it.w || 0) / 2 + it.y + (it.d || 0) / 2; it._d = d; minD = Math.min(minD, d); maxD = Math.max(maxD, d); });
  const span = Math.max(0.001, maxD - minD), fogA = sc.fog ?? 0.12;
  let emi = 0;
  const ctx = {
    fogA,
    ft: (it) => fogA * (1 - (it._d - minD) / span),
    delay: (it) => { if (!it.e) return 0; if (it._dl == null) it._dl = 0.25 + ((emi++ * 0.37) % 1) * 0.55; return it._dl; },
  };

  const uniforms = { uNight: { value: 0 }, uNightRaw: { value: 0 }, uTime: { value: 0 }, uIdle: { value: reduced ? 0 : 1 }, uOpacity: { value: 1 } };
  const solid = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG, side: THREE.FrontSide });
  const clear = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, side: THREE.DoubleSide,
    polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });

  // ---- sort items into animated groups (the props that move) and the static room
  const near = (a, b, e = 0.011) => Math.abs(a - b) < e;
  const groups = {};
  const G = (key, origin) => (groups[key] ||= { items: [], origin });
  const LID_HINGE = [6.3, 1.33, 2.48];
  const TOOL_HINGE = [10.6, 3.4, 0.55];
  let noteIdx = 0;
  const isBookTarget = (it) => it.t === 'b' && near(it.x, 1.55) && near(it.w, 0.06) && near(it.y, 1.45 + 2 * 0.4) && near(it.z, 0.31 + 3 * 1.2);
  const extra = [];
  items.forEach((it) => {
    if (it.t === 'g' || it.t === 's') return; // sprites, handled below
    if (it.t === 'b' && it.x >= 6.29 && it.x <= 8.1 && it.y >= 1.28 && it.y <= 1.4 && it.z >= 2.47) {
      if (near(it.y, 1.395) && it.z >= 2.74) { G('bar' + it.x.toFixed(2), [it.x, it.y, it.z]).items.push(it); G('bar' + it.x.toFixed(2)).parent = 'lid'; return; }
      G('lid', LID_HINGE).items.push(it); return;
    }
    if (it.t === 'b' && near(it.y, 0.36) && near(it.d, 0.02) && it.z > 2.9 && it.x < 3.6) { const k = 'note' + noteIdx++; G(k, [it.x + it.w / 2, it.y, it.z + it.h / 2]).items.push(it); return; }
    if (isBookTarget(it)) { G('book', [it.x, it.y + it.d / 2, it.z]).items.push(it); return; }
    if (it.t === 'b' && near(it.x, 10.6) && near(it.y, 3.4) && near(it.z, 0)) {
      // split the toolbox into a body and a lid that can open
      G('static').items.push({ ...it, h: 0.45 });
      G('toolLid', TOOL_HINGE).items.push({ ...it, z: 0.45, h: 0.1, _c: null });
      return;
    }
    if (it.t === 'b' && near(it.x, 10.95) && near(it.y, 3.65) && near(it.z, 0.55)) { G('toolLid', TOOL_HINGE).items.push(it); return; }
    if (it.dn === 'd' && it.op && it.h < 0.01 && it.z < 0.1) { G('sun', [0, 0, 0]).items.push(it); return; }
    G('static', [0, 0, 0]).items.push(it);
  });
  // a wrench hidden in the toolbox (pops up on V06)
  G('wrench', [10.95, 3.72, 0.3]).items.push(
    { t: 'b', x: 10.9, y: 3.68, z: 0.05, w: 0.1, d: 0.08, h: 0.62, c: '#AEB5C1' },
    { t: 'b', x: 10.8, y: 3.66, z: 0.62, w: 0.3, d: 0.12, h: 0.1, c: '#AEB5C1' },
    { t: 'b', x: 10.8, y: 3.66, z: 0.72, w: 0.08, d: 0.12, h: 0.14, c: '#AEB5C1' },
    { t: 'b', x: 11.02, y: 3.66, z: 0.72, w: 0.08, d: 0.12, h: 0.14, c: '#AEB5C1' });
  // a glint that sweeps across the certificate frame (V02)
  G('glint', [0.39, 6.95, 3.42]).items.push({ t: 'b', x: 0.38, y: 6.9, z: 2.95, w: 0.01, d: 0.12, h: 0.95, c: '#FFFFFF', op: 0.7 });

  const room = new THREE.Group();
  scene.add(room);
  const nodes = {};
  for (const [key, g] of Object.entries(groups)) {
    const o = g.origin ? P3(...g.origin) : new THREE.Vector3();
    const solidB = new Baker(o), clearB = new Baker(o);
    for (const it of g.items) {
      const bk = (it.op != null && it.op < 1) || it.dn ? clearB : solidB;
      if (it.t === 'b') addBox(bk, it, ctx); else if (it.t === 'c' || it.t === 'k') addPrism(bk, it, ctx); else if (it.t === 'd') addDisc(bk, it, ctx);
    }
    const node = new THREE.Group();
    node.position.copy(o);
    if (solidB.pos.length) { const m = solidB.build(solid); m.position.set(0, 0, 0); node.add(m); }
    if (clearB.pos.length) { const m = clearB.build(clear); m.position.set(0, 0, 0); m.renderOrder = 2; node.add(m); }
    nodes[key] = node;
  }
  for (const [key, node] of Object.entries(nodes)) {
    const parent = groups[key].parent ? nodes[groups[key].parent] : room;
    if (groups[key].parent) node.position.sub(P3(...groups[groups[key].parent].origin));
    parent.add(node);
  }

  // ---- sprites: spheres (sun, moon, bulb) and night glows
  const gTex = glowTexture(), bTex = ballTexture();
  const balls = [], glows = [];
  items.forEach((it) => {
    if (it.t === 's') {
      let s;
      if (it.y < 0.5) {
        // sun / moon in the window: a flat disc on the glass, behind the city
        const m = new THREE.MeshBasicMaterial({ map: bTex, transparent: true, depthWrite: false, toneMapped: false });
        s = new THREE.Mesh(new THREE.CircleGeometry(it.r, 32), m);
        s.position.copy(P3(it.x, 0.383, it.z));
      } else {
        const m = new THREE.SpriteMaterial({ map: bTex, transparent: true, depthWrite: false, toneMapped: false });
        s = new THREE.Sprite(m);
        s.position.copy(P3(it.x, it.y + 0.013, it.z));
        s.scale.setScalar(it.r * 2);
      }
      s.renderOrder = 3;
      room.add(s);
      const [cd, cn] = itemColors(it, 1, fogA, ctx.ft(it));
      balls.push({ it, s, cd: new THREE.Color(...cd), cn: new THREE.Color(...cn), ad: it.dn === 'n' ? 0 : 1, an: it.dn === 'd' ? 0 : 1 });
    } else if (it.t === 'g') {
      const m = new THREE.SpriteMaterial({ map: gTex, color: it.c, transparent: true, depthWrite: false, opacity: 0, toneMapped: false });
      const s = new THREE.Sprite(m);
      s.position.copy(P3(it.x, it.y, it.z));
      s.scale.setScalar(it.r * 2);
      s.renderOrder = 4;
      room.add(s);
      glows.push({ it, s });
    }
  });
  // warm day highlight on the lamp (V06) and night steam over the mug
  const lampHi = new THREE.Sprite(new THREE.SpriteMaterial({ map: gTex, color: '#FFD27A', transparent: true, depthWrite: false, opacity: 0 }));
  lampHi.position.copy(P3(10.05, 1.5, 3.2)); lampHi.scale.setScalar(2.4); lampHi.renderOrder = 4; room.add(lampHi);
  const steam = [0, 1, 2].map(() => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: gTex, color: '#E9EDF5', transparent: true, depthWrite: false, opacity: 0 }));
    s.renderOrder = 4; room.add(s); return s;
  });
  // the thread that ties the pinboard notes to the laptop (V05)
  const stringPts = [P3(1.6, 0.4, 4.2), P3(2.3, 0.4, 3.35), P3(2.95, 0.4, 4.2), P3(4.6, 0.9, 3.4), P3(6.4, 1.3, 3.35)];
  const stringGeo = new THREE.BufferGeometry().setFromPoints(new THREE.CatmullRomCurve3(stringPts).getPoints(60));
  const stringMat = new THREE.LineBasicMaterial({ color: '#C9785E', transparent: true, opacity: 0.9 });
  const stringLine = new THREE.Line(stringGeo, stringMat);
  stringGeo.setDrawRange(0, 0);
  room.add(stringLine);

  // ---- state
  const st = { view: 0, night: 0, nightFrom: 0, nightTo: 0, nightT0: -1, t: 0 };
  const ev = {}; // animation start times per view (seconds, scene clock)
  let W = 1, H = 1, narrow = false;

  function camFor(i) {
    const p = sc.cams[HOME_CAMS[i]].pov;
    const eye = P3(...p.eye), at = P3(...p.at);
    let fov = p.fov, off = p.off || 0;
    if (narrow) { off = 0; fov = Math.min(92, p.fov + 14); }
    return { eye, at, fov, off };
  }
  const cam = { eye: new THREE.Vector3(), at: new THREE.Vector3(), fov: 70, off: 0, from: null, to: null, t0: 0, dur: 750, delay: 100 };

  function goTo(i, instant = false) {
    const prev = st.view;
    st.view = i;
    const to = camFor(i);
    const now = st.t;
    if (instant || reduced) {
      Object.assign(cam, { eye: to.eye.clone(), at: to.at.clone(), fov: to.fov, off: to.off, to: null });
      ev[i] = now - 10; // props show their end state
      return;
    }
    cam.from = { eye: cam.eye.clone(), at: cam.at.clone(), fov: cam.fov, off: cam.off };
    cam.to = to;
    cam.t0 = now; cam.delay = 0.1; cam.dur = 0.75; cam.arc = 0.15;
    ev[i] = now + 0.85; // props start when the camera arrives
    if (i >= 3 && prev < 3) ev.lid = now + 0.85;
  }

  // One slow step in on load (1.6 s)
  function intro() {
    const to = camFor(st.view);
    const back = new THREE.Vector3().subVectors(to.eye, to.at).normalize().multiplyScalar(1.6);
    cam.eye.copy(to.eye).add(back); cam.at.copy(to.at); cam.fov = to.fov; cam.off = to.off;
    if (reduced) { goTo(st.view, true); return; }
    cam.from = { eye: cam.eye.clone(), at: cam.at.clone(), fov: cam.fov, off: cam.off };
    cam.to = to; cam.t0 = st.t; cam.delay = 0; cam.dur = 1.6; cam.arc = 0;
    ev[st.view] = st.t + 0.6;
  }

  function setNight(on, instant = false) {
    const target = on ? 1 : 0;
    if (instant || reduced) { st.night = target; st.nightFrom = st.nightTo = target; st.nightT0 = -1; return; }
    st.nightFrom = st.night; st.nightTo = target; st.nightT0 = st.t;
  }

  function resize() {
    W = canvas.clientWidth || window.innerWidth;
    H = canvas.clientHeight || window.innerHeight;
    narrow = window.innerWidth < 820;
    const small = Math.min(window.innerWidth, window.innerHeight) < 700;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2));
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    if (!cam.to) goTo(st.view, true);
  }

  // ---- per-frame
  const tmp = new THREE.Color();
  const since = (k) => st.t - (ev[k] ?? -1e9);
  const prog = (k, dur, delay = 0) => clamp01((since(k) - delay) / dur);

  let raf = 0, last = performance.now();
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    st.t += dt;
    const t = st.t, v = st.view;

    // night: materials 100–900 ms, lit parts 300–1100 ms one by one (1200 ms total)
    if (st.nightT0 >= 0) {
      const p = clamp01((t - st.nightT0) / 1.2);
      st.nightRaw = st.nightFrom + (st.nightTo - st.nightFrom) * p;
      st.night = st.nightFrom + (st.nightTo - st.nightFrom) * inOutSine(clamp01((p * 1.2 - 0.1) / 0.8));
      if (p >= 1) { st.nightT0 = -1; st.night = st.nightRaw = st.nightTo; }
    } else st.nightRaw = st.night;
    const n = st.night;
    uniforms.uNight.value = n;
    uniforms.uNightRaw.value = st.nightTo > st.nightFrom ? st.nightRaw * 1.0 : 1 - (1 - st.nightRaw);
    uniforms.uTime.value = t;
    uniforms.uIdle.value = reduced ? 0 : 1;

    balls.forEach((b) => {
      tmp.copy(b.cd).lerp(b.cn, n);
      if (b.it.a === 'dz-pulse' && !reduced) tmp.multiplyScalar(0.85 + 0.15 * Math.cos(t * TAU / 3.2));
      b.s.material.color.copy(tmp);
      b.s.material.opacity = b.ad + (b.an - b.ad) * n;
      b.s.visible = b.s.material.opacity > 0.01;
    });
    // lamp bulb flicker on V06 entry (2 frames off), then steady
    const lampP = since(5);
    const lampFlick = v === 5 && lampP > 0 && lampP < 0.12 && !reduced ? (Math.floor(lampP * 30) % 2 ? 0.15 : 1) : 1;
    glows.forEach((g) => {
      const base = g.it.day ? 0.35 + (0.5 - 0.35) * n : 0.5 * n;
      let k = 1;
      if (g.it.a === 'dz-pulse' && !reduced) k = 0.85 + 0.15 * Math.cos(t * TAU / 3.2);
      if (g.it.c === '#FFD27A' && g.it.r > 2.5) k *= lampFlick;
      g.s.material.opacity = base * k;
    });
    lampHi.material.opacity = v === 5 ? (1 - n) * 0.45 * outCubic(prog(5, 0.5)) : Math.max(0, lampHi.material.opacity - dt * 2);

    // V01: note 1 bobs ±5 px (3.4 s); sun patch drifts 0.3 units over 20 s
    if (nodes.sun) nodes.sun.position.x = reduced ? 0 : Math.sin(t * TAU / 40) * 0.15;

    // V02: book slides out 0.4 units and tilts 8°; the certificate glint
    const bk = v === 1 ? outBack(prog(1, 0.6)) : Math.max(0, 1 - since('bookOut') / 0.4);
    if (v === 1) ev.bookOut = t;
    if (nodes.book) { nodes.book.position.x = 1.55 + 0.4 * bk; nodes.book.rotation.z = -0.14 * bk; }
    if (nodes.glint) {
      const g = v === 1 ? prog(1, 0.9, 0.2) : 1;
      nodes.glint.position.z = P3(0, 6.2 + g * 1.5, 0).z; // sweep along the frame (three z = design y)
      nodes.glint.visible = g > 0 && g < 1 && !reduced;
    }

    // V04: lid opens 0 → 100° (700 ms, easeOutBack) and stays open; closed before V04
    if (v >= 3) st.lid = reduced || ev.lid == null ? 1 : outBack(prog('lid', 0.7));
    else st.lid = reduced ? 0 : Math.max(0, (st.lid ?? 0) - dt * 2.5);
    const lidP = st.lid;
    if (nodes.lid) nodes.lid.rotation.x = (1 - lidP) * (Math.PI / 2 - 0.03) - lidP * 0.17;
    ['bar6.55', 'bar6.90', 'bar7.25', 'bar7.60'].forEach((k, i) => {
      if (!nodes[k]) return;
      const p = v >= 3 ? (reduced ? 1 : outCubic(prog(3, 0.45, i * 0.1))) : (v < 3 ? 0.35 : 1);
      nodes[k].scale.y = Math.max(0.02, p);
    });

    // V05: notes pop on one by one (80 ms apart, easeOutBack, 6° tilt); the string draws in 500 ms
    for (let i = 0; i < 5; i++) {
      const node = nodes['note' + i]; if (!node) continue;
      let s = 1, tilt = 0;
      if (v === 4 && !reduced) { const p = prog(4, 0.45, i * 0.08); s = Math.max(0.001, outBack(p)); tilt = (i % 2 ? 1 : -1) * 0.105 * (1 - p) ; }
      node.scale.setScalar(s);
      node.rotation.z = tilt;
      if (i === 0) node.position.y = P3(...groups.note0.origin).y + (reduced ? 0 : Math.sin(t * TAU / 3.4) * 0.03);
    }
    const sp = v === 4 ? (reduced ? 1 : outCubic(prog(4, 0.5, 0.4))) : 0;
    stringGeo.setDrawRange(0, Math.floor(61 * sp));
    stringLine.visible = sp > 0;

    // V06: toolbox lid flips open −110°, wrench pops up 0.3; steam at night
    const tb = v === 5 ? (reduced ? 1 : outBack(prog(5, 0.6))) : 0;
    if (nodes.toolLid) nodes.toolLid.rotation.x = -tb * 1.92;
    if (nodes.wrench) nodes.wrench.position.y = -0.04 + 0.64 * tb; // hidden in the box until the lid opens
    steam.forEach((s, i) => {
      const ph = ((t * 0.25) + i / 3) % 1;
      s.position.copy(P3(8.3 + Math.sin(ph * 5 + i) * 0.08, 2.75, 2.8 + ph * 1.1));
      s.scale.setScalar(0.25 + ph * 0.35);
      s.material.opacity = reduced ? 0 : n * 0.35 * Math.sin(ph * Math.PI);
    });

    // camera
    if (cam.to) {
      const p = clamp01((t - cam.t0 - cam.delay) / cam.dur);
      const e = inOutCubic(p);
      const d = cam.from.eye.distanceTo(cam.to.eye) + cam.from.at.distanceTo(cam.to.at) * 0.5;
      cam.eye.lerpVectors(cam.from.eye, cam.to.eye, e);
      cam.at.lerpVectors(cam.from.at, cam.to.at, e);
      const lift = Math.sin(Math.PI * e) * d * (cam.arc ?? 0.15);
      cam.eye.y += lift; cam.at.y += lift * 0.6;
      cam.fov = cam.from.fov + (cam.to.fov - cam.from.fov) * e;
      cam.off = cam.from.off + (cam.to.off - cam.from.off) * e;
      if (p >= 1) cam.to = null;
    }
    camera.position.copy(cam.eye);
    if (!reduced) { // idle sway ±5 px over 18 s
      const s = Math.sin(t * TAU / 18);
      camera.position.x += s * 0.05; camera.position.y += Math.sin(t * TAU / 18 + 1) * 0.03;
    }
    camera.lookAt(cam.at);
    const hf = cam.fov * Math.PI / 180;
    camera.fov = 2 * Math.atan(Math.tan(hf / 2) * (H / W)) * 180 / Math.PI;
    camera.setViewOffset(W, H, -cam.off * W, 0, W, H);
    camera.updateProjectionMatrix();

    renderer.render(scene, camera);
  }

  window.addEventListener('resize', resize);
  st.view = opts.startView ?? 0;
  resize();
  intro(); // one slow step into the first view (1.6 s)
  raf = requestAnimationFrame((n0) => { last = n0; frame(n0); });

  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); opts.onLost?.(); });

  return {
    goTo, setNight, resize,
    setReducedMotion(v) { reduced = v; },
    dispose() { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); renderer.dispose(); },
  };
}

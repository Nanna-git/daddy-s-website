// Draws a design-canvas scene (canvas-diorama.js) as HTML. Used by Home and the My story sections.
import { CanvasDiorama } from './canvas-diorama.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

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

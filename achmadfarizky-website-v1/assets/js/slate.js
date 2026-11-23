// The slate: the transition between the site's pages. A clapperboard is lifted into the frame, the
// lights go down, the sticks clap, the next page loads behind it, the board drops away and the lights
// come up. Loaded as a plain script at the top of <body> on every page, so that an arriving page shows
// the closed board from its very first paint. Styles: "slate" in site.css.
//
// It plays on links between the pages below. It does not play on a first visit, a refresh, a direct
// link or the browser's Back button. With reduced motion on, the pages fade through the paper colour.
(function () {
  // what the board reads for each page
  var PAGES = {
    'index.html': { title: 'Home' },
    'university.html': { scene: '1', title: 'University', years: '2000–2005' },
    'telkomsel.html': { scene: '2', title: 'Telkomsel', years: '2005–2009' },
    'trying.html': { scene: '3', title: 'A year of trying', years: '2009–2010' }
  };
  var RISE = 620, CLAP = 220, DROP = 650, FADE = 260; // ms: board up and lights down, the clap, board away, plain fade
  var KEY = 'af-slate';
  var root = document.documentElement;
  var pageOf = function (url) { var f = url.pathname.split('/').pop() || 'index.html'; return PAGES[f] ? f : null; };
  var here = pageOf(location);
  var el = null, busy = false, landed = false;

  var cell = function (label, value, cls) { return '<span class="slate-cell' + (cls ? ' ' + cls : '') + '"><i>' + label + '</i><b>' + value + '</b></span>'; };
  function build(page, cls) {
    var p = PAGES[page], d = document.createElement('div');
    d.className = 'slate ' + cls;
    d.setAttribute('aria-hidden', 'true');
    d.innerHTML = '<div class="slate-dim"></div><div class="slate-board"><div class="slate-clap"></div><div class="slate-bar"></div><div class="slate-body">'
      + (p.scene ? '<div class="slate-row">' + cell('Scene', p.scene) + cell('Years', p.years, 'slate-wide') + '</div>' : '')
      + '<div class="slate-title">' + p.title + '</div>'
      + '<div class="slate-row">' + cell('Director', 'Achmad Farizky', 'slate-wide') + '</div></div></div>';
    document.body.appendChild(d);
    return d;
  }

  /* ---------------------------------------------------------------- arriving */
  var flag = null;
  try { flag = JSON.parse(sessionStorage.getItem(KEY)); sessionStorage.removeItem(KEY); } catch (e) { /* no storage: no slate */ }
  var arriving = !!(flag && flag.to === here && Date.now() - flag.at < 15000);
  if (arriving) el = build(here, flag.plain ? 'is-plain is-in is-arrive' : 'is-in is-shut is-arrive'); // closed board on the dark set

  // The page calls land() once its first view is drawn: the board drops away and the lights come up.
  // show() runs as the board starts to drop (the page lets its text come in then).
  function land(show) {
    if (!el || landed) { if (show) show(); return; }
    landed = true;
    var plain = el.classList.contains('is-plain'), d = el;
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      if (show) show();
      d.classList.remove('is-arrive');
      d.classList.add('is-out');
      setTimeout(function () { d.remove(); if (el === d) el = null; }, (plain ? FADE : DROP) + 80);
    }); });
  }
  if (arriving) setTimeout(function () { land(); }, 6000); // never leave a visitor behind the board

  /* ---------------------------------------------------------------- leaving */
  function leave(url, to) {
    if (busy) return;
    busy = true;
    var plain = root.classList.contains('reduce-motion');
    el = build(to, plain ? 'is-plain' : '');
    el.getBoundingClientRect();
    el.classList.add('is-in'); // the board is lifted in, then the lights go down
    var go = function () {
      try { sessionStorage.setItem(KEY, JSON.stringify({ to: to, at: Date.now(), plain: plain })); } catch (e) { /* the next page just appears */ }
      location.href = url.href;
    };
    if (plain) { setTimeout(go, FADE); return; }
    setTimeout(function () { el.classList.add('is-shut'); }, RISE); // clap
    setTimeout(go, RISE + CLAP);
  }
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    var url = new URL(a.href, location.href), to = url.origin === location.origin ? pageOf(url) : null;
    if (!to || to === here) return;
    e.preventDefault();
    url.hash = ''; // the slate always lands on the page's first view
    leave(url, to);
  });
  // Back to a page that was left behind the board: show the page, not the board.
  window.addEventListener('pageshow', function (e) {
    if (e.persisted && el) { el.remove(); el = null; busy = false; }
  });

  window.Slate = { arriving: arriving, land: land };
})();

// Writes the story pages (article mode only, no scenes) from achmadfarizky-content/stories/*.md:
//   stories/<slug>.html  one page per story
//   stories.html         the story index (the library as a page)
// and points every story link on the other pages (link text = a story title, or "all stories") at them.
//   node tools/build-stories.mjs
// Run it again after a story's text changes. The site itself has no build step: the written files are committed.
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';

const root = new URL('..', import.meta.url);
const src = new URL('achmadfarizky-content/stories/', root);
const { STORIES, TOPICS } = await import(new URL('assets/js/data.js', root));

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const unesc = (s) => s.replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (_, e) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", nbsp: ' ' }[e]));
const slugify = (s) => s.toLowerCase().replace(/<[^>]+>|[*`]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const fmtDate = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/* ---------------------------------------------------------------- frontmatter (the subset these files use) */
function frontmatter(text) {
  const m = /^---\n([\s\S]*?)\n---\n/.exec(text);
  if (!m) throw new Error('no frontmatter');
  const fm = {}; let list = null, item = null;
  const val = (v) => { v = v.trim(); return /^".*"$/.test(v) ? JSON.parse(v) : v; };
  for (const line of m[1].split('\n')) {
    let r;
    if ((r = /^(\w+):\s*\[(.*)\]\s*$/.exec(line))) { fm[r[1]] = r[2].split(',').map(val); list = null; }
    else if ((r = /^(\w+):\s*$/.exec(line))) { list = fm[r[1]] = []; }
    else if ((r = /^(\w+):\s*(.+)$/.exec(line))) { fm[r[1]] = val(r[2]); list = null; }
    else if ((r = /^\s+-\s+(\w+):\s*(.+)$/.exec(line))) { list.push(item = { [r[1]]: val(r[2]) }); }
    else if ((r = /^\s+-\s+(.+)$/.exec(line))) { list.push(val(r[1])); item = null; }
    else if ((r = /^\s+(\w+):\s*(.+)$/.exec(line)) && item) { item[r[1]] = val(r[2]); }
    else if (line.trim()) throw new Error('frontmatter line not understood: ' + line);
  }
  return { fm, body: text.slice(m[0].length) };
}

/* ---------------------------------------------------------------- markdown (the subset these files use) */
// Inline: `code`, [text](url), **bold**, *italic*. Links to other stories (x.md) become x.html.
function inline(s) {
  const code = [];
  s = esc(s).replace(/`([^`]+)`/g, (_, c) => `\u0000${code.push(c) - 1}\u0000`);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => {
    const local = /^([\w-]+)\.md$/.exec(u);
    const href = local ? `${local[1]}.html` : u;
    return `<a href="${href}"${local ? '' : ' rel="noopener"'}>${t}</a>`;
  });
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${code[i]}</code>`);
}
// Blocks: # headings, > quotes, - and 1. lists, paragraphs. A single line break inside a
// paragraph or quote is kept as a line break (the text is shown as it was written).
function blocks(md) {
  const out = []; let para = [], quote = [], list = null;
  const flush = () => {
    if (para.length) out.push({ t: 'p', html: para.map(inline).join('<br>\n') });
    if (quote.length) out.push({ t: 'quote', html: quote.map(inline).join('<br>\n') });
    if (list) out.push(list);
    para = []; quote = []; list = null;
  };
  for (const line of md.split('\n')) {
    let r;
    if (!line.trim()) { flush(); continue; }
    if ((r = /^(#{1,3})\s+(.*)$/.exec(line))) { flush(); out.push({ t: 'h' + r[1].length, text: r[2], html: inline(r[2]) }); continue; }
    if ((r = /^>\s?(.*)$/.exec(line))) { if (!quote.length) flush(); quote.push(r[1]); continue; }
    if ((r = /^-\s+(.*)$/.exec(line))) { if (!list || list.t !== 'ul') { flush(); list = { t: 'ul', items: [] }; } list.items.push(inline(r[1])); continue; }
    if ((r = /^(\d+)\.\s+(.*)$/.exec(line))) { if (!list || list.t !== 'ol') { flush(); list = { t: 'ol', start: +r[1], items: [] }; } list.items.push(inline(r[2])); continue; }
    if (/^\s/.test(line) || /^\|/.test(line)) throw new Error('markdown line not understood: ' + line);
    if (list || quote.length) flush();
    para.push(line);
  }
  flush();
  return out;
}
const blockHTML = (b) => b.t === 'p' ? `<p>${b.html}</p>`
  : b.t === 'quote' ? `<blockquote><p>${b.html}</p></blockquote>`
  : b.t === 'ul' ? `<ul>${b.items.map((i) => `<li>${i}</li>`).join('')}</ul>`
  : b.t === 'ol' ? `<ol${b.start !== 1 ? ` start="${b.start}"` : ''}>${b.items.map((i) => `<li>${i}</li>`).join('')}</ol>`
  : `<h${b.t[1]}>${b.html}</h${b.t[1]}>`;

// Self-check: the words on the page are exactly the words of the file (nothing added, dropped or changed).
const words = (s) => s.replace(/\s+/g, ' ').trim();
const mdText = (md) => words(md.replace(/^(#{1,3}|>|-|\d+\.)[ \t]?/gm, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*|\*|`/g, ''));
const htmlText = (h) => words(unesc(h.replace(/<br>|<\/?(p|li|h\d|ul|ol|blockquote)\b[^>]*>/g, ' ').replace(/<[^>]+>/g, '')));

/* ---------------------------------------------------------------- read the stories */
const CHIPS = ['University', 'Telkomsel', 'A year of trying', 'Ericsson', 'Kanzway', 'Community', 'JHAH', 'Passions'];
const meta = Object.fromEntries(STORIES.map((s) => [s.slug, s]));
const topicName = Object.fromEntries(TOPICS.map((t) => [t.id, t.name]));
const stories = readdirSync(src).filter((f) => f.endsWith('.md') && f !== 'index.md').map((f) => {
  const { fm, body } = frontmatter(readFileSync(new URL(f, src), 'utf8'));
  const slug = f.replace(/\.md$/, '');
  if (fm.slug !== slug) throw new Error(`${f}: slug ${fm.slug}`);
  const m = meta[slug]; if (!m) throw new Error(`${slug} is not in STORIES (assets/js/data.js)`);
  const bl = blocks(body);
  if (bl[0]?.t !== 'h1') throw new Error(`${slug}: the text does not start with "# title"`);
  const html = bl.map(blockHTML).join('');
  if (htmlText(html) !== mdText(body)) { const a = htmlText(html), b = mdText(body); let i = 0; while (a[i] === b[i]) i++; throw new Error(`${slug}: the page text differs from the file\n page: …${a.slice(i - 40, i + 60)}\n file: …${b.slice(i - 40, i + 60)}`); }
  return { slug, fm, bl, m };
});
// "Next story": along the timeline (the library's phase chips in order), then by date (story S08 on the canvas).
const timeline = [...stories].sort((a, b) => (CHIPS.indexOf(a.m.chip) - CHIPS.indexOf(b.m.chip)) || String(a.fm.date).localeCompare(String(b.fm.date)));
if (stories.length !== STORIES.length || timeline.some((s) => CHIPS.indexOf(s.m.chip) < 0)) throw new Error('stories and STORIES do not match');

/* ---------------------------------------------------------------- shared page parts */
const head = ({ title, desc, base }) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:type" content="article">
  <meta name="theme-color" content="#F4F1EA">
  <script>
    // Theme and reduced motion are decided before first paint (same keys as Home).
    (function () {
      var d = document.documentElement, t = null, r = null;
      try { t = localStorage.getItem('theme'); r = localStorage.getItem('af-reduce'); } catch (e) {}
      if (t !== 'light' && t !== 'dark') t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      d.setAttribute('data-theme', t);
      if (r === '1' || (r === null && matchMedia('(prefers-reduced-motion: reduce)').matches)) d.classList.add('reduce-motion');
      d.classList.add('js');
    })();
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${base}assets/css/site.css">
</head>`;
const ICONS = `  <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true">
    <defs>
      <symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></symbol>
      <symbol id="i-moon" viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></symbol>
      <symbol id="i-link" viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></symbol>
      <symbol id="i-right" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
    </defs>
  </svg>`;
const toggle = (cls) => `<button type="button" class="${cls}" data-theme-toggle aria-label="Switch to night"><svg class="ic ic-18"><use href="#i-moon"/></svg></button>`;
const thumb = (m, cls, w, h) => `<div class="${cls}" data-scene="${m.scene}" data-cam="${m.cam}" data-w="${w}" data-h="${h}" aria-hidden="true"></div>`;
const firstPara = (bl) => htmlText(bl.find((b) => b.t === 'p')?.html || '');

/* ---------------------------------------------------------------- one page per story */
mkdirSync(new URL('stories/', root), { recursive: true });
for (const s of stories) {
  const { slug, fm, bl, m } = s;
  const title = bl[0].text.replace(/\*/g, '');
  // sections: the title and its intro, then one per "##" heading
  const secs = [{ id: 'top', name: title, blocks: [] }];
  for (const b of bl.slice(1)) {
    if (b.t === 'h2') secs.push({ id: slugify(b.text), name: htmlText(b.html), blocks: [b] });
    else secs[secs.length - 1].blocks.push(b);
  }
  const ids = new Set();
  secs.forEach((c) => { let id = c.id, n = 2; while (ids.has(id)) id = `${c.id}-${n++}`; ids.add(c.id = id); });

  const chips = [fm.phase, ...fm.themes, fm.reading_time].map((c) => `<span>${esc(c)}</span>`).join('');
  const sections = secs.map((c, i) => `
        <section class="art-sec" id="${c.id}">
          ${i ? `<a class="art-anchor" href="#${c.id}" aria-label="Link to this section"><svg class="ic ic-15"><use href="#i-link"/></svg></a>
          ` : `<div class="st-chips">${chips}</div>
          ${blockHTML(bl[0])}
          `}${c.blocks.map(blockHTML).join('\n          ')}
        </section>`).join('');
  const posts = fm.linkedin_posts.map((p) => `<li><a href="${esc(p.url)}" rel="noopener">${fmtDate(p.date)}</a>${p.note ? ` <span>· ${esc(p.note)}</span>` : ''}</li>`).join('');
  const next = timeline[(timeline.indexOf(s) + 1) % timeline.length];

  writeFileSync(new URL(`stories/${slug}.html`, root), `${head({ title: `${title} · Achmad Farizky`, desc: firstPara(bl), base: '../' })}
<body class="story-page">
  <!-- Generated by tools/build-stories.mjs from achmadfarizky-content/stories/${slug}.md. Do not edit by hand. -->
${ICONS}
  <a class="skip-link" href="#story">Skip to content</a>
  <header class="art-header">
    <a class="art-brand" href="../index.html"><span class="af-mark af-36" aria-hidden="true">AF</span><span>Achmad Farizky</span></a>
    <div class="art-actions">
      <a class="chip-link" href="../stories.html">All stories</a>
      ${toggle('round-chip')}
    </div>
  </header>
  <div class="art-body">
    <nav class="art-toc" aria-label="In this story">
      <span class="t-label">In this story</span>
      <ul>${secs.map((c, i) => `<li><a href="#${c.id}"${i ? '' : ' aria-current="true"'}>${esc(c.name)}</a></li>`).join('')}</ul>
    </nav>
    <main class="art-main" id="story" tabindex="-1">
      <article>
        ${thumb(m, 'art-still', 700, 220)}${sections}
      </article>
      <footer class="st-foot">
        <div class="st-src">
          <span class="t-label">${fm.linkedin_posts.length > 1 ? 'From my LinkedIn posts' : 'From my LinkedIn post'}</span>
          <ul>${posts}</ul>
        </div>
        <a class="st-next" href="${next.slug}.html">
          ${thumb(next.m, 'st-next-thumb', 150, 96)}
          <span class="st-next-text"><span>Next story · ${esc(next.m.chip)}</span><strong>${esc(next.bl[0].text.replace(/\*/g, ''))}</strong></span>
          <span class="st-next-go" aria-hidden="true"><svg class="ic ic-18 bold"><use href="#i-right"/></svg></span>
        </a>
      </footer>
    </main>
  </div>
  <script type="module" src="../assets/js/story.js"></script>
</body>
</html>
`);
}

/* ---------------------------------------------------------------- the story index (same order and cards as Home's library) */
const titleOf = Object.fromEntries(stories.map((s) => [s.slug, s.bl[0].text.replace(/\*/g, '')]));
const cards = STORIES.map((s) => `
    <a class="story-card" href="stories/${s.slug}.html" data-topics="${s.topics.join(' ')}">
      ${thumb(s, 'story-thumb', 306, 170)}
      <div class="story-body">
        <div class="story-chips"><span>${esc(s.chip)}</span><span>${s.minutes} min</span></div>
        <strong class="story-title">${esc(titleOf[s.slug])}</strong>
      </div>
    </a>`).join('');
writeFileSync(new URL('stories.html', root), `${head({ title: 'Stories · Achmad Farizky', desc: `${STORIES.length} stories by Achmad Farizky, in ${TOPICS.length} topics: ${TOPICS.map((t) => t.name).join(', ')}.`, base: '' })}
<body class="story-index">
  <!-- Generated by tools/build-stories.mjs. Do not edit by hand. -->
${ICONS}
  <a class="skip-link" href="#stories">Skip to content</a>
  <div class="lib-hero">
    ${thumb({ scene: 'library', cam: 'wide' }, 'lib-hero-scene', 1440, 340).replace('data-w', 'data-side="right" data-w')}
    <div class="lib-top">
      <a class="glass-pill brand-pill" href="index.html"><span class="af-mark" aria-hidden="true">AF</span><span>Achmad Farizky</span></a>
      <div class="lib-actions">${toggle('glass-round')}</div>
    </div>
    <div class="lib-title glass-card">
      <h1>Stories</h1>
      <span>${STORIES.length} stories · ${TOPICS.length} topics</span>
    </div>
  </div>
  <div class="lib-chips" role="group" aria-label="Filter stories by topic">
    ${[{ id: 'all', name: 'All' }, ...TOPICS].map((t) => `<button type="button" class="topic-chip" data-topic="${t.id}" aria-pressed="${t.id === 'all'}">${esc(t.name)}</button>`).join('\n    ')}
  </div>
  <main class="lib-grid" id="stories" tabindex="-1">${cards}
  </main>
  <p class="sr-only" aria-live="polite" id="announce"></p>
  <script type="module" src="assets/js/story.js"></script>
</body>
</html>
`);
console.log(`wrote stories.html and ${stories.length} pages in stories/`);

/* ---------------------------------------------------------------- point the site's story links at the pages */
// A link counts as a story link when its text (a related-story card's <strong>) is the start of exactly one story title.
const titles = stories.map((s) => [s.slug, [titleOf[s.slug], s.fm.title, s.m.title]]);
const slugFor = (text) => {
  if (text === 'all stories') return 'index';
  const hits = titles.filter(([, ts]) => ts.some((t) => t.startsWith(text)));
  return text.length >= 8 && hits.length === 1 ? hits[0][0] : null;
};
for (const f of readdirSync(root).filter((f) => f.endsWith('.html') && f !== 'stories.html')) {
  const file = new URL(f, root), before = readFileSync(file, 'utf8');
  let n = 0;
  const after = before.replace(/<a\b([^>]*?)href="(#|stories\/[\w-]+\.html|stories\.html)"([^>]*)>([\s\S]*?)<\/a>/g, (all, a, href, b, inner) => {
    const text = unesc((/<strong>([\s\S]*?)<\/strong>/.exec(inner)?.[1] ?? inner).replace(/<[^>]+>/g, '')).trim();
    const slug = slugFor(text);
    if (!slug) return all;
    n++;
    return `<a${a}href="${slug === 'index' ? 'stories.html' : `stories/${slug}.html`}"${b}>${inner}</a>`;
  });
  if (after !== before) writeFileSync(file, after);
  if (n) console.log(`${f}: ${n} story links`);
}

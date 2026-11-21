import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const ROOT = path.resolve(process.cwd(), '../achmadfarizky-content');
// shortcut: show drafts while developing; set HIDE_DRAFTS=1 for the production build
const HIDE_DRAFTS = process.env.HIDE_DRAFTS === '1';

// story links in the content look like stories/x.md; the site serves /stories/x/
const fixLinks = (md) => md.replace(/\]\((?:\.\.\/)?stories\/index\.md\)/g, '](/stories/)')
  .replace(/\]\((?:\.\.\/)?stories\/([\w-]+)\.md\)/g, '](/stories/$1/)')
  .replace(/\]\(([\w-]+)\.md\)/g, '](/stories/$1/)');
export const md = (s) => marked.parse(fixLinks(s), { breaks: true });

export function getStories() {
  const dir = path.join(ROOT, 'stories');
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f !== 'index.md')
    .map((f) => {
      // the content's asset lines are free text and may hold ": ", so quote them before YAML sees them
      const raw = fs.readFileSync(path.join(dir, f), 'utf8').replace(/^(  - (?!date:|note:|url:)|[ \t]+note: )(.*\S)$/gm, (_, a, b) => (/^"[^"]*"$/.test(b) ? _ : `${a}"${b.replace(/"/g, '\\"')}"`));
      const { data, content } = matter(raw);
      const slug = data.slug || f.replace(/\.md$/, '');
      return { ...data, slug, date: new Date(data.date), body: md(content.replace(/^# .*\n/, '')) };
    })
    .filter((s) => !(HIDE_DRAFTS && s.status === 'draft'))
    .sort((a, b) => b.date - a.date);
}

const portfolio = () => fs.readFileSync(path.join(ROOT, 'portfolio.md'), 'utf8').replace(/<!--[\s\S]*?-->/, '');
const section = (src, h) => (src.split(/^## /m).find((s) => s.startsWith(h)) || '').replace(h, '');

export function getHome() {
  const src = portfolio();
  const intro = src.split(/^---$/m)[0];
  const lines = intro.split('\n');
  return {
    headline: (lines.find((l) => l.startsWith('**')) || '').replace(/\*\*/g, ''),
    location: (lines[lines.findIndex((l) => l.startsWith('**')) + 1] || '').trim(),
    introHtml: md(lines.filter((l) => l.startsWith('Hi,') || l.startsWith('I learned') || l.startsWith('This website')).join('\n\n')),
    threads: md(section(src, 'Three threads in my story')),
    threadItems: [...section(src, 'Three threads in my story').matchAll(/^\d+\. \*\*🧵 (.*?)\*\* (.*)$/gm)].map((m) => ({ title: m[1], text: m[2] })),
    quotes: [...section(src, 'Community & recognition').matchAll(/> "(.*?)"\n> — \*\*(.*?)\*\*,? ?(.*)/g)].map((m) => ({ text: m[1], who: m[2], role: m[3] })),
    years: (src.match(/(\d+) years/) || [])[1],
  };
}

export function getPhases() {
  const src = section(portfolio(), 'My story').split(/^---$/m).join('\n');
  return src.split(/^### /m).slice(1).map((p) => {
    const [title, ...rest] = p.split('\n');
    return { title: title.trim(), html: md(rest.join('\n').replace(/^---\s*$/gm, '').replace(/^#### /gm, '### ')) };
  });
}

export function getProjects() {
  const src = section(portfolio(), 'Portfolio').split(/^## /m)[0];
  return src.split(/^(?=\*\*\d+\. )/m).slice(1).map((p) => {
    const title = p.match(/^\*\*(\d+)\. (.*?)\*\*/);
    return { n: title[1], title: title[2], html: md(p.replace(/^\*\*\d+\. .*\n/, '').replace(/^### .*$/gm, '')) };
  });
}

export function getRest() {
  const src = portfolio();
  return {
    topics: md(section(src, 'What I write about')),
    community: md(section(src, 'Community & recognition')),
    passions: md(section(src, 'Passions')),
    tips: md(section(src, 'Tips for people with a background like mine')),
    skills: md(section(src, 'Skills, tools & certificates')),
    connect: md(section(src, "Let's connect")),
  };
}

export const PHASE_GROUPS = [
  ['University', 'University'], ['Telkomsel', 'Telkomsel'], ['Ericsson', 'Ericsson'], ['Kanzway', 'Kanzway'],
  ['Learning through community', 'Community 2025'], ['JHAH', 'Johns Hopkins Aramco Healthcare'], ['Life', 'Life beyond data'],
];
// a phase like "Telkomsel → JHAH" belongs to the group named first
export const phaseGroup = (phase = '') => {
  const hits = PHASE_GROUPS.map(([k, label], i) => [phase.indexOf(k), i, label]).filter(([p]) => p >= 0).sort((a, b) => a[0] - b[0]);
  return hits.length ? hits[0][2] : 'Other';
};

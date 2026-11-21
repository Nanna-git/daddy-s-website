// Site content used by the Home page menus.
// Titles, phases, themes and reading times are copied from
// achmadfarizky-content/stories/*.md frontmatter and portfolio.md.
// Every story and section link points to '#' until those pages exist.

export const TOPICS = [
  { id: 'powerbi',    name: 'Power BI design craft',            line: "dashboards that don't look like Power BI." },
  { id: 'engineering',name: 'Data engineering & Fabric',        line: 'the part nobody sees.' },
  { id: 'cdmp',       name: 'Data management & the CDMP road',  line: 'the "core of the core."' },
  { id: 'automation', name: 'Automation & clever tricks',       line: 'small hacks, big time savings.' },
  { id: 'storytelling',name: 'Data storytelling',               line: "it's not a bonus, it's mandatory." },
  { id: 'career',     name: 'Career & learning journey',        line: '21 years and still a student.' },
  { id: 'design',     name: 'Creative design',                  line: 'PowerPoint, Flash and Figma.' },
  { id: 'healthcare', name: 'Healthcare analytics',             line: 'learning a new industry after 40.' },
  { id: 'life',       name: 'Life beyond data',                 line: 'skating, hiking and languages.' },
];

const T = Object.fromEntries(TOPICS.map((t) => [t.name, t.id]));

// Library card (from the design): phase chip, number of views, and the
// diorama + camera drawn as the card's thumbnail.
const CARD = {
  '2020-learning-sprint': [11, 'Ericsson', 'village', 'lego'],
  'analyst-learn-the-business': [10, 'JHAH', 'server', 'board'],
  'ceo-dashboard': [7, 'Community', 'gallery', 'frames'],
  'chda-exam-shocked-me': [11, 'JHAH', 'jhah', 'office'],
  'data-vis-forge-gym': [14, 'Community', 'community', 'gym'],
  'english-my-enemy': [11, 'A year of trying', 'trying', 'plane'],
  'fabric-dojo-month': [11, 'Community', 'community', 'dojo'],
  'find-your-community': [9, 'Community', 'community', 'wide'],
  'first-year-in-healthcare': [17, 'JHAH', 'jhah', 'wide'],
  'freeskates': [8, 'Passions', 'village', 'skate'],
  'hajj-dream-team': [12, 'Ericsson', 'ericsson', 'wall'],
  'hey-reporter-2am-test-call': [8, 'Telkomsel', 'telkomsel', 'road'],
  'human-languages': [10, 'Ericsson', 'village', 'words'],
  'i-cheated-time-offset': [8, 'Ericsson', 'server', 'wide'],
  'i-miss-power-bi': [6, 'JHAH', 'gallery', 'first'],
  'just-do-the-thing': [9, 'Community', 'hill', 'bench'],
  'kettle-my-first-kitchen': [10, 'Telkomsel', 'telkomsel', 'desk'],
  'learn-healthcares-language': [16, 'JHAH', 'jhah', 'hospital'],
  'living-like-a-local': [8, 'Passions', 'village', 'hike'],
  'lucky-me-data-and-it': [11, 'Ericsson', 'server', 'racks'],
  'my-2025-journey': [13, 'Community', 'hill', 'top'],
  'portfolio-website-matters': [7, 'Community', 'gallery', 'wide'],
  'power-bi-park-lab': [13, 'Community', 'community', 'park'],
  'power-bi-theme-machine': [9, 'Community', 'workshop', 'shelf'],
  'power-query-email-trick': [5, 'Community', 'server', 'desk'],
  'powerpoint-makeup-artist': [14, 'University', 'campus', 'studio'],
  'road-to-cdmp-master': [17, 'JHAH', 'library', 'wide'],
  'sap-bo-to-power-bi': [11, 'Community', 'ericsson', 'console'],
  'side-projects-with-friends': [15, 'Community', 'workshop', 'wide'],
  'small-power-bi-tricks': [15, 'Community', 'server', 'tape'],
  'storytelling-bookshelf': [9, 'JHAH', 'library', 'plinths'],
  'svg-flash-memories': [5, 'University', 'campus', 'flash'],
  'why-power-query': [10, 'Kanzway', 'kanzway', 'shelves'],
};

const S = (title, slug, date, phase, themes, minutes) => {
  const [views, chip, scene, cam] = CARD[slug];
  return { title, slug, date, phase, minutes, views, chip, scene, cam, href: '#', topics: themes.map((name) => T[name]) };
};

export const STORIES = [
  S('Excel trainer, still a student: my 2020–21 learning sprint', '2020-learning-sprint', '2021-01-17', 'Ericsson', ['Career & learning journey', 'Automation & clever tricks'], 4),
  S('Why must a data analyst learn the business?', 'analyst-learn-the-business', '2026-07-28', 'JHAH', ['Data storytelling', 'Healthcare analytics'], 3),
  S("Rebuilding Nick Desbarats' CEO dashboard", 'ceo-dashboard', '2025-07-15', 'Learning through community (2025)', ['Power BI design craft'], 3),
  S('The CHDA exam shocked me', 'chda-exam-shocked-me', '2025-09-15', 'JHAH (preparing)', ['Healthcare analytics', 'Career & learning journey'], 4),
  S('The Data Vis Forge gym', 'data-vis-forge-gym', '2025-08-14', 'Learning through community (2025)', ['Power BI design craft'], 6),
  S('From emergency to fluency: retraining my voice', 'english-my-enemy', '2026-06-07', 'JHAH', ['Life beyond data', 'Career & learning journey'], 4),
  S('One month in the Fabric Dojo', 'fabric-dojo-month', '2025-05-02', 'Learning through community (2025)', ['Data engineering & Fabric'], 5),
  S('Find your community', 'find-your-community', '2025-04-13', 'Learning through community (2025)', ['Career & learning journey'], 3),
  S('My first year in healthcare', 'first-year-in-healthcare', '2026-06-17', 'JHAH', ['Healthcare analytics', 'Career & learning journey'], 5),
  S('Taking a break to skate', 'freeskates', '2025-07-08', 'Life', ['Life beyond data'], 2),
  S('The Hajj dream team', 'hajj-dream-team', '2023-07-01', 'Ericsson (Mobily)', ['Career & learning journey'], 3),
  S("Hey reporter, you're part of the brain! (the 2 AM test call)", 'hey-reporter-2am-test-call', '2026-08-21', 'Telkomsel → JHAH', ['Career & learning journey', 'Data management & the CDMP road'], 4),
  S('Human languages beat programming languages', 'human-languages', '2023-07-10', 'Ericsson', ['Life beyond data', 'Career & learning journey'], 3),
  S('I cheated! (But it turned out okay.)', 'i-cheated-time-offset', '2025-07-20', 'Ericsson (Mobily)', ['Career & learning journey', 'Automation & clever tricks'], 3),
  S('I really miss building front-end experiments', 'i-miss-power-bi', '2026-10-16', 'JHAH', ['Power BI design craft', 'Healthcare analytics'], 3),
  S('Just do the thing! How I studied', 'just-do-the-thing', '2026-01-21', 'Learning through community (2025)', ['Career & learning journey', 'Power BI design craft'], 3),
  S('Kettle, Pentaho and my first data warehouse', 'kettle-my-first-kitchen', '2023-07-05', 'Telkomsel → Ericsson', ['Data engineering & Fabric', 'Automation & clever tricks'], 3),
  S('Learn my language if you want to talk to me', 'learn-healthcares-language', '2026-11-16', 'JHAH', ['Healthcare analytics', 'Career & learning journey', 'Data management & the CDMP road'], 5),
  S('Living like a local', 'living-like-a-local', '2023-08-20', 'Life', ['Life beyond data'], 3),
  S('Data in IT is worse than a headache? Lucky me.', 'lucky-me-data-and-it', '2026-08-16', 'Ericsson → JHAH', ['Career & learning journey', 'Data management & the CDMP road'], 3),
  S('2025: from learning to a new career chapter', 'my-2025-journey', '2025-12-29', 'Learning through community (2025) → JHAH', ['Career & learning journey'], 5),
  S('Does a portfolio website matter?', 'portfolio-website-matters', '2025-08-05', 'Learning through community (2025)', ['Career & learning journey', 'Creative design'], 2),
  S('My Power BI Park lab', 'power-bi-park-lab', '2025-01-20', 'Learning through community (2025)', ['Power BI design craft', 'Career & learning journey'], 6),
  S('My own Power BI theme machine', 'power-bi-theme-machine', '2025-06-12', 'Learning through community (2025)', ['Automation & clever tricks', 'Power BI design craft'], 3),
  S('Sending hundreds of emails at once? A Power Query trick', 'power-query-email-trick', '2025-05-09', 'Learning through community (2025)', ['Automation & clever tricks'], 2),
  S('PowerPoint: my first "Power Platform"', 'powerpoint-makeup-artist', '2025-06-02', 'University → now', ['Creative design', 'Data storytelling'], 5),
  S('Road to CDMP Master', 'road-to-cdmp-master', '2026-07-20', 'JHAH', ['Data management & the CDMP road'], 6),
  S('From SAP BO to Power BI: web-style BI or BI-style web?', 'sap-bo-to-power-bi', '2025-04-04', 'Learning through community (2025)', ['Career & learning journey', 'Power BI design craft'], 4),
  S('Side projects with friends', 'side-projects-with-friends', '2025-09-07', 'Learning through community (2025)', ['Power BI design craft'], 4),
  S('Small Power BI tricks I love', 'small-power-bi-tricks', '2025-11-22', 'Learning through community (2025) → JHAH', ['Automation & clever tricks', 'Power BI design craft'], 5),
  S('My data storytelling bookshelf (and the yellow book)', 'storytelling-bookshelf', '2026-04-01', 'JHAH', ['Data storytelling'], 3),
  S('SVG animation took me back to Macromedia Flash', 'svg-flash-memories', '2025-07-02', 'Learning through community (2025)', ['Creative design', 'Power BI design craft'], 2),
  S('The reality of a data analyst, and why Power Query became my main tool', 'why-power-query', '2023-08-24', 'Ericsson → Kanzway', ['Automation & clever tricks', 'Career & learning journey'], 3),
];

const FEATURED = ['hey-reporter-2am-test-call', 'kettle-my-first-kitchen', 'i-cheated-time-offset', 'hajj-dream-team',
  'powerpoint-makeup-artist', 'svg-flash-memories', 'english-my-enemy', 'why-power-query',
  'power-bi-park-lab', 'fabric-dojo-month', 'chda-exam-shocked-me', 'freeskates'];
STORIES.sort((a, b) => {
  const fa = FEATURED.indexOf(a.slug), fb = FEATURED.indexOf(b.slug);
  if (fa >= 0 || fb >= 0) return (fa < 0 ? 99 : fa) - (fb < 0 ? 99 : fb);
  return b.date.localeCompare(a.date);
});

// The seven career phases (Chapters sheet, timeline spine).
export const PHASES = [
  { id: 'university', name: 'University', years: '2000–2005' },
  { id: 'telkomsel', name: 'Telkomsel', years: '2005–2009' },
  { id: 'trying', name: 'A year of trying', years: '2009–2010' },
  { id: 'ericsson', name: 'Ericsson', years: '2010–2023' },
  { id: 'kanzway', name: 'Kanzway', years: '2023–2025' },
  { id: 'community', name: 'Learning through community', years: '2025' },
  { id: 'jhah', name: 'Johns Hopkins Aramco Healthcare', years: '2025–now' },
];

// The other main sections (Chapters sheet grid).
export const MORE = [
  { id: 'portfolio', name: 'Portfolio' },
  { id: 'writing', name: 'What I write about' },
  { id: 'recognition', name: 'Community & recognition' },
  { id: 'passions', name: 'Passions' },
  { id: 'tips', name: 'Tips' },
  { id: 'skills', name: 'Skills, tools & certificates' },
  { id: 'connect', name: "Let's connect" },
];

// Article-mode table of contents.
export const TOC = [
  { id: 'home', name: 'Home' }, { id: 'university', name: 'University' }, { id: 'telkomsel', name: 'Telkomsel' },
  { id: 'trying', name: 'A year of trying' }, { id: 'ericsson', name: 'Ericsson' }, { id: 'kanzway', name: 'Kanzway' },
  { id: 'community', name: 'Learning through community' }, { id: 'jhah', name: 'JHAH' }, ...MORE,
];

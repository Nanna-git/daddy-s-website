// My story sections (2.1 University, 2.2 Telkomsel, 2.3 A year of trying, 2.4 Ericsson, 2.5 Kanzway, 2.6 Learning through community, 2.7 Johns Hopkins Aramco Healthcare). Each view is the canvas board: the scene
// drawn by the canvas engine (canvas-diorama.js) at 1440 × 900, plus that board's overlay.
// The page picks its section with <body data-section="…">.
import { sceneHTML, cameraMove, viaMove, povOf, warm } from './board.js';

// cam / uv / ut are copied from the boards U01…U11, TK01…TK10, YT01…YT05, ER01…ER15, KZ01…KZ07, LC01…LC09 and JH01…JH10 (ut = the text painted into the scene).
// moves: how the camera gets from each view to the next one:
//   'travel'  it really goes there (1.5 s); the old view's text stays where it is
//   'cut'     walk, cut, walk: for spots too far apart (1.8 s). The two pictures are moved, not redrawn:
//             the old one steps forward and fades, the new one fades in and settles (university.css)
//   'crane'   a slow rise to a view from above (2.4 s)
//   { kind: 'walk', back }  the long way on foot in one take, unhurried (7 s): turn to where it is going, walk to `back` units behind
//             the view's standing point, turn to face the view, walk in. No cut; the same going back.
//   'fade'    a plain cross-fade
//   { kind: 'via', turn, walk, via, dur }  turn ('left' / 'right'), walk `walk` units, cut, then walk the last
//             stretch to the view, starting where view number via + 1 stands (or at the point viaEye, or a little
//             before the view). out: it first backs that far out of the room. Going back the other way it turns the
//             short way and starts a little before the view.
//   { kind: 'fly', up, out, in, glide, reverse }  one take through the air: up, along a curve, and a glide down (flyPath
//             in board.js; reverse: flying backwards). Going back it flies the same curve the other way.
//   { kind: 'slide' }  sideways along the front of the sets and in or out of one of them, facing the walls all the way, in one take
//             (slidePath in board.js): for two views that face the same way, one of them standing further in.
//   { kind: 'route', via }  on foot through the points in via ([[x, y], …]: a gate, a door), in one take (routePath in board.js).
//             Going back, the same path is walked backwards. fixed: it keeps facing the walls instead of turning to the path.
//   { kind: 'drone', c1, c2 }  turn left on the spot as it lifts off, fly a curve through the ground points c1, c2, spin on round to
//             the left as it glides down onto the view (dronePath in board.js).
const DURATION = { travel: 1500, cut: 1800, crane: 2400, walk: 7000, fly: 3600, slide: 3200, route: 5000, drone: 6000 };
const SECTIONS = {
  // 1→2: on foot through the gate, up the walk and round to the antenna lab. 2→3: turn round, across the lawn and into the studio.
  university: { scene: 'uni', moves: [{ kind: 'route', via: [[26, 48], [25.5, 26]], dur: 5000 }, { kind: 'route', via: [[34, 24], [5, 24.5], [-24, 27.5]], dur: 6500 }, 'travel', 'travel', 'travel', 'travel', 'travel', 'crane'], views: [
  { cam: 'u1', uv: 1, ut: '1. University: an engineer|who loved design (2000–2005)||In 2000, I started studying Telecommunication Engineering at Telkom University in Bandung, Indonesia. (Back then, it was called Sekolah Tinggi Teknologi Telkom, or STT Telkom.)' },
  { cam: 'u2', uv: 2, ut: 'My classes were real engineering stuff: switching techniques, traffic engineering, transmission lines, antenna and propagation, digital signal processing, and optical and satellite communication systems.||There was a lot of calculus, physics and lab work, and I enjoyed it. Programming was only a small part: one introduction to computers and one programming lab.' },
  { cam: 'u3', uv: 3, ut: 'But outside the classroom, I spent a lot of my time on something else: design. I taught myself Adobe Photoshop and CorelDraw, then web design with HTML, CSS and JavaScript, and animation with Macromedia Flash.||Nobody asked me to. I just liked making things look good.' },
  { cam: 'u4', uv: 4, ut: 'I had a friend, Jockie Heruseon, who was much better than me at networking. He always knew where the opportunities were. So we teamed up: he found them, and I did the design work.||We joined web design competitions, and we got projects to design the university\'s yearly academic book and the university calendar. Together, we learned how the real world works, long before we graduated.' },
  { cam: 'u5', uv: 5, ut: 'I also had a best "art friend" on campus, Fakhrudin. He was a famous animator and designer among the students, and we pushed each other to make better work. Years later, when I made animated SVG visuals in Power BI, it took me straight back to those Flash days.' },
  { cam: 'u6t', uv: 6, ut: '' },
  { cam: 'u7t', uv: 7, ut: '' },
  { cam: 'u9', uv: 9, ut: "A moment I'm proud of||Getting paid, as a student, to design my own university's calendar and its academic book. Those were my first real design clients." },
  { cam: 'u11', uv: 11, ut: '' },
  ] },
  // Every move is one take. 1→2: on foot, turning left, in an arc down the field to the rural site, which stays in sight. 2→3: a flight back over the lot,
  // down through the open front of the office. 5→6: out of the office and into the meeting room. 6→7: back out of the meeting room,
  // along the front and into the office, facing the walls the whole way. 9→10: a slow rise to the whole lot.
  telkomsel: { scene: 'tsel', moves: [{ kind: 'route', watch: true, via: [[-50, 50]], dur: 5000 }, { kind: 'fly', out: 6, in: 30, up: 18, climb: 25, dur: 5000 },
    { kind: 'travel', dur: 1800 }, { kind: 'travel', dur: 2200 }, { kind: 'route', via: [[68, 46]], dur: 3400 }, { kind: 'route', fixed: true, via: [[96, 46], [56, 46]], dur: 4600 },
    { kind: 'travel', dur: 1800 }, { kind: 'travel', dur: 1800 }, { kind: 'crane', dur: 3400 }], views: [
  { cam: 't1', uv: 1, ut: "2. Telkomsel: the desk guy|who discovered data (2005–2009)||After graduating in 2005, I joined Telkomsel, Indonesia's biggest mobile operator, as a radio network engineer in operations and network performance, first in Medan and later in Jakarta." },
  { cam: 't2', uv: 2, ut: 'Honestly, I was a bit jealous in my first years. My colleagues travelled for technical training and went to the field with drive test tools. I stayed at my desk with spreadsheets.||One night I begged to join them, and they sent me to a rural site at 2 AM just to make a test call. I was so happy, like a kid in an amusement park.' },
  { cam: 't3', uv: 3, ut: 'At my desk, I started doing more than delivering numbers. I learned UNIX scripting by myself and used it to build small automations for our daily work. I used my old web skills to build a web dashboard for network performance. Then I combined Google Earth with UNIX scripts to build a live GIS view of our 2G radio network, so management could see how the network was running from their own workstations.' },
  { cam: 't4', uv: 4, ut: 'In my last year, my manager, Akhmad Madces, brought me into a big data warehouse project. We collected network performance data from all our equipment vendors (Ericsson, Siemens, Nokia, Huawei and more) into one place, and built the dashboards and reports on top of it with Pentaho. I had two great mentors on that project: Reza Lesmana, a solution architect at Nokia, and Feris Thia, CEO of Pentaho Indonesia. It was my first time learning what a data warehouse is, and I still use those concepts today.' },
  { cam: 't5', uv: 5, ut: "Thread 1 again.||Very few people around me knew even a little programming. That small skill made me useful in a way I didn't expect." },
  { cam: 't6', uv: 6, ut: 'Thread 2 again.||My team leaders, Petrus Sila and Sorpa EA Togatorop, kept me at my desk with Excel. At the time I didn\'t understand why. Later I realized they saw where my work created real value before I did. I wasn\'t just their "calculator guy." I was helping guide their decisions.' },
  { cam: 't7', uv: 7, ut: 'Thread 3, for the first time.||Google Earth and a few scripts became a live monitoring tool. No big budget, just tools we already had.' },
  { cam: 't8', uv: 8, ut: "A moment I'm proud of||In 2009, after the earthquake in West Sumatra, my GIS live monitoring tool was used during the network recovery. I received official appreciation from the company's directors and VPs. I was also named best employee of the service quality assurance team in 2007." },
  { cam: 't9', uv: 9, ut: '' },
  { cam: 't10', uv: 10, ut: '' },
  ] },
  // 1→2 and 3→4: the whole way on foot (down the road to the study; out of the study and down the road to the airport).
  // 2→3: a side-step along the wall to the window.
  trying: { scene: 'yt', moves: [{ kind: 'walk', back: 10 }, 'travel', { kind: 'walk', back: 10 }, 'crane'], views: [
  { cam: 'y1', uv: 1, ut: '3. A year of trying|(2009–2010)||At the end of 2009, I left Telkomsel to build a career overseas. It took longer than I hoped. For most of 2010, I kept applying and waiting.' },
  { cam: 'y2', uv: 2, ut: 'I used that time to fill a gap. After five years in data and reporting, I felt my telecom knowledge was not deep enough. So I studied 3G radio networks seriously. I wanted to understand how things really work on the business side of the network, not only the data and the reports about it.' },
  { cam: 'y3', uv: 3, ut: 'Thread 2, in a different way.||To be useful to engineers, I had to understand their world, not just their numbers.' },
  { cam: 'y4', uv: 4, ut: 'Patience. Some doors open late, but they do open. In October 2010, Ericsson brought me to Riyadh, Saudi Arabia.||When I arrived, my English speaking was close to zero. My Arabic helped me survive, and my English just "grew by nature" for many years. (It took me another 15 years to finally fix it properly. That\'s its own story.)' },
  { cam: 'y5', uv: 5, ut: '' },
  ] },
  // 2→3, 6→7, 9→10, 11→12: a side-step along the wall. 3→4 and 5→6: a crane: up, forward, a glide down
  // (3→4 turns right as it rises and flies along the back of the operations room; 5→6 goes straight over the back wall).
  // 4→5: a drone: it turns left as it lifts off, flies an arc over the operations room, and spins on round to the left (about
  // 270°) as it glides down in front of it. 7→8: pulling back and to the right out of the tent, low over the sand and the back wall.
  // 8→9: back out of the room, turn right, walk, cut to the road, then turn in to the last room. 12→13: fast, straight through.
  ericsson: { scene: 'er', moves: ['fade', 'travel', { kind: 'fly', dur: 4400, out: 4, in: 40, climb: 40 }, { kind: 'drone', c1: [112, -34], c2: [82, 16], up: 18, dur: 6500 },
    { kind: 'fly', dur: 3200, climb: 16 }, 'travel', { kind: 'fly', reverse: true, dur: 3000, up: 9, out: 8, in: 8, glide: 0.35 }, { kind: 'via', turn: 'right', out: 12, walk: 10, viaEye: [172, 31, 5.2], dur: 4600 },
    'travel', 'fade', 'travel', { kind: 'travel', dur: 1000 }, 'fade', 'crane'], views: [
  { cam: 'e1', uv: 1, ut: '4. Ericsson: 13 years with|Saudi telecom operators (2010–2023)||At Ericsson, I was a Data Solution Professional in managed services. I worked from Riyadh and Jeddah for telecom operators in Saudi Arabia, and later supported projects in the GCC and Africa. I was on the business side, close to the network operations teams, not in IT.' },
  { cam: 'e2', uv: 2, ut: '4a. STC: building on SAP BusinessObjects (2010–2012)||My first customer was STC. Here I went deep into SAP BusinessObjects, not just as a user. I built ways to share documents publicly, set up alerts for network anomalies, and put data on Google Earth and Google Maps for faster insights.' },
  { cam: 'e3', uv: 3, ut: 'In 2011, I was named best employee of the STC network performance team. In 2012, Omar Elward taught me Excel macros and VBA, another tool I used for years.' },
  { cam: 'e4', uv: 4, ut: '4b. Mobily: nine years and the Hajj dream team (2013–2022)||Mobily was my longest customer. From 2014 to 2020, I was the data leader for Hajj affairs. During Hajj, the network carries millions of pilgrims in a few days, and the operations team needs to see what is happening live.' },
  { cam: 'e5', uv: 5, ut: 'I integrated the data end to end, built dashboards and a mini-GIS application for live monitoring, made advanced reports, and automated many processes. This saved a lot of effort and improved accuracy. The tools were used for many years in a row.' },
  { cam: 'e6', uv: 6, ut: 'That team was more than a team. It was a family: we supported each other, taught each other, and covered each other. Naif Al Malki, then a General Manager at Mobily and my data analytics mentor for many years, wrote this about my work:||"Indeed, your fingerprint is still till today, you are one of the best talented telecom engineer in advanced data analysis field that I worked with him, wish you all the best."||Naif Al Malki, now GM of Service Management Center' },
  { cam: 'e7', uv: 7, ut: "I also received official appreciation from the customer's top management for the work progress and deep analytics." },
  { cam: 'e8', uv: 8, ut: 'At Mobily, I also "cheated" once. Our BI tool made it hard to compare time periods, like today vs. yesterday, hour by hour. So I added "time offset" calculations directly into our main data model on the production server. I was afraid it looked like a quick fix. But it worked for years, and it\'s still in use. More than ten years later, I saw well-known BI experts teaching the same idea in Power BI, and calling it a superpower.||My "cheat" had been an expert trick all along. I just didn\'t know it.||Sometimes what looks like a "cheat" is actually a smart solution. That gave me the confidence to start sharing even my small ideas.' },
  { cam: 'e9', uv: 9, ut: '4c. Many customers, one way of working (2021–2023)||In my last years, I moved between projects: a 4G and 5G trial for Zain, remote support for MTN Benin in Africa, then back to STC, and finally Tawal. Because I had built my tools in a reusable way, I could copy them to new projects quickly. A project manager in Bahrain told me, "Your reports are great!" A customer director in Benin said, "I like that dashboard!"' },
  { cam: 'e10', uv: 10, ut: 'During these years I also kept learning by myself: advanced Excel and Power Query, Python, and machine learning. A friend who was also my customer, Sultan Alsayed, showed me his work in Power BI, and that pushed me to want to be as good as him. My boss also encouraged me to go deeper into machine learning.' },
  { cam: 'e11', uv: 11, ut: 'Thread 2 again.||Most of my best tools started from what my team leaders, managers and customers needed. The IT team was supportive too: "Go ahead, do what the business needs."' },
  { cam: 'e12', uv: 12, ut: "Thread 3 again.||The vendor's built-in reports didn't always fit our needs, so I built custom ones with the tools we had. Custom was the solution, and many of those tools are still in daily use." },
  { cam: 'e13', uv: 13, ut: "A moment I'm proud of||Being trusted as the data leader for Hajj for seven years in a row, and Naif's words above." },
  { cam: 'e14', uv: 14, ut: '' },
  { cam: 'e15', uv: 15, ut: '' },
  ] },
  // The three sets stand side by side around one yard, so the camera slides from one to the next, always facing the walls.
  // 1→2: along the road, then in on the data office. 2→3, 3→4: along the office wall. 4→5: back out of the office, then along the
  // road to the dock. 5→6: a step to the right and closer. 6→7: back and up over the road, to the whole yard.
  kanzway: { scene: 'kz', moves: [{ kind: 'slide' }, 'travel', 'travel', { kind: 'slide', dur: 3400 }, 'travel', { kind: 'travel', dur: 2600 }], views: [
  { cam: 'k1', uv: 1, ut: '5. Kanzway: my first manager role (2023–2025)||In September 2023, I joined Kanzway in Jeddah in a senior data management role, to manage the company\'s digital product catalog. Later my role changed: I became Business and Data Management Manager, leading a small data team. It was a new world for me, far from telecom: industrial tool brands, product catalogs and business requirements.' },
  { cam: 'k2', uv: 2, ut: 'I wrote business requirements documents (BRDs) to define project scope, and designed entity relationship diagrams (ERDs) for the product catalog. I built a process with Python and SQL to collect complex catalog data from our partners\' websites (brands like Dormer, Völkel, ESAB, Knipex, Koken and Röhm) and load it into our database with full accuracy. I also built Power BI dashboards for management.' },
  { cam: 'k3', uv: 3, ut: 'I also worked closely with software developers for the first time. My friends Yussin Hidayat and Aslah Fuadin taught me Git on a real project, and I learned to manage work with Trello.||In 2025 the company ended its operations. I stayed until the last months to help.' },
  { cam: 'k4', uv: 4, ut: 'Leading a team for the first time taught me that my job was no longer only to build things, but to help other people build them well.||Writing BRDs taught me to speak the business language first, before touching any data.||Working with developers taught me version control and teamwork habits that I had never needed as a "solo data warrior."' },
  { cam: 'k5', uv: 5, ut: 'When things end, you still have everything you learned.' },
  { cam: 'k6', uv: 6, ut: '' },
  { cam: 'k7', uv: 7, ut: '' },
  ] },
  // Four places stand apart on one park lot. 1→2: on foot through the gate, beside Achmad, up the path and round to the park wall.
  // 2→3: back from the wall, then sideways past the lawn to the hall. 3→4: a flight backwards, up over the street building and down
  // in front of it. 4→5: a flight over that roof and across the lot, down to the middle of the park wall. 5→6: along the wall.
  // 6→7: walk, cut, walk (the street is too far to walk to). 7→8: a flight over the roof, down in front of the locker room.
  // 8→9: back and up over the street building, to the whole lot.
  community: { scene: 'lc', moves: [{ kind: 'route', via: [[-55.2, 30], [-58, 2]] }, { kind: 'slide', dur: 4200 }, { kind: 'fly', reverse: true, up: 18, glide: 0.4 }, { kind: 'fly', up: 18, dur: 4200 }, 'travel', 'cut', { kind: 'fly', up: 16, dur: 3400 }, { kind: 'travel', dur: 3000 }], views: [
  { cam: 'c1', uv: 1, ut: '6. Learning through community (2025)||At the end of 2024, I decided to learn Power BI properly. I already knew BI from SAP BusinessObjects, but I wanted to learn the modern way. So I joined online communities and followed their instructions exactly.' },
  { cam: 'c2', uv: 2, ut: 'Power BI Park||(led by Injae Park), from January 2025. One project after another, posting my progress on LinkedIn twice a week because the community asked us to. I was #1 on the monthly leaderboard from January to March, and then I was asked to be a moderator.' },
  { cam: 'c3', uv: 3, ut: 'Fabric Dojo||(led by Will Needham), April 2025. I finished all the classes in one month, reached #1 on the leaderboard, and earned the blue belt.||The Data Vis Forge||(led by Gustaw Dudek), May–June 2025. Advanced "workouts" where I chose not to open the solution files. I learned corporate-style reporting there.' },
  { cam: 'c4', uv: 4, ut: 'In July, I built a simple portfolio website and started looking for a job. In August, two big companies interviewed me on the same day, and both offered me a job. My LinkedIn posts really helped.||During the hiring process, I passed DP-700 (Microsoft Fabric) and PL-300 (Power BI) to make sure my foundation was solid.' },
  { cam: 'c5', uv: 5, ut: 'Just do the thing.||Follow the mentor\'s instructions exactly. Don\'t skip steps. I even typed the datasets myself instead of downloading them, and rebuilt the visuals instead of copying them. That\'s where I found the "hidden treasures."||Find your community.||My first community was Pentaho-Indonesia in 2010. Fifteen years later, communities changed my career again.' },
  { cam: 'c6', uv: 6, ut: 'Thread 1 again.||I was over 40, with 20 years of experience, and still a student. Age is just a number.' },
  { cam: 'c7', uv: 7, ut: 'A moment I\'m proud of||Two job offers on the same day, after only eight months of learning in public.' },
  { cam: 'c8', uv: 8, ut: '' },
  { cam: 'c9', uv: 9, ut: '' },
  ] },
  // Four places stand apart on one hospital lot: the hospital front and the wing at the front, the library and the data office behind them.
  // 1→2: a flight up the hospital front, over its roof and down to the library behind it. 2→3: on foot in one take: turn right, along the
  // back row to the data office, turn in. 3→4: along the office wall. 4→5: sideways along the front of the back row, facing the walls all
  // the way, then in on the other half of the library. 5→6: a flight backwards, up out of the library, across the lot and over
  // the wing, down in front of the clinic corridor. 6→7, 7→8: along the wing. 8→9: a flight over the wing, down in front of the office.
  // 9→10: back and up over the wing, to the whole lot.
  jhah: { scene: 'jh', moves: [{ kind: 'fly', up: 26, climb: 26, dur: 5000 }, { kind: 'walk', back: 10, dur: 6000 }, 'travel', { kind: 'slide', dur: 4200 }, { kind: 'fly', reverse: true, up: 18, glide: 0.4, dur: 4600 }, 'travel', { kind: 'travel', dur: 1800 }, { kind: 'fly', up: 16, dur: 4000 }, { kind: 'crane', dur: 3400 }], views: [
  { cam: 'j1', uv: 1, ut: '7. Johns Hopkins Aramco Healthcare: learning a new language (2025–now)||In October 2025, I joined Johns Hopkins Aramco Healthcare (JHAH) in Dhahran as a Quality & Data Analyst, working as a data specialist in healthcare. It was my third industry, and the first one where I didn\'t know the business at all.' },
  { cam: 'j2', uv: 2, ut: 'Before day one, I studied healthcare analytics and passed the CHDA exam (AHIMA), which shocked me with how deep the healthcare questions were. Then Elijah Joshua Pryor, through his posts, introduced me to DAMA and the DMBOK2. After that, I started studying data management seriously, because it brings all my years of experience together into one framework.' },
  { cam: 'j3', uv: 3, ut: 'In my first year:||I found that about 60% of my job is talking to people, not working with data.||My first task was one page of a Power BI dashboard. A few weeks later, I was unexpectedly asked to open it in a meeting with shareholders and answer their questions. They liked it.||My director gave me the chance to lead a new data project, where I practiced data modeling for real.||I took Epic training (Cogito, Clarity, Caboodle and Access data models) to understand our healthcare data and work better with the IT reporting teams.||I helped with the data side of JHAH\'s ICHOM accreditation for two services, one of them a first in Saudi Arabia.||I passed all my CDMP exams and became a CDMP Master in August 2026.' },
  { cam: 'j4', uv: 4, ut: 'My work moved from front-end dashboards to the back end: data modeling, data quality and metadata. I miss building Power BI experiments sometimes, but a strong back end makes the front end much easier.' },
  { cam: 'j5', uv: 5, ut: 'Now I\'m studying again: a Master of Applied Science in Patient Safety & Healthcare Quality at the Johns Hopkins Bloomberg School of Public Health, and two AI and Agentic AI in Healthcare programs at the Johns Hopkins Whiting School of Engineering.' },
  { cam: 'j6', uv: 6, ut: 'Thread 2, in its newest form: learn their language.||To build something useful for doctors, nurses and pharmacists, I first need to understand how they work. So I\'m learning healthcare from the inside.' },
  { cam: 'j7', uv: 7, ut: 'Find mentors early.||My colleagues are senior people with clinical backgrounds, and my manager is strong in data management. I\'m surrounded by great teachers.||Analytics shows you the answer. Data management tells you whether you can trust it.' },
  { cam: 'j8', uv: 8, ut: 'A moment I\'m proud of||That shareholder meeting, when the dashboard answered their questions better than I could.' },
  { cam: 'j9', uv: 9, ut: 'Tools I picked up' },
  { cam: 'j10', uv: 10, ut: '' },
  ] },
};
const SLUG = document.body.dataset.section;
const { scene: SCENE, views: VIEWS, moves: MOVES } = SECTIONS[SLUG];
const TOTAL = VIEWS.length;

const root = document.documentElement;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};
const phoneQuery = matchMedia('(max-width: 819px)');
const isDark = () => root.dataset.theme === 'dark';
const reduced = () => root.classList.contains('reduce-motion');

/* ================================================================ drawing the views */
const views = $$('.u-view');
const drawn = new Map(); // view index → theme it was drawn in
const viewProps = (i) => { const v = VIEWS[i]; return { scene: SCENE, cam: v.cam, side: 'center', nofog: 'true', uv: v.uv, ut: v.ut, dark: isDark(), w: 1440, h: 900 }; };
function draw(i) {
  if (i < 0 || i >= TOTAL) return;
  const mode = isDark() ? 'dark' : 'light';
  if (drawn.get(i) === mode) return;
  $('.u-board', views[i]).innerHTML = sceneHTML(viewProps(i));
  $$('.u-thumb', views[i]).forEach((el) => { el.innerHTML = sceneHTML({ scene: el.dataset.scene, cam: el.dataset.cam, dark: el.dataset.dark ? true : isDark(), w: +el.dataset.w || 284, h: +el.dataset.h || 124, inset: false }); });
  drawn.set(i, mode);
}

// The scene covers its box (like a background photo); the overlay is fitted inside the
// viewport so its text is never cut off. Both use the board's 1440 × 900 coordinates.
function fit() {
  const sc = $('.u-scene', views[0]);
  const w = sc.clientWidth, h = sc.clientHeight;
  root.style.setProperty('--cover', Math.max(w / 1440, h / 900));
  root.style.setProperty('--contain', Math.min(window.innerWidth / 1440, window.innerHeight / 900));
}
window.addEventListener('resize', fit);

/* ================================================================ theme / reduced motion */
function applyTheme(theme, save) {
  root.dataset.theme = theme;
  $$('[data-theme-set]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.themeSet === theme)));
  $$('[data-theme-toggle]').forEach((b) => {
    b.setAttribute('aria-label', theme === 'dark' ? 'Switch to day' : 'Switch to night');
    $('use', b).setAttribute('href', theme === 'dark' ? '#i-sun' : '#i-moon');
  });
  $('meta[name="theme-color"]').setAttribute('content', theme === 'dark' ? '#0B1222' : '#F4F1EA');
  if (save) store.set('theme', theme);
  [active - 1, active, active + 1].forEach(draw);
}
$$('[data-theme-set]').forEach((b) => b.addEventListener('click', () => applyTheme(b.dataset.themeSet, true)));
$$('[data-theme-toggle]').forEach((b) => b.addEventListener('click', () => applyTheme(isDark() ? 'light' : 'dark', true)));
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => { if (!store.get('theme')) applyTheme(e.matches ? 'dark' : 'light'); });

/* ================================================================ moving between views */
const circ = 2 * Math.PI * 26;
let active = -1, lockUntil = 0;
function setActive(i, { focus = false } = {}) {
  i = Math.max(0, Math.min(TOTAL - 1, i));
  if (i === active) return;
  const prev = active;
  active = i;
  draw(i);
  views.forEach((v, k) => {
    const on = k === i;
    v.classList.toggle('is-active', on);
    v.toggleAttribute('inert', !on);
    v.setAttribute('aria-hidden', String(!on));
  });
  $$('[data-idx]').forEach((el) => (el.textContent = i + 1));
  $('#dial').setAttribute('aria-label', `View ${i + 1} of ${TOTAL}`);
  $('.dial-fill').style.strokeDasharray = `${(circ * (i + 1) / TOTAL).toFixed(1)} 999`;
  $$('.phone-dots span').forEach((d, k) => d.classList.toggle('on', k === i));
  const last = i === TOTAL - 1;
  $('[data-phone-next]').hidden = last;
  $('[data-phone-section]').hidden = !last;
  if (prev >= 0) $('#announce').textContent = `View ${i + 1} of ${TOTAL}`;
  const hash = `#/${SLUG}/${i + 1}`;
  if (location.hash !== hash) history.replaceState(null, '', hash);
  if (phoneQuery.matches) $('#views').scrollTop = 0;
  // draw the neighbours once this view is up, so the next move is instant
  setTimeout(() => {
    if (root.classList.contains('is-moving')) return;
    draw(i + 1); draw(i - 1);
    if (!reduced()) [i, i + 1, i - 1].forEach((k) => { if (k >= 0 && k < TOTAL) warm(viewProps(k)); }); // so a move starts on time
  }, reduced() ? 0 : 700);
  if (focus) {
    const t = $('h1, h2, h3, .u-copy', views[i]);
    if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1');
    setTimeout(() => t.focus({ preventScroll: true }), reduced() ? 0 : 650);
  }
}
function step(dir, opts) {
  const now = performance.now();
  if (now < lockUntil) return;
  const next = active + dir;
  if (next < 0 || next >= TOTAL) return;
  const pair = Math.min(active, next), move = typeof MOVES[pair] === 'string' ? { kind: MOVES[pair] } : MOVES[pair];
  if (!reduced() && !heavy.has(pair) && heavy.size < 2 && move.kind !== 'fade') { moveTo(next, opts, move, pair); return; }
  lockUntil = now + (reduced() ? 250 : 1050);
  setActive(next, opts);
}

// Camera move to a neighbouring view. It plays inside the old view, then the next view takes over at
// the same camera and its text comes in line by line.
const heavy = new Set(); // moves this device could not keep up with: they cross-fade from then on (all of them after two)
function moveTo(next, opts, move, pair) {
  const prev = active, kind = move.kind, dur = move.dur || DURATION[kind];
  lockUntil = performance.now() + dur + 200;
  root.classList.add('is-moving'); // the laid-over text, cards and the Next link fade out
  const arrive = () => {
    drawn.delete(next);
    draw(next); // also its story pictures
    $('.u-board', views[next]).innerHTML = sceneHTML({ ...viewProps(next), enter: true });
    setActive(next, opts);
    views[next].getBoundingClientRect(); // the views swap at once, then the laid-over text fades in
    root.classList.remove('is-moving');
  };
  if (kind === 'cut') {
    // walk, cut, walk without redrawing: the old picture steps forward and fades, the new one fades in and settles
    $('.u-board', views[next]).innerHTML = sceneHTML({ ...viewProps(next), evo: 0 }); // its words come in on arrival
    views[prev].classList.add('cut-out'); views[next].classList.add('cut-in');
    setTimeout(() => { arrive(); views[prev].classList.remove('cut-out'); views[next].classList.remove('cut-in'); }, dur);
    return;
  }
  const board = $('.u-board', views[prev]), a = viewProps(prev), b = viewProps(next);
  const forward = next > prev; // the turn hand and the cut-in spot are written for going forward
  const playing = kind === 'via'
    ? viaMove(board, a, b, forward ? { ...move, viaEye: move.viaEye || (move.via == null ? null : povOf(viewProps(move.via)).eye) } : { walk: move.walk, out: move.out }, dur)
    : cameraMove(board, a, b, ['walk', 'fly', 'slide', 'route', 'drone'].includes(kind) ? kind : 'travel', dur, { ...move, flip: !forward });
  playing.then((smooth) => {
    if (!smooth) heavy.add(pair);
    drawn.delete(prev); // the old board is left at the new camera; it is redrawn as a neighbour
    arrive();
  });
}
$$('[data-next]').forEach((b) => b.addEventListener('click', () => step(1, { focus: true })));

let wheelSum = 0, wheelTimer = 0;
window.addEventListener('wheel', (e) => {
  if (phoneQuery.matches) return;
  e.preventDefault();
  if (performance.now() < lockUntil) { wheelSum = 0; return; }
  wheelSum += e.deltaY;
  clearTimeout(wheelTimer);
  wheelTimer = setTimeout(() => (wheelSum = 0), 200);
  if (Math.abs(wheelSum) >= 60) { step(wheelSum > 0 ? 1 : -1); wheelSum = 0; }
}, { passive: false });

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeHudMenu(); return; }
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  const onControl = e.target.closest('button, a, [role="button"]');
  switch (e.key) {
    case 'ArrowDown': case 'ArrowRight': case 'PageDown': e.preventDefault(); step(1, { focus: true }); break;
    case ' ': if (onControl) return; e.preventDefault(); step(e.shiftKey ? -1 : 1, { focus: true }); break;
    case 'Enter': if (onControl) return; e.preventDefault(); if (active === TOTAL - 1) $('a.next-link', views[active]).click(); else step(1, { focus: true }); break;
    case 'ArrowUp': case 'ArrowLeft': case 'PageUp': e.preventDefault(); step(-1, { focus: true }); break;
    case 'Home': e.preventDefault(); lockUntil = 0; setActive(0, { focus: true }); break;
    case 'End': e.preventDefault(); lockUntil = 0; setActive(TOTAL - 1, { focus: true }); break;
  }
});

let touch = null;
document.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) touch = { y: e.touches[0].clientY, x: e.touches[0].clientX, t: performance.now(), top: $('#views').scrollTop };
}, { passive: true });
document.addEventListener('touchend', (e) => {
  if (!touch) return;
  const p = e.changedTouches[0], dy = touch.y - p.clientY, dx = touch.x - p.clientX, dt = performance.now() - touch.t, st = touch;
  touch = null;
  if (Math.abs(dy) < 40 || Math.abs(dy) < Math.abs(dx) || Math.abs(dy) / dt < 0.3) return;
  const sheet = $('#views');
  if (phoneQuery.matches && e.target.closest('#views')) {
    const atEnd = sheet.scrollTop + sheet.clientHeight >= sheet.scrollHeight - 2;
    if ((dy > 0 && !atEnd) || (dy < 0 && !(st.top <= 0 && sheet.scrollTop <= 0))) return;
  }
  step(dy > 0 ? 1 : -1);
}, { passive: true });

/* ================================================================ HUD menu */
const hudMenu = $('#hud-menu'), hudBtn = $('.hud-menu-btn');
function closeHudMenu() { hudMenu.classList.remove('is-open'); hudBtn.setAttribute('aria-expanded', 'false'); }
hudBtn.addEventListener('click', () => {
  const open = !hudMenu.classList.contains('is-open');
  hudMenu.classList.toggle('is-open', open);
  hudBtn.setAttribute('aria-expanded', String(open));
});
document.addEventListener('pointerdown', (e) => { if (!hudMenu.contains(e.target)) closeHudMenu(); });

/* ================================================================ start */
const viewHash = new RegExp(`^#/${SLUG}/(\\d+)$`);
const fromHash = () => { const m = viewHash.exec(location.hash); return m ? Math.min(TOTAL, Math.max(1, +m[1])) - 1 : 0; };
window.addEventListener('hashchange', () => { if (viewHash.test(location.hash)) { lockUntil = 0; setActive(fromHash()); } });
// links to pages that don't exist yet point to '#': stay on this view
document.addEventListener('click', (e) => { if (e.target.closest('a[href="#"]')) e.preventDefault(); });
const start = fromHash();
fit();
active = start; // so applyTheme draws the right views
applyTheme(root.dataset.theme);
active = -1;
setActive(start);
// Arriving behind the slate (slate.js): as the board drops away, this view's text comes in.
const slate = window.Slate;
if (slate?.arriving && !reduced()) root.classList.add('is-moving');
slate?.land(() => {
  if (!root.classList.contains('is-moving')) return;
  $('.u-board', views[active]).innerHTML = sceneHTML({ ...viewProps(active), enter: true });
  root.classList.remove('is-moving');
});
requestAnimationFrame(() => root.classList.add('u-ready'));

// Builds extensions/diagram-options.html: four candidate "scroll-down" extensions for the homepage.
// Standalone: one file, inline SVG, EN only (BM is made for whichever option is chosen).
// Rules followed (diagram-design skill): orthogonal r=8 connectors, ports >= 8px off corners, labels on opaque
// masks with a 6-10px gap, <= 2 accent elements per diagram, 4px grid, accessible title/desc, legend strip.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

const K = {
  paper: '#fffaf3', card: '#ffffff', ink: '#1f1b16', muted: '#6f675c', soft: '#8f867a',
  rule: '#efe4d3', ruleSolid: '#d9cdb9',
  accent: '#f5a524', accentTint: '#ffe9b8',
  teal: '#0f766e', tealTint: '#d9f2ee', tealB: '#b9e3dc',
  rose: '#fde2d8', roseB: '#f8c4b0', warn: '#b4412b',
  amberTint: '#fff3d6', amberB: '#f3d9a0',
};
const SANS = "'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',sans-serif";
const MONO = "'Geist Mono',ui-monospace,'SF Mono',Menlo,monospace";

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const T = (x, y, s, o = {}) =>
  `<text x="${x}" y="${y}" fill="${o.fill || K.ink}" font-size="${o.size || 13}" font-weight="${o.w || 400}" font-family="${o.mono ? MONO : SANS}"${o.anchor ? ` text-anchor="${o.anchor}"` : ''}${o.ls ? ` letter-spacing="${o.ls}"` : ''}${o.italic ? ' font-style="italic"' : ''}>${esc(s)}</text>`;
const R = (x, y, w, h, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 6}" fill="${o.fill || 'none'}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 1}"` : ''}${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.op ? ` opacity="${o.op}"` : ''}/>`;

// rounded orthogonal path through pts, radius r on each interior bend
function elbow(pts, r = 8) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1], [cx, cy] = pts[i], [nx, ny] = pts[i + 1];
    const d1 = Math.hypot(cx - px, cy - py), d2 = Math.hypot(nx - cx, ny - cy);
    const a = Math.min(r, d1 / 2), b = Math.min(r, d2 / 2);
    const sx = cx - ((cx - px) / d1) * a, sy = cy - ((cy - py) / d1) * a;
    const ex = cx + ((nx - cx) / d2) * b, ey = cy + ((ny - cy) / d2) * b;
    d += ` L${sx} ${sy} Q${cx} ${cy} ${ex} ${ey}`;
  }
  const [lx, ly] = pts[pts.length - 1];
  return d + ` L${lx} ${ly}`;
}
const arrow = (id, pts, o = {}) =>
  `<path d="${elbow(pts)}" fill="none" stroke="${o.accent ? K.accent : K.muted}" stroke-width="${o.accent ? 1.6 : 1.2}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.noHead ? '' : ` marker-end="url(#${id}-${o.accent ? 'arrow-accent' : 'arrow'})"`}/>`;
// arrow label: mono, caps, opaque mask, gap handled by caller's y
const label = (x, y, s, anchor = 'middle', bg = K.paper) => {
  const w = Math.ceil(s.length * 6.2 + 12), x0 = anchor === 'middle' ? x - w / 2 : x;
  return `${R(x0, y - 11, w, 16, { rx: 2, fill: bg })}${T(anchor === 'middle' ? x : x + 6, y, s, { mono: true, size: 10, fill: K.muted, anchor: anchor === 'middle' ? 'middle' : undefined, ls: '0.06em' })}`;
};
const defs = (id) => `<defs>
  <marker id="${id}-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="${K.muted}"/></marker>
  <marker id="${id}-arrow-accent" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="${K.accent}"/></marker>
</defs>`;
const svg = (id, w, h, title, desc, body) =>
  `<div class="fig"><svg id="${id}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="min-width:${w}px" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="${id}-title ${id}-desc">
<title id="${id}-title">${esc(title)}</title><desc id="${id}-desc">${esc(desc)}</desc>
${defs(id)}
<rect width="100%" height="100%" fill="${K.paper}"/>
${body}
</svg></div>`;
const legendLine = (w, y) => `<line x1="40" y1="${y - 12}" x2="${w - 40}" y2="${y - 12}" stroke="${K.rule}" stroke-width="1"/>${T(40, y + 8, 'LEGEND', { mono: true, size: 10, fill: K.muted, ls: '0.14em' })}`;
const chip = (x, y, w, s, fill, ink = '#fff') => `${R(x, y, w, 20, { rx: 2, fill })}${T(x + w / 2, y + 14, s, { mono: true, size: 10, fill: ink, anchor: 'middle', ls: '0.08em', w: 600 })}`;

// ======================================================================================
// Option 1 — anatomy of a tenancy agreement (annotated document)
// ======================================================================================
function opt1() {
  const id = 'o1', W = 1040, H = 604;
  const rows = [
    { y: 108, tone: 'amber', clause: 'Deposit', chip: 'REVIEW', head: 'Flagged, with the market norm', b: ['Amber means look twice. Puascari puts the', 'usual market position beside the clause.'] },
    { y: 204, tone: 'ask', clause: 'Repairs and servicing', chip: 'ASK', head: 'Ask in plain words', b: ['“Who pays for the aircond service?”', 'Answered from this agreement, in EN or BM.'] },
    { y: 300, tone: 'red', clause: 'Clause 5.2 · Termination', chip: 'WATCH OUT', head: 'Clause 5.2 · Termination', b: ["Landlord can end tenancy with 7 days' notice,", 'no reason. Unusually short.'], focal: true },
    { y: 396, tone: 'green', clause: 'Clause 9.1 · Renewal', chip: 'LOOKS FINE', head: 'Clause 9.1 · Renewal', b: ['Rent increase capped at 10%.', 'Standard.'] },
  ];
  const tone = {
    red: { fill: K.rose, stripe: K.warn, chip: K.warn, card: K.rose, cardB: K.roseB },
    amber: { fill: K.amberTint, stripe: K.accent, chip: K.accent, chipInk: K.ink, card: '#fff', cardB: K.amberB },
    green: { fill: K.tealTint, stripe: K.teal, chip: K.teal, card: '#fff', cardB: K.tealB },
    ask: { fill: '#fff', stripe: K.ink, chip: K.ink, card: '#fff', cardB: K.ruleSolid },
  };
  let a = '', n = '';
  // page
  n += R(40, 56, 368, 464, { fill: K.card, stroke: K.ruleSolid });
  n += T(64, 84, 'TENANCY AGREEMENT', { mono: true, size: 10, fill: K.muted, ls: '0.14em' });
  n += `<line x1="64" y1="92" x2="384" y2="92" stroke="${K.rule}"/>`;
  rows.forEach((r) => {
    const t = tone[r.tone], cy = r.y + 40;
    // connector first (drawn before boxes)
    a += `<line x1="384" y1="${cy}" x2="560" y2="${cy}" stroke="${r.focal ? K.accent : K.muted}" stroke-width="${r.focal ? 1.6 : 1.2}" marker-end="url(#${id}-${r.focal ? 'arrow-accent' : 'arrow'})"/>`;
    n += R(64, r.y, 320, 80, { fill: t.fill, stroke: K.rule });
    n += R(64, r.y, 6, 80, { rx: 0, fill: t.stripe });
    n += T(84, r.y + 28, r.clause, { w: 700, size: 13 });
    n += R(84, r.y + 44, 236, 6, { rx: 3, fill: K.ruleSolid, op: 0.7 }) + R(84, r.y + 58, 168, 6, { rx: 3, fill: K.ruleSolid, op: 0.7 });
    n += `<circle cx="384" cy="${cy}" r="3.5" fill="${r.focal ? K.accent : K.muted}"/>`;
    // card
    n += R(560, r.y, 440, 80, { fill: t.card, stroke: r.focal ? K.accent : t.cardB, sw: r.focal ? 2 : 1 });
    n += chip(580, r.y + 14, r.chip.length * 7.2 + 20, r.chip, t.chip, t.chipInk || '#fff');
    n += T(580 + r.chip.length * 7.2 + 32, r.y + 29, r.head, { w: 700, size: 13 });
    n += T(580, r.y + 54, r.b[0], { size: 12, fill: K.muted }) + T(580, r.y + 70, r.b[1], { size: 12, fill: K.muted });
  });
  // legend
  let l = legendLine(W, 548);
  const items = [['WATCH OUT', K.warn, '#fff', 112], ['REVIEW', K.accent, K.ink, 80], ['LOOKS FINE', K.teal, '#fff', 100], ['ASK', K.ink, '#fff', 56]];
  let lx = 112;
  items.forEach(([s, f, ink, w]) => { l += chip(lx, 556, w, s, f, ink); lx += w + 16; });
  l += T(lx + 8, 570, 'Every clause gets a colour and a plain-language reason.', { size: 12, fill: K.muted });
  return svg(id, W, H, 'Anatomy of a tenancy agreement',
    'A sample tenancy agreement with four clauses, each connected to a plain-language explanation: deposit flagged for review, repairs answered on request, a 7-day termination clause flagged as a risk, and a renewal clause with a 10 percent rent cap marked fine.',
    a + n + l);
}

// ======================================================================================
// Option 2 — from upload to answer (how it works / why you can trust it)
// ======================================================================================
function opt2() {
  const id = 'o2', W = 1120, H = 520;
  const box = (x, y, w, h, name, sub, o = {}) =>
    `${R(x, y, w, h, { fill: K.paper })}${R(x, y, w, h, { fill: o.fill || K.card, stroke: o.stroke || K.ruleSolid, sw: o.sw || 1 })}` +
    T(x + w / 2, y + h / 2 - (sub ? 2 : -5), name, { w: 700, size: 14, anchor: 'middle' }) +
    (sub ? T(x + w / 2, y + h / 2 + 16, sub, { mono: true, size: 10.5, fill: K.muted, anchor: 'middle' }) : '');
  let a = '', n = '';
  // zone: not legal advice
  const zone = R(536, 60, 528, 372, { rx: 8, fill: 'none', stroke: K.soft, dash: '5,4' }) +
    T(556, 84, 'NOT LEGAL ADVICE', { mono: true, size: 10, fill: K.muted, ls: '0.14em' });
  // connectors (before boxes)
  a += arrow(id, [[248, 132], [276, 132], [276, 244], [304, 244]]);                 // upload -> agreement
  a += arrow(id, [[512, 244], [560, 244]], { accent: true });                       // agreement -> engine
  a += arrow(id, [[248, 356], [664, 356], [664, 292]]);                             // ask -> engine (bottom)
  a += label(456, 346, 'EN OR BM');
  a += arrow(id, [[768, 220], [800, 220], [800, 132], [832, 132]]);                 // engine -> ratings
  a += arrow(id, [[768, 244], [832, 244]]);                                         // engine -> answer
  a += arrow(id, [[768, 268], [800, 268], [800, 356], [832, 356]]);                 // engine -> draft
  n += box(40, 96, 208, 72, 'Upload', 'PDF · photo · scan');
  n += box(40, 320, 208, 72, 'Ask a question', 'English or BM');
  n += box(304, 196, 208, 96, 'Your agreement', 'the source of truth', { fill: K.accentTint, stroke: K.accent, sw: 1.5 });
  n += box(560, 196, 208, 96, 'Reads and reasons', 'Claude + tenancy know-how');
  n += box(832, 96, 208, 72, 'Clause ratings', 'red · amber · green');
  n += box(832, 208, 208, 72, 'Plain-language answer', 'from the document');
  n += box(832, 320, 208, 72, 'Notice or renewal', 'drafted from your terms');
  n += T(556, 416, 'For a dispute, talk to a lawyer. Puascari helps you walk in prepared.', { size: 12.5, italic: true, fill: K.muted });
  let l = legendLine(W, 456);
  l += R(112, 456, 20, 14, { rx: 3, fill: K.accentTint, stroke: K.accent });
  l += T(140, 468, 'Your document: every answer is grounded in it', { size: 12, fill: K.muted });
  l += `<line x1="468" y1="463" x2="500" y2="463" stroke="${K.muted}" stroke-width="1.2" marker-end="url(#${id}-arrow)"/>`;
  l += T(508, 468, 'Flow', { size: 12, fill: K.muted });
  l += `<line x1="572" y1="463" x2="604" y2="463" stroke="${K.soft}" stroke-width="1.2" stroke-dasharray="5,4"/>`;
  l += T(612, 468, 'Where Puascari stops and a lawyer starts', { size: 12, fill: K.muted });
  return svg(id, W, H, 'From upload to answer',
    'Flow from an uploaded agreement and a question, through Claude and tenancy know-how, to clause ratings, a plain-language answer and a drafted notice, all grounded in the document and marked as not legal advice.',
    zone + a + n + l);
}

// ======================================================================================
// Option 3 — which plan fits you (decision tree beside pricing)
// ======================================================================================
function opt3() {
  const id = 'o3', W = 1040, H = 560;
  const plan = (x, name, price, f1, f2, o = {}) =>
    `${R(x, 220, 288, 96, { fill: K.paper })}${R(x, 220, 288, 96, { fill: K.card, stroke: o.stroke || K.ruleSolid, sw: o.sw || 1 })}` +
    T(x + 20, 248, name, { w: 700, size: 15 }) + T(x + 268, 248, price, { mono: true, size: 12, fill: K.ink, anchor: 'end', w: 600 }) +
    T(x + 20, 274, f1, { size: 12, fill: K.muted }) + T(x + 20, 294, f2, { size: 12, fill: K.muted });
  let a = '', n = '';
  a += arrow(id, [[420, 132], [420, 176], [184, 176], [184, 220]]);
  a += arrow(id, [[520, 132], [520, 220]]);
  a += arrow(id, [[620, 132], [620, 176], [856, 176], [856, 220]]);
  a += label(302, 168, 'UP TO 5');
  a += label(520 + 8, 192, 'UP TO 60', 'start');
  a += label(738, 168, 'OVER 60');
  a += arrow(id, [[184, 316], [184, 356], [440, 356], [440, 396]]);
  a += arrow(id, [[520, 316], [520, 396]]);
  a += arrow(id, [[856, 316], [856, 356], [600, 356], [600, 396]]);
  n += `${R(320, 48, 400, 84, { fill: K.paper })}${R(320, 48, 400, 84, { fill: K.card, stroke: K.ink, sw: 1.2 })}`;
  n += T(520, 84, 'How many agreements do you manage?', { w: 700, size: 15, anchor: 'middle' });
  n += T(520, 108, 'one question, three answers', { mono: true, size: 10.5, fill: K.muted, anchor: 'middle' });
  n += plan(40, 'Landlord', 'RM 29/mo', 'Up to 5 agreements', 'Risk flags, Q&A, notices and renewals');
  n += plan(376, 'Agent', 'RM 99/mo', 'Up to 60 agreements', 'Shareable tenant Q&A link, portfolio view');
  n += plan(712, 'Property manager', "Let's talk", 'Unlimited agreements', 'Team workspaces, renewal calendar');
  n += `${R(360, 396, 320, 64, { fill: K.paper })}${R(360, 396, 320, 64, { fill: K.accentTint, stroke: K.accent, sw: 1.5 })}`;
  n += T(520, 434, 'Sign in', { w: 700, size: 15, anchor: 'middle' });
  let l = legendLine(W, 504);
  l += R(112, 504, 20, 14, { rx: 3, fill: K.accentTint, stroke: K.accent });
  l += T(140, 516, 'Every plan ends at the same place', { size: 12, fill: K.muted });
  l += T(420, 516, 'Prices and limits are the ones on the pricing cards.', { size: 12, fill: K.muted });
  return svg(id, W, H, 'Which plan fits you',
    'Decision tree: the number of agreements you manage points to the Landlord plan up to 5, the Agent plan up to 60, or the Property manager plan above 60, and all three lead to signing in.',
    a + n + l);
}

// ======================================================================================
// Option 4 — one portfolio, one question (swimlane over time)
// ======================================================================================
function opt4() {
  const id = 'o4', W = 1040, H = 508;
  const x0 = 320, cw = 112, months = ['OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR'];
  const lanes = [
    { y: 124, q: ['Which agreements expire', 'this quarter?'] },
    { y: 212, q: ['Which still carry the', 'old deposit clause?'] },
    { y: 300, q: ['Who owes a', 'renewal letter?'] },
  ];
  const cx = (m, slot) => x0 + m * cw + (slot ? 60 : 8);
  const chips = [
    [0, 0, 0, 'U07'], [0, 1, 0, 'U12', true], [0, 1, 1, 'U19'], [0, 2, 0, 'U26'],
    [1, 1, 0, 'U12', true], [1, 4, 0, 'U31'],
    [2, 0, 0, 'U07'], [2, 1, 1, 'U19'],
  ];
  let a = '', n = '';
  // quarter band (behind everything)
  n += R(x0, 72, cw * 3, 316, { rx: 0, fill: K.accentTint, op: 0.55 });
  n += T(x0 + 8, 88, 'THIS QUARTER', { mono: true, size: 10, fill: K.ink, ls: '0.14em', w: 600 });
  months.forEach((m, i) => { n += T(x0 + i * cw + cw / 2, 112, m, { mono: true, size: 10.5, fill: K.muted, anchor: 'middle', ls: '0.1em' }); });
  lanes.forEach((ln) => {
    n += R(x0, ln.y, cw * 6, 72, { fill: 'none', stroke: K.ruleSolid });
    for (let i = 1; i < 6; i++) n += `<line x1="${x0 + i * cw}" y1="${ln.y}" x2="${x0 + i * cw}" y2="${ln.y + 72}" stroke="${K.rule}" stroke-dasharray="3,4"/>`;
    n += R(40, ln.y, 256, 72, { fill: K.card, stroke: K.ruleSolid });
    n += T(60, ln.y + 32, ln.q[0], { w: 700, size: 13 }) + T(60, ln.y + 50, ln.q[1], { w: 700, size: 13 });
  });
  // same-unit link: U12 lane1 -> lane2 (vertical, same x)
  const ux = cx(1, 0) + 24;
  a += `<line x1="${ux}" y1="${lanes[0].y + 22 + 28}" x2="${ux}" y2="${lanes[1].y + 22}" stroke="${K.accent}" stroke-width="1.6" marker-end="url(#${id}-arrow-accent)"/>`;
  a += label(ux + 12, lanes[0].y + 78 + 6, 'SAME UNIT', 'start', '#ffefc9');
  chips.forEach(([lane, m, slot, s, hot]) => {
    const x = cx(m, slot), y = lanes[lane].y + 22;
    n += R(x, y, 48, 28, { rx: 4, fill: hot ? K.accentTint : K.card, stroke: hot ? K.accent : K.ink, sw: hot ? 1.6 : 1 });
    n += T(x + 24, y + 18, s, { mono: true, size: 11, anchor: 'middle', w: 600 });
  });
  n += T(40, 92, 'ASK PUASCARI, ONCE', { mono: true, size: 10, fill: K.muted, ls: '0.14em' });
  n += T(x0, 412, 'Forty units. One question. Puascari reads them all.', { size: 13, italic: true, fill: K.muted });
  let l = legendLine(W, 452);
  l += R(112, 452, 48, 24, { rx: 4, fill: K.accentTint, stroke: K.accent, sw: 1.6 });
  l += T(172, 469, 'One unit, two answers', { size: 12, fill: K.muted });
  l += R(332, 454, 20, 20, { rx: 0, fill: K.accentTint, op: 0.55 });
  l += T(360, 469, 'Current quarter', { size: 12, fill: K.muted });
  l += T(520, 469, 'Unit numbers and dates are illustrative, not customer data.', { size: 12, fill: K.muted });
  return svg(id, W, H, 'One portfolio, one question',
    'Swimlane over six months: three questions a property manager can ask across a portfolio, with illustrative units placed in the month their agreement expires, and one unit flagged in two lanes.',
    a + n + l);
}

// ======================================================================================
const options = [
  { n: 1, name: 'Anatomy of a tenancy agreement', type: 'Annotated document layout', where: 'After the three steps', after: 2,
    why: 'Shows what a flagged clause looks like, using the clauses people actually search for (termination, deposit, renewal). Best for SEO, since it puts those words in headings and alt text.', svg: opt1() },
  { n: 2, name: 'From upload to answer', type: 'Flowchart', where: 'After the time-saved calculator', after: 3,
    why: 'Answers "how does it work and can I trust it?" by drawing the claim already in the FAQ: every answer comes from your own document, and disputes go to a lawyer.', svg: opt2() },
  { n: 3, name: 'Which plan fits you?', type: 'Decision tree', where: 'Right above the pricing cards', after: 4,
    why: 'Helps a reader pick between Landlord, Agent and Property manager by one number. Uses only the prices and limits already on the cards.', svg: opt3() },
  { n: 4, name: 'One portfolio, one question', type: 'Swimlane over time', where: 'After pricing, before the FAQ', after: 5,
    why: 'Gives the property-manager persona a picture of "forty units, one question". Needs your OK on the illustrative unit data.', svg: opt4() },
];
const flow = ['Hero', 'Three steps', 'Time saved', 'Pricing', 'FAQ'];

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Homepage extension options | Puascari</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&family=Geist+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
:root{--bg:${K.paper};--ink:${K.ink};--mut:${K.muted};--line:${K.rule};--sun:${K.accent};--sun-l:${K.accentTint};--teal:${K.teal}}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:${SANS};background:var(--bg);color:var(--ink);line-height:1.55;-webkit-font-smoothing:antialiased}
.wrap{max-width:1200px;margin:0 auto;padding:0 24px}
header.top{padding:48px 0 16px}
.eyebrow{font-family:${MONO};font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--mut)}
h1{font-size:40px;line-height:1.1;font-weight:800;letter-spacing:-.02em;margin:10px 0 12px}
h1 .hl{background:linear-gradient(transparent 60%,var(--sun-l) 60%)}
.lede{color:var(--mut);max-width:640px}
nav.jump{display:flex;gap:8px;flex-wrap:wrap;margin:24px 0 8px}
nav.jump a{border:2px solid var(--line);background:#fff;padding:7px 14px;border-radius:999px;font-weight:700;font-size:13px;text-decoration:none;color:var(--ink)}
nav.jump a:hover{border-color:var(--teal);color:var(--teal)}
section.opt{padding:56px 0 24px;border-top:2px solid var(--line);margin-top:32px}
.opt h2{font-size:28px;font-weight:800;letter-spacing:-.02em;line-height:1.2;margin:4px 0 8px}
.opt .num{display:inline-grid;place-items:center;width:30px;height:30px;border-radius:50%;background:var(--sun);font-weight:800;font-size:14px;margin-right:10px;vertical-align:2px}
.meta{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 14px}
.tag{font-family:${MONO};font-size:11px;letter-spacing:.06em;text-transform:uppercase;border:1px solid #d9cdb9;background:#fff;border-radius:4px;padding:3px 8px;color:var(--mut)}
.why{max-width:720px;color:var(--mut);margin-bottom:18px}
ol.flow{display:flex;gap:6px;flex-wrap:wrap;list-style:none;margin:0 0 22px;font-size:12.5px;font-weight:700}
ol.flow li{padding:5px 12px;border-radius:999px;border:2px dashed var(--line);color:var(--mut)}
ol.flow li.me{border:2px solid var(--sun);background:var(--sun-l);color:var(--ink)}
.fig{overflow-x:auto;background:var(--bg);border:2px solid var(--line);border-radius:14px;padding:12px}
.fig svg{display:block;max-width:none;height:auto}
.compare{margin:56px 0 80px;border-top:2px solid var(--line);padding-top:32px}
table{width:100%;border-collapse:collapse;font-size:14px;background:#fff;border:2px solid var(--line)}
th,td{text-align:left;padding:10px 12px;border-top:1px solid var(--line);vertical-align:top}
th{font-family:${MONO};font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mut);border-top:0;background:var(--bg)}
.table-wrap{overflow-x:auto}
@media(max-width:700px){h1{font-size:30px}.wrap{padding:0 16px}}
</style>
</head>
<body>
<div class="wrap">
<header class="top">
  <div class="eyebrow">veridle.com · homepage</div>
  <h1>Four ways to extend the page <span class="hl">for readers who keep scrolling.</span></h1>
  <p class="lede">Each option is a diagram in the Puascari palette, using only copy and numbers already on the site. English only for now; the chosen one gets a BM version. Scroll sideways inside a diagram on a narrow screen.</p>
  <nav class="jump" aria-label="Options">${options.map((o) => `<a href="#opt${o.n}">${o.n}. ${esc(o.name)}</a>`).join('')}</nav>
</header>
${options.map((o) => `<section class="opt" id="opt${o.n}">
  <div class="eyebrow">Option ${o.n}</div>
  <h2><span class="num">${o.n}</span>${esc(o.name)}</h2>
  <div class="meta"><span class="tag">${esc(o.type)}</span><span class="tag">${esc(o.where)}</span></div>
  <p class="why">${esc(o.why)}</p>
  <ol class="flow" aria-label="Where it sits on the page">${flow.map((f, i) => `<li${i + 1 === o.after ? ' class="me"' : ''}>${esc(f)}${i + 1 === o.after ? ' ← here' : ''}</li>`).join('')}</ol>
  ${o.svg}
</section>`).join('\n')}
<section class="compare">
  <div class="eyebrow">Side by side</div>
  <h2 style="font-size:28px;font-weight:800;margin:6px 0 16px">How they compare</h2>
  <div class="table-wrap"><table>
    <tr><th>#</th><th>Reader's question</th><th>New copy needed?</th><th>SEO value</th></tr>
    <tr><td>1</td><td>What does a flagged clause look like?</td><td>None. Reuses the phone-mock clauses.</td><td>High: termination, deposit, renewal as headings</td></tr>
    <tr><td>2</td><td>How does it work, and can I trust it?</td><td>None. Reuses the FAQ claims.</td><td>Medium: process and trust language</td></tr>
    <tr><td>3</td><td>Which plan is for me?</td><td>None. Reuses prices and limits.</td><td>Low: helps conversion more than ranking</td></tr>
    <tr><td>4</td><td>Can it handle my whole portfolio?</td><td>Illustrative unit data, needs your OK.</td><td>Medium: property-manager queries</td></tr>
  </table></div>
</section>
</div>
</body>
</html>
`;
fs.writeFileSync(path.join(here, 'diagram-options.html'), page);
console.log('wrote extensions/diagram-options.html', (page.length / 1024).toFixed(1) + ' KB');

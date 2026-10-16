// Builds extensions/option2-variants.html: three retail-friendly rewrites of "From upload to answer".
// Standalone, EN only. Icons: Heroicons outline only (from src/icons).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const icon = (n, cls = '') =>
  fs.readFileSync(path.join(here, '../src/icons', `${n}.svg`), 'utf8').trim().replace(' data-slot="icon"', '')
    .replace('<svg ', `<svg class="icon${cls ? ' ' + cls : ''}" `);

const SANS = "'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',sans-serif";
const MONO = "'Geist Mono',ui-monospace,'SF Mono',Menlo,monospace";

// ---- Variant A: chat -----------------------------------------------------------------
const A = `
<div class="va">
  <div class="chat" role="group" aria-label="Example chat with Puascari">
    <div class="chat-top"><span>Puascari</span><span class="dot"></span></div>
    <div class="b me"><span class="att">${icon('document-arrow-up')}tenancy-agreement.pdf</span>Is anything risky in here?</div>
    <div class="b bot">Yes, one to watch. Clause 5.2 lets the landlord end the tenancy with 7 days' notice, no reason. That's unusually short.
      <span class="src warn">${icon('document-text')}Clause 5.2 · Termination</span></div>
    <div class="b me">Who pays for the aircond service?</div>
    <div class="b bot">Let me check your agreement. Here's the clause, in plain words.
      <span class="src">${icon('document-text')}Repairs and servicing</span></div>
    <div class="b me">Can you write to the landlord?</div>
    <div class="b bot">Done. A draft reply, based on your own agreement.
      <span class="src ok">${icon('check-circle')}Draft ready</span></div>
  </div>
  <ul class="trust">
    <li>${icon('document-text')}<div><b>Every answer points to its clause</b><p>You can see where it came from in your own agreement.</p></div></li>
    <li>${icon('lock-closed')}<div><b>Your agreement stays yours</b><p>Processed for you alone and never used to train models.</p></div></li>
    <li>${icon('scale')}<div><b>Not legal advice</b><p>For a dispute, talk to a lawyer. Puascari helps you walk in prepared.</p></div></li>
  </ul>
</div>`;

// ---- Variant B: nested rings -----------------------------------------------------------
const B = `
<div class="vb">
  <div class="ring outer">
    <p class="ring-l"><span>${icon('scale')}</span>Got a dispute? Talk to a lawyer. Puascari helps you walk in prepared.</p>
    <div class="ring mid">
      <p class="ring-l"><span>${icon('lock-closed')}</span>Private to you. Never used to train models.</p>
      <div class="core">
        <div class="core-h">${icon('document-text')}<div><b>Your agreement</b><small>PDF, photo or scan · English, Malay or both</small></div></div>
        <ul>
          <li>${icon('check')}Reads every clause and flags the risky ones</li>
          <li>${icon('check')}Answers your questions from the document</li>
          <li>${icon('check')}Drafts notices and renewals from your own terms</li>
        </ul>
      </div>
    </div>
  </div>
</div>`;

// ---- Variant C: before / after -------------------------------------------------------------
const rows = [
  ['Sign it without reading', 'Know the risky clauses in two minutes'],
  ['Phone the agent for every question', 'Ask in plain words, answered from your agreement'],
  ['Write notices from scratch', 'Notices and renewals drafted for you'],
];
const C = `
<div class="vc">
  <div class="col before"><h3>Without Puascari</h3>${rows.map((r) => `<div class="cell">${icon('x-mark')}<span>${esc(r[0])}</span></div>`).join('')}</div>
  <div class="mid" aria-hidden="true">${rows.map(() => `<div class="cell">${icon('arrow-right')}</div>`).join('')}</div>
  <div class="col after"><h3>With Puascari</h3>${rows.map((r) => `<div class="cell">${icon('check')}<span>${esc(r[1])}</span></div>`).join('')}</div>
  <p class="foot">${icon('scale')}Not legal advice. For a dispute, talk to a lawyer.</p>
</div>`;

const variants = [
  { k: 'A', name: 'Chat with your agreement', type: 'Conversation, with a trust column',
    why: 'Looks like the WhatsApp-style chat an owner already uses, so the product explains itself. Trust is three plain promises beside it instead of a node on a diagram.',
    kept: 'Every answer comes from the document · private · not legal advice',
    gone: '"Reads and reasons", "Claude + tenancy know-how", "source of truth", arrows and zones',
    newcopy: 'Chat lines are new, but reuse the phone mock (clause 5.2, aircond question, draft reply). The aircond answer is deliberately generic so it claims nothing about a real clause.', body: A },
  { k: 'B', name: 'Your agreement stays yours', type: 'Rings: the document in the middle',
    why: 'Answers the first worry of an individual owner ("what happens to my agreement?") before anything else. One picture, three layers, no flow to follow.',
    kept: 'Private · not used to train models · lawyer for disputes · what Puascari does with the document',
    gone: 'Upload/ask inputs, the engine box, the three output boxes',
    newcopy: 'None. All lines come from the FAQ and the steps section.', body: B },
  { k: 'C', name: 'Before and after', type: 'Side-by-side comparison',
    why: 'Starts from the owner\'s pain, not the product\'s mechanism. Three rows a person recognises, each with the fix beside it. Quickest read of the four.',
    kept: 'Two-minute review · plain-words Q&A · drafted notices · not legal advice',
    gone: 'Everything technical: no engine, no flow, no zones',
    newcopy: 'Left-hand lines are new ("Phone the agent for every question" is the only one that needs your OK). Right-hand lines reuse existing copy.', body: C },
];

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Option 2 variants | Puascari</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&family=Geist+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
:root{--bg:#fffaf3;--ink:#1f1b16;--mut:#6f675c;--line:#efe4d3;--rule:#d9cdb9;--sun:#f5a524;--sun-l:#ffe9b8;--teal:#0f766e;--teal-l:#d9f2ee;--rose:#fde2d8;--rose-b:#f8c4b0;--warn:#b4412b}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:${SANS};background:var(--bg);color:var(--ink);line-height:1.55;-webkit-font-smoothing:antialiased}
.wrap{max-width:1000px;margin:0 auto;padding:0 24px}
.eyebrow{font-family:${MONO};font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--mut)}
.icon{width:1.25em;height:1.25em;flex:none;stroke-width:2}
header.top{padding:48px 0 8px}
h1{font-size:38px;line-height:1.1;font-weight:800;letter-spacing:-.02em;margin:10px 0 12px}
h1 .hl{background:linear-gradient(transparent 60%,var(--sun-l) 60%)}
.lede{color:var(--mut);max-width:660px}
nav.jump{display:flex;gap:8px;flex-wrap:wrap;margin:22px 0 4px}
nav.jump a{border:2px solid var(--line);background:#fff;padding:7px 14px;border-radius:999px;font-weight:700;font-size:13px;text-decoration:none;color:var(--ink)}
section.v{padding:48px 0 16px;border-top:2px solid var(--line);margin-top:32px}
.v h2{font-size:28px;font-weight:800;letter-spacing:-.02em;line-height:1.2;margin:4px 0 8px}
.num{display:inline-grid;place-items:center;width:30px;height:30px;border-radius:50%;background:var(--sun);font-weight:800;font-size:14px;margin-right:10px;vertical-align:2px}
.tag{display:inline-block;font-family:${MONO};font-size:11px;letter-spacing:.06em;text-transform:uppercase;border:1px solid var(--rule);background:#fff;border-radius:4px;padding:3px 8px;color:var(--mut);margin:6px 0 12px}
.why{max-width:700px;color:var(--mut);margin-bottom:14px}
dl.notes{display:grid;grid-template-columns:110px 1fr;gap:6px 14px;font-size:13.5px;max-width:760px;margin-bottom:24px}
dl.notes dt{font-family:${MONO};font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mut);padding-top:2px}
dl.notes dd{color:var(--ink)}
.stage{background:#fff;border:2px solid var(--line);border-radius:20px;padding:32px}
/* A */
.va{display:grid;grid-template-columns:1.1fr .9fr;gap:36px;align-items:center}
.chat{background:var(--bg);border:2px solid var(--rule);border-radius:22px;padding:14px;display:flex;flex-direction:column;gap:10px;max-width:460px;width:100%;margin:0 auto}
.chat-top{display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:700;color:var(--mut);padding:2px 6px 8px;border-bottom:2px solid var(--line)}
.dot{width:8px;height:8px;border-radius:50%;background:var(--teal)}
.b{max-width:86%;padding:10px 14px;border-radius:16px;font-size:14px}
.b.me{align-self:flex-end;background:var(--sun-l);border-bottom-right-radius:4px}
.b.bot{align-self:flex-start;background:#fff;border:2px solid var(--line);border-bottom-left-radius:4px}
.att,.src{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;border-radius:8px;padding:4px 9px}
.att{background:#fff;border:2px solid var(--rule);margin-bottom:6px;display:flex;width:max-content}
.src{background:var(--teal-l);color:var(--teal);margin-top:8px;display:flex;width:max-content}
.src.warn{background:var(--rose);color:var(--warn)}
.src.ok{background:var(--teal-l)}
.src .icon,.att .icon{width:16px;height:16px}
.trust{list-style:none;display:grid;gap:18px}
.trust li{display:flex;gap:14px;align-items:flex-start}
.trust li>.icon{width:26px;height:26px;color:var(--teal);margin-top:2px}
.trust b{display:block;font-size:15px}
.trust p{color:var(--mut);font-size:14px}
/* B */
.vb{max-width:720px;margin:0 auto}
.ring{border-radius:22px;padding:22px}
.ring-l{display:flex;gap:10px;align-items:center;font-size:13.5px;font-weight:700;margin-bottom:16px}
.ring-l span{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:#fff;border:2px solid currentColor;flex:none}
.ring-l .icon{width:16px;height:16px}
.ring.outer{border:2px dashed var(--mut);color:var(--mut)}
.ring.mid{border:2px solid var(--teal);background:var(--teal-l);color:var(--teal);padding:22px 22px 24px}
.core{background:var(--sun-l);border:2px solid var(--sun);border-radius:16px;padding:22px;color:var(--ink)}
.core-h{display:flex;gap:14px;align-items:center;margin-bottom:14px}
.core-h .icon{width:34px;height:34px}
.core-h b{display:block;font-size:19px}
.core-h small{color:var(--mut);font-size:13px}
.core ul{list-style:none;display:grid;gap:8px;font-size:14.5px}
.core li{display:flex;gap:10px;align-items:flex-start}
.core li .icon{color:var(--teal);width:18px;height:18px;margin-top:3px;stroke-width:2.6}
/* C */
.vc{display:grid;grid-template-columns:1fr 48px 1fr;gap:0 8px;max-width:820px;margin:0 auto}
.vc h3{font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-family:${MONO};margin-bottom:12px;color:var(--mut)}
.vc .col{display:flex;flex-direction:column;gap:12px}
.vc .mid{display:flex;flex-direction:column;gap:12px;padding-top:36px}
.vc .mid .cell{flex:1;display:grid;place-items:center;color:var(--mut)}
.vc .cell{display:flex;gap:12px;align-items:center;border-radius:14px;padding:16px 18px;font-weight:700;font-size:15px;min-height:76px}
.vc .before .cell{background:var(--rose);border:2px solid var(--rose-b);color:#7a2a18}
.vc .before .cell .icon{color:var(--warn)}
.vc .after .cell{background:var(--teal-l);border:2px solid #b9e3dc}
.vc .after .cell .icon{color:var(--teal);stroke-width:2.6}
.vc .after h3{color:var(--teal)}
.vc .foot{grid-column:1/-1;display:flex;gap:10px;align-items:center;justify-content:center;margin-top:22px;color:var(--mut);font-size:14px}
.compare{margin:48px 0 80px;border-top:2px solid var(--line);padding-top:28px}
table{width:100%;border-collapse:collapse;font-size:14px;background:#fff;border:2px solid var(--line)}
th,td{text-align:left;padding:10px 12px;border-top:1px solid var(--line);vertical-align:top}
th{font-family:${MONO};font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--mut);border-top:0;background:var(--bg)}
.table-wrap{overflow-x:auto}
@media(max-width:760px){h1{font-size:30px}.wrap{padding:0 16px}.stage{padding:18px}.va{grid-template-columns:1fr}dl.notes{grid-template-columns:1fr}.vc{grid-template-columns:1fr}.vc .mid{display:none}.vc .after{margin-top:18px}}
</style>
</head>
<body>
<div class="wrap">
<header class="top">
  <div class="eyebrow">veridle.com · option 2, reworked</div>
  <h1>Three friendlier ways to say <span class="hl">"how it works, and can I trust it."</span></h1>
  <p class="lede">The original flow diagram was written for someone who thinks in systems. These swap boxes and arrows for things a first-time landlord already understands: a chat, a safe, a before-and-after. All three keep the two claims that matter: answers come from your own agreement, and it isn't legal advice.</p>
  <nav class="jump" aria-label="Variants">${variants.map((v) => `<a href="#v${v.k}">${v.k}. ${esc(v.name)}</a>`).join('')}</nav>
</header>
${variants.map((v) => `<section class="v" id="v${v.k}">
  <div class="eyebrow">Variant ${v.k}</div>
  <h2><span class="num">${v.k}</span>${esc(v.name)}</h2>
  <span class="tag">${esc(v.type)}</span>
  <p class="why">${esc(v.why)}</p>
  <dl class="notes"><dt>Keeps</dt><dd>${esc(v.kept)}</dd><dt>Drops</dt><dd>${esc(v.gone)}</dd><dt>New copy</dt><dd>${esc(v.newcopy)}</dd></dl>
  <div class="stage">${v.body}</div>
</section>`).join('\n')}
<section class="compare">
  <div class="eyebrow">Which one</div>
  <table><div class="table-wrap"></div>
    <tr><th>Variant</th><th>Strongest for</th><th>Weakest at</th><th>Mobile</th></tr>
    <tr><td>A · Chat</td><td>Showing the product in use</td><td>Longest of the three</td><td>Stacks into one column</td></tr>
    <tr><td>B · Stays yours</td><td>Trust and privacy worries</td><td>Says less about what it does</td><td>Rings stay nested, text wraps</td></tr>
    <tr><td>C · Before and after</td><td>Fastest read, owner's own pain</td><td>Least visual; needs OK on new lines</td><td>Two cards stack, arrows hide</td></tr>
  </table>
  <p style="margin-top:16px;color:var(--mut);max-width:680px">My pick for an individual owner: <b style="color:var(--ink)">A</b> as the section, or <b style="color:var(--ink)">C</b> if you want it shorter. B works well as a small strip next to the FAQ's privacy answer.</p>
</section>
</div>
</body>
</html>
`;
fs.writeFileSync(path.join(here, 'option2-variants.html'), page.replace('<table><div class="table-wrap"></div>', '<div class="table-wrap"><table>').replace('</table>\n  <p style="margin-top', '</table></div>\n  <p style="margin-top'));
console.log('wrote extensions/option2-variants.html');

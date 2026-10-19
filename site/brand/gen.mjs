// Generates the four logo + OG options (brand/options/) and installs the chosen one.
//   node brand/gen.mjs            -> writes options A–D, installs A as the default
//   node brand/gen.mjs C          -> same, installs C
// Text is converted to paths (opentype.js) so SVG/PNG render the same everywhere with no font installed.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';
import { Resvg } from '@resvg/resvg-js';

const here = path.dirname(fileURLToPath(import.meta.url));
const fontDir = path.join(here, '../node_modules/@fontsource/plus-jakarta-sans/files');
const load = (w) => {
  const b = fs.readFileSync(path.join(fontDir, `plus-jakarta-sans-latin-${w}-normal.woff`));
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
};
const F = { 400: load(400), 700: load(700), 800: load(800) };

const C = { bg: '#fffaf3', ink: '#1f1b16', mut: '#6f675c', line: '#efe4d3', sun: '#f5a524', sunl: '#ffe08a', teal: '#0f766e', tealL: '#d9f2ee', rose: '#fde2d8', roseB: '#f8c4b0', warn: '#b4412b' };

const width = (t, size, w = 800, ls = 0) => F[w].getAdvanceWidth(t, size, { letterSpacing: ls / size });
const text = (t, x, y, size, fill, w = 800, ls = 0, anchor = 'start') => {
  const wd = width(t, size, w, ls);
  const x0 = anchor === 'middle' ? x - wd / 2 : anchor === 'end' ? x - wd : x;
  const d = F[w].getPath(t, x0, y, size, { letterSpacing: ls / size }).toPathData(2);
  return `<path d="${d}" fill="${fill}"/>`;
};

// ---- marks (48x48 box) ------------------------------------------------------
const marks = {
  A: () => `<circle cx="24" cy="24" r="14" fill="${C.sun}"/>`,
  B: () => `<rect width="48" height="48" rx="13" fill="${C.sun}"/>
    <path d="M11 25 24 12.5 37 25" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M17 36h14M17 30.5h14" stroke="${C.ink}" stroke-width="3.2" stroke-linecap="round"/>`,
  C: () => {
    const d = F[800].getPath('P', 0, 0, 40).toPathData(2);
    const bb = F[800].getPath('P', 0, 0, 40).getBoundingBox();
    const tx = 24 - (bb.x1 + bb.x2) / 2, ty = 24 - (bb.y1 + bb.y2) / 2;
    return `<rect width="48" height="48" rx="13" fill="${C.teal}"/>
    <path d="${d}" transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)})" fill="#fff"/>
    <circle cx="36.5" cy="11.5" r="4.6" fill="${C.sun}"/>`;
  },
  D: () => {
    const p = F[800].getPath('p', 0, 0, 44);
    const bb = p.getBoundingBox();
    const tx = 24 - (bb.x1 + bb.x2) / 2, ty = 24 - (bb.y1 + bb.y2) / 2;
    return `<rect width="48" height="48" rx="13" fill="${C.sun}"/>
    <path d="${p.toPathData(2)}" transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)})" fill="${C.ink}"/>`;
  },
};

// ---- lockups: returns {svg, w, h} drawn at origin (0,0), height ~ 48 ---------
function lockup(opt, ink = C.ink, sub = C.mut) {
  const size = 30;
  if (opt === 'D') {
    const word = 'puascari';
    const ww = width(word, 38, 800, -0.5);
    const hl = `<rect x="-4" y="22" width="${(ww + 8).toFixed(1)}" height="14" rx="3" fill="${C.sun}"/>`;
    return {
      w: ww + 8, h: 62,
      svg: `${hl}${text(word, 0, 36, 38, ink, 800, -0.5)}${text('PROPERTY GROUP', 1, 56, 11, sub === C.mut ? C.teal : sub, 700, 2.2)}`,
    };
  }
  const gap = 12, mx = marks[opt]();
  const word = text('Puascari', 48 + gap, 33, size, ink, 800, -0.4);
  const ww = width('Puascari', size, 800, -0.4);
  const subTxt = text('PROPERTY GROUP', 48 + gap + 1, 47, 10.5, sub, 700, 2.4);
  return {
    w: 48 + gap + ww, h: 52,
    svg: `<g>${mx}</g>${word}${subTxt}`,
  };
}

const logoSvg = (opt) => {
  const l = lockup(opt);
  const pad = 8;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${(l.w + 2 * pad).toFixed(1)} ${l.h + 2 * pad}" role="img" aria-label="Puascari Property Group">${l.svg}</svg>`;
};
const markSvg = (opt) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">${marks[opt]()}</svg>`;

// ---- OG 1200x630 ---------------------------------------------------------------
const themes = {
  A: { bg: C.bg, h: C.ink, p: C.mut, hl: C.sunl, ink: C.ink, sub: C.mut, cardLine: C.line },
  B: { bg: C.sun, h: C.ink, p: '#3d2f12', hl: '#fff', ink: C.ink, sub: '#3d2f12', cardLine: 'rgba(31,27,22,.25)' },
  C: { bg: C.teal, h: '#fff', p: '#d4ece8', hl: 'rgba(245,165,36,.95)', ink: '#fff', sub: '#bfe3de', cardLine: 'rgba(255,255,255,.35)' },
  D: { bg: C.bg, h: C.ink, p: C.mut, hl: C.sun, ink: C.ink, sub: C.teal, cardLine: C.line },
};

function card(x, y, w, h, fill, stroke, label, labelColor, title, body) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="${fill}" stroke="${stroke}" stroke-width="3"/>
  ${text(label, x + 26, y + 40, 15, labelColor, 800, 1.6)}
  ${text(title, x + 26, y + 74, 22, C.ink, 700)}
  ${body.map((ln, i) => text(ln, x + 26, y + 104 + i * 26, 19, C.mut, 400)).join('')}`;
}

function ogSvg(opt) {
  const t = themes[opt];
  const lk = lockup(opt, t.ink, t.sub);
  const hlRects = [
    // highlight under "actually signed." (line 2)
    `<rect x="70" y="318" width="${(width('actually signed.', 76, 800, -1.6) + 6).toFixed(0)}" height="30" rx="4" fill="${t.hl}"/>`,
  ];
  const sunDot = opt === 'D' ? '' : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${t.bg}"/>
  <g transform="translate(70 50) scale(1.55)">${lk.svg}</g>
  ${hlRects.join('')}
  ${text('Know what you', 70, 270, 76, t.h, 800, -1.6)}
  ${text('actually signed.', 70, 346, 76, t.h, 800, -1.6)}
  ${text('AI tenancy agreement review for Malaysian', 70, 412, 27, t.p, 400)}
  ${text('landlords, agents and property managers.', 70, 446, 27, t.p, 400)}
  ${text('veridle.com', 70, 570, 24, t.h, 700)}
  ${text('EN · BM', 1130, 570, 22, t.p, 700, 0, 'end')}
  ${card(760, 130, 370, 168, C.rose, C.roseB, 'WATCH OUT', C.warn, 'Clause 5.2 · Termination', ['7 days’ notice, no reason.', 'Unusually short.'])}
  ${card(760, 322, 370, 148, C.tealL, '#b9e3dc', 'LOOKS FINE', C.teal, 'Clause 9.1 · Renewal', ['Rent increase capped at 10%.'])}
  ${sunDot}
</svg>`;
}

const png = (svg, w) => new Resvg(svg, { fitTo: { mode: 'width', value: w }, background: 'rgba(0,0,0,0)' }).render().asPng();

// ---- write -----------------------------------------------------------------------
const out = path.join(here, 'options');
fs.mkdirSync(out, { recursive: true });
const names = { A: 'Sun', B: 'Roof', C: 'Door-P', D: 'Highlighter' };
for (const o of Object.keys(marks)) {
  fs.writeFileSync(path.join(out, `${o}-logo.svg`), logoSvg(o));
  fs.writeFileSync(path.join(out, `${o}-mark.svg`), markSvg(o));
  fs.writeFileSync(path.join(out, `${o}-og.svg`), ogSvg(o));
  fs.writeFileSync(path.join(out, `${o}-og.png`), png(ogSvg(o), 1200));
}

// contact sheet: 2x2 of the OG images + their marks
const pad = 40, cw = 600, chh = 315, label = 56;
const cells = Object.keys(marks).map((o, i) => {
  const x = pad + (i % 2) * (cw + pad), y = pad + Math.floor(i / 2) * (chh + label + pad + 70);
  const b64 = png(ogSvg(o), cw).toString('base64');
  const mk = png(logoSvg(o), 360).toString('base64');
  return `<image x="${x}" y="${y + label}" width="${cw}" height="${chh}" href="data:image/png;base64,${b64}"/>
  <rect x="${x}" y="${y + label}" width="${cw}" height="${chh}" fill="none" stroke="#d9cdb9" stroke-width="2"/>
  ${text(o, x, y + 40, 36, C.ink, 800)}${text(names[o], x + 40, y + 40, 22, C.mut, 700)}
  <image x="${x + cw - Math.round(54*(lockup(o).w+16)/(lockup(o).h+16))}" y="${y - 2}" width="${Math.round(54*(lockup(o).w+16)/(lockup(o).h+16))}" height="54" href="data:image/png;base64,${mk}"/>`;
}).join('');
const sheetW = pad * 3 + cw * 2, sheetH = pad + 2 * (chh + label + pad + 70);
fs.writeFileSync(path.join(out, 'overview.png'), png(`<svg xmlns="http://www.w3.org/2000/svg" width="${sheetW}" height="${sheetH}"><rect width="100%" height="100%" fill="#f4ede0"/>${cells}</svg>`, sheetW));

// ---- install chosen option ---------------------------------------------------------
const pick = (process.argv[2] || 'A').toUpperCase();
if (!marks[pick]) throw new Error('option must be A, B, C or D');
const dest = path.join(here, '../src/assets/brand');
fs.mkdirSync(dest, { recursive: true });
fs.writeFileSync(path.join(dest, 'logo.svg'), logoSvg(pick));
fs.writeFileSync(path.join(dest, 'favicon.svg'), markSvg(pick));
fs.writeFileSync(path.join(dest, 'og.png'), png(ogSvg(pick), 1200));
fs.writeFileSync(path.join(dest, 'apple-touch-icon.png'), png(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 60 60" width="180" height="180"><rect x="-6" y="-6" width="60" height="60" fill="${C.bg}"/>${marks[pick]()}</svg>`, 180));
fs.writeFileSync(path.join(dest, 'icon-512.png'), png(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 60 60" width="512" height="512"><rect x="-6" y="-6" width="60" height="60" fill="${C.bg}"/>${marks[pick]()}</svg>`, 512));
fs.writeFileSync(path.join(dest, 'CHOSEN'), pick + '\n');
console.log('options written; installed option', pick);

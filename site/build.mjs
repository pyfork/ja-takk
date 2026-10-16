// Static site generator: node build.mjs  ->  dist/
// No framework. Two languages (EN at /, BM at /ms/) are rendered into plain HTML so crawlers see all copy.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { SITE, en } from './content.mjs';
import { ms } from './content.ms.mjs'; // BM copy: gitignored, not tracked
import { legalEn, legalMs, UPDATED, CONTACT } from './legal.mjs';
// Terms & Privacy in both languages: PDPA s.7(3) requires the notice in BM and English.
const legalOf = (t) => (t.lang === 'en' ? legalEn : legalMs);

const root = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(root, 'src');
const dist = path.join(root, 'dist');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(path.join(dist, 'assets', 'fonts'), { recursive: true });
fs.mkdirSync(path.join(dist, 'ms'), { recursive: true });

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c');

// ---- icons: Heroicons (outline, 24px) only ----------------------------------------
const icon = (name, cls = '') =>
  fs
    .readFileSync(path.join(src, 'icons', `${name}.svg`), 'utf8')
    .trim()
    .replace(' data-slot="icon"', '')
    .replace('<svg ', `<svg class="icon${cls ? ' ' + cls : ''}" `);

// ---- assets: hashed names so they can be cached for a year ------------------------
const hashed = {};
for (const f of ['style.css', 'app.js', 'signin.js']) {
  const buf = fs.readFileSync(path.join(src, 'assets', f));
  const h = crypto.createHash('sha256').update(buf).digest('hex').slice(0, 8);
  const ext = path.extname(f);
  const name = `${path.basename(f, ext)}.${h}${ext}`;
  fs.writeFileSync(path.join(dist, 'assets', name), buf);
  hashed[f] = `/assets/${name}`;
}
for (const f of fs.readdirSync(path.join(src, 'assets', 'fonts'))) {
  fs.copyFileSync(path.join(src, 'assets', 'fonts', f), path.join(dist, 'assets', 'fonts', f));
}
const brandDir = path.join(src, 'assets', 'brand');
for (const f of ['favicon.svg', 'apple-touch-icon.png', 'og.png', 'icon-512.png']) {
  fs.copyFileSync(path.join(brandDir, f), path.join(dist, f));
}
const logo = fs.readFileSync(path.join(brandDir, 'logo.svg'), 'utf8').replace(/^<\?xml[^>]*>\s*/, '');
// favicon.ico (PNG-in-ICO, 48x48) for crawlers and old browsers that request /favicon.ico
{
  const png = new Resvg(fs.readFileSync(path.join(dist, 'favicon.svg'), 'utf8'), { fitTo: { mode: 'width', value: 48 } }).render().asPng();
  const head = Buffer.alloc(22);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(1, 4);
  head[6] = 48; head[7] = 48; head.writeUInt16LE(1, 10); head.writeUInt16LE(32, 12);
  head.writeUInt32LE(png.length, 14); head.writeUInt32LE(22, 18);
  fs.writeFileSync(path.join(dist, 'favicon.ico'), Buffer.concat([head, png]));
}
fs.writeFileSync(
  path.join(dist, 'manifest.webmanifest'),
  JSON.stringify({
    name: SITE.legal, short_name: SITE.brand, start_url: '/', display: 'browser',
    background_color: '#fffaf3', theme_color: '#fffaf3',
    icons: [{ src: '/icon-512.png', sizes: '512x512', type: 'image/png' }],
  }),
);

// ---- calculator defaults (same maths as the concept) -------------------------------
const DEF = { u: 12, q: 6 };
const calcOut = (u, q) => ({
  hours: Math.round(u * 0.6 + q * 4 * 0.5 + u * 0.15 * 1.5),
  v1: u, v2: q * 4, v3: Math.round(u * 0.9),
});

// ---- shared head ---------------------------------------------------------------------
const abs = (p) => SITE.origin + p;
function head(t, { title, description, canonical, robots, alternates, ld = [], css = true, og = true, preload = true }) {
  return `<!doctype html>
<html lang="${t.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="${robots}">
<meta name="theme-color" content="#fffaf3">
<link rel="canonical" href="${abs(canonical)}">
${(alternates || []).map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${abs(a.href)}">`).join('\n')}
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
${preload ? `<link rel="preload" href="/assets/fonts/plus-jakarta-sans-latin-800-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/plus-jakarta-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>` : ''}
${og ? `<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE.legal)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${abs(canonical)}">
<meta property="og:locale" content="${t.locale}">
<meta property="og:locale:alternate" content="${t.alt.code === 'ms' ? 'ms_MY' : 'en_MY'}">
<meta property="og:image" content="${abs('/og.png')}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(t.ogAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${abs('/og.png')}">` : ''}
${css ? `<link rel="stylesheet" href="${hashed['style.css']}">` : ''}
${ld.map((o) => `<script type="application/ld+json">${json(o)}</script>`).join('\n')}
</head>`;
}

// ---- landing page ------------------------------------------------------------------
function landing(t) {
  const P = t.personas.landlord;
  const o = calcOut(DEF.u, DEF.q);
  const isEn = t.lang === 'en';
  const canonical = t.base;
  const alternates = [
    { hreflang: 'en-MY', href: '/' },
    { hreflang: 'ms-MY', href: '/ms/' },
    { hreflang: 'x-default', href: '/' },
  ];

  const org = {
    '@type': 'Organization', '@id': abs('/#org'), name: SITE.legal, alternateName: SITE.brand,
    url: abs('/'), logo: abs('/icon-512.png'),
  };
  const ld = [{
    '@context': 'https://schema.org',
    '@graph': [
      org,
      {
        '@type': 'WebSite', '@id': abs('/#site'), url: abs('/'), name: SITE.brand,
        publisher: { '@id': abs('/#org') }, inLanguage: ['en-MY', 'ms-MY'],
      },
      {
        '@type': 'WebPage', '@id': abs(canonical) + '#page', url: abs(canonical), name: t.title,
        description: t.description, inLanguage: t.htmlLang, isPartOf: { '@id': abs('/#site') },
        primaryImageOfPage: abs('/og.png'),
      },
      {
        '@type': 'SoftwareApplication', '@id': abs('/#app'), name: SITE.brand,
        applicationCategory: 'BusinessApplication', operatingSystem: 'Web',
        description: t.description, inLanguage: ['en-MY', 'ms-MY'], url: abs('/'),
        provider: { '@id': abs('/#org') },
        areaServed: { '@type': 'Country', name: 'Malaysia' },
        offers: t.pricing.plans.filter((p) => p.amount).map((p) => ({
          '@type': 'Offer', name: p.name, price: p.amount, priceCurrency: 'MYR',
          priceSpecification: { '@type': 'UnitPriceSpecification', price: p.amount, priceCurrency: 'MYR', unitText: 'MONTH' },
          url: abs(t.signin),
        })),
      },
      {
        '@type': 'FAQPage', '@id': abs(canonical) + '#faq', inLanguage: t.htmlLang,
        mainEntity: t.faq.items.map(([q, a]) => ({
          '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
    ],
  }];

  const i18n = { personas: t.personas, calc: { lu: t.calc.lu, lq: t.calc.lq, per: t.calc.per } };
  const stepIcons = ['document-arrow-up', 'magnifying-glass', 'bolt'];

  return `${head(t, { title: t.title, description: t.description, canonical, robots: 'index,follow,max-image-preview:large', alternates, ld })}
<body>
<a class="skip" href="#main">${esc(t.skip)}</a>
<div class="top">
  <div class="wrap">
    <nav aria-label="${esc(t.nav.menu)}">
      <a class="logo" href="${t.base}" aria-label="${esc(SITE.legal)}">${logo}</a>
      <div class="links">
        <a href="#how">${esc(t.nav.how)}</a>
        <a href="#savings">${esc(t.nav.savings)}</a>
        <a href="#pricing">${esc(t.nav.pricing)}</a>
        <a href="#faq">${esc(t.nav.faq)}</a>
      </div>
      <div class="tog" role="group" aria-label="${esc(t.langLabel)}">
        ${[en, ms].map((l) => l.lang === t.lang
          ? `<a href="${l.base}" hreflang="${l.htmlLang}" lang="${l.lang}" aria-current="true">${l.lang === 'en' ? 'EN' : 'BM'}</a>`
          : `<a href="${l.base}" hreflang="${l.htmlLang}" lang="${l.lang}">${l.lang === 'en' ? 'EN' : 'BM'}</a>`).join('\n        ')}
      </div>
      <a class="btn sun sm" href="${t.signin}">${esc(t.nav.signin)}</a>
    </nav>
  </div>
</div>
<main id="main" class="wrap">

<header class="hero">
  <div>
    <div class="tabs" id="tabs" role="group" aria-label="${esc(t.tabsLabel)}" hidden>
      ${Object.entries(t.personas).map(([k, p]) => `<button type="button" data-p="${k}" aria-pressed="${k === 'landlord'}">${esc(p.tab)}</button>`).join('\n      ')}
    </div>
    <h1 id="h1">${esc(P.h[0])}<span class="hl">${esc(P.h[1])}</span></h1>
    <p class="lead" id="lead">${esc(P.lead)}</p>
    <div class="cta">
      <a class="btn sun" href="${t.signin}" id="cta1"><span id="cta1-text">${esc(P.c1)}</span>${icon('arrow-right')}</a>
      <a class="btn" href="#how" id="cta2">${esc(P.c2)}</a>
    </div>
  </div>
  <figure class="phone" role="img" aria-label="${esc(t.phone.label)}">
    <div class="t"><span>9:41</span><span>${SITE.brand}</span></div>
    <div class="card flag"><span class="lbl">${icon('exclamation-triangle')}${esc(t.phone.l1)}</span><b>${esc(t.phone.c1b)}</b>${esc(t.phone.c1)}</div>
    <div class="card good"><span class="lbl">${icon('check-circle')}${esc(t.phone.l2)}</span><b>${esc(t.phone.c2b)}</b>${esc(t.phone.c2)}</div>
    <div class="card"><div class="ask">${icon('chat-bubble-left-right')}<div><b>${esc(t.phone.c3b)}</b>${esc(t.phone.c3)}</div></div></div>
    <a class="pbtn" href="${t.signin}">${esc(t.phone.btn)}${icon('arrow-right')}</a>
  </figure>
</header>

<section id="how" aria-labelledby="how-h">
  <h2 id="how-h">${esc(t.how.h)}</h2><p class="sub">${esc(t.how.sub)}</p>
  <ol class="steps">
    ${t.how.steps.map(([h, p], i) => `<li class="s"><div class="n">${icon(stepIcons[i])}</div><h3>${i + 1}. ${esc(h)}</h3><p>${esc(p)}</p></li>`).join('\n    ')}
  </ol>
</section>

<section id="anatomy" aria-labelledby="anatomy-h">
  <h2 id="anatomy-h">${esc(t.anatomy.h)}</h2><p class="sub">${esc(t.anatomy.sub)}</p>
  <div class="anat" role="group" aria-label="${esc(t.anatomy.figure)}">
    <div class="anat-labels" aria-hidden="true"><span>${esc(t.anatomy.docLabel)}</span><span></span><span>${esc(t.anatomy.noteLabel)}</span></div>
    ${t.anatomy.rows.map((r) => `<div class="arow t-${r.tone}${r.focal ? ' focal' : ''}">
      <div class="clause"><b>${esc(r.clause)}</b><i></i><i></i></div>
      <span class="link" aria-hidden="true"></span>
      <div class="note"><span class="chip">${icon(r.icon)}${esc(r.chip)}</span><b>${esc(r.head)}</b><p>${esc(r.body)}</p></div>
    </div>`).join('\n    ')}
  </div>
</section>

<section id="chat" aria-labelledby="chat-h">
  <h2 id="chat-h">${esc(t.chat.h)}</h2><p class="sub">${esc(t.chat.sub)}</p>
  <div class="va">
    <div class="chat" role="group" aria-label="${esc(t.chat.label)}">
      <div class="chat-top"><span>${esc(t.chat.top)}</span><span class="dot"></span></div>
      ${t.chat.msgs.map((m) => `<div class="b ${m.who}">${m.attach ? `<span class="att">${icon('document-arrow-up')}${esc(m.attach)}</span>` : ''}${esc(m.text)}${m.src ? `<span class="src ${m.src[1]}">${icon(m.src[2])}${esc(m.src[0])}</span>` : ''}</div>`).join('\n      ')}
    </div>
    <ul class="trust">
      ${t.chat.trust.map(([i, h, p]) => `<li>${icon(i)}<div><b>${esc(h)}</b><p>${esc(p)}</p></div></li>`).join('\n      ')}
    </ul>
  </div>
</section>

<section id="savings" aria-labelledby="savings-h">
  <div class="calc">
    <div>
      <h2 id="savings-h">${esc(t.calc.h)}</h2><p>${esc(t.calc.p)}</p>
      <label for="units" id="lu">${esc(t.calc.lu)} · ${DEF.u}</label>
      <input class="js-only" type="range" id="units" min="1" max="120" value="${DEF.u}" hidden>
      <label for="qs" id="lq">${esc(t.calc.lq)} · ${DEF.q}</label>
      <input class="js-only" type="range" id="qs" min="0" max="20" value="${DEF.q}" hidden>
    </div>
    <div class="out" aria-live="polite">
      <div class="big"><span id="hours">${o.hours}</span> <small>${esc(t.calc.unit)}</small></div>
      <p>${esc(t.calc.note)}</p>
      <hr>
      <div class="row"><span>${esc(t.calc.r1)}</span><b id="v1">${o.v1}</b></div>
      <div class="row"><span>${esc(t.calc.r2)}</span><b id="v2">${o.v2}/${t.calc.per}</b></div>
      <div class="row"><span>${esc(t.calc.r3)}</span><b id="v3">${o.v3}</b></div>
    </div>
  </div>
</section>

<section id="change" aria-labelledby="change-h">
  <h2 id="change-h">${esc(t.ba.h)}</h2><p class="sub">${esc(t.ba.sub)}</p>
  <div class="vc">
    <div class="col before"><h3>${esc(t.ba.before)}</h3>${t.ba.rows.map((r) => `<div class="cell">${icon('x-mark')}<span>${esc(r[0])}</span></div>`).join('')}</div>
    <div class="mid" aria-hidden="true">${t.ba.rows.map(() => `<div class="cell">${icon('arrow-right')}</div>`).join('')}</div>
    <div class="col after"><h3>${esc(t.ba.after)}</h3>${t.ba.rows.map((r) => `<div class="cell">${icon('check')}<span>${esc(r[1])}</span></div>`).join('')}</div>
    <p class="foot">${icon('scale')}${esc(t.ba.foot)}</p>
  </div>
</section>

<section id="pricing" aria-labelledby="pricing-h">
  <h2 id="pricing-h">${esc(t.pricing.h)}</h2><p class="sub">${esc(t.pricing.sub)}</p>
  <div class="plans">
    ${t.pricing.plans.map((p) => `<div class="p${p.hot ? ' hot' : ''}">
      <h3>${esc(p.name)}</h3>
      <div class="pr">${esc(p.price)}${p.amount ? `<small>${esc(t.pricing.per)}</small>` : ''}</div>
      <ul>${p.items.map((i) => `<li>${icon('check')}<span>${esc(i)}</span></li>`).join('')}</ul>
      <a class="btn${p.hot ? ' sun' : ''} block" href="${t.signin}">${esc(p.cta)}</a>
    </div>`).join('\n    ')}
  </div>
</section>

<section id="faq" class="faq-list" aria-labelledby="faq-h">
  <h2 id="faq-h">${esc(t.faq.h)}</h2>
  ${t.faq.items.map(([q, a]) => `<details><summary><span>${esc(q)}</span>${icon('chevron-down')}</summary><p>${esc(a)}</p></details>`).join('\n  ')}
</section>

</main>
<div class="wrap">
  <footer><span>© ${SITE.year} ${esc(SITE.legal)}</span><span>${esc(t.footer)} · <a href="${legalOf(t).path}">${esc(legalOf(t).footerLink)}</a></span></footer>
</div>
<script type="application/json" id="i18n">${json(i18n)}</script>
<script src="${hashed['app.js']}" defer></script>
</body>
</html>
`;
}

// ---- BM landing page (own structure, copy from content.ms.mjs) -------------------------------
function landingMs(t) {
  const canonical = t.base;
  const alternates = [
    { hreflang: 'en-MY', href: '/' },
    { hreflang: 'ms-MY', href: '/ms/' },
    { hreflang: 'x-default', href: '/' },
  ];
  const ld = [{
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': abs('/#org'), name: SITE.legal, alternateName: SITE.brand, url: abs('/'), logo: abs('/icon-512.png') },
      { '@type': 'WebSite', '@id': abs('/#site'), url: abs('/'), name: SITE.brand, publisher: { '@id': abs('/#org') }, inLanguage: ['en-MY', 'ms-MY'] },
      { '@type': 'WebPage', '@id': abs(canonical) + '#page', url: abs(canonical), name: t.title, description: t.description, inLanguage: t.htmlLang, isPartOf: { '@id': abs('/#site') }, primaryImageOfPage: abs('/og.png') },
      {
        '@type': 'SoftwareApplication', '@id': abs('/#app'), name: SITE.brand, applicationCategory: 'BusinessApplication', operatingSystem: 'Web',
        description: t.description, inLanguage: ['en-MY', 'ms-MY'], url: abs('/'), provider: { '@id': abs('/#org') },
        areaServed: { '@type': 'Country', name: 'Malaysia' },
        offers: t.pricing.plans.filter((p) => p.amount).map((p) => ({
          '@type': 'Offer', name: p.name, price: p.amount, priceCurrency: 'MYR',
          priceSpecification: { '@type': 'UnitPriceSpecification', price: p.amount, priceCurrency: 'MYR', unitText: 'MONTH' },
          url: abs(t.signin),
        })),
      },
    ],
  }];
  const stepIcons = ['document-arrow-up', 'magnifying-glass', 'bolt'];
  const arrow = icon('arrow-right');
  const h = t.hero;
  return `${head(t, { title: t.title, description: t.description, canonical, robots: 'index,follow,max-image-preview:large', alternates, ld })}
<body>
<a class="skip" href="#main">${esc(t.skip)}</a>
<div class="top">
  <div class="wrap">
    <nav aria-label="${esc(t.nav.menu)}">
      <a class="logo" href="${t.base}" aria-label="${esc(SITE.legal)}">${logo}</a>
      <div class="links">
        <a href="#how">${esc(t.nav.how)}</a>
        <a href="#pricing">${esc(t.nav.pricing)}</a>
      </div>
      <div class="tog" role="group" aria-label="${esc(t.langLabel)}">
        <a href="/" hreflang="en-MY" lang="en">EN</a>
        <a href="/ms/" hreflang="ms-MY" lang="ms" aria-current="true">BM</a>
      </div>
      <a class="btn sun sm" href="${t.signin}">${esc(t.nav.signin)}</a>
    </nav>
  </div>
</div>
<main id="main" class="wrap">

<header class="hero">
  <div>
    <h1 id="h1">${esc(h.h[0])}<span class="hl">${esc(h.h[1])}</span></h1>
    <p class="lead">${esc(h.lead)}</p>
    <p class="lead lead2">${esc(h.lead2)}</p>
    <div class="cta"><a class="btn sun" href="${t.signin}">${esc(h.cta)}${arrow}</a></div>
    <ul class="hero-meta">${h.meta.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>
  </div>
  <figure class="phone" role="img" aria-label="${esc(t.phone.label)}">
    <div class="t"><span>9:41</span><span>${SITE.brand}</span></div>
    <div class="card flag"><span class="lbl">${icon('exclamation-triangle')}${esc(t.phone.l1)}</span><b>${esc(t.phone.c1b)}</b>${esc(t.phone.c1)}</div>
    <div class="card good"><span class="lbl">${icon('check-circle')}${esc(t.phone.l2)}</span><b>${esc(t.phone.c2b)}</b>${esc(t.phone.c2)}</div>
    <div class="card"><div class="ask">${icon('chat-bubble-left-right')}<div><b>${esc(t.phone.c3b)}</b>${esc(t.phone.c3)}</div></div></div>
    <a class="pbtn" href="${t.signin}">${esc(t.phone.btn)}${arrow}</a>
  </figure>
</header>

<section id="masalah" class="problem" aria-labelledby="problem-h">
  <p class="eyebrow">${esc(t.problem.eyebrow)}</p>
  <h2 id="problem-h">${esc(t.problem.h)}</h2>
  <p class="prose">${esc(t.problem.p1)}</p>
  <p class="prose">${esc(t.problem.p2)}</p>
  <p class="prose strong">${esc(t.problem.p3)}</p>
</section>

<section id="how" aria-labelledby="how-h">
  <p class="eyebrow">${esc(t.how.eyebrow)}</p>
  <h2 id="how-h">${esc(t.how.h)}</h2>
  <ol class="steps">
    ${t.how.steps.map(([sh, sp], i) => `<li class="s"><div class="n">${icon(stepIcons[i])}</div><h3>${i + 1}. ${esc(sh)}</h3><p>${esc(sp)}</p></li>`).join('\n    ')}
  </ol>
</section>

<section id="untuk" aria-labelledby="untuk-h">
  <h2 id="untuk-h" class="sr-only">${esc(t.personas.eyebrow)}</h2>
  <div class="pcards">
    ${t.personas.cards.map((c) => `<article class="pc${c.hot ? ' hot' : ''}">
      <p class="eyebrow">${esc(c.eyebrow)}</p>
      <h3>${esc(c.h)}</h3>
      <p>${esc(c.p)}</p>
      ${c.plan ? `<div class="planchip"><span>${esc(c.plan[0])}</span><b>${esc(c.plan[1])}</b><small>${esc(c.plan[2])}</small></div>` : ''}
      <a class="btn${c.hot ? ' sun' : ''} block" href="${t.signin}">${esc(c.cta)}${arrow}</a>
    </article>`).join('\n    ')}
  </div>
</section>

<section id="pricing" aria-labelledby="pricing-h">
  <p class="eyebrow">${esc(t.pricing.eyebrow)}</p>
  <h2 id="pricing-h">${esc(t.pricing.h)}</h2>
  <div class="plans">
    ${t.pricing.plans.map((p) => `<div class="p${p.hot ? ' hot' : ''}">
      <h3>${esc(p.name)}</h3>
      <div class="pr">${esc(p.price)}</div>
      <p>${esc(p.p)}</p>
    </div>`).join('\n    ')}
  </div>
  <p class="prose pricing-note">${esc(t.pricing.note)}</p>
  <p class="prose strong">${esc(t.pricing.start)}</p>
  <div class="cta"><a class="btn sun" href="${t.signin}">${esc(t.pricing.cta)}${arrow}</a></div>
</section>

<section class="final" aria-labelledby="final-h">
  <h2 id="final-h">${esc(t.final.h)}</h2>
  <p class="prose">${esc(t.final.p)}</p>
  <div class="cta"><a class="btn sun" href="${t.signin}">${esc(t.final.cta)}${arrow}</a></div>
  <p class="disclaimer">${esc(t.final.disclaimer)}</p>
</section>

</main>
<div class="wrap">
  <footer><span>© ${SITE.year} ${esc(SITE.legal)}</span><span>${esc(t.footer)} · <a href="${legalOf(t).path}">${esc(legalOf(t).footerLink)}</a></span></footer>
</div>
</body>
</html>
`;
}

// ---- sign-in page (noindex) ---------------------------------------------------------
function signin(t) {
  const s = t.signinPage;
  const i18n = { show: s.show, hide: s.hide, busy: s.busy, submit: s.submit, net: s.net };
  return `${head(t, { title: s.title, description: s.description, canonical: s.path, robots: 'noindex,nofollow', og: false })}
<body>
<main class="auth" id="main">
  <div class="auth-box">
    <a class="logo" href="${t.base}" aria-label="${esc(SITE.legal)}">${logo}</a>
    <div class="auth-card">
      <h1>${esc(s.h)}</h1>
      <p class="sub">${esc(s.sub)}</p>
      <p class="msg" id="error" role="alert">${esc(s.err)}</p>
      <p class="msg" id="locked" role="alert">${esc(s.locked)}</p>
      <form id="f" method="post" action="/api/signin">
        <input type="hidden" name="l" value="${t.lang}">
        <div class="field">
          <label for="username">${esc(s.user)}</label>
          <input id="username" name="username" type="text" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" maxlength="200" required>
        </div>
        <div class="field">
          <label for="password">${esc(s.pass)}</label>
          <div class="pw">
            <input id="password" name="password" type="password" autocomplete="current-password" maxlength="200" required>
            <button type="button" id="toggle" aria-label="${esc(s.show)}" hidden>
              <span class="i-eye">${icon('eye')}</span><span class="i-eye-slash" hidden>${icon('eye-slash')}</span>
            </button>
          </div>
        </div>
        <button class="btn sun block" type="submit" id="submit">${icon('lock-closed')}<span>${esc(s.submit)}</span></button>
      </form>
    </div>
    <a class="back" href="${t.base}">${esc(s.back)}</a>
  </div>
</main>
<script type="application/json" id="i18n">${json(i18n)}</script>
<script src="${hashed['signin.js']}" defer></script>
</body>
</html>
`;
}

// ---- terms & privacy (indexable) ----------------------------------------------------
function legal(t) {
  const L = legalOf(t);
  // email_off: stop Cloudflare's email obfuscation, so the contact shows without JavaScript.
  const mailto = `<!--email_off--><a href="mailto:${CONTACT}">${CONTACT}</a><!--/email_off-->`;
  const section = (id, h, items) => `<section id="${id}" aria-labelledby="${id}-h">
  <h2 id="${id}-h">${esc(h)}</h2>
  ${items.map(([sh, ps], i) => `<h3>${i + 1}. ${esc(sh)}</h3>
  ${ps.map((p) => `<p>${esc(p).replace(CONTACT, mailto)}</p>`).join('\n  ')}`).join('\n  ')}
</section>`;
  const alternates = [
    { hreflang: 'en-MY', href: legalEn.path },
    { hreflang: 'ms-MY', href: legalMs.path },
    { hreflang: 'x-default', href: legalEn.path },
  ];
  return `${head(t, { title: L.title, description: L.description, canonical: L.path, robots: 'index,follow', alternates, og: false })}
<body>
<a class="skip" href="#main">${esc(t.skip)}</a>
<div class="top">
  <div class="wrap">
    <nav aria-label="${esc(t.nav.menu)}">
      <a class="logo" href="${t.base}" aria-label="${esc(SITE.legal)}">${logo}</a>
      <div class="tog" role="group" aria-label="${esc(t.langLabel)}">
        <a href="${legalEn.path}" hreflang="en-MY" lang="en"${t.lang === 'en' ? ' aria-current="true"' : ''}>EN</a>
        <a href="${legalMs.path}" hreflang="ms-MY" lang="ms"${t.lang === 'ms' ? ' aria-current="true"' : ''}>BM</a>
      </div>
    </nav>
  </div>
</div>
<main id="main" class="wrap legal">
  <h1>${esc(L.h)}</h1>
  <p class="sub">${esc(L.updated)}: ${UPDATED} · <a href="#terms">${esc(L.termsH)}</a> · <a href="#privacy">${esc(L.privacyH)}</a></p>
  ${section('terms', L.termsH, L.terms)}
  ${section('privacy', L.privacyH, L.privacy)}
  <p><a class="btn" href="${t.base}">${esc(L.back)}</a></p>
</main>
<div class="wrap">
  <footer><span>© ${SITE.year} ${esc(SITE.legal)}</span><span>${esc(t.footer)}</span></footer>
</div>
</body>
</html>
`;
}

// ---- 404 ----------------------------------------------------------------------------
function notFound() {
  const t = en;
  return `${head(t, { title: 'Page not found | Puascari', description: 'Page not found.', canonical: '/', robots: 'noindex', og: false })}
<body>
<main class="auth" id="main">
  <div class="auth-box">
    <a class="logo" href="/" aria-label="${esc(SITE.legal)}">${logo}</a>
    <div class="auth-card">
      <h1>Page not found</h1>
      <p class="sub">That page doesn’t exist.</p>
      <a class="btn sun block" href="/">Back to home</a>
    </div>
  </div>
</main>
</body>
</html>
`;
}

// ---- write ----------------------------------------------------------------------------
const write = (f, s) => fs.writeFileSync(path.join(dist, f), s);
write('index.html', landing(en));
write('ms/index.html', landingMs(ms));
write('signin.html', signin(en));
write('ms/log-masuk.html', signin(ms));
write('404.html', notFound());
write('terms-privacy.html', legal(en));
write('ms/terma-privasi.html', legal(ms));
write('robots.txt', `User-agent: *
Allow: /
Disallow: /signin
Disallow: /ms/log-masuk
Disallow: /api/

Sitemap: ${abs('/sitemap.xml')}
`);
// RFC 9116 security contact. Emitted only when a contact is supplied, so a deploy never ships a placeholder:
//   VERIDLE_SECURITY_CONTACT=mailto:name@example.com deploy/deploy.sh
// Expires is rebuilt on every deploy (364 days out); redeploy at least yearly or it lapses.
const secContact = process.env.VERIDLE_SECURITY_CONTACT;
if (secContact) {
  const expires = new Date(Date.now() + 364 * 864e5).toISOString().replace(/\.\d+Z$/, 'Z');
  write('security.txt', `Contact: ${secContact}\nExpires: ${expires}\nPreferred-Languages: en, ms\nCanonical: ${abs('/.well-known/security.txt')}\n`);
}
const today = new Date().toISOString().slice(0, 10);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[['/', 1.0], ['/ms/', 0.9]].map(([u, pr]) => `  <url>
    <loc>${abs(u)}</loc>
    <lastmod>${today}</lastmod>
    <priority>${pr}</priority>
    <xhtml:link rel="alternate" hreflang="en-MY" href="${abs('/')}"/>
    <xhtml:link rel="alternate" hreflang="ms-MY" href="${abs('/ms/')}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs('/')}"/>
  </url>`).join('\n')}
${[legalEn, legalMs].map((l) => `  <url>
    <loc>${abs(l.path)}</loc>
    <lastmod>${UPDATED}</lastmod>
    <priority>0.3</priority>
    <xhtml:link rel="alternate" hreflang="en-MY" href="${abs(legalEn.path)}"/>
    <xhtml:link rel="alternate" hreflang="ms-MY" href="${abs(legalMs.path)}"/>
  </url>`).join('\n')}
</urlset>
`);

const kb = (f) => (fs.statSync(path.join(dist, f)).size / 1024).toFixed(1) + ' KB';
console.log('built dist/:', ['index.html', 'ms/index.html', 'signin.html', 'ms/log-masuk.html'].map((f) => `${f} ${kb(f)}`).join(' · '));

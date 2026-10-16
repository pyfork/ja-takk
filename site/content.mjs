// All page copy. Source: docs/spikes/veridle.com/concept-3-rumah.html.
// CTAs that said "Start free" / "Book a demo" etc. now say "Sign in" because every CTA goes to the
// sign-in page (there is no registration yet). "See how it works" stays an in-page anchor.
// The BM page lives in content.ms.mjs (gitignored, not tracked).
// Brand: trade name "Puascari Property Group" (veridle.com is only the domain).

export const SITE = {
  origin: 'https://veridle.com',
  brand: 'Puascari',
  legal: 'Puascari Property Group',
  year: 2026,
};

export const en = {
  lang: 'en',
  base: '/',
  signin: '/signin',
  alt: { code: 'ms', href: '/ms/', label: 'BM', hreflang: 'ms-MY' },
  htmlLang: 'en-MY',
  locale: 'en_MY',
  title: 'Puascari — Check Your Tenancy Agreement in Minutes | Malaysia',
  description:
    'Upload your tenancy agreement. Puascari flags risky clauses, answers questions in English or BM, and drafts notices and renewals. For Malaysian landlords and agents.',
  ogAlt: 'Puascari: know what you actually signed. AI tenancy agreement review for Malaysia.',
  nav: { how: 'How it works', savings: 'Time saved', pricing: 'Pricing', faq: 'FAQ', signin: 'Sign in', menu: 'Main' },
  skip: 'Skip to content',
  langLabel: 'Language',
  tabsLabel: 'I am a',
  personas: {
    landlord: {
      tab: 'Landlord',
      h: ['Know what you ', 'actually signed.'],
      lead: 'Upload your tenancy agreement. Puascari reads it, flags anything risky, and answers your questions in plain English or BM. Need a notice? It drafts one from your own agreement.',
      c1: 'Sign in to check my agreement',
      c2: 'See how it works',
    },
    agent: {
      tab: 'Agent',
      h: ['Review every agreement ', 'before they sign.'],
      lead: "Stop being the tenant helpdesk. Puascari reviews agreements in seconds, drafts renewals, and answers tenant questions from the document so you don't have to.",
      c1: 'Sign in as an agent',
      c2: 'See how it works',
    },
    pm: {
      tab: 'Property manager',
      h: ['Forty units. ', 'One question.'],
      lead: 'Ask across your whole portfolio: which agreements expire this quarter, which still carry the old deposit clause, who owes a renewal letter. Puascari reads them all.',
      c1: 'Sign in to your portfolio',
      c2: 'See how it works',
    },
  },
  phone: {
    label: 'Example: Puascari reviewing a tenancy agreement',
    l1: 'Watch out',
    c1b: 'Clause 5.2 · Termination',
    c1: "Landlord can end tenancy with 7 days' notice, no reason. Unusually short.",
    l2: 'Looks fine',
    c2b: 'Clause 9.1 · Renewal',
    c2: 'Rent increase capped at 10%. Standard.',
    c3b: 'Ask a question',
    c3: '"Who pays for the aircond service?"',
    btn: 'Draft a reply to the landlord',
  },
  how: {
    h: 'Three steps. No lawyer on retainer.',
    sub: 'Most people sign tenancy agreements without reading them. Now you can read all of it in two minutes.',
    steps: [
      ['Upload', 'PDF, photo, or scan. English, Malay, or both in the same document.'],
      ['Review', 'Every clause flagged red, amber, or green, with a plain explanation and the market norm.'],
      ['Act', 'Ask questions, draft notices and renewals, compare across your units. All grounded in the document.'],
    ],
  },
  anatomy: {
    h: 'See what a flagged clause looks like.',
    sub: 'Every clause gets a colour and a plain-language reason, so you know what to question before you sign.',
    docLabel: 'Tenancy agreement',
    noteLabel: 'What Puascari tells you',
    figure: 'Sample tenancy agreement with four clauses and what Puascari says about each',
    rows: [
      { tone: 'amber', icon: 'magnifying-glass', clause: 'Deposit', chip: 'Review', head: 'Flagged, with the market norm', body: 'Amber means look twice. Puascari puts the usual market position beside the clause.' },
      { tone: 'ask', icon: 'chat-bubble-left-right', clause: 'Repairs and servicing', chip: 'Ask', head: 'Ask in plain words', body: '\u201CWho pays for the aircond service?\u201D Answered from this agreement, in English or BM.' },
      { tone: 'red', icon: 'exclamation-triangle', clause: 'Clause 5.2 \u00B7 Termination', chip: 'Watch out', head: 'Clause 5.2 \u00B7 Termination', body: "Landlord can end tenancy with 7 days' notice, no reason. Unusually short.", focal: true },
      { tone: 'green', icon: 'check-circle', clause: 'Clause 9.1 \u00B7 Renewal', chip: 'Looks fine', head: 'Clause 9.1 \u00B7 Renewal', body: 'Rent increase capped at 10%. Standard.' },
    ],
  },
  chat: {
    h: 'Ask your agreement anything.',
    sub: 'Chat in English or BM. Every answer points to the clause it came from.',
    label: 'Example chat with Puascari',
    top: 'Puascari',
    msgs: [
      { who: 'me', attach: 'tenancy-agreement.pdf', text: 'Is anything risky in here?' },
      { who: 'bot', text: "Yes, one to watch. Clause 5.2 lets the landlord end the tenancy with 7 days' notice, no reason. That's unusually short.", src: ['Clause 5.2 \u00B7 Termination', 'warn', 'document-text'] },
      { who: 'me', text: 'Who pays for the aircond service?' },
      { who: 'bot', text: "Let me check your agreement. Here's the clause, in plain words.", src: ['Repairs and servicing', '', 'document-text'] },
      { who: 'me', text: 'Can you write to the landlord?' },
      { who: 'bot', text: 'Done. A draft reply, based on your own agreement.', src: ['Draft ready', 'ok', 'check-circle'] },
    ],
    trust: [
      ['document-text', 'Every answer points to its clause', 'You can see where it came from in your own agreement.'],
      ['lock-closed', 'Your agreement stays yours', 'Processed for you alone and never used to train models.'],
      ['scale', 'Not legal advice', 'For a dispute, talk to a lawyer. Puascari helps you walk in prepared.'],
    ],
  },
  ba: {
    h: 'From hoping to knowing.',
    sub: 'Three things that get easier once you can read your whole agreement in two minutes.',
    before: 'Without Puascari',
    after: 'With Puascari',
    rows: [
      ['Sign it without reading', 'Know the risky clauses in two minutes'],
      ['Phone the agent for every question', 'Ask in plain words, answered from your agreement'],
      ['Write notices from scratch', 'Notices and renewals drafted for you'],
    ],
    foot: 'Not legal advice. For a dispute, talk to a lawyer.',
  },
  calc: {
    h: 'How much time does it give back?',
    p: 'Rough estimate based on pilot agencies. Drag the sliders.',
    lu: 'Agreements you manage',
    lq: 'Tenant or landlord questions per week',
    unit: 'hours a month',
    note: 'spent reading agreements and answering the same questions by hand.',
    r1: 'Agreements reviewed on upload',
    r2: 'Questions answered from the document',
    r3: 'Renewal letters drafted per year',
    per: 'mo',
  },
  pricing: {
    h: 'Simple monthly plans.',
    sub: 'Self-serve. Cancel any time. Pay in ringgit.',
    per: '/month',
    plans: [
      {
        key: 'landlord', name: 'Landlord', price: 'RM 29', amount: '29',
        items: ['Up to 5 agreements', 'Risk flags and Q&A', 'Notices and renewal drafts', 'English and BM'],
        cta: 'Sign in',
      },
      {
        key: 'agent', name: 'Agent', price: 'RM 99', amount: '99', hot: true,
        items: ['Up to 60 agreements', 'Shareable tenant Q&A link', 'Portfolio comparison', 'Priority drafting'],
        cta: 'Sign in',
      },
      {
        key: 'pm', name: 'Property manager', price: "Let's talk",
        items: ['Unlimited agreements', 'Team workspaces', 'Renewal calendar and alerts', 'Onboarding for your office'],
        cta: 'Sign in',
      },
    ],
  },
  faq: {
    h: 'Frequently asked questions',
    items: [
      ['Is this legal advice?', 'No. Puascari explains what your agreement says and what is normal in the Malaysian market. For a dispute, talk to a lawyer. Puascari helps you walk in prepared.'],
      ['Does it work with Bahasa Malaysia agreements?', 'Yes. Malay, English, and mixed documents. Ask in either language and get the answer in that language.'],
      ['Is my agreement private?', 'Yes. Your documents are processed for you alone and are never used to train models.'],
      ['What is it built on?', 'Claude, by Anthropic, is the core engine. It reads the document and does the reasoning. We build the tenancy knowledge, the drafting, and the portfolio tools on top.'],
    ],
  },
  footer: 'Built on Claude · Not legal advice',
  signinPage: {
    path: '/signin',
    title: 'Sign in | Puascari',
    description: 'Sign in to Puascari.',
    h: 'Sign in',
    sub: 'Welcome back to Puascari.',
    user: 'Username',
    pass: 'Password',
    show: 'Show password',
    hide: 'Hide password',
    submit: 'Sign in',
    busy: 'Signing in…',
    err: 'Invalid username or password.',
    locked: 'Too many attempts. Try again in an hour.',
    net: 'Could not reach the server. Try again.',
    back: 'Back to home',
  },
};

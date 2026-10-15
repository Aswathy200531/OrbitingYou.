// Browser-only stand-in for the Node server, so the pages work without npm.
// It mimics the same /api routes and Socket.IO events and keeps its data in localStorage.
(function () {
const {LANGS,translate}=(function(){const module={exports:{}};
// Fake "universal translator": every alien language is a deterministic syllable dictionary.
const LANGS = {
  common:     { name: 'Galactic Common' },
  crystalline:{ name: 'Crystalline', syl: ['ky','ri','ze','el','sha','vi','lu'], sep: '' },
  aetheric:   { name: 'Aetheric',    syl: ['ae','lo','ven','thi','ra','si','mir'], sep: "'" },
  drakonic:   { name: 'Drakonic',    syl: ['dra','ghor','vok','ul','kar','zath','mog'], sep: '' },
  bubblish:   { name: 'Bubblish',    syl: ['blu','bo','glub','ploo','wa','bli'], sep: '-' },
  leafsong:   { name: 'Leafsong',    syl: ['fe','lo','na','wi','sha','ora','ly'], sep: '' },
  hummish:    { name: 'Hummish',     syl: ['mm','hum','rrm','oom','vv','hmm'], sep: '-' },
  clickspeak: { name: 'Clickspeak',  syl: ['tk','ik','ck','ak','tsk','uk'], sep: '!' },
  sporish:    { name: 'Sporish',     syl: ['spo','fu','mu','pff','ra','ni'], sep: '' }
};
function translate(text, lang) {
  const L = LANGS[lang];
  if (!L || !L.syl) return text;
  return text.replace(/[A-Za-z']+/g, (w) => {
    let h = 0;
    for (const c of lang + w.toLowerCase()) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const parts = [];
    for (let i = 0; i < Math.max(1, Math.ceil(w.length / 3)); i++) {
      parts.push(L.syl[h % L.syl.length]);
      h = (h * 1103515245 + 12345) >>> 0;
    }
    const out = parts.join(L.sep);
    return /^[A-Z]/.test(w) ? out[0].toUpperCase() + out.slice(1) : out;
  });
}
module.exports = { LANGS, translate };

return module.exports})();
const {compat}=(function(){const module={exports:{}};
const KEYS = ['hands', 'eyes', 'legs', 'ant', 'skin'];
// prefs: { g, hands, eyes, legs, ant, skin } where '' / null means "any"
function compat(me, target, prefs) {
  const p = prefs || me.pref || {};
  if (p.g && target.g !== p.g) return { ok: false, score: 0 };
  const set = KEYS.filter((k) => p[k] !== undefined && p[k] !== null && p[k] !== '');
  if (!set.length) return { ok: true, score: 100 };
  const hit = set.filter((k) => String(target[k]) === String(p[k])).length;
  const score = Math.round((100 * hit) / set.length);
  return { ok: score >= 60, score };
}
module.exports = { compat };

return module.exports})();
const {dateIdea}=(function(){const module={exports:{}};
function dateIdea(a, b) {
  const seed = [...(a.id + b.id)].reduce((s, c) => s + c.charCodeAt(0), 0);
  const I = [];
  const add = (emoji, title, text) => I.push({ emoji, title, text });
  if (a.legs === 0 || b.legs === 0) add('🛸', 'Zero-gravity picnic', 'Float side by side on a drifting comet while the snacks orbit around you.');
  if (a.hands + b.hands >= 8) add('🍲', 'Many-handed cook-off', `With ${a.hands + b.hands} hands between you, cook a nine-course dinner in ten minutes.`);
  if (a.eyes + b.eyes >= 6) add('🔭', 'Double-count stargazing', `With ${a.eyes + b.eyes} eyes between you, count every star twice and argue about the total.`);
  if (a.skin === b.skin) add('📸', 'Twin-colour photoshoot', 'Wear matching outfits in front of a nebula and pose like a royal family portrait.');
  if ([a, b].some((x) => x.species === 'Human')) add('🍜', 'Earth night', 'Recreate an Earth dinner: instant noodles, old songs from a laptop and candlelight.');
  if (a.lang !== b.lang) add('🎭', 'Translator-off charades', 'Switch off the universal translator for one hour and use only gestures and dramatic sighs.');
  add('🌅', 'Sunset swap', `Show each other a favourite sunset from ${a.planet} and ${b.planet}. Bring snacks.`);
  add('🏄', 'Moon-surfing and meteor shower', 'Ride a lunar wave at dusk, then lie back and watch the meteors.');
  const i = seed % I.length;
  const { emoji, title } = I[(i + 1) % I.length];
  return { ...I[i], backup: { emoji, title } };
}
module.exports = { dateIdea };

return module.exports})();
const {botReply}=(function(){const module={exports:{}};
// Seed profiles answer for themselves when nobody is logged in as them.
const LINES = [
  'Hello! My hearts just skipped a beat.',
  'I told my mother-ship about you. She approves.',
  'Do you prefer moonlight or double moonlight?',
  'Tell me more about your home planet!',
  'You make my antennae tingle. Is that normal?',
  'I could talk to you until the suns come up.'
];
const botReply = (bot, text) => LINES[(text.length + bot.name.length) % LINES.length];
module.exports = { botReply };

return module.exports})();
const SEED = [{"id": "p0", "g": "m", "name": "Arjun", "species": "Human", "planet": "Earth (gone)", "age": 28, "hands": 2, "eyes": 2, "legs": 2, "ant": 0, "skin": "peach", "badge": "Last human alive", "bio": "Sole survivor of Earth. Brought a phone, a laptop and zero signal. Can cook, can code, can open jars.", "m": {"human": 1, "round": 1, "skin": "#f3c9a5", "skin2": "#d9a47c", "hair": "#1c120d", "hi": "#5a4030", "eye": "#5a3a22", "sclera": "#fff", "jacket": "#3b6ea5", "collar": "#f4f4f4", "glow": "#fff", "bg": "#8a3a22"}, "cosmicId": "ARJUN-001", "lang": "common", "bot": true, "bioDone": true}, {"id": "p1", "g": "f", "name": "Zyra-Q", "species": "Crystallan", "planet": "Nebulon", "age": 214, "hands": 2, "eyes": 2, "legs": 2, "ant": 0, "skin": "white", "badge": "Crystal queen", "img": "images/zyra-q.jpg", "pos": "50% 20%", "bio": "Hair of living light and a gown woven from frost. Loves stargazing, crystal gardens and quiet mornings.", "cosmicId": "ZYRA-Q-001", "lang": "crystalline", "bot": true, "bioDone": true}, {"id": "p7", "g": "m", "name": "Lord Sylvar", "species": "Aetherian", "planet": "Aetheria", "age": 240, "hands": 2, "eyes": 2, "legs": 2, "ant": 2, "skin": "teal", "badge": "Heartthrob of Aetheria", "img": "images/lord-sylvar.jpg", "pos": "50% 15%", "bio": "Calm and mysterious, with wings for ears and gold in his eyes. Collects butterflies and rare compliments.", "cosmicId": "LORD-SYLVAR-001", "lang": "aetheric", "bot": true, "bioDone": true}, {"id": "p10", "g": "f", "name": "Rubyne", "species": "Gemlin", "planet": "Garnetia", "age": 176, "hands": 2, "eyes": 2, "legs": 2, "ant": 0, "skin": "pink", "badge": "Most dazzling in Garnetia", "img": "images/rubyne.jpg", "pos": "50% 8%", "bio": "Wears her rubies every day, because why not. Big red eyes, a bigger laugh, and zero patience for boring dates.", "cosmicId": "RUBYNE-001", "lang": "crystalline", "bot": true, "bioDone": true}, {"id": "p8", "g": "m", "name": "Thalassor", "species": "Finfolk", "planet": "Aquarion", "age": 224, "hands": 2, "eyes": 2, "legs": 2, "ant": 2, "skin": "blue", "badge": "Warrior of the deep", "img": "images/thalassor.jpg", "pos": "30% 8%", "bio": "Sea-blue skin, a crown of fins and shoulders built for carrying you across any river. Swims at dawn, sings at dusk.", "cosmicId": "THALASSOR-001", "lang": "bubblish", "bot": true, "bioDone": true}, {"id": "p2", "g": "f", "name": "Xylanthe", "species": "Kepleran", "planet": "Kepler-9", "age": 187, "hands": 2, "eyes": 2, "legs": 2, "ant": 0, "skin": "lime", "badge": "Sunset dreadlocks", "img": "images/xylanthe.jpg", "pos": "50% 22%", "bio": "Soft-spoken and tall, with dreadlocks that glow at sunset. Fluent in seven moon dialects. Tea over comets, always.", "cosmicId": "XYLANTHE-001", "lang": "leafsong", "bot": true, "bioDone": true}, {"id": "p3", "g": "m", "name": "Ryn", "species": "Drakeling", "planet": "Emberscale", "age": 120, "hands": 2, "eyes": 2, "legs": 2, "ant": 0, "skin": "blue", "badge": "Rising star", "img": "images/ryn.jpg", "pos": "50% 28%", "bio": "Scales like a night sky and curls like a sunrise. Serious eyes, gentle heart, very good jacket.", "cosmicId": "RYN-001", "lang": "drakonic", "bot": true, "bioDone": true}, {"id": "p11", "g": "f", "name": "Fernora", "species": "Verdant", "planet": "Verdantia", "age": 169, "hands": 2, "eyes": 2, "legs": 2, "ant": 0, "skin": "teal", "badge": "Garden goddess", "img": "images/fernora.jpg", "pos": "55% 18%", "bio": "Crowned in leaves and rooted in kindness. Grows her own tea, and her own opinions.", "cosmicId": "FERNORA-001", "lang": "leafsong", "bot": true, "bioDone": true}, {"id": "p4", "g": "m", "name": "Gruk", "species": "Glassdome", "planet": "Bubblia", "age": 400, "hands": 2, "eyes": 1, "legs": 2, "ant": 0, "skin": "grey", "badge": "Deep thinker", "img": "images/gruk.jpg", "pos": "50% 10%", "bio": "Lives in a glass dome and watches three moons rise every evening. Thin, thoughtful, and very good at silence.", "cosmicId": "GRUK-001", "lang": "hummish", "bot": true, "bioDone": true}, {"id": "p12", "g": "f", "name": "Nyx-Ila", "species": "Pale Seer", "planet": "Lunaris", "age": 150, "hands": 2, "eyes": 4, "legs": 2, "ant": 0, "skin": "white", "badge": "Mysterious and magnetic", "img": "images/nyx-ila.jpg", "pos": "50% 18%", "bio": "Four eyes, long silver-white hair and a smile with a little bite. Sees through small talk, but loves big talk.", "cosmicId": "NYX-ILA-001", "lang": "aetheric", "bot": true, "bioDone": true}, {"id": "p9", "g": "m", "name": "Draven-X", "species": "Drakonid", "planet": "Skyforge", "age": 289, "hands": 2, "eyes": 2, "legs": 2, "ant": 0, "skin": "blue", "badge": "Royal and brooding", "img": "images/draven-x.jpg", "pos": "35% 18%", "bio": "Gold-embroidered robes, dragon horns and a stare that has ended arguments. Secretly loves puppies.", "cosmicId": "DRAVEN-X-001", "lang": "drakonic", "bot": true, "bioDone": true}, {"id": "p6", "g": "m", "name": "Vorax", "species": "Obsidian", "planet": "Cyberion", "age": 333, "hands": 2, "eyes": 2, "legs": 2, "ant": 0, "skin": "black", "badge": "Glowing eyes, glowing heart", "img": "images/vorax.jpg", "pos": "30% 20%", "bio": "Smooth helmet head, amber glowing eyes and a collection of runic armour. The silent type, with a very soft side.", "cosmicId": "VORAX-001", "lang": "clickspeak", "bot": true, "bioDone": true}, {"id": "p13", "g": "f", "name": "Morrigha", "species": "Hive Royal", "planet": "Obsidia", "age": 410, "hands": 2, "eyes": 0, "legs": 2, "ant": 0, "skin": "black", "badge": "Queen of the hive", "img": "images/morrigha.jpg", "pos": "50% 28%", "bio": "Dark, glossy and dramatic. She has no eyes and still sees everything, especially who forgot her birthday.", "cosmicId": "MORRIGHA-001", "lang": "clickspeak", "bot": true, "bioDone": true}, {"id": "p14", "g": "f", "name": "Glimmer", "species": "Glowlet", "planet": "Luminara", "age": 45, "hands": 2, "eyes": 2, "legs": 2, "ant": 3, "skin": "orange", "badge": "Cutest in the cosmos", "img": "images/glimmer.jpg", "pos": "50% 50%", "bio": "Tiny, fluffy and glowing like a campfire. Big dark eyes, big dreams and extremely huggable.", "cosmicId": "GLIMMER-001", "lang": "hummish", "bot": true, "bioDone": true}, {"id": "p15", "g": "m", "name": "Clawdius", "species": "Pincerian", "planet": "Tidepool-5", "age": 180, "hands": 0, "eyes": 2, "legs": 4, "ant": 0, "skin": "blue", "badge": "Gentle giant", "img": "images/clawdius.jpg", "pos": "78% 50%", "bio": "Four sturdy legs, big shiny eyes and one very serious nose horn. Walks slowly, loves deeply and never skips a meal.", "cosmicId": "CLAWDIUS-001", "lang": "bubblish", "bot": true, "bioDone": true}, {"id": "p16", "g": "m", "name": "Avo-Kado", "species": "Avocadian", "planet": "Guacamolia", "age": 90, "hands": 0, "eyes": 2, "legs": 2, "ant": 1, "skin": "teal", "badge": "Ripe and ready", "img": "images/avo-kado.jpg", "pos": "50% 50%", "bio": "Round, bumpy and full of good fats. One giant eye for details and one small eye for gossip. Loves brunch.", "cosmicId": "AVO-KADO-001", "lang": "sporish", "bot": true, "bioDone": true}, {"id": "p17", "g": "f", "name": "Sporella", "species": "Fungoid", "planet": "Mycelia", "age": 55, "hands": 0, "eyes": 1, "legs": 0, "ant": 0, "skin": "brown", "badge": "Eye-catching", "img": "images/sporella.jpg", "pos": "50% 50%", "bio": "A cap of golden spots, one huge blue eye and roots that go deep. Quiet, loyal and grows on people.", "cosmicId": "SPORELLA-001", "lang": "sporish", "bot": true, "bioDone": true}];
const EDITABLE = ['g','age','species','planet','lang','hands','eyes','legs','ant','skin','bio','badge','pref','m','bioDone'];
const KEY = 'cosmic-jodi-demo-db';
let DB = null;
try { DB = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
DB = DB || { users: [], edits: {}, matches: [], messages: [] };
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) {} };
const norm = (s) => String(s || '').trim().toUpperCase();
const all = () => SEED.map((p) => ({ ...p, ...(DB.edits[p.id] || {}) })).concat(DB.users);
const get = (id) => all().find((p) => p.id === id);
const byC = (c) => all().find((p) => p.cosmicId === c);
const pair = (a, b) => [a, b].sort();
const isMatch = (a, b) => DB.matches.some((m) => m[0] === pair(a, b)[0] && m[1] === pair(a, b)[1]);
const view = (m) => { const a = get(m.from), b = get(m.to); return { ...m, fromLang: a.lang, toLang: b.lang, inFrom: translate(m.text, a.lang), inTo: translate(m.text, b.lang) }; };

let listeners = {}, uid = null;
const emit = (e, d) => (listeners[e] || []).forEach((f) => f(d));
function send(from, to, text) {
  const m = { id: DB.messages.length + 1, from, to, text, ts: Date.now() };
  DB.messages.push(m); save();
  if (uid === from || uid === to) emit('chat:message', view(m));
  if (get(to).bot && to !== uid) setTimeout(() => send(to, from, botReply(get(to), text)), 1200);
}
window.io = () => {
  listeners = {};
  return {
    on(e, f) { (listeners[e] = listeners[e] || []).push(f); if (e === 'connect') setTimeout(f, 0); },
    emit(e, d) {
      if (e === 'auth') { const u = byC(norm(d)); if (u) uid = u.id; }
      if (e === 'chat:send' && uid && d.text && isMatch(uid, d.to)) send(uid, d.to, String(d.text).slice(0, 500));
    }
  };
};
window.api = async function (url, body) {
  await new Promise((r) => setTimeout(r, 40));
  const u = new URL(url, 'http://x'), p = u.pathname, q = u.searchParams, b = body || {};
  const me = byC(norm(b.cosmicId || q.get('cosmicId')));
  const auth = () => { if (!me) throw new Error('Unknown Cosmic ID'); };
  if (p === '/api/profiles') return all().map(({ cosmicId, ...r }) => r);
  if (p === '/api/languages') return Object.entries(LANGS).map(([id, l]) => ({ id, name: l.name }));
  if (p === '/api/register') {
    const id = norm(b.cosmicId), name = String(b.name || '').trim().slice(0, 30);
    if (!/^[A-Z0-9-]{4,20}$/.test(id)) throw new Error('Cosmic ID must be 4 to 20 letters, numbers or dashes.');
    if (!name) throw new Error('Please enter your name.');
    if (byC(id)) throw new Error('That Cosmic ID is taken in this galaxy. Pick another.');
    const n = { id: 'u' + Date.now().toString(36), cosmicId: id, name, lang: 'common', bioDone: false };
    DB.users.push(n); save(); return { profile: n };
  }
  if (p === '/api/login') { if (!me) throw new Error('No being found with this Cosmic ID. Register first.'); return { profile: me }; }
  if (p === '/api/profile') {
    auth();
    const patch = {}; EDITABLE.forEach((k) => { if (k in b.profile) patch[k] = b.profile[k]; });
    if (!LANGS[patch.lang]) patch.lang = 'common';
    const user = DB.users.find((x) => x.id === me.id);
    if (user) Object.assign(user, patch); else DB.edits[me.id] = { ...(DB.edits[me.id] || {}), ...patch };
    save(); return { profile: get(me.id) };
  }
  if (p === '/api/interest') {
    auth();
    const t = get(b.toId); if (!t || t.id === me.id) throw new Error('Pick someone else.');
    const c = compat(me, t, b.prefs); if (!c.ok) return { match: false, score: c.score };
    if (!isMatch(me.id, t.id)) { DB.matches.push(pair(me.id, t.id)); save(); }
    return { match: true, score: c.score, idea: dateIdea(me, t) };
  }
  if (p === '/api/matches') { auth(); return DB.matches.filter((m) => m.includes(me.id)).map((m) => m.find((x) => x !== me.id)).map((id) => ({ id, idea: dateIdea(me, get(id)) })); }
  if (p.startsWith('/api/chat/')) {
    auth(); const id = p.split('/').pop();
    if (!isMatch(me.id, id)) throw new Error('Not matched yet.');
    return DB.messages.filter((m) => (m.from === me.id && m.to === id) || (m.from === id && m.to === me.id)).map(view);
  }
  throw new Error('Not found');
};
})();

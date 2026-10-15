// Shared by every page: session, navigation, toast, speech and select helpers
const getCid = () => localStorage.getItem('cosmicId') || '';
const setCid = (v) => localStorage.setItem('cosmicId', v);
function logout() { localStorage.removeItem('cosmicId'); location.href = 'login.html'; }
let people = [], langs = [], matches = {}, cid = getCid(), me = null;

// Loads what a logged-in page needs. Returns false (and redirects) when nobody is logged in.
async function loadApp() {
  if (!cid) { location.replace('login.html'); return false; }
  try {
    [people, langs] = await Promise.all([api('/api/profiles'), api('/api/languages')]);
    const r = await api('/api/login', { cosmicId: cid });
    me = people.find((p) => p.id === r.profile.id);
    Object.assign(me, r.profile);
    matches = {};
    (await api('/api/matches?cosmicId=' + cid)).forEach((x) => (matches[x.id] = x.idea));
    return true;
  } catch (e) {
    if (/Cosmic ID/.test(e.message)) logout(); else toast(e.message === 'Failed to fetch' ? 'Cannot reach the server. Is it running (npm start)?' : e.message);
    return false;
  }
}
function renderNav() {
  $('#nav').innerHTML = me
    ? `<a class="link" href="matches.html">Matches</a><a class="link" href="my-matches.html">My matches</a><a class="link" href="bio.html">Edit profile</a><span>Hi, ${esc(me.name)}</span><button id="lo">Logout</button>`
    : '<a class="link" href="login.html">Login</a><a class="link" href="register.html">Register</a>';
  if (me) $('#lo').onclick = logout;
}
function toast(t) { const e = $('#toast'); e.textContent = t; e.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove('show'), 2600); }
function speak(t, cb) {
  if (!('speechSynthesis' in window)) { cb && cb(); return; }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(t);
  u.pitch = .5; u.rate = .85; u.onend = () => cb && cb(); u.onerror = () => cb && cb();
  speechSynthesis.speak(u);
}
function fill(id, opts, any) { $(id).innerHTML = (any ? '<option value="">Any</option>' : '') + opts.map((o) => `<option>${o}</option>`).join(''); }
const H = [0, 1, 2, 3, 4, 5, 6, 8], E = [0, 1, 2, 3, 4, 5, 6], L = [0, 2, 4], A = [0, 1, 2, 3], K = Object.keys(SKINS);

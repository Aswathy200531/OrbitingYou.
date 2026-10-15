(async () => {
  if (!await loadApp()) return;
  renderNav();
  const ids = Object.keys(matches), grid = $('#mGrid');
  if (!ids.length) { grid.innerHTML = '<div class="empty">No matches yet. Send interest to someone compatible on the <a class="link" href="matches.html">Matches page</a>.</div>'; return; }
  grid.innerHTML = ids.map((id) => {
    const p = people.find((x) => x.id === id), i = matches[id];
    const pic = p.img ? `<img src="${p.img}" style="object-position:${p.pos || '50% 12%'}" alt="Portrait of ${esc(p.name)}">` : p.m ? portrait(p) : alien(p);
    return `<article class="card"><div class="pic">${pic}</div><div class="body"><h3>${esc(p.name)}</h3><div class="meta">${esc(p.species)} from ${esc(p.planet)}</div><p class="bio">💡 ${i.emoji} <strong>${esc(i.title)}</strong>: ${esc(i.text)}</p><a class="primary" href="chat.html?with=${p.id}">💬 Open chat</a></div></article>`;
  }).join('');
})();

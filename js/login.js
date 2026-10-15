renderNav();
$('#lGo').onclick = async () => {
  const id = $('#lId').value.trim().toUpperCase();
  if (!id) { $('#lErr').textContent = 'Enter your Cosmic ID.'; return; }
  try {
    const r = await api('/api/login', { cosmicId: id });
    setCid(id);
    location.href = r.profile.bioDone ? 'matches.html' : 'bio.html';
  } catch (e) { $('#lErr').textContent = e.message === 'Failed to fetch' ? 'Cannot reach the server. Is it running (npm start)?' : e.message; }
};
$('#lId').onkeydown = (e) => { if (e.key === 'Enter') $('#lGo').click(); };

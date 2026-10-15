renderNav();
$('#rGen').onclick = () => {
  const b = ($('#rName').value.trim().split(/\s+/)[0] || 'ALIEN').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || 'ALIEN';
  $('#rId').value = `${b}-${Math.floor(1000 + Math.random() * 9000)}`;
};
$('#rGo').onclick = async () => {
  const id = $('#rId').value.trim().toUpperCase(), name = $('#rName').value.trim();
  if (!name) { $('#rErr').textContent = 'Please enter your name.'; return; }
  if (!/^[A-Z0-9-]{4,20}$/.test(id)) { $('#rErr').textContent = 'Cosmic ID must be 4 to 20 letters, numbers or dashes.'; return; }
  try {
    await api('/api/register', { name, cosmicId: id });
    setCid(id);
    location.href = 'bio.html';
  } catch (e) { $('#rErr').textContent = e.message === 'Failed to fetch' ? 'Cannot reach the server. Is it running (npm start)?' : e.message; }
};
$('#rId').onkeydown = $('#rName').onkeydown = (e) => { if (e.key === 'Enter') $('#rGo').click(); };

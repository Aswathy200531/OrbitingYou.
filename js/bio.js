// Bio data page: about me + preferred partner
const BF=[['bHands','hands'],['bEyes','eyes'],['bLegs','legs'],['bAnt','ant'],['bSkin','skin'],['bLang','lang']],PF=[['pGender','g'],['pHands','hands'],['pEyes','eyes'],['pLegs','legs'],['pAnt','ant'],['pSkin','skin']];
function loadBio(){
  $('#bErr').textContent='';$('#bGender').value=me.g||'m';$('#bAge').value=me.age||'';$('#bSpecies').value=me.species||'';$('#bPlanet').value=me.planet||'';$('#bAbout').value=me.bio||'';
  BF.forEach(([i,k])=>{if(me[k]!==undefined)$('#'+i).value=me[k]});
  PF.forEach(([i,k])=>$('#'+i).value=(me.pref||{})[k]??'');
}

const NAMES = { h: 'Hands', e: 'Eyes', l: 'Legs', a: 'Ant', s: 'Skin' };
[['h', H], ['e', E], ['l', L], ['a', A], ['s', K]].forEach(([k, o]) => { fill('#p' + NAMES[k], o, 1); fill('#b' + NAMES[k], o, 0); });
$('#bHands').value = 2; $('#bEyes').value = 2; $('#bLegs').value = 2; $('#bAnt').value = 0;
(async () => {
  if (!await loadApp()) return;
  renderNav();
  $('#bLang').innerHTML = langs.map((l) => `<option value="${l.id}">${l.name}</option>`).join('');
  loadBio();
})();
$('#bSave').onclick = async () => {
  const age = +$('#bAge').value;
  if (!(age >= 18 && age <= 999)) { $('#bErr').textContent = 'Enter your age in cycles (18 or more).'; return; }
  const pref = {};
  PF.forEach(([i, k]) => (pref[k] = $('#' + i).value));
  Object.assign(me, {
    g: $('#bGender').value, age, species: $('#bSpecies').value.trim() || 'Unknown', planet: $('#bPlanet').value.trim() || 'Somewhere',
    bio: $('#bAbout').value.trim() || 'New in the galaxy and ready to meet someone special.',
    hands: +$('#bHands').value, eyes: +$('#bEyes').value, legs: +$('#bLegs').value, ant: +$('#bAnt').value,
    skin: $('#bSkin').value, lang: $('#bLang').value, badge: me.badge || 'New arrival', bioDone: true, pref
  });
  if (!me.img && (!me.m || me.m.auto)) { me.m = look(me); me.m.auto = 1; } // drawn portrait for new beings
  try {
    await api('/api/profile', { cosmicId: cid, profile: me }, 'PUT');
    toast('Bio data saved. Finding your matches...');
    setTimeout(() => (location.href = 'matches.html'), 700);
  } catch (e) { $('#bErr').textContent = e.message; }
};

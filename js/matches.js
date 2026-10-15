// Matches page: filters, voice search, profile cards, sending interest
/* voice */
const NUM={zero:0,no:0,one:1,single:1,two:2,to:2,too:2,three:3,four:4,for:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10};
function parse(text){
  const t=text.toLowerCase(),out={};
  const re=/(\d+|zero|no|one|single|two|too|to|three|four|for|five|six|seven|eight|nine|ten)\s*(hands?|arms?|eyes?|legs?|feet|antenn\w*|feelers?)/g;let m;
  while((m=re.exec(t))){const v=/^\d/.test(m[1])?+m[1]:NUM[m[1]],w=m[2];
    if(/^(hand|arm)/.test(w))out.hands=v;else if(/^eye/.test(w))out.eyes=v;else if(/^(leg|feet)/.test(w))out.legs=v;else out.ant=v}
  for(const c of [...K,...Object.keys(SYN)])if(t.includes(c)){out.skin=SYN[c]||c;break}
  if(/\b(female|woman|girl|lady|pretty|beautiful)\b/.test(t))out.g='f';else if(/\b(male|man|boy|guy|handsome)\b/.test(t))out.g='m';
  return out;
}
function apply(o){
  if('hands' in o)$('#fh').value=H.includes(o.hands)?o.hands:'';
  if('eyes' in o)$('#fe').value=E.includes(o.eyes)?o.eyes:'';
  if('legs' in o)$('#fl').value=L.includes(o.legs)?o.legs:'';
  if('ant' in o)$('#fa').value=A.includes(o.ant)?o.ant:'';
  if('skin' in o)$('#fs').value=o.skin;
  if('g' in o)$('#fg').value=o.g;
  search(true);
}
let rec=null;
$('#mic').onclick=()=>{
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){$('#status').textContent='Voice listening is not supported in this browser. Type your wishes instead; the Listen buttons still talk to you.';return}
  if(rec){rec.stop();return}
  speak('Tell me, traveller. What do you want in a partner?',()=>{
    rec=new SR();rec.lang='en-US';rec.interimResults=false;
    rec.onstart=()=>{$('#mic').classList.add('on');$('#status').textContent='Listening... say something like "two hands, four eyes, green".'};
    rec.onresult=e=>{const t=e.results[0][0].transcript;$('#say').value=t;apply(parse(t))};
    rec.onerror=e=>{$('#status').textContent=e.error==='not-allowed'?'Microphone blocked. Allow mic access in your browser, or type instead.':'Could not hear you. Try again or type.'};
    rec.onend=()=>{$('#mic').classList.remove('on');rec=null};
    try{rec.start()}catch(_){rec=null}
  });
};
$('#go').onclick=()=>{const t=$('#say').value.trim();if(t)apply(parse(t));else search(true)};
$('#say').onkeydown=e=>{if(e.key==='Enter')$('#go').click()};
['#fh','#fe','#fl','#fa','#fs','#fg'].forEach(id=>$(id).onchange=()=>search(false));
$('#clear').onclick=()=>{['#fh','#fe','#fl','#fa','#fs','#fg'].forEach(id=>$(id).value='');$('#say').value='';search(false);$('#status').textContent='Preferences cleared.'};
$('#hello').onclick=()=>speak('Welcome to Cosmic Jodi. The galaxy\'s only matrimony site with no internet. Tap the microphone and tell me how many hands and eyes you want in a partner.');

/* search + render */
function score(p){
  const c=[['hands','hands'],['eyes','eyes'],['legs','legs'],['ant','ant'],['skin','skin']].filter(([k])=>crit[k]!==null&&crit[k]!=='');
  if(!c.length)return null;
  return Math.round(100*c.filter(([k,f])=>String(p[f])===String(crit[k])).length/c.length);
}
function search(say){
  crit={hands:$('#fh').value,eyes:$('#fe').value,legs:$('#fl').value,ant:$('#fa').value,skin:$('#fs').value,g:$('#fg').value};
  const list=people.filter(p=>p.bioDone!==false&&(!me||p.id!==me.id)&&(!crit.g||p.g===crit.g)).map(p=>({p,s:score(p)}));
  const any=list.some(x=>x.s!==null);
  list.sort((a,b)=>(b.s??0)-(a.s??0));
  const shown=any?list.filter(x=>$('#strict').checked?x.s===100:x.s>0):list;
  $('#count').textContent=any?`${shown.length} compatible being${shown.length==1?'':'s'}`:`${shown.length} singles`;
  $('#grid').innerHTML=shown.length?shown.map(({p,s})=>card(p,s)).join(''):'<div class="empty">No one matches yet. Loosen a preference or wait for new arrivals to join.</div>';
  $('#grid').querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>listen(b.dataset.l));
  $('#grid').querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>interest(b.dataset.i));
  if(any){const msg=shown.length?`I found ${shown.length} match${shown.length==1?'':'es'}. Top match is ${shown[0].p.name}, ${shown[0].s} percent compatible.`:'No matches found. Try fewer wishes.';
    $('#status').textContent=msg;if(say)speak(msg)}
  else if(say){$('#status').textContent='Showing everyone. Add a preference to see compatibility.'}
}
function card(p,s){
  return `<article class="card"><div class="pic">${p.img?`<img src="${p.img}" style="object-position:${p.pos||'50% 12%'}" alt="Portrait of ${esc(p.name)}">`:p.m?portrait(p):alien(p)}</div>${p.badge?`<div class="badge">${esc(p.badge)}</div>`:''}
  <div class="body"><h3>${esc(p.name)}</h3><div class="meta">${esc(p.species)} from ${esc(p.planet)}, ${p.age} cycles</div>
  <div class="tags"><span>🖐 ${p.hands} hands</span><span>👁 ${p.eyes} eyes</span><span>🦵 ${p.legs} legs</span><span>📡 ${p.ant} antennae</span></div>
  <p class="bio">${esc(p.bio)}</p>
  ${s!==null?`<div class="bar" aria-hidden="true"><i style="width:${s}%"></i></div><div class="pct">${s}% match with your wishes</div>`:''}
  <div class="row"><button data-l="${p.id}">🔊 Listen</button><button class="primary" data-i="${p.id}">${matches[p.id]?'💬 Chat & date idea':'Send interest'}</button></div></div></article>`;
}
function listen(id){const p=people.find(x=>x.id===id);
  speak(`${p.name}, ${p.age} cycles old, ${p.species} from ${p.planet}. ${p.hands} hands, ${p.eyes} eyes, ${p.legs} legs. ${p.bio}`)}
async function interest(id){
  const p=people.find(x=>x.id===id);if(!me||!p)return;
  if(p.id===me.id){toast('Self love is great, but pick someone else');return}
  if(matches[id]){location.href='chat.html?with='+id;return}
  toast(`Interest beamed to ${p.name} 💫`);
  try{
    const r=await api('/api/interest',{cosmicId:cid,toId:id,prefs:crit});
    if(!r.match){const t=`${p.name} is only ${r.score}% compatible with your preferences. Adjust them or try someone else.`;toast(t);speak(t);return}
    matches[id]=r.idea;search(false);speak(`It is a match! ${p.name} accepted your interest.`);setTimeout(()=>{location.href='chat.html?with='+id+'&new=1'},1200);
  }catch(e){toast(e.message)}
}

function fillPrefs(){
  const q=me.pref||{};[['fg','g'],['fh','hands'],['fe','eyes'],['fl','legs'],['fa','ant'],['fs','skin']].forEach(([i,k])=>$('#'+i).value=q[k]??'');
  $('#say').value='';$('#mTitle').textContent=`Matches for ${me.name}`;
}

[['h', H], ['e', E], ['l', L], ['a', A], ['s', K]].forEach(([k, o]) => fill('#f' + k, o, 1));
(async () => {
  if (!await loadApp()) return;
  renderNav();
  if (!me.bioDone) { location.replace('bio.html'); return; }
  fillPrefs();
  search(false);
})();

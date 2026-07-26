const T={"ko":{"title":"EZPK 멤버","sortLabel":"정렬","lead":"등급별 닉네임, IND.와 전투력을 확인하세요.","total":"전체 인원","tp":"전체 전투력","avg":"평균 전투력","search":"닉네임 검색","all":"전체 등급","high":"전투력 높은 순","level":"산업 레벨 높은 순","name":"닉네임 순","unregistered":"미등록","member":"명","shelter":"산업 레벨","power":"전투력","empty":"검색 결과가 없습니다.","footer":"함께 싸우고, 함께 승리하자!","updated":"마지막 업데이트","loadError":"멤버 데이터를 불러오지 못했습니다."},"en":{"title":"EZPK MEMBERS","sortLabel":"Sort","lead":"View nicknames, IND. levels, and combat power by rank.","total":"Total Members","tp":"Total Power","avg":"Average Power","search":"Search nickname","all":"All Ranks","high":"Power: High to Low","level":"Industry Level: High to Low","name":"Nickname A–Z","unregistered":"Not Set","member":"Members","shelter":"IND.","power":"CP","empty":"No members found.","footer":"Fight together, win together!","updated":"Last Updated","loadError":"Could not load member data."},"pt":{"title":"MEMBROS EZPK","sortLabel":"Ordenar","lead":"Veja apelidos, IND. e poder de combate por patente.","total":"Total de Membros","tp":"Poder Total","avg":"Poder Médio","search":"Buscar apelido","all":"Todas as Patentes","high":"Maior Poder","level":"Maior Nível Industrial","name":"Apelido A–Z","unregistered":"Not Set","member":"Membros","shelter":"IND.","power":"CP","empty":"Nenhum membro encontrado.","footer":"Lutem juntos, vençam juntos!","updated":"Última atualização","loadError":"Não foi possível carregar os dados."},"vi":{"title":"THÀNH VIÊN EZPK","sortLabel":"Sắp xếp","lead":"Xem biệt danh, IND. và lực chiến theo cấp bậc.","total":"Tổng Thành Viên","tp":"Tổng Lực Chiến","avg":"Lực Chiến Trung Bình","search":"Tìm biệt danh","all":"Tất Cả Cấp Bậc","high":"Lực Chiến Cao → Thấp","level":"Cấp Công Nghiệp Cao → Thấp","name":"Biệt Danh A–Z","unregistered":"Not Set","member":"Thành viên","shelter":"IND.","power":"CP","empty":"Không tìm thấy thành viên.","footer":"Cùng chiến đấu, cùng chiến thắng!","updated":"Cập nhật lần cuối","loadError":"Không thể tải dữ liệu thành viên."},"ar":{"title":"أعضاء EZPK","sortLabel":"الترتيب","lead":"اعرض الأسماء ومستويات IND. والقوة القتالية حسب الرتبة.","total":"إجمالي الأعضاء","tp":"إجمالي القوة","avg":"متوسط القوة","search":"ابحث عن اسم","all":"كل الرتب","high":"القوة: من الأعلى","level":"المستوى الصناعي: من الأعلى","name":"الاسم أ–ي","unregistered":"Not Set","member":"أعضاء","shelter":"IND.","power":"CP","empty":"لم يتم العثور على أعضاء.","footer":"قاتلوا معًا وانتصروا معًا!","updated":"آخر تحديث","loadError":"تعذر تحميل بيانات الأعضاء."},"ja":{"title":"EZPK メンバー","sortLabel":"並び替え","lead":"ランク別のニックネーム、IND.、戦闘力を確認できます。","total":"総メンバー数","tp":"総戦闘力","avg":"平均戦闘力","search":"ニックネーム検索","all":"すべてのランク","high":"戦闘力：高い順","level":"産業レベル：高い順","name":"ニックネーム順","unregistered":"Not Set","member":"名","shelter":"IND.","power":"CP","empty":"メンバーが見つかりません。","footer":"共に戦い、共に勝利しよう！","updated":"最終更新","loadError":"メンバーデータを読み込めませんでした。"},"zh-tw":{"title":"EZPK 成員","sortLabel":"排序","lead":"依階級查看暱稱、IND. 與戰力。","total":"總成員數","tp":"總戰力","avg":"平均戰力","search":"搜尋暱稱","all":"全部階級","high":"戰力：高至低","level":"產業等級：高至低","name":"暱稱 A–Z","unregistered":"Not Set","member":"成員","shelter":"IND.","power":"CP","empty":"找不到成員。","footer":"攜手作戰，共同取勝！","download":"下載 Excel","excelError":"無法載入 Excel 功能。","updated":"最後更新","loadError":"無法載入成員資料。"},"th":{"title":"สมาชิก EZPK","sortLabel":"เรียงลำดับ","lead":"ตรวจสอบชื่อเล่น IND. และพลังรบตามอันดับ","total":"สมาชิกทั้งหมด","tp":"พลังรบรวม","avg":"พลังรบเฉลี่ย","search":"ค้นหาชื่อเล่น","all":"ทุกอันดับ","high":"พลังรบ: สูงไปต่ำ","level":"ระดับอุตสาหกรรม: สูงไปต่ำ","name":"เรียงตามชื่อเล่น","unregistered":"Not Set","member":"คน","shelter":"IND.","power":"CP","empty":"ไม่พบสมาชิก","footer":"สู้ไปด้วยกันและชนะไปด้วยกัน!","updated":"อัปเดตล่าสุด","loadError":"ไม่สามารถโหลดข้อมูลสมาชิกได้"}};
const ROLES={R5:'Leader',R4:'Officer',R3:'Core',R2:'Support',R1:'Reserve'},ORDER={R5:5,R4:4,R3:3,R2:2,R1:1};
let MEMBERS=[],visibleMembers=[];
let lang=localStorage.getItem('ezpk-lang-v5')||'en'; if(!window.EZPK_DATA[lang])lang='en';
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s),fmt=n=>new Intl.NumberFormat('en-US').format(n),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
function ui(){const c=window.EZPK_DATA[lang],t=T[lang];document.documentElement.lang=lang;document.documentElement.dir=c.dir;document.body.classList.toggle('rtl',c.dir==='rtl');$('#flag').textContent=c.flag;$('#lname').textContent=c.name;$$('[data-k]').forEach(e=>{if(c.ui[e.dataset.k]!=null)e.textContent=c.ui[e.dataset.k]});$('#membersTitle').textContent=t.title;$('#membersLead').textContent=t.lead;$('#totalLabel').textContent=t.total;$('#totalPowerLabel').textContent=t.tp;$('#avgPowerLabel').textContent=t.avg;$('#memberSearch').placeholder=t.search;$('#rankFilter').innerHTML=`<option value="ALL">${t.all}</option>${['R5','R4','R3','R2','R1'].map(r=>`<option value="${r}">${r} · ${ROLES[r]}</option>`).join('')}`;$('#mobileSortLabel').textContent=t.sortLabel;$('#sortMembers').innerHTML=`<option value="high">${t.high}</option><option value="level">${t.level}</option><option value="name">${t.name}</option>`;$('#sortMembers').value='high';$('#emptyState').textContent=t.empty;$('#memberFooter').textContent=t.footer;updateSummary();localStorage.setItem('ezpk-lang-v5',lang);render()}
function hasPower(m){return Number.isFinite(m.power)&&m.power>0}
function hasIndustry(m){return Number.isFinite(m.ind)&&m.ind>0}
function updateSummary(){const registered=MEMBERS.filter(hasPower),sum=registered.reduce((a,m)=>a+m.power,0);$('#totalMembers').textContent=MEMBERS.length;$('#totalPower').textContent=fmt(sum);$('#avgPower').textContent=registered.length?fmt(Math.round(sum/registered.length)):'0'}
function compareMissingLast(aValue,bValue,direction='desc'){const aMissing=aValue==null,bMissing=bValue==null;if(aMissing!==bMissing)return aMissing?1:-1;if(aMissing&&bMissing)return 0;return direction==='desc'?bValue-aValue:aValue-bValue}
function render(){const t=T[lang],isMobile=window.matchMedia('(max-width:620px)').matches;if(isMobile){$('#memberSearch').value='';$('#rankFilter').value='ALL';}const q=$('#memberSearch').value.trim().toLocaleLowerCase(),rf=isMobile?'ALL':$('#rankFilter').value,sort=$('#sortMembers').value;let list=MEMBERS.filter(m=>(rf==='ALL'||m.rank===rf)&&m.nickname.toLocaleLowerCase().includes(q));list=[...list].sort((a,b)=>{if(sort==='high')return compareMissingLast(a.power,b.power)||a.nickname.localeCompare(b.nickname);if(sort==='level')return compareMissingLast(a.ind,b.ind)||compareMissingLast(a.power,b.power)||a.nickname.localeCompare(b.nickname);return a.nickname.localeCompare(b.nickname,undefined,{sensitivity:'base'});});visibleMembers=list;const groups=['R5','R4','R3','R2','R1'].map(r=>{const arr=list.filter(m=>m.rank===r);if(!arr.length)return'';return `<section class="rank-group"><button class="rank-head" aria-expanded="true"><div class="rank-title"><span class="rank-badge">${r}</span><div><h2>${ROLES[r]}</h2><small>${r}</small></div></div><div class="rank-count"><strong>${arr.length}</strong><span class="label">${t.member}</span><span class="rank-arrow">⌃</span></div></button><div class="rank-list">${arr.map((m,i)=>`<article class="member-card"><div class="member-index">${String(i+1).padStart(2,'0')}</div><div><h3 class="member-name">${esc(m.nickname)}</h3><div class="member-meta"><span>${t.shelter} <b>${hasIndustry(m)?m.ind:t.unregistered}</b></span><i class="member-meta-divider" aria-hidden="true">/</i><span>${t.power} <b>${hasPower(m)?fmt(m.power):t.unregistered}</b></span></div></div></article>`).join('')}</div></section>`}).join('');$('#memberGroups').innerHTML=groups;$('#emptyState').hidden=!!list.length;$$('.rank-head').forEach(b=>b.onclick=()=>{const g=b.closest('.rank-group'),l=g.querySelector('.rank-list'),open=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',String(!open));l.hidden=open;g.classList.toggle('collapsed',open)})}
function mapApiMember(item){const registered=item?.profileSpecsRegistered!==false&&item?.power!=null&&item?.industryLevel!=null;const industryText=registered?String(item.industryLevel||'').toUpperCase():'';const industryNumber=Number(industryText.replace(/^I/,''));return{rank:String(item?.memberRank||'R1').toUpperCase(),nickname:String(item?.nickname||''),ind:registered&&Number.isFinite(industryNumber)?industryNumber:null,power:registered&&Number.isFinite(Number(item.power))?Number(item.power):null,registered};}
async function fetchMemberPage(page){
  const res=await fetch(`/api/members?page=${page}&limit=100&sort=power_desc`,{
    cache:'no-store',
    credentials:'include',
    headers:{accept:'application/json'}
  });
  if(!res.ok)throw new Error('HTTP '+res.status);
  const payload=await res.json();
  if(!payload?.ok)throw new Error(payload?.code||'MEMBER_API_ERROR');
  return payload.data||{};
}
async function loadMembers(){
  try{
    const first=await fetchMemberPage(1);
    const totalPages=Math.max(1,Number(first.pagination?.totalPages||0));
    let items=Array.isArray(first.items)?[...first.items]:[];
    if(totalPages>1){
      const remaining=await Promise.all(
        Array.from({length:totalPages-1},(_,index)=>fetchMemberPage(index+2))
      );
      remaining.forEach(pageData=>{
        if(Array.isArray(pageData.items))items.push(...pageData.items);
      });
    }
    MEMBERS=items.map(mapApiMember).filter(member=>
      member.nickname&&ORDER[member.rank]
    );
    visibleMembers=[...MEMBERS];
    ui();
  }catch(err){
    console.error(err);
    MEMBERS=[];
    visibleMembers=[];
    updateSummary();
    $('#memberGroups').innerHTML=`<div class="empty-state">${T[lang].loadError}</div>`;
    $('#emptyState').hidden=true;
  }
}
window.addEventListener('ezpk-language-change',e=>{const next=e.detail?.lang||localStorage.getItem('ezpk-lang-v5')||'en';lang=T[next]?next:'en';ui()});$('#memberSearch').oninput=render;$('#rankFilter').onchange=render;$('#sortMembers').onchange=render;window.addEventListener('resize',render);loadMembers();

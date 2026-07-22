(function(){
'use strict';
const game=document.body.dataset.game;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let score=0,start=0,timer=null,nick='',cleanupGame=()=>{},fitCleanup=()=>{},currentLang=(window.EZPKLanguage?.get?.()||localStorage.getItem('ezpk-lang-v5')||'en'),soundOn=!(window.GameAudio?.isMuted?.()||false);

const I18N={
 en:{
  games:{
   'treasure-hunter':['TREASURE HUNTER','Memorize the clues, find the key and treasure, and escape before time runs out.','MOVES','Memorize the briefly revealed items, then uncover the key and treasure before opening the exit.','Build a combo by finding useful tiles quickly. Bombs cost a life.'],
   'zombie-defense':['ZOMBIE DEFENSE','Destroy the incoming zombies before they break through.','WAVE','Tap every zombie before it crosses the defense line. Fast and armored zombies appear as waves rise.','Fast kills build your combo and multiplier.'],
   'portal-escape':['PORTAL ESCAPE','Read the maze quickly and reach as many portals as possible.','LEVEL','Move one tile at a time through the open route. Each portal creates a harder maze.','Fewer moves and faster clears earn more points.'],
   'hero-merge':['HERO MERGE','Chain merges immediately and build the highest hero tier.','SCORE','Swipe the board or use the direction buttons. Matching heroes merge into the next tier.','Consecutive merges increase the combo multiplier.']},
  ui:{eyebrow:'EZPK MINI GAME · MONTHLY RANKING',available:'AVAILABLE NOW',play:'PLAY',current:'CURRENT GAME',time:'TIME',nickname:'Game nickname',enter:'Enter your nickname and challenge the monthly TOP 30.',start:'GAME START',complete:'MISSION COMPLETE',retry:'TRY AGAIN',ranking:'VIEW RANKING',loading:'Loading ranking...',empty:'No scores yet.',rankTitle:'Monthly {game} Ranking',rankNote:'A new ranking starts on the first day of each month. Only each nickname’s best score is shown.',needNick:'Enter a nickname.',escaped:'Escaped level {level} in {moves} moves.',bomb:'Bomb! {life} lives left.',defense:'Defense broke at wave {wave}.',noMoves:'No more moves.',timeUp:'Time is up.',goal:'TARGET TIER {tier}',combo:'COMBO ×{combo}',life:'LIFE {life}',wave:'WAVE {wave} · {kills}/{need} · LIFE {life}',level:'LEVEL {level}',moves:'MOVES {moves}',score:'SCORE',sound:'Sound'},
  library:[['SURVIVAL','Missiles, shells and drones. Survive as long as possible.','🛡','game'],['TANK BATTLE','Destroy enemy tanks and clear waves.','💥','tank-battle'],['MISSILE DEFENSE','Defend the base from incoming missiles.','🚀','missile-defense'],['DRONE HUNTER','Destroy drones and build a hit streak.','🎯','drone-hunter']]
 },
 ko:{
  games:{
   'treasure-hunter':['보물 사냥','단서를 기억하고 열쇠와 보물을 찾아 제한 시간 안에 탈출하세요.','이동','잠깐 공개되는 위치를 기억한 뒤 열쇠와 보물을 찾고 출구를 여세요.','유용한 타일을 빠르게 찾으면 콤보가 오릅니다. 폭탄은 생명을 잃습니다.'],
   'zombie-defense':['좀비 방어','방어선을 뚫기 전에 몰려오는 좀비를 제거하세요.','웨이브','좀비가 방어선을 넘기 전에 빠르게 터치하세요. 웨이브가 오르면 빠른 좀비와 장갑 좀비가 등장합니다.','빠른 연속 처치로 콤보와 배수를 올리세요.'],
   'portal-escape':['포탈 탈출','미로를 빠르게 판단하고 최대한 많은 포탈에 도달하세요.','레벨','한 칸씩 이동해 열린 길을 따라가세요. 포탈에 도착할 때마다 더 어려운 미로가 생성됩니다.','적은 이동과 빠른 클리어일수록 높은 점수를 얻습니다.'],
   'hero-merge':['영웅 합성','시작 즉시 연쇄 합성을 만들고 최고 등급 영웅에 도전하세요.','점수','보드를 스와이프하거나 방향 버튼을 사용하세요. 같은 영웅끼리 합쳐 다음 등급이 됩니다.','연속 합성할수록 콤보 배수가 올라갑니다.']},
  ui:{eyebrow:'EZPK 미니게임 · 월간 랭킹',available:'지금 플레이 가능',play:'플레이',current:'현재 게임',time:'시간',nickname:'게임 닉네임',enter:'닉네임을 입력하고 월간 TOP 30에 도전하세요.',start:'게임 시작',complete:'미션 완료',retry:'다시 도전',ranking:'순위 보기',loading:'랭킹 불러오는 중...',empty:'아직 등록된 점수가 없습니다.',rankTitle:'월간 {game} 랭킹',rankNote:'매월 1일 새로운 랭킹이 시작되며 닉네임별 최고 점수만 표시됩니다.',needNick:'닉네임을 입력하세요.',escaped:'레벨 {level}을 {moves}번 이동으로 탈출했습니다.',bomb:'폭탄! 남은 생명 {life}',defense:'웨이브 {wave}에서 방어선이 무너졌습니다.',noMoves:'더 이상 이동할 수 없습니다.',timeUp:'시간이 종료되었습니다.',goal:'목표 등급 {tier}',combo:'콤보 ×{combo}',life:'생명 {life}',wave:'웨이브 {wave} · {kills}/{need} · 생명 {life}',level:'레벨 {level}',moves:'이동 {moves}',score:'점수',sound:'사운드'},
  library:[['서바이벌','미사일과 포탄, 드론을 피하며 최대한 오래 생존하세요.','🛡','game'],['탱크 배틀','적 전차를 파괴하고 웨이브를 돌파하세요.','💥','tank-battle'],['미사일 방어','날아오는 미사일로부터 기지를 방어하세요.','🚀','missile-defense'],['드론 헌터','드론을 파괴하고 연속 명중을 이어가세요.','🎯','drone-hunter']]
 },
 ja:{games:{'treasure-hunter':['トレジャーハンター','手掛かりを覚え、鍵と宝を見つけて時間内に脱出しよう。','手数','短時間表示される位置を覚え、鍵と宝を見つけて出口を開こう。','素早く見つけるとコンボ。爆弾でライフを失います。'],'zombie-defense':['ゾンビディフェンス','防衛線を突破される前にゾンビを倒そう。','ウェーブ','ゾンビが防衛線を越える前にタップ。高速・装甲ゾンビも登場します。','素早い連続撃破で倍率アップ。'],'portal-escape':['ポータルエスケープ','迷路を素早く読み、できるだけ多くのポータルへ到達しよう。','レベル','開いた道を一マスずつ進みます。クリアごとに難しくなります。','少ない手数と短時間で高得点。'],'hero-merge':['ヒーローマージ','開始直後から連鎖合成し、最高ランクを目指そう。','スコア','スワイプまたは方向ボタンで同じ英雄を合成します。','連続合成でコンボ倍率が上がります。']},ui:{eyebrow:'EZPK ミニゲーム · 月間ランキング',available:'プレイ可能',play:'プレイ',current:'現在のゲーム',time:'時間',nickname:'ゲームニックネーム',enter:'ニックネームを入力して月間TOP30に挑戦。',start:'ゲーム開始',complete:'ミッション完了',retry:'もう一度',ranking:'ランキング',loading:'ランキング読込中...',empty:'まだスコアがありません。',rankTitle:'月間 {game} ランキング',rankNote:'毎月1日に更新され、各ニックネームの最高得点のみ表示されます。',needNick:'ニックネームを入力してください。',escaped:'レベル{level}を{moves}手で脱出。',bomb:'爆弾！残りライフ {life}',defense:'ウェーブ{wave}で防衛失敗。',noMoves:'動かせません。',timeUp:'時間切れです。',goal:'目標ランク {tier}',combo:'コンボ ×{combo}',life:'ライフ {life}',wave:'ウェーブ {wave} · {kills}/{need} · ライフ {life}',level:'レベル {level}',moves:'手数 {moves}',score:'スコア',sound:'サウンド'},library:[['サバイバル','攻撃を避けて長く生き残ろう。','🛡','game'],['タンクバトル','敵戦車を破壊しよう。','💥','tank-battle'],['ミサイル防衛','基地をミサイルから守ろう。','🚀','missile-defense'],['ドローンハンター','ドローンを連続撃破しよう。','🎯','drone-hunter']]},
 vi:{games:{'treasure-hunter':['SĂN KHO BÁU','Ghi nhớ manh mối, tìm chìa khóa và kho báu rồi thoát trước khi hết giờ.','LƯỢT','Ghi nhớ vị trí được hé lộ rồi tìm chìa khóa, kho báu và cửa ra.','Tìm nhanh để tăng combo. Bom làm mất mạng.'],'zombie-defense':['PHÒNG THỦ ZOMBIE','Tiêu diệt zombie trước khi chúng vượt tuyến phòng thủ.','ĐỢT','Chạm zombie trước khi chúng vượt tuyến. Zombie nhanh và bọc giáp sẽ xuất hiện.','Hạ nhanh liên tiếp để tăng combo.'],'portal-escape':['THOÁT QUA CỔNG','Đọc mê cung nhanh và tới nhiều cổng nhất có thể.','CẤP','Di chuyển từng ô theo đường mở. Mỗi cổng tạo mê cung khó hơn.','Ít bước và nhanh hơn sẽ được nhiều điểm.'],'hero-merge':['HỢP NHẤT ANH HÙNG','Tạo chuỗi hợp nhất ngay lập tức và đạt cấp cao nhất.','ĐIỂM','Vuốt hoặc dùng nút hướng để hợp nhất anh hùng giống nhau.','Hợp nhất liên tiếp tăng hệ số combo.']},ui:{eyebrow:'EZPK MINI GAME · XẾP HẠNG THÁNG',available:'CHƠI NGAY',play:'CHƠI',current:'TRÒ HIỆN TẠI',time:'THỜI GIAN',nickname:'Tên trong game',enter:'Nhập tên và thử thách TOP 30 tháng.',start:'BẮT ĐẦU',complete:'HOÀN THÀNH',retry:'CHƠI LẠI',ranking:'XEM XẾP HẠNG',loading:'Đang tải...',empty:'Chưa có điểm.',rankTitle:'Xếp hạng {game} tháng',rankNote:'Bảng xếp hạng làm mới ngày đầu tháng và chỉ hiển thị điểm cao nhất.',needNick:'Hãy nhập tên.',escaped:'Thoát cấp {level} trong {moves} bước.',bomb:'Bom! Còn {life} mạng.',defense:'Thất thủ ở đợt {wave}.',noMoves:'Không còn nước đi.',timeUp:'Hết giờ.',goal:'MỤC TIÊU {tier}',combo:'COMBO ×{combo}',life:'MẠNG {life}',wave:'ĐỢT {wave} · {kills}/{need} · MẠNG {life}',level:'CẤP {level}',moves:'LƯỢT {moves}',score:'ĐIỂM',sound:'Âm thanh'},library:[['SURVIVAL','Sống sót trước mọi đợt tấn công.','🛡','game'],['TANK BATTLE','Phá hủy xe tăng địch.','💥','tank-battle'],['MISSILE DEFENSE','Bảo vệ căn cứ khỏi tên lửa.','🚀','missile-defense'],['DRONE HUNTER','Hạ drone và duy trì combo.','🎯','drone-hunter']]},
 th:{games:{'treasure-hunter':['นักล่าสมบัติ','จำเบาะแส ค้นหากุญแจและสมบัติ แล้วหนีก่อนหมดเวลา','จำนวนครั้ง','จำตำแหน่งที่เปิดให้ดูชั่วครู่ แล้วค้นหากุญแจ สมบัติ และทางออก','ค้นหาเร็วเพื่อเพิ่มคอมโบ ระเบิดทำให้เสียชีวิต'],'zombie-defense':['ป้องกันซอมบี้','กำจัดซอมบี้ก่อนพวกมันข้ามแนวป้องกัน','เวฟ','แตะซอมบี้ก่อนข้ามแนว ซอมบี้เร็วและเกราะจะปรากฏในเวฟสูง','กำจัดต่อเนื่องอย่างรวดเร็วเพื่อเพิ่มตัวคูณ'],'portal-escape':['หลบหนีผ่านพอร์ทัล','อ่านเขาวงกตให้เร็วและไปถึงพอร์ทัลให้มากที่สุด','เลเวล','เดินทีละช่องตามเส้นทางเปิด แต่ละพอร์ทัลจะสร้างด่านที่ยากขึ้น','ใช้จำนวนครั้งน้อยและเวลาเร็วเพื่อคะแนนสูง'],'hero-merge':['รวมฮีโร่','สร้างการรวมต่อเนื่องทันทีและไปถึงระดับสูงสุด','คะแนน','ปัดหรือใช้ปุ่มทิศทางเพื่อรวมฮีโร่ที่เหมือนกัน','การรวมต่อเนื่องเพิ่มตัวคูณคอมโบ']},ui:{eyebrow:'EZPK มินิเกม · อันดับรายเดือน',available:'เล่นได้แล้ว',play:'เล่น',current:'เกมปัจจุบัน',time:'เวลา',nickname:'ชื่อในเกม',enter:'ใส่ชื่อและท้าทาย TOP 30 รายเดือน',start:'เริ่มเกม',complete:'ภารกิจสำเร็จ',retry:'เล่นอีกครั้ง',ranking:'ดูอันดับ',loading:'กำลังโหลดอันดับ...',empty:'ยังไม่มีคะแนน',rankTitle:'อันดับ {game} รายเดือน',rankNote:'อันดับเริ่มใหม่ทุกวันที่ 1 และแสดงคะแนนสูงสุดของแต่ละชื่อ',needNick:'กรุณาใส่ชื่อ',escaped:'ผ่านเลเวล {level} ใน {moves} ครั้ง',bomb:'ระเบิด! เหลือ {life} ชีวิต',defense:'แนวป้องกันแตกที่เวฟ {wave}',noMoves:'ไม่มีการเคลื่อนไหวแล้ว',timeUp:'หมดเวลา',goal:'เป้าหมาย {tier}',combo:'คอมโบ ×{combo}',life:'ชีวิต {life}',wave:'เวฟ {wave} · {kills}/{need} · ชีวิต {life}',level:'เลเวล {level}',moves:'ครั้ง {moves}',score:'คะแนน',sound:'เสียง'},library:[['SURVIVAL','เอาชีวิตรอดให้นานที่สุด','🛡','game'],['TANK BATTLE','ทำลายรถถังศัตรู','💥','tank-battle'],['MISSILE DEFENSE','ป้องกันฐานจากขีปนาวุธ','🚀','missile-defense'],['DRONE HUNTER','ทำลายโดรนและรักษาคอมโบ','🎯','drone-hunter']]},
 ar:{games:{'treasure-hunter':['صائد الكنوز','احفظ الأدلة واعثر على المفتاح والكنز واهرب قبل انتهاء الوقت.','الحركات','احفظ المواقع التي تظهر سريعًا ثم ابحث عن المفتاح والكنز والمخرج.','العثور السريع يزيد الكومبو، والقنبلة تقلل الحياة.'],'zombie-defense':['دفاع الزومبي','اقضِ على الزومبي قبل عبور خط الدفاع.','الموجة','المس الزومبي قبل عبور الخط. ستظهر أنواع سريعة ومدرعة.','القتل السريع المتتالي يزيد المضاعف.'],'portal-escape':['الهروب عبر البوابة','اقرأ المتاهة بسرعة واصل إلى أكبر عدد من البوابات.','المستوى','تحرك مربعًا واحدًا عبر الطريق المفتوح. كل بوابة تنشئ متاهة أصعب.','حركات أقل ووقت أسرع يمنحان نقاطًا أعلى.'],'hero-merge':['دمج الأبطال','اصنع سلسلة دمج فورًا واصل إلى أعلى رتبة.','النقاط','اسحب اللوحة أو استخدم أزرار الاتجاه لدمج الأبطال المتشابهين.','الدمج المتتالي يزيد مضاعف الكومبو.']},ui:{eyebrow:'ألعاب EZPK · الترتيب الشهري',available:'متاح الآن',play:'العب',current:'اللعبة الحالية',time:'الوقت',nickname:'اسم اللاعب',enter:'أدخل اسمك وتحدَّ أفضل 30 لاعبًا شهريًا.',start:'ابدأ اللعبة',complete:'اكتملت المهمة',retry:'حاول مجددًا',ranking:'عرض الترتيب',loading:'جارٍ تحميل الترتيب...',empty:'لا توجد نقاط بعد.',rankTitle:'ترتيب {game} الشهري',rankNote:'يبدأ ترتيب جديد في أول كل شهر ويظهر أفضل رصيد لكل اسم فقط.',needNick:'أدخل اسم اللاعب.',escaped:'تم اجتياز المستوى {level} في {moves} حركة.',bomb:'قنبلة! الحياة المتبقية {life}',defense:'انهار الدفاع في الموجة {wave}.',noMoves:'لا توجد حركات.',timeUp:'انتهى الوقت.',goal:'الهدف {tier}',combo:'كومبو ×{combo}',life:'الحياة {life}',wave:'الموجة {wave} · {kills}/{need} · الحياة {life}',level:'المستوى {level}',moves:'الحركات {moves}',score:'النقاط',sound:'الصوت'},library:[['البقاء','اصمد لأطول وقت ممكن.','🛡','game'],['معركة الدبابات','دمر دبابات العدو.','💥','tank-battle'],['دفاع الصواريخ','احمِ القاعدة من الصواريخ.','🚀','missile-defense'],['صائد الدرون','دمر الطائرات وحافظ على الكومبو.','🎯','drone-hunter']]},
 'zh-tw':{games:{'treasure-hunter':['寶藏獵人','記住線索，找到鑰匙和寶藏並在時間內逃脫。','步數','記住短暫顯示的位置，找到鑰匙、寶藏和出口。','快速找到有效格可累積連擊，炸彈會扣除生命。'],'zombie-defense':['殭屍防禦','在殭屍突破防線前消滅它們。','波次','在殭屍越過防線前點擊。高波次會出現快速和裝甲殭屍。','快速連續擊殺可提高倍率。'],'portal-escape':['傳送門逃脫','快速判斷迷宮並抵達更多傳送門。','等級','沿開放路線逐格移動，每次抵達都會產生更難的迷宮。','步數越少、速度越快，得分越高。'],'hero-merge':['英雄合成','立即製造連鎖合成，挑戰最高英雄等級。','分數','滑動棋盤或使用方向鍵，合併相同英雄。','連續合成會提高連擊倍率。']},ui:{eyebrow:'EZPK 小遊戲 · 每月排名',available:'立即可玩',play:'開始',current:'目前遊戲',time:'時間',nickname:'遊戲暱稱',enter:'輸入暱稱，挑戰每月 TOP 30。',start:'開始遊戲',complete:'任務完成',retry:'再次挑戰',ranking:'查看排名',loading:'載入排名中...',empty:'目前沒有分數。',rankTitle:'每月 {game} 排名',rankNote:'每月 1 日重新開始，只顯示每個暱稱的最高分。',needNick:'請輸入暱稱。',escaped:'第 {level} 關以 {moves} 步完成。',bomb:'炸彈！剩餘生命 {life}',defense:'防線在第 {wave} 波被突破。',noMoves:'無法繼續移動。',timeUp:'時間結束。',goal:'目標等級 {tier}',combo:'連擊 ×{combo}',life:'生命 {life}',wave:'波次 {wave} · {kills}/{need} · 生命 {life}',level:'等級 {level}',moves:'步數 {moves}',score:'分數',sound:'聲音'},library:[['生存','躲避攻擊並盡可能生存。','🛡','game'],['坦克戰','摧毀敵方坦克。','💥','tank-battle'],['飛彈防禦','保護基地免受飛彈攻擊。','🚀','missile-defense'],['無人機獵人','摧毀無人機並保持連擊。','🎯','drone-hunter']]},
 pt:{games:{'treasure-hunter':['CAÇADOR DE TESOUROS','Memorize as pistas, encontre a chave e o tesouro e escape antes que o tempo acabe.','MOVIMENTOS','Memorize as posições reveladas por alguns instantes, encontre a chave, o tesouro e depois abra a saída.','Encontre casas úteis rapidamente para aumentar o combo. Bombas retiram uma vida.'],'zombie-defense':['DEFESA ZUMBI','Elimine os zumbis antes que atravessem a linha de defesa.','ONDA','Toque em cada zumbi antes que ele atravesse a defesa. Zumbis rápidos e blindados aparecem nas ondas mais altas.','Eliminações rápidas e consecutivas aumentam o combo e o multiplicador.'],'portal-escape':['FUGA PELO PORTAL','Leia o labirinto rapidamente e alcance o maior número possível de portais.','NÍVEL','Mova-se uma casa por vez pelas rotas abertas. Cada portal cria um labirinto mais difícil.','Menos movimentos e conclusões mais rápidas rendem mais pontos.'],'hero-merge':['FUSÃO DE HERÓIS','Crie fusões em cadeia desde o início e alcance o nível de herói mais alto.','PONTOS','Deslize o tabuleiro ou use os botões de direção. Heróis iguais se unem no próximo nível.','Fusões consecutivas aumentam o multiplicador de combo.']},ui:{eyebrow:'MINIJOGO EZPK · RANKING MENSAL',available:'DISPONÍVEL AGORA',play:'JOGAR',current:'JOGO ATUAL',time:'TEMPO',nickname:'Apelido no jogo',enter:'Digite seu apelido e dispute o TOP 30 mensal.',start:'INICIAR JOGO',complete:'MISSÃO CONCLUÍDA',retry:'TENTAR NOVAMENTE',ranking:'VER RANKING',loading:'Carregando ranking...',empty:'Ainda não há pontuações.',rankTitle:'Ranking Mensal de {game}',rankNote:'Um novo ranking começa no primeiro dia de cada mês. Apenas a melhor pontuação de cada apelido é exibida.',needNick:'Digite um apelido.',escaped:'Nível {level} concluído em {moves} movimentos.',bomb:'Bomba! Restam {life} vidas.',defense:'A defesa caiu na onda {wave}.',noMoves:'Não há mais movimentos.',timeUp:'O tempo acabou.',goal:'NÍVEL-ALVO {tier}',combo:'COMBO ×{combo}',life:'VIDAS {life}',wave:'ONDA {wave} · {kills}/{need} · VIDAS {life}',level:'NÍVEL {level}',moves:'MOVIMENTOS {moves}',score:'PONTOS',sound:'Som'},library:[['SOBREVIVÊNCIA','Desvie dos ataques e sobreviva o máximo possível.','🛡','game'],['BATALHA DE TANQUES','Destrua tanques inimigos e supere as ondas.','💥','tank-battle'],['DEFESA DE MÍSSEIS','Proteja a base contra os mísseis.','🚀','missile-defense'],['CAÇADOR DE DRONES','Destrua drones e mantenha a sequência de acertos.','🎯','drone-hunter']]},
};
I18N.pt=I18N.en;
function normalizeLang(lang){return I18N[lang]?lang:'en'}
function t(){return I18N[normalizeLang(currentLang)]||I18N.en}
function fmt(s,v={}){return String(s).replace(/\{(\w+)\}/g,(_,k)=>v[k]??'')}
function gameText(){return t().games[game]||I18N.en.games[game]}
function rankingCheckedCopy(){return ({
 en:['Ranking checked. Ready for another challenge?','PLAY AGAIN'],
 ko:['순위를 확인했습니다. 다시 도전해 보세요.','다시 시작'],
 pt:['Ranking verificado. Pronto para tentar novamente?','JOGAR NOVAMENTE'],
 vi:['Đã xem bảng xếp hạng. Sẵn sàng thử lại?','CHƠI LẠI'],
 ar:['تم عرض الترتيب. هل أنت مستعد للمحاولة مجددًا؟','العب مجددًا'],
 ja:['ランキングを確認しました。もう一度挑戦しましょう。','もう一度プレイ'],
 th:['ตรวจสอบอันดับแล้ว พร้อมท้าทายอีกครั้งไหม?','เล่นอีกครั้ง'],
 'zh-tw':['已查看排行榜。準備再次挑戰嗎？','再玩一次']
 }[currentLang]||['Ranking checked. Ready for another challenge?','PLAY AGAIN']);}
function hideOverlay148(el){if(!el)return;el.hidden=true;el.setAttribute('hidden','');el.style.display='none';el.style.pointerEvents='none'}
function showOverlay148(el){if(!el)return;el.hidden=false;el.removeAttribute('hidden');el.style.removeProperty('display');el.style.removeProperty('pointer-events')}
function applyLanguage(lang=currentLang){currentLang=I18N[lang]?lang:'en';const g=gameText(),u=t().ui;document.documentElement.lang=currentLang;document.documentElement.dir=currentLang==='ar'?'rtl':'ltr';document.body.classList.toggle('rtl',currentLang==='ar');$('#gameTitle').textContent=g[0];$('#gameLead').textContent=g[1];$('#mobileInfoTitle').textContent=g[0];$('#mobileInfoText').textContent=g[3];$('#mobileInfoControl').textContent=g[4];$('.mini-game-hero .eyebrow').textContent=u.eyebrow;$('#timeLabel').textContent=u.time;if($('#startTitle'))$('#startTitle').textContent=g[0];if($('#startText'))$('#startText').textContent=g[3];if($('#nicknameLabel'))$('#nicknameLabel').textContent=u.nickname;$('#nickname').placeholder=u.nickname;if($('#controlHelp'))$('#controlHelp').textContent=g[4];$('#startBtn').textContent=u.start;$('#resultTitle').textContent=u.complete;$('#retryBtn').textContent=u.retry;$('#rankingBtn').textContent=u.ranking;const checked=rankingCheckedCopy();if($('#rankingCheckedText'))$('#rankingCheckedText').textContent=checked[0];if($('#replayBtn'))$('#replayBtn').textContent=checked[1];$('#soundBtn').setAttribute('aria-label',u.sound);if(!start)$('#scoreLabel').textContent=g[2];const mergeStatus=$('#mergeStatus');if(mergeStatus&&!mergeStatus.hidden&&mergeStatus.dataset.tier){mergeStatus.textContent=`${fmt(u.goal,{tier:mergeStatus.dataset.tier})} · ${fmt(u.combo,{combo:mergeStatus.dataset.combo||0})}`;}renderBaseLibrary();window.EZPKGameResultFlow?.syncCommonModalLanguage?.(currentLang);loadRanking();}
function renderBaseLibrary(){const root=$('#gameLibrary');if(!root)return;root.innerHTML='';t().library.forEach(([title,desc,icon,slug])=>{const a=document.createElement('article');a.className='game-choice active-game';a.innerHTML=`<div class="game-choice-icon">${icon}</div><div><span>${t().ui.available}</span><h2>${title}</h2><p>${desc}</p></div><a href="../${slug}/#gameShell">${t().ui.play}</a>`;root.appendChild(a)});window.dispatchEvent(new CustomEvent('ezpk-render-extra-games',{detail:{lang:currentLang}}));}

// v165: all four new games use the shared ranking service.
// The service reads EZPK_SUPABASE_CONFIG.publishableKey first and stores each
// score under the page's data-game value: treasure-hunter, zombie-defense,
// portal-escape, or hero-merge.
const rankingService=window.EZPKGameRanking?.create({gameId:game,localPrefix:`ezpk-ranking-${game}-`});
async function submit(){
 if(!rankingService){console.error(`[${game}] Shared ranking service is unavailable.`);return {remote:false}}
 const result=await rankingService.submit(nick,score);
 if(!result.remote&&result.error)console.error(`[${game}] Score was saved locally only.`,result.error);
 await loadRanking();
 return result;
}
function best(rows){return rankingService.bestRows(rows)}
async function loadRanking(){if(!window.EZPKRankingPanel||!rankingService)return;const status=$('#rankingStatus');if(status)status.textContent=t().ui.loading;const result=await rankingService.load(),rows=result.rows;window.EZPKRankingPanel.renderRows(rows);if(status)status.textContent=rows.length?'':t().ui.empty;const title=$('#rankingTitle'),note=$('#rankingNote'),month=$('#monthChip');if(title)title.textContent=fmt(t().ui.rankTitle,{game:gameText()[0]});if(note)note.textContent=t().ui.rankNote;if(month)month.textContent=result.monthKey;return result}
function update(){ $('#scoreValue').textContent=Math.max(0,Math.round(score)).toLocaleString(); if(start)$('#timeValue').textContent=((Date.now()-start)/1000).toFixed(1)+'s'}
function resetRuntime(){cleanupGame();cleanupGame=()=>{};fitCleanup();fitCleanup=()=>{};clearInterval(timer);timer=null}
function begin(){nick=$('#nickname').value.trim();if(!nick)return alert(t().ui.needNick);resetRuntime();window.EZPKGameViewport?.setPlaying(true);localStorage.setItem('ezpk-game-nickname',nick);score=0;start=Date.now();window.GameAudio?.play('start');$('#scoreLabel').textContent=gameText()[2];hideOverlay148($('#startOverlay'));hideOverlay148($('#resultOverlay'));hideOverlay148($('#postRankingOverlay'));timer=setInterval(update,100);build();update()}
async function finish(msg){if(!start)return;const endedAt=start;if(game==='zombie-defense')score=Math.round(score);resetRuntime();start=0;window.EZPKGameViewport?.setPlaying(false);$('#finalScore').textContent=Math.max(0,Math.round(score)).toLocaleString();$('#resultText').textContent=msg;window.GameAudio?.play('gameOver');showOverlay148($('#resultOverlay'));await submit();return endedAt}
function makeGrid(size,extra=''){const stage=$('#stage');stage.innerHTML=`<div class="newgame-grid ${extra}" style="--grid-size:${size}"></div>`;const grid=stage.firstElementChild;const fit=()=>{const usableW=stage.clientWidth-16,usableH=stage.clientHeight-16;const board=Math.max(150,Math.floor(Math.min(usableW,usableH,620)));grid.style.setProperty('--board-size',board+'px')};fit();const ro=new ResizeObserver(fit);ro.observe(stage);fitCleanup=()=>ro.disconnect();return grid}
function popup(text,kind=''){const el=document.createElement('div');el.className='game-pop '+kind;el.textContent=text;$('#stage').appendChild(el);setTimeout(()=>el.remove(),650)}

function treasure(){
 const size=6,total=size*size,g=makeGrid(size,'treasure-grid');let level=1,lives=3,moves=0,combo=0,ended=false,roundLocked=false,roundStart=Date.now(),roundTimer=null;
 function newRound(){if(ended)return;roundLocked=true;g.innerHTML='';
  const difficultyBoost=level<10?0:level<15?.10:level<20?.20:.30;
  const baseBombCount=Math.min(11,3+Math.floor(level*1.2));
  const bombCount=Math.min(15,baseBombCount+Math.round(baseBombCount*difficultyBoost));
  const minDistance=level<10?0:level<15?4:level<20?5:6;
  const treasureCount=1+Math.floor(level/5);
  const distance=(a,b)=>Math.abs(a%size-b%size)+Math.abs(Math.floor(a/size)-Math.floor(b/size));
  const all=[...Array(total).keys()];
  const randomFrom=list=>list[Math.floor(Math.random()*list.length)];
  const key=randomFrom(all);
  const treasures=[];
  while(treasures.length<treasureCount){
   const candidates=all.filter(i=>i!==key&&!treasures.includes(i)&&(minDistance===0||[key,...treasures].every(x=>distance(i,x)>=minDistance)));
   const fallback=all.filter(i=>i!==key&&!treasures.includes(i));
   treasures.push(randomFrom(candidates.length?candidates:fallback));
  }
  const treasureSet=new Set(treasures);
  const exitCandidates=all.filter(i=>i!==key&&!treasureSet.has(i)&&(minDistance===0||[key,...treasures].every(x=>distance(i,x)>=minDistance)));
  const exit=randomFrom(exitCandidates.length?exitCandidates:all.filter(i=>i!==key&&!treasureSet.has(i)));
  const slots=all.filter(i=>i!==key&&!treasureSet.has(i)&&i!==exit),take=()=>slots.splice(Math.floor(Math.random()*slots.length),1)[0];
  const bombs=new Set(Array.from({length:Math.min(bombCount,slots.length)},take));let gotK=false,treasuresFound=0,foundExit=false,roundMoves=0;roundStart=Date.now();const clearRound=()=>{if(roundLocked||!gotK||treasuresFound<treasureCount||!foundExit)return;roundLocked=true;const bonus=Math.max(100,900-roundMoves*45);score+=bonus;window.GameAudio?.play('success');popup('+'+bonus,'good');level++;setTimeout(newRound,350)};
  for(let i=0;i<total;i++){const b=document.createElement('button');b.type='button';b.className='newgame-cell';b.textContent=i===key?'🗝':treasureSet.has(i)?'💰':i===exit?'🚪':bombs.has(i)?'💣':'·';g.appendChild(b)}
  $('#scoreLabel').textContent=`${fmt(t().ui.level,{level})} · 💰 ${treasuresFound}/${treasureCount} · ${fmt(t().ui.life,{life:lives})}`;
  setTimeout(()=>{if(ended)return;[...g.children].forEach(b=>{b.textContent='?';b.classList.add('ready')});roundLocked=false},900);
  [...g.children].forEach((b,i)=>b.addEventListener('click',()=>{if(ended||roundLocked||b.classList.contains('revealed'))return;b.classList.add('revealed');moves++;roundMoves++;let symbol='·',good=false;if(i===key){symbol='🗝';gotK=true;good=true}else if(treasureSet.has(i)){symbol='💰';treasuresFound++;good=true}else if(i===exit){symbol='🚪';foundExit=true;good=gotK&&treasuresFound>=treasureCount}else if(bombs.has(i)){symbol='💣';lives--;combo=0;window.GameAudio?.play('damage');popup(fmt(t().ui.bomb,{life:lives}),'danger');if(lives<=0){ended=true;finish(t().ui.timeUp);return}}b.textContent=symbol;if(good){combo++;const speed=Math.max(1,Math.round(12-(Date.now()-roundStart)/1000));score+=80*combo+speed*15;window.GameAudio?.play(combo>=3?'combo':'item');popup(fmt(t().ui.combo,{combo}),'good')}else if(!bombs.has(i)&&i!==exit)combo=0;
    $('#scoreLabel').textContent=`${fmt(t().ui.level,{level})} · 💰 ${treasuresFound}/${treasureCount} · ${fmt(t().ui.life,{life:lives})}`;update();clearRound();
  }))
 }
 roundTimer=setTimeout(()=>{ended=true;finish(t().ui.timeUp)},60000);newRound();cleanupGame=()=>{ended=true;clearTimeout(roundTimer)};
}

function zombies(){
 const stage=$('#stage');stage.innerHTML='<div class="zombie-field"><div class="zombie-darkness"></div><div class="defense-line"></div></div>';const field=stage.firstElementChild;
 let wave=1,waveKills=0,totalKills=0,openingKills=0,barricade=100,combo=0,ended=false,spawnTimer=null,secondTimer=null,finishTimer=null,lastWave=1,activeBomb=null,bonusBombs=0;const movers=new Set(),bombTimers=[];
 const elapsed=()=>start?(Date.now()-start)/1000:0;
 const waveAt=()=>Math.min(6,Math.floor(elapsed()/10)+1);
 const waveBonuses=[0,1200,1600,1900,2200,2500,2600];
 const spawnDelay=()=>{const e=elapsed();if(e<5)return 820;if(e<15)return 700;if(e<30)return 590;if(e<45)return 485;return 350};
 const maxActive=()=>{const e=elapsed();return e<5?5:e<15?7:e<30?9:e<45?11:15};
 function updateHud(){
  const hp=Math.max(0,Math.round(barricade));
  $('#scoreLabel').textContent=`WAVE ${wave}/6 · KILLS ${totalKills} · HP ${hp}%`;
 }
 function removeMover(e){clearInterval(e.id);movers.delete(e);e.el.remove()}
 function completeWave(nextWave){
  if(nextWave<=lastWave)return;for(let w=lastWave;w<nextWave;w++){score+=waveBonuses[w]||0;window.GameAudio?.play('success')}
  lastWave=nextWave;wave=nextWave;waveKills=0;field.classList.add('wave-change');setTimeout(()=>field.classList.remove('wave-change'),320);updateHud();
 }
 function damage(amount,type){
  barricade=Math.max(0,barricade-amount);combo=0;window.GameAudio?.play('damage');popup((type==='poison'?'TOXIC HIT ':'BARRICADE -')+amount+'%','danger');updateHud();
  if(barricade<=0&&!ended){ended=true;cleanup();finish(`BARRICADE DESTROYED · WAVE ${wave}`)}
 }
 function chooseType(){
  const e=elapsed(),r=Math.random();
  if(e>=30&&r<Math.min(.16,.05+(e-30)*.004))return 'giant';
  if(e>=20&&r<.31)return 'poison';
  if(e>=12&&r<.52)return 'runner';
  return 'normal';
 }
 function bombPosition(){
  for(let attempt=0;attempt<12;attempt++){
   const x=10+Math.random()*80,y=18+Math.random()*48;
   const safe=[...movers].every(e=>{const ex=parseFloat(e.el.style.left)||50,ey=parseFloat(e.el.style.top)||0;return Math.hypot(ex-x,ey-y)>15});
   if(safe)return {x,y};
  }
  return {x:50,y:38};
 }
 function removeBomb(){if(!activeBomb)return;clearTimeout(activeBomb.expire);activeBomb.el.remove();activeBomb=null}
 function bombBonus(kills){return kills>=10?2000:kills>=7?1200:kills>=4?500:0}
 function detonateBomb(){
  if(ended||!activeBomb||activeBomb.locked)return;
  const bomb=activeBomb;activeBomb=null;clearTimeout(bomb.expire);bomb.el.remove();let kills=0,bombScore=0;
  [...movers].forEach(entry=>{
   if(entry.type==='giant'){
    entry.hp=Math.max(1,Math.ceil(entry.hp*.3));entry.el.classList.add('bomb-hit');setTimeout(()=>entry.el.classList.remove('bomb-hit'),220);return;
   }
   const points=entry.type==='poison'?400:entry.type==='runner'?300:180;
   bombScore+=points;kills++;removeMover(entry);waveKills++;totalKills++;
  });
  combo=Math.min(30,combo+Math.min(2,kills));bombScore=Math.min(5000,bombScore+bombBonus(kills));score+=bombScore;
  field.classList.add('bomb-shake');setTimeout(()=>field.classList.remove('bomb-shake'),300);window.GameAudio?.play('destroy');
  popup(`BOMB! · ${kills} KILLS · +${bombScore.toLocaleString()}`,'good');updateHud();update();
 }
 function spawnBomb(isBonus=false){
  if(ended||activeBomb)return false;const pos=bombPosition(),b=document.createElement('button');b.type='button';b.className='zombie-bomb locked';b.textContent='💣';b.setAttribute('aria-label','Bomb');b.style.left=pos.x+'%';b.style.top=pos.y+'%';field.appendChild(b);
  activeBomb={el:b,locked:true,expire:null};setTimeout(()=>{if(activeBomb&&activeBomb.el===b){activeBomb.locked=false;b.classList.remove('locked')}},200);
  activeBomb.expire=setTimeout(()=>{if(activeBomb&&activeBomb.el===b)removeBomb()},4000);b.addEventListener('click',detonateBomb);if(isBonus)bonusBombs++;return true;
 }
 function spawnOne(forcedType){
  if(ended||movers.size>=maxActive())return;
  const type=forcedType||chooseType(),z=document.createElement('button');z.type='button';z.className='zombie '+type;
  z.textContent=type==='giant'?'🧟‍♂️':type==='runner'?'🧟‍♀️':type==='poison'?'☣️':'🧟';z.setAttribute('aria-label',type+' zombie');z.style.left=(6+Math.random()*88)+'%';field.appendChild(z);
  let y=-12;const hpMax=type==='giant'?3:1;
  const e=elapsed(),base=type==='runner'?.91:type==='giant'?.40:type==='poison'?.58:.55,speed=base+Math.min(.28,e*.0045)+Math.random()*.06;
  const entry={el:z,id:null,type,hp:hpMax};entry.id=setInterval(()=>{y+=speed;z.style.top=y+'%';if(y>=84){removeMover(entry);damage(type==='giant'?12:type==='poison'?8:5,type)}},30);movers.add(entry);
  z.addEventListener('click',()=>{
   if(ended||!movers.has(entry))return;entry.hp--;window.GameAudio?.play('hit');z.classList.add('hit');setTimeout(()=>z.classList.remove('hit'),90);
   if(entry.hp>0){score+=150;update();return}
   removeMover(entry);waveKills++;totalKills++;combo=Math.min(30,combo+1);
   const basePoints=type==='giant'?2500:type==='poison'?1000:type==='runner'?800:500;
   let gained=basePoints+(combo>=3?Math.min(1000,(combo-2)*80):0);
   if(totalKills===1){gained+=500;popup('FIRST KILL · +1,000','good')}
   openingKills++;if(openingKills===3){gained+=1500;popup('RAPID FIRE · +1,500','good');field.classList.add('opening-burst');setTimeout(()=>field.classList.remove('opening-burst'),350)}
   score+=gained;window.GameAudio?.play(type==='giant'||combo>=3?'combo':'destroy');if(combo>=4)popup(fmt(t().ui.combo,{combo}),'good');
   if((type==='giant'||type==='poison')&&bonusBombs<1&&!activeBomb&&Math.random()<.08)spawnBomb(true);
   updateHud();update();
  });
 }
 function schedule(){if(ended)return;const count=elapsed()>=45&&Math.random()<.36?2:1;for(let i=0;i<count;i++)setTimeout(()=>spawnOne(),i*120);spawnTimer=setTimeout(schedule,spawnDelay())}
 function cleanup(){clearTimeout(spawnTimer);clearInterval(secondTimer);clearTimeout(finishTimer);bombTimers.forEach(clearTimeout);removeBomb();[...movers].forEach(removeMover)}
 updateHud();spawnOne('normal');setTimeout(()=>spawnOne('normal'),260);setTimeout(()=>spawnOne('normal'),520);setTimeout(schedule,900);
 [13000,30000,47000].forEach(ms=>bombTimers.push(setTimeout(()=>spawnBomb(false),ms)));
 secondTimer=setInterval(()=>{
  if(ended)return;const next=waveAt();if(next!==wave)completeWave(next);score+=100;update();
  if(elapsed()>=45&&!field.classList.contains('final-defense')){field.classList.add('final-defense');window.GameAudio?.play('warning')}
 },1000);
 finishTimer=setTimeout(()=>{
  if(ended)return;ended=true;score+=waveBonuses[6];const hpBonus=Math.round(barricade/100*10000);score+=10000+hpBonus;popup('DEFENSE COMPLETE · +'+(10000+hpBonus),'good');cleanup();update();finish(`DEFENSE COMPLETE · BARRICADE ${Math.round(barricade)}%`)
 },60000);
 cleanupGame=()=>{ended=true;cleanup()};
}
function portal(){
 const size=7,total=size*size,g=makeGrid(size,'portal-grid');let level=1,player=0,portal=total-1,moves=0,roundMoves=0,ended=false,deadline=setTimeout(()=>{ended=true;finish(t().ui.timeUp)},45000),cells=[];
 function buildMaze(){roundMoves=0;player=0;cells=Array(total).fill('wall');let r=0,c=0;cells[0]='open';while(r<size-1||c<size-1){const choices=[];if(r<size-1)choices.push('d');if(c<size-1)choices.push('r');const d=choices[Math.floor(Math.random()*choices.length)];if(d==='d')r++;else c++;cells[r*size+c]='open';if(Math.random()<.45){const nr=Math.max(0,Math.min(size-1,r+(Math.random()<.5?-1:1))),nc=Math.max(0,Math.min(size-1,c+(Math.random()<.5?-1:1)));cells[nr*size+nc]='open'}}
  const openChance=Math.max(.10,.34-level*.025);for(let i=0;i<total;i++)if(cells[i]==='wall'&&Math.random()<openChance)cells[i]='open';paint();$('#scoreLabel').textContent=fmt(t().ui.level,{level});
 }
 function paint(){g.innerHTML='';cells.forEach((v,i)=>{const b=document.createElement('button');b.type='button';b.className='newgame-cell '+(v==='wall'?'wall ':'')+(i===player?'player ':'')+(i===portal?'portal':'');b.textContent=i===player?'🛡':i===portal?'🌀':v==='wall'?'':'·';b.addEventListener('click',()=>move(i));g.appendChild(b)})}
 function move(i){if(ended)return;if(cells[i]==='wall'){ended=true;popup('GAME OVER','danger');finish(t().ui.noMoves);return}const dx=Math.abs(i%size-player%size),dy=Math.abs(Math.floor(i/size)-Math.floor(player/size));if(dx+dy!==1)return;player=i;moves++;roundMoves++;score+=Math.max(2,14-level);window.GameAudio?.play('hit');paint();update();if(player===portal){const elapsed=(Date.now()-start)/1000,bonus=Math.max(120,850-roundMoves*28-Math.floor(elapsed)*2);score+=bonus;window.GameAudio?.play('success');popup('+'+bonus,'good');level++;setTimeout(buildMaze,280)}}
 buildMaze();cleanupGame=()=>{ended=true;clearTimeout(deadline)};
}

function merge(){
 const stage=$('#stage'),controls=$('#mergeControls'),status=$('#mergeStatus');stage.innerHTML='<div class="merge-game"><div class="merge-board" aria-label="Hero merge board"></div><div class="merge-rush" id="mergeRush">HERO RUSH</div></div>';const wrap=stage.firstElementChild,g=wrap.querySelector('.merge-board'),rush=$('#mergeRush');if(controls)controls.hidden=false;if(status)status.hidden=false;
 let board=Array(16).fill(0),ended=false,touchStart=null,combo=0,moves=0,target=6,highest=2,deadline=null,rushTimer=null,autoTimer=null,comboAwards=new Set();
 const elapsed=()=>start?(Date.now()-start)/1000:0;
 const mergeScores={2:100,3:250,4:500,5:900,6:1500,7:2300,8:3300,9:4500,10:6000};
 const highestBonus=level=>level>=10?12000:level===9?8000:level===8?5000:level===7?3000:0;
 function fit(){const size=Math.max(150,Math.floor(Math.min(stage.clientWidth-20,stage.clientHeight-20,560)));g.style.width=size+'px';g.style.height=size+'px'}const ro=new ResizeObserver(fit);ro.observe(stage);fitCleanup=()=>ro.disconnect();
 function add(v){const empty=board.map((x,i)=>x?null:i).filter(x=>x!==null);if(!empty.length)return false;board[empty[Math.floor(Math.random()*empty.length)]]=v||(Math.random()<.86?1:2);return true}
 function draw(){g.innerHTML='';board.forEach(v=>{const d=document.createElement('div');d.className='merge-tile tier-'+Math.min(v,9)+(v===highest?' highest':'');d.textContent=v?['','🪖','⚔️','🛡','👑','🔥','⭐','💎','🏆','🌟'][Math.min(v,9)]+' '+(2**v):'';g.appendChild(d)});if(status){status.dataset.tier=String(2**target);status.dataset.combo=String(combo);status.textContent=`${fmt(t().ui.goal,{tier:2**target})} · ${fmt(t().ui.combo,{combo})} · ${Math.max(0,45-Math.floor(elapsed()))}s`;}fit()}
 function line(arr){
  let a=arr.filter(Boolean),merged=0,points=0,changed=true;
  while(changed){changed=false;for(let i=0;i<a.length-1;i++){if(a[i]===a[i+1]){a[i]++;a.splice(i+1,1);merged++;points+=mergeScores[a[i]]||6000;changed=true;break}}}
  while(a.length<4)a.push(0);return {a,merged,points}
 }
 function canMove(){if(board.includes(0))return true;for(let r=0;r<4;r++)for(let c=0;c<4;c++){const v=board[r*4+c];if(c<3&&board[r*4+c+1]===v)return true;if(r<3&&board[(r+1)*4+c]===v)return true}return false}
 function rescue(){
  const min=Math.min(...board.filter(Boolean));const ids=board.map((v,i)=>v===min?i:-1).filter(i=>i>=0);if(ids.length>=2){board[ids[0]]=min+1;board[ids[1]]=0;score+=500;popup('AUTO MERGE · +500','good');return true}return false
 }
 function awardCombo(){
  const levels=[[5,500],[10,1500],[15,3000]];for(const [threshold,bonus] of levels){if(combo>=threshold&&!comboAwards.has(threshold)){comboAwards.add(threshold);score+=bonus;popup(`COMBO ×${threshold} · +${bonus.toLocaleString()}`,'good')}}
 }
 function resetCombo(){combo=0;comboAwards.clear()}
 function shift(d){
  if(ended)return;const old=board.join();let nb=Array(16).fill(0),merges=0,mergePoints=0;
  for(let k=0;k<4;k++){let arr=[];for(let j=0;j<4;j++){const r=d==='up'||d==='down'?j:k,c=d==='up'||d==='down'?k:j;arr.push(board[r*4+c])}if(d==='right'||d==='down')arr.reverse();const out=line(arr);arr=out.a;merges+=out.merged;mergePoints+=out.points;if(d==='right'||d==='down')arr.reverse();for(let j=0;j<4;j++){const r=d==='up'||d==='down'?j:k,c=d==='up'||d==='down'?k:j;nb[r*4+c]=arr[j]}}
  board=nb;if(board.join()===old){resetCombo();draw();return}
  moves++;score+=350;if(merges){combo=Math.min(15,combo+merges);score+=mergePoints;awardCombo()}else resetCombo();
  add();if(elapsed()>=35&&Math.random()<.55)add(1);highest=Math.max(highest,...board);
  if(merges){window.GameAudio?.play(combo>=4?'combo':'item');popup(merges>=2?`CHAIN MERGE ×${merges}`:fmt(t().ui.combo,{combo}),'good');g.classList.add('merge-impact');setTimeout(()=>g.classList.remove('merge-impact'),180)}
  if(highest>=target){popup('NEW HERO '+(2**highest),'good');wrap.classList.add('tier-up');setTimeout(()=>wrap.classList.remove('tier-up'),500);target=Math.min(10,target+1)}
  if(!canMove()&&!rescue()){ended=true;finishMerge(t().ui.noMoves);return}draw();update();
 }
 function finishMerge(reason){if(ended&&start===0)return;ended=true;clearTimeout(deadline);clearTimeout(rushTimer);clearInterval(autoTimer);const top=Math.max(...board),topBonus=highestBonus(top);score+=topBonus;if(topBonus)popup('TOP HERO '+(2**top)+' · +'+topBonus.toLocaleString(),'good');update();finish(`${reason} · TOP HERO ${2**top}`)}
 controls?.querySelectorAll('[data-d]').forEach(b=>b.addEventListener('click',()=>shift(b.dataset.d)));const keyHandler=e=>{const map={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'};if(map[e.key]){e.preventDefault();shift(map[e.key])}};document.addEventListener('keydown',keyHandler);g.addEventListener('pointerdown',e=>touchStart={x:e.clientX,y:e.clientY});g.addEventListener('pointerup',e=>{if(!touchStart)return;const dx=e.clientX-touchStart.x,dy=e.clientY-touchStart.y;touchStart=null;if(Math.max(Math.abs(dx),Math.abs(dy))<18)return;shift(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'))});
 [1,1,2,2,1,1,2,1,1,2].forEach(v=>add(v));highest=Math.max(...board);draw();popup('MERGE RUSH!','good');
 autoTimer=setInterval(()=>{if(ended)return;if(board.filter(Boolean).length<11){add(Math.random()<.82?1:2);draw()}},1200);
 rushTimer=setTimeout(()=>{if(ended)return;wrap.classList.add('rush-mode');if(rush)rush.classList.add('show');popup('HERO RUSH · 10s','danger');window.GameAudio?.play('warning');clearInterval(autoTimer);autoTimer=setInterval(()=>{if(ended)return;if(board.filter(Boolean).length<13){add(Math.random()<.88?1:2);draw()}},650)},35000);
 deadline=setTimeout(()=>finishMerge(t().ui.timeUp),45000);
 cleanupGame=()=>{ended=true;clearTimeout(deadline);clearTimeout(rushTimer);clearInterval(autoTimer);if(controls)controls.hidden=true;if(status){status.hidden=true;status.textContent='';delete status.dataset.tier;delete status.dataset.combo;}document.removeEventListener('keydown',keyHandler)};
}
function build(){({'treasure-hunter':treasure,'zombie-defense':zombies,'portal-escape':portal,'hero-merge':merge}[game])()}
$('#startBtn').onclick=begin;$('#nickname').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();begin()}});$('#retryBtn').onclick=begin;$('#rankingBtn').onclick=async()=>{if(window.EZPKGameResultFlow?.showRanking){await window.EZPKGameResultFlow.showRanking({loadRanking,nickname:nick||localStorage.getItem('ezpk-game-nickname')||''});}else{hideOverlay148($('#resultOverlay'));await loadRanking();window.EZPKRankingPanel?.focusPlayer(nick||localStorage.getItem('ezpk-game-nickname')||'');}};if($('#replayBtn'))$('#replayBtn').onclick=begin;$('#refreshRanking').onclick=loadRanking;$('#soundBtn').onclick=()=>{const muted=window.GameAudio?.toggle?.()??soundOn;soundOn=!muted;$('#soundBtn').textContent=soundOn?'🔊':'🔇'};$('#nickname').value=localStorage.getItem('ezpk-game-nickname')||'';
window.addEventListener('ezpk-language-change',e=>applyLanguage(e.detail?.lang||window.EZPKLanguage?.get?.()||'en'));
applyLanguage(currentLang);
})();

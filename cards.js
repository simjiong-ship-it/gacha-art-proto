/* 카드 50장 생성기: 시리즈마다 50장, 장마다 다른 캐릭터. 레어 이상은 특별 캐릭터 */
(function () {
  var N = 50;
  // 번호별 등급: 001~025 Common, 026~038 Uncommon, 039~045 Rare, 046~049 Epic, 050 Legendary
  function grade(n) { return n < 25 ? 'C' : n < 38 ? 'U' : n < 45 ? 'R' : n < 49 ? 'E' : 'L'; }
  var GRADES = {
    C: { key: 'C', name: 'Common', short: 'C', color: '#A9A8B2', bw: 4, prob: 50 },
    U: { key: 'U', name: 'Uncommon', short: 'U', color: '#5FA36A', bw: 5, prob: 25 },
    R: { key: 'R', name: 'Rare', short: 'R', color: '#3E7BD6', bw: 6, prob: 15 },
    E: { key: 'E', name: 'Epic', short: 'EPIC', color: '#8A4FD1', bw: 7, prob: 8 },
    L: { key: 'L', name: 'Legendary', short: 'LEGEND', color: '#D98A1E', bw: 8, prob: 2 }
  };

  function hash(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function pick(r, a) { return a[Math.floor(r() * a.length) % a.length]; }
  function f1(v) { return Math.round(v * 10) / 10; }
  function circ(cx, cy, r) { return 'M' + f1(cx - r) + ' ' + f1(cy) + 'a' + f1(r) + ' ' + f1(r) + ' 0 1 0 ' + f1(2 * r) + ' 0a' + f1(r) + ' ' + f1(r) + ' 0 1 0 ' + f1(-2 * r) + ' 0Z'; }
  function ell(cx, cy, rx, ry) { return 'M' + f1(cx - rx) + ' ' + f1(cy) + 'a' + f1(rx) + ' ' + f1(ry) + ' 0 1 0 ' + f1(2 * rx) + ' 0a' + f1(rx) + ' ' + f1(ry) + ' 0 1 0 ' + f1(-2 * rx) + ' 0Z'; }
  function tri(a, b, c) { return 'M' + f1(a[0]) + ' ' + f1(a[1]) + 'L' + f1(b[0]) + ' ' + f1(b[1]) + 'L' + f1(c[0]) + ' ' + f1(c[1]) + 'Z'; }
  function star4(cx, cy, r) { var k = r * 0.28; return 'M' + f1(cx) + ' ' + f1(cy - r) + 'L' + f1(cx + k) + ' ' + f1(cy - k) + 'L' + f1(cx + r) + ' ' + f1(cy) + 'L' + f1(cx + k) + ' ' + f1(cy + k) + 'L' + f1(cx) + ' ' + f1(cy + r) + 'L' + f1(cx - k) + ' ' + f1(cy + k) + 'L' + f1(cx - r) + ' ' + f1(cy) + 'L' + f1(cx - k) + ' ' + f1(cy - k) + 'Z'; }
  function star5(cx, cy, r) { var d = ''; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; d += (i ? 'L' : 'M') + f1(cx + Math.cos(a) * rr) + ' ' + f1(cy + Math.sin(a) * rr); } return d + 'Z'; }

  var FURS = {
    cat: [
      { name: '까망', base: '#1E1B2E', light: '#2E2A44', dark: '#0E0C18', ear: '#4A3F6B' },
      { name: '하양', base: '#F3F0EA', light: '#FFFFFF', dark: '#CFC8BA', ear: '#F2B8C6' },
      { name: '치즈', base: '#E8954A', light: '#F7D7B0', dark: '#C46E2A', ear: '#F2B8C6', stripes: true },
      { name: '회색', base: '#8A8FA3', light: '#C9CCD8', dark: '#6B7085', ear: '#E6A9B8' },
      { name: '삼색', base: '#F3EEE6', light: '#FFFFFF', dark: '#2A2433', ear: '#F2B8C6', patches: ['#E8954A', '#2A2433'] },
      { name: '턱시도', base: '#1E1B2E', light: '#FFFFFF', dark: '#0E0C18', ear: '#4A3F6B', chest: true },
      { name: '샴', base: '#EFE3CF', light: '#FAF3E6', dark: '#5A4334', ear: '#5A4334', points: true },
      { name: '고등어', base: '#9B8A70', light: '#D9CCB4', dark: '#5E5040', ear: '#E6A9B8', stripes: true }
    ],
    bunny: [
      { name: '눈송이', base: '#FFFFFF', light: '#FFFFFF', dark: '#D7E3F0', ear: '#F6C1D0' },
      { name: '구름', base: '#E7EEF8', light: '#FFFFFF', dark: '#B9C8DD', ear: '#F6C1D0' },
      { name: '밀크티', base: '#E6CDB4', light: '#F6EADF', dark: '#B99474', ear: '#F2B8C6' },
      { name: '초코', base: '#7A5440', light: '#C9A58A', dark: '#4E3326', ear: '#E6A9B8' },
      { name: '하늘', base: '#BFD9F5', light: '#E6F1FD', dark: '#86AED8', ear: '#F6C1D0' }
    ],
    bear: [
      { name: '갈색', base: '#8A6248', light: '#D9BFA4', dark: '#5C3F2D', ear: '#D9BFA4' },
      { name: '흰', base: '#F1EEE8', light: '#FFFFFF', dark: '#CFC8BA', ear: '#E8D8C8' },
      { name: '꿀', base: '#D49A4A', light: '#F2D8A8', dark: '#A06B26', ear: '#F2D8A8' },
      { name: '회색', base: '#7C8BA6', light: '#C9D2E0', dark: '#55627C', ear: '#C9D2E0' }
    ],
    fox: [
      { name: '주황', base: '#E2895A', light: '#FFFFFF', dark: '#2A1E1A', ear: '#2A1E1A' },
      { name: '북극', base: '#F2F1EE', light: '#FFFFFF', dark: '#B9C3CF', ear: '#B9C3CF' },
      { name: '노을', base: '#D9644A', light: '#FBE3D2', dark: '#3A2420', ear: '#3A2420' },
      { name: '사막', base: '#E8C38E', light: '#FFF6E8', dark: '#9C7A4C', ear: '#9C7A4C' }
    ],
    ghost: [
      { name: '하얀', base: '#F4F0FF', light: '#FFFFFF', dark: '#C9C1E8', ear: '#F6C1D0' },
      { name: '민트', base: '#D2F4EA', light: '#F0FFFA', dark: '#94D6C2', ear: '#F6C1D0' },
      { name: '분홍', base: '#FAD9E6', light: '#FFF2F7', dark: '#E5A6BE', ear: '#F6C1D0' },
      { name: '보라', base: '#DCD2FA', light: '#F4F0FF', dark: '#A796E0', ear: '#F6C1D0' }
    ]
  };
  var NOUN = { cat: '냥', bunny: '토끼', bear: '곰', fox: '여우', ghost: '유령', whale: '고래', house: '집' };
  var EYES = ['#F2C94C', '#7ED37A', '#6FB7F0', '#E39B3B'];
  var ACC = [['scarf', '목도리'], ['bell', '방울'], ['bow', '리본'], ['hat', '마법모자'], ['glasses', '안경'], ['', ''], ['fish', '생선'], ['flower', '꽃']];
  var POSE = [['front', '앉은'], ['front', '앉은'], ['front', '앉은'], ['loaf', '식빵'], ['sleep', '꿀잠'], ['back', '달구경']];
  var SPECIAL = {
    cat: { R: ['별빛냥', '오로라냥', '유성냥', '반딧불냥', '달무리냥', '은하수냥', '네온냥'], E: ['달의 기사', '밤의 마법사', '꿈의 수호자', '그림자 왕'], L: '달의 여왕 루나' },
    other: { R: ['별빛', '오로라', '유성', '반딧불', '무지개', '은하수', '네온'], E: ['기사', '마법사', '수호자', '왕'] }
  };
  var BPROP = [['comic', '선글라스 만화책'], ['glasses', '동그란 안경 공부'], ['apple', '사과 머리 낮잠'], ['chips', '과자 파티'], ['juice', '딸기 주스'], ['carrot', '당근 간식'], ['crown', '꽃 왕관'], ['phones', '헤드폰 음악'], ['tea', '찻잔 티타임'], ['bookball', '책 위 솜뭉치'], ['scarf', '목도리 산책'], ['balloon', '풍선 놀이'], ['back', '구름 구경'], ['clover', '네잎클로버'], ['lettuce', '상추 냠냠']];
  var LOP = [['귤색', '#F2C08A', '#DDA66A'], ['꿀색', '#E9B572', '#CF9450'], ['모카', '#CDA27A', '#AE835C'], ['치즈', '#F5CF8E', '#E0B06A']];
  var BFUR = [['눈송이', '#FFFFFF', '#E6E9F2'], ['초코', '#8A5E44', '#6B4532'], ['회색', '#BDC0CC', '#989BAA'], ['얼룩', '#FFFFFF', '#E6E2DA', '#6B4A3A'], ['까망', '#3E3644', '#2A2430'], ['크림', '#FBF1E2', '#EAD8BF'], ['귤색', '#F2C08A', '#DDA66A'], ['라떼', '#E3CDB4', '#CBB093']];
  var BLOB = { sea: '파도 요정', pink: '산호 요정', lemon: '레몬 요정', lav: '꽃 요정' };
  // 레어 7장: 각자 다른 빛깔 / 에픽 4장: 각자 다른 역할
  var RARE = [
    { base: '#2B3A7A', light: '#4A63B8', dark: '#18224D', glow: '#9FE8FF', eye: '#9FF3FF', sky: ['#0E2A5C', '#2B3F9A', '#4FB3D9'], dots: '#BFF6FF' },
    { base: '#1F5E63', light: '#4FB3A8', dark: '#123B3E', glow: '#8FFFD6', eye: '#B8FFE8', sky: ['#0B2B3A', '#1D6B6E', '#7BE0B8'], dots: '#D2FFF0' },
    { base: '#7A3B1E', light: '#E58A4A', dark: '#4A2210', glow: '#FFC27A', eye: '#FFE29A', sky: ['#2A1030', '#7A2E3A', '#F08A4A'], dots: '#FFE0B0' },
    { base: '#2E4A22', light: '#6EA04A', dark: '#1A2E12', glow: '#E8FF7A', eye: '#F4FF9A', sky: ['#0E1E14', '#24452A', '#7AA04A'], dots: '#F4FFB0' },
    { base: '#8A90A8', light: '#E6E9F2', dark: '#5A6078', glow: '#FFFFFF', eye: '#CFE6FF', sky: ['#1A1F35', '#3B4566', '#A7B4D6'], dots: '#FFFFFF' },
    { base: '#3B2A7A', light: '#8A6BE0', dark: '#1B1446', glow: '#D6B8FF', eye: '#F0DDFF', sky: ['#120C2E', '#3B2A7A', '#B37BE0'], dots: '#F0DDFF' },
    { base: '#1A1430', light: '#FF5FC8', dark: '#0A0618', glow: '#FF5FC8', eye: '#7AF7FF', sky: ['#0A0618', '#2A0E4A', '#FF5FC8'], dots: '#7AF7FF' }
  ];
  var EPIC = [
    { role: 'knight', base: '#C9CED9', light: '#FFFFFF', dark: '#8A90A8', cape: '#2B5FB8', eye: '#6FB7F0', sky: ['#0E1A3A', '#2B3F7A', '#D9B24A'] },
    { role: 'wizard', base: '#2A1E4A', light: '#4A3A7A', dark: '#120C2E', cape: '#6A2E9A', eye: '#F2C94C', sky: ['#120C2E', '#4A1E7A', '#E36BD8'] },
    { role: 'guardian', base: '#F3F0EA', light: '#FFFFFF', dark: '#CFC8BA', cape: '#1F8A7A', eye: '#7ED37A', sky: ['#0B2B2A', '#1F6A5E', '#F2D27A'] },
    { role: 'king', base: '#1E1B2E', light: '#3A3356', dark: '#0E0C18', cape: '#B8304E', eye: '#FFD36B', sky: ['#2A0F3E', '#6A1E5E', '#D98A1E'] }
  ];

  function speciesOf(s) {
    if (s.kind === 'cat' || s.kind === 'bunny' || s.kind === 'bear' || s.kind === 'fox' || s.kind === 'ghost' || s.kind === 'whale' || s.kind === 'house') return s.kind;
    return 'blob';
  }
  function blobFurs(s) {
    return [
      { name: '', base: s.w1, light: s.sun, dark: s.w2, ear: '#F6C1D0' },
      { name: '', base: s.sun === '#FFFFFF' ? s.w1 : s.sun, light: '#FFFFFF', dark: s.w2, ear: '#F6C1D0' },
      { name: '', base: s.w2, light: s.w1, dark: s.fig, ear: '#F6C1D0' }
    ];
  }

  function name(s, n) {
    var g = grade(n), sp = speciesOf(s), r = rng(hash(s.id + ':' + n));
    var noun = sp === 'blob' ? (BLOB[s.id] || '요정') : NOUN[sp];
    if (g === 'L') return sp === 'cat' ? SPECIAL.cat.L : s.title + '의 주인';
    if (g === 'E') { var e = SPECIAL[sp === 'cat' ? 'cat' : 'other'].E[n - 45]; return sp === 'cat' ? e : noun + ' ' + e; }
    if (g === 'R') { var x = SPECIAL[sp === 'cat' ? 'cat' : 'other'].R[n - 38]; return sp === 'cat' ? x : x + ' ' + noun; }
    var furs = sp === 'blob' ? blobFurs(s) : (FURS[sp] || FURS.cat);
    var fur = pick(r, furs), pose = pick(r, POSE), acc = pick(r, ACC);
    if (s.photo) { fur = furs[n % furs.length]; acc = ACC[Math.floor(n / furs.length) % ACC.length]; pose = POSE[(n * 7) % POSE.length]; }
    if (sp !== 'cat' && sp !== 'bunny' && sp !== 'bear' && sp !== 'fox') pose = POSE[0];
    var noAcc = pose[0] === 'sleep' || pose[0] === 'back' || sp === 'whale' || sp === 'house';
    var tag = noAcc ? pose[1] : (acc[1] || pose[1]);
    if (s.photo) {
      var MOMENT = {
        front: ['구름 위 산책', '당근 한 입', '별 세기', '바람 타기', '솜사탕 냠냠', '비눗방울', '꽃향기', '무지개 구경', '첫눈 마중', '하늘 그림', '깡총 점프', '노래 한 소절', '편지 쓰기', '풍선 놀이', '민들레 후', '구름빵 굽기', '물웅덩이', '반짝 윙크', '소원 빌기', '햇살 샤워'],
        loaf: ['구름 식빵', '폭신 식빵', '찹쌀떡', '모찌 자세', '통통 식빵', '솜뭉치', '빵 굽는 중', '따끈 식빵'],
        sleep: ['구름 낮잠', '새근새근', '꿈나라', '쿨쿨 오후', '이불 속', '달콤한 꿈', '늦잠'],
        back: ['노을 구경', '먼 산 바라기', '구름 마중', '하늘 멍', '바람 맞이', '기다림', '작별 인사']
      };
      var bp = BPROP[n % BPROP.length], bfn = bp[0] === 'lettuce' ? LOP[Math.floor(n / BPROP.length) % LOP.length][0] : BFUR[(n * 3 + Math.floor(n / BPROP.length) * 2) % BFUR.length][0];
      return bfn + ' 토끼 · ' + bp[1];
    }
    if (sp === 'whale' || sp === 'house') {
      var w = ['하늘', '분홍', '노랑', '민트', '보라', '구름', '별빛', '새벽'][n % 8], t2 = (sp === 'whale' ? ['산책', '노래', '낮잠', '별구경', '물장구'] : ['불 켜진', '굴뚝 연기', '아침', '비 오는', '눈 오는'])[Math.floor(n / 8) % 5];
      return sp === 'whale' ? w + ' 고래 · ' + t2 : t2 + ' ' + w + ' 집';
    }
    if (sp === 'cat') return fur.name + '냥 · ' + tag;
    if (sp === 'blob') return noun + ' · ' + tag;
    return (fur.name ? fur.name + ' ' : '') + noun + ' · ' + tag;
  }

  /* 그림 한 장 = path 목록 */
  function draw(s, n, gray) {
    var g = grade(n), sp = speciesOf(s), r = rng(hash(s.id + ':' + n));
    var special = g === 'R' || g === 'E' || g === 'L';
    var P = [];
    function add(d, f, o, st, w) { P.push({ d: d, f: f || 'none', o: o == null ? 1 : o, s: st || 'none', w: w || 0 }); }

    var furs = sp === 'blob' ? blobFurs(s) : (FURS[sp] || FURS.cat);
    var fur = pick(r, furs), pose = pick(r, POSE)[0], acc = pick(r, ACC)[0], eye = pick(r, EYES);
    if (s.photo) { fur = furs[n % furs.length]; acc = ACC[Math.floor(n / furs.length) % ACC.length][0]; pose = POSE[(n * 7) % POSE.length][0]; }
    if (sp !== 'cat' && sp !== 'bunny' && sp !== 'bear' && sp !== 'fox') pose = 'front';
    if (special) { pose = 'front'; acc = ''; }
    var RT = g === 'R' ? (RARE[n - 38] || RARE[0]) : null, ET = g === 'E' ? (EPIC[n - 45] || EPIC[0]) : null;
    var moonX = 18 + r() * 64, moonY = 18 + r() * 14, moonR = 7 + r() * 6;

    // 배경
    var meadow = s.style === 'meadow', th = RT || ET, ph = meadow ? null : s.photo, bgEnd = 0;
    if (meadow) {
      var mr = rng(hash('meadow:' + s.id + ':' + n)), scene = special ? 3 : n % 4;
      function swirl(cx, cy, rmax, k, cols, w) { var ds = cols.map(function () { return ''; }); for (var q = 0; q < k; q++) { var rr = 2 + mr() * rmax, a0 = mr() * Math.PI * 2, a1 = a0 + (2 + mr() * 4) / rr; ds[q % cols.length] += 'M' + f1(cx + Math.cos(a0) * rr) + ' ' + f1(cy + Math.sin(a0) * rr * 0.8) + 'A' + f1(rr) + ' ' + f1(rr * 0.8) + ' 0 0 1 ' + f1(cx + Math.cos(a1) * rr) + ' ' + f1(cy + Math.sin(a1) * rr * 0.8); } ds.forEach(function (d, i) { if (d) add(d, 'none', 0.85, cols[i], w || 1.3); }); }
      function flow(x0, x1, y0, y1, k, cols, w, lean) { var ds = cols.map(function () { return ''; }); for (var q = 0; q < k; q++) { var x = x0 + mr() * (x1 - x0), y = y0 + mr() * (y1 - y0), L = 2.5 + mr() * 4; ds[q % cols.length] += 'M' + f1(x) + ' ' + f1(y) + 'q' + f1(L / 2) + ' ' + f1(-(lean || 1) * (0.6 + mr())) + ' ' + f1(L) + ' ' + f1((mr() - 0.5) * 1.2); } ds.forEach(function (d, i) { if (d) add(d, 'none', 0.8, cols[i], w || 1.1); }); }
      function orb(x, y, rr, c1, c2) { add(circ(x, y, rr * 2.3), c2, 0.22); add(circ(x, y, rr * 1.6), 'none', 0.7, c2, 0.9); add(circ(x, y, rr * 1.25), 'none', 0.8, c1, 0.8); add(circ(x, y, rr), c1); add(circ(x - rr * 0.3, y - rr * 0.3, rr * 0.4), '#FFFBE6', 0.8); }
      function hyd(x, y, k, cols) { for (var hp = 0; hp < k; hp++) { var hx2 = x + (mr() - 0.5) * 14, hy2 = y + (mr() - 0.5) * 9, hc = cols[hp % cols.length]; for (var q4 = 0; q4 < 4; q4++) { var qa = q4 * Math.PI / 2 + 0.6; add(circ(hx2 + Math.cos(qa) * 1.3, hy2 + Math.sin(qa) * 1.3, 1.25), hc); } add(circ(hx2, hy2, 0.5), '#F2C94C'); } }
      if (scene === 3) {
        var gold = g === 'E' || g === 'L';
        add('M0 0H100V130H0Z', g === 'L' ? '#2A1D5E' : g === 'E' ? '#2B1F4E' : RT ? RT.sky[0] : '#1D3A6E');
        flow(-4, 100, 0, 88, 150, RT ? [RT.sky[1], RT.base, RT.glow] : gold ? ['#3B2F7A', '#5B3F9A', '#8A6BD6'] : ['#25467F', '#355F9F', '#5B86C8'], 1.3, 1);
        swirl(56, 40, 30, 120, RT ? [RT.light, RT.glow, '#FFFFFF'] : gold ? ['#8A6BD6', '#D6B8FF', '#FFE29A'] : ['#4A7BC4', '#7FA6E0', '#A9C8F0'], 1.4);
        swirl(18, 24, 13, 40, ['#7FA6E0', '#C9DDF5'], 1.2);
        orb(82, 16, 6, '#F6E27A', '#FFF1B0'); orb(14, 46, 3, '#F6E27A', '#FFF1B0'); orb(40, 12, 2.4, '#F6E27A', '#FFF1B0'); orb(66, 58, 2.2, '#F6E27A', '#FFF1B0');
        add('M0 94 C20 82 46 86 62 90 C78 94 90 86 100 88 V130 H0Z', gold ? '#C99A2E' : '#C9A43A');
        flow(-2, 100, 88, 116, 150, ['#E8C54A', '#F2D86A', '#B8902A', '#8A6A1E'], 1.2, -1);
        for (var ff = 0; ff < 10; ff++) add(circ(mr() * 100, 70 + mr() * 30, 0.7), '#FFE98A', 0.9);
      } else if (scene === 1) {
        add('M0 0H100V130H0Z', th ? th.sky[0] : '#2F5BAE'); add('M0 40H100V130H0Z', th ? th.sky[1] : '#3E6FC4', 0.85);
        for (var lf = 0; lf < 9; lf++) { var lx = mr() * 100; add('M' + f1(lx) + ' 104 Q' + f1(lx - 6 + mr() * 12) + ' ' + f1(70 + mr() * 14) + ' ' + f1(lx + (mr() - 0.5) * 16) + ' ' + f1(62 + mr() * 14) + ' Q' + f1(lx + 4) + ' 84 ' + f1(lx + 2) + ' 104Z', lf % 2 ? '#2E5E34' : '#3F7A3E'); }
        add('M-12 62 Q50 4 112 62 Q100 56 86 62 Q72 54 58 62 Q44 54 30 62 Q16 54 2 62 Q-6 58 -12 62Z', '#6E9BE6');
        add('M50 22 Q34 40 30 62 M50 22 Q66 40 72 62 M50 22 L50 60', 'none', 1, '#3F6DC0', 0.8); add('M-12 62 Q50 4 112 62', 'none', 0.5, '#9EC0F5', 1.2);
        add('M80 60 L80 112', 'none', 1, '#4A4A5A', 1.4);
        for (var rd = 0; rd < 8; rd++) add(circ(8 + mr() * 84, 26 + mr() * 30, 1.1), '#FFFFFF', 0.85);
        for (var rn = 0; rn < 18; rn++) { var rx = mr() * 100, ry = mr() * 120; if (ry > 18 && ry < 62 && rx > 4 && rx < 96) continue; add('M' + f1(rx) + ' ' + f1(ry) + ' l-1.2 6', 'none', 0.75, '#FFFFFF', 0.7); }
        hyd(16, 98, 9, ['#4C7BE0', '#7FA6F0', '#3E6FD8']); hyd(84, 96, 9, ['#4C7BE0', '#7FA6F0', '#3E6FD8']);
      } else if (scene === 2) {
        add('M0 0H100V130H0Z', th ? th.sky[1] : '#5E92D8'); add('M0 50H100V130H0Z', th ? th.sky[2] : '#86B2E8', 0.8);
        var cl = function (x, y, k) { for (var cc2 = 0; cc2 < k; cc2++) add(circ(x + (mr() - 0.5) * 22, y + (mr() - 0.5) * 7, 4 + mr() * 5), '#FFFFFF', 0.85); };
        cl(14, 20, 8); cl(84, 44, 9); cl(90, 14, 5);
        add('M64 30 c-2 -4 -8 -3 -7 2 c1 4 7 7 7 8 c0 -1 6 -4 7 -8 c1 -5 -5 -6 -7 -2Z', '#E8443A');
        for (var tr = 0; tr < 10; tr++) add(circ(mr() * 100, 88 + mr() * 4, 5 + mr() * 5), tr % 2 ? '#2E5E34' : '#3F7A3E');
        add('M0 92 C24 88 50 94 76 90 C88 88 96 90 100 92 V130 H0Z', '#5E9A3E');
      } else {
        add('M0 0H100V130H0Z', th ? th.sky[1] : '#9EC3EA'); add('M0 34H100V130H0Z', th ? th.sky[2] : '#B9D5F0', 0.8);
        if (th) add('M0 0H100V130H0Z', th.sky[0], 0.35);
        add('M0 78 C14 64 30 62 44 72 C56 62 72 60 100 70 V130 H0Z', '#5E8F7A'); add('M0 82 C20 72 40 76 60 74 C78 72 90 76 100 78 V130 H0Z', '#6FA07A');
        var tx = n % 2 ? 74 : 26, tw = 12;
        add('M' + (tx - tw / 2) + ' 104 C' + (tx - tw / 2 + 1) + ' 80 ' + (tx - tw / 2 + 2) + ' 56 ' + (tx - 3) + ' 40 L' + (tx + 3) + ' 40 C' + (tx + tw / 2 - 2) + ' 56 ' + (tx + tw / 2 - 1) + ' 80 ' + (tx + tw / 2) + ' 104Z', '#2F3B2A');
        [['#2E5E34', 0], ['#3F7A3E', 3], ['#5E9A48', 6], ['#86BE62', 9]].forEach(function (cc) { for (var cb = 0; cb < 9; cb++) add(circ(tx - 30 + mr() * 60, -6 + mr() * 46 - cc[1] * 0.4, 6 + mr() * 9 - cc[1] * 0.4), cc[0], 0.95); });
        add('M0 90 C24 86 50 92 76 88 C88 86 96 88 100 90 V130 H0Z', '#6DAA4A');
      }
      if (scene === 0) { flow(0, 100, 0, 40, 60, ['#B7D2F2', '#8DB6E6'], 1); flow(0, 100, 90, 112, 60, ['#5E9A3E', '#86BE62'], 1, -1); }
      if (scene === 1) flow(0, 100, 0, 30, 40, ['#3F6DC0', '#5584D6'], 1.1);
      if (scene === 2) { flow(0, 100, 0, 88, 70, ['#7AA8E6', '#4F86D0', '#A9C8F0'], 1.1); flow(0, 100, 92, 112, 60, ['#4E8F3A', '#7DB860'], 1, -1); }
      if (th && scene !== 3) add('M0 0H100V130H0Z', th.sky[0], 0.25);
      if (scene !== 3) add('M0 112 C30 106 60 114 100 108 V130 H0Z', scene === 1 ? '#2E5E34' : '#4E8F3A');
      if (scene !== 3) for (var fl = 0; fl < 16; fl++) { var fx2 = mr() * 100, fy2 = 94 + mr() * 16; if (mr() < 0.5) add(circ(fx2, fy2, 1 + mr()), '#4C7BE0', 0.9); else { add(circ(fx2, fy2, 1.2 + mr() * 0.6), '#FFFFFF'); add(circ(fx2, fy2, 0.5), '#F2C94C'); } }
      if (special && scene !== 3) { var rays2 = 14, col2 = RT ? RT.glow : '#FFD36B'; for (var ri = 0; ri < rays2; ri++) { var b1 = (ri / rays2) * Math.PI * 2, b2 = b1 + Math.PI / rays2 * 0.9; add('M50 62L' + f1(50 + Math.cos(b1) * 120) + ' ' + f1(62 + Math.sin(b1) * 120) + 'L' + f1(50 + Math.cos(b2) * 120) + ' ' + f1(62 + Math.sin(b2) * 120) + 'Z', col2, 0.12); } add(circ(50, 66, 30), col2, 0.18); }
      bgEnd = P.length;
    } else if (ph) {
      var col = n % ph.cols, row = Math.floor(n / ph.cols), tileH = 100 * (ph.h / ph.rows) / (ph.w / ph.cols);
      P.push({ img: ph.src, x: -col * 100, y: f1(-row * tileH - (tileH - 130) / 2), w: ph.cols * 100, h: f1(ph.rows * tileH) });
      if (th) add('M0 0H100V130H0Z', th.sky[1], 0.35);
      if (g === 'L') add('M0 0H100V130H0Z', 'url(#ga-l)', 0.4);
      add('M0 96H100V130H0Z', '#1E3A6E', 0.12);
      bgEnd = P.length;
    }
    else if (th) { add('M0 0H100V130H0Z', th.sky[0]); add('M0 36H100V130H0Z', th.sky[1], 0.75); add('M0 70H100V130H0Z', th.sky[2], 0.55); add(ell(50, 130, 70, 40), th.sky[2], 0.35); }
    else add('M0 0H100V130H0Z', g === 'L' ? 'url(#ga-l)' : s.sky);
    if (special && !meadow) {
      var rays = g === 'L' ? 18 : 14, col = RT ? RT.glow : g === 'E' ? '#FFD36B' : '#FFE9A8';
      for (var i = 0; i < rays; i++) {
        var a1 = (i / rays) * Math.PI * 2, a2 = a1 + Math.PI / rays * 0.9;
        add('M50 62L' + f1(50 + Math.cos(a1) * 120) + ' ' + f1(62 + Math.sin(a1) * 120) + 'L' + f1(50 + Math.cos(a2) * 120) + ' ' + f1(62 + Math.sin(a2) * 120) + 'Z', col, g === 'L' ? 0.16 : 0.12);
      }
      add(circ(50, 62, 40), col, 0.12); add(circ(50, 62, 28), col, 0.16);
    } else {
      if (!ph && !meadow) { add(circ(moonX, moonY, moonR + 4), s.sun, 0.15); add(circ(moonX, moonY, moonR), s.sun); }
    }
    if (!ph && !meadow) for (var k = 0; k < 9; k++) add(star4(4 + r() * 92, 6 + r() * 56, 0.8 + r() * 1.6), special ? '#FFFFFF' : s.star, 0.5 + r() * 0.5);
    // 언덕
    if (meadow) add(ell(50, 108, 22, 4), '#2E5E34', 0.25);
    else if (!ph) {
      add('M0 102 C20 94 38 98 52 96 S82 90 100 98 V130 H0Z', special ? 'rgba(20,10,40,.45)' : s.w1);
      add('M0 114 C24 108 48 118 70 112 S92 108 100 112 V130 H0Z', special ? 'rgba(10,5,25,.55)' : s.w2);
    } else add(ell(50, 104, 22, 4), '#1E3A6E', 0.25);
    var figStart = P.length;

    // 특별 카드 뒤쪽 장식
    if (g === 'L') {
      add('M42 70 C20 50 6 56 4 40 C14 46 22 44 26 36 C30 48 36 50 42 58Z', '#FFFFFF', 0.95);
      add('M42 72 C24 66 12 72 8 62 C18 64 26 60 30 54 C34 62 38 64 44 66Z', '#F3E8FF', 0.95);
      add('M58 70 C80 50 94 56 96 40 C86 46 78 44 74 36 C70 48 64 50 58 58Z', '#FFFFFF', 0.95);
      add('M58 72 C76 66 88 72 92 62 C82 64 74 60 70 54 C66 62 62 64 56 66Z', '#F3E8FF', 0.95);
    }
    if (g === 'E') add('M36 74 C30 92 28 104 24 112 L76 112 C72 104 70 92 64 74 Z', ET.cape);
    if (special) add(circ(50, 70, 26), RT ? RT.glow : '#FFE08A', 0.22);

    var hx = 50, hy = 62, hr = 14, bodyFill = g === 'L' ? 'url(#ga-gx)' : fur.base;
    if (g === 'R') { var RT = RARE[n - 38] || RARE[0]; fur = { base: RT.base, light: RT.light, dark: RT.dark, ear: RT.glow }; bodyFill = fur.base; eye = RT.eye; }
    if (g === 'E') { var ET = EPIC[n - 45] || EPIC[0]; fur = { base: ET.base, light: ET.light, dark: ET.dark, ear: ET.cape }; bodyFill = fur.base; eye = ET.eye; }
    if (g === 'L') { fur = { base: '#3B2A7A', light: '#F4E9FF', dark: '#1B1446', ear: '#E36BD8' }; eye = '#FFE9A8'; }

    if (sp === 'bunny') {
      var fr2 = rng(hash('fur:' + s.id + ':' + n));
      var inner = '#F4B6C8', cheek = s.style === 'meadow' ? '#F2785C' : '#F7A8BE';
      var prop = special ? 'bouquet' : BPROP[n % BPROP.length][0];
      var bf = BFUR[(n * 3 + Math.floor(n / BPROP.length) * 2) % BFUR.length];
      if (prop === 'lettuce') bf = LOP[Math.floor(n / BPROP.length) % LOP.length];
      var furB = special ? fur.base : bf[1], shade = special ? fur.dark : bf[2], patch = special ? null : bf[3];
      var darkFur = /^#[0-5]/.test(furB), ink = darkFur ? '#1A1420' : '#2A2433';
      var SIDE_OK = { balloon: 1, juice: 1, bouquet: 1 };
      var ang = ['front', 'three', 'side', 'three', 'front'][(n * 3 + 1) % 5], dir = n % 2 ? 1 : -1;
      if (special) ang = 'front';
      if (ang === 'side' && !SIDE_OK[prop]) ang = 'three';
      function fluff(cx, cy, rx, ry, k) {
        var pts = [];
        for (var t = 0; t <= k; t++) { var a = t / k * Math.PI * 2; pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
        var d = 'M' + f1(pts[0][0]) + ' ' + f1(pts[0][1]);
        for (var t2 = 1; t2 <= k; t2++) { var am = (t2 - 0.5) / k * Math.PI * 2; d += 'Q' + f1(cx + Math.cos(am) * rx * 1.12) + ' ' + f1(cy + Math.sin(am) * ry * 1.12) + ' ' + f1(pts[t2][0]) + ' ' + f1(pts[t2][1]); }
        return d + 'Z';
      }
      function ear(x, y, h, lean, w) {
        w = w || 5.4;
        add('M' + f1(x - w * 0.6) + ' ' + f1(y) + ' C' + f1(x - w * 1.2 + lean * 0.5) + ' ' + f1(y - h * 0.6) + ' ' + f1(x - w * 0.9 + lean) + ' ' + f1(y - h) + ' ' + f1(x + lean) + ' ' + f1(y - h) + ' C' + f1(x + w * 0.9 + lean) + ' ' + f1(y - h) + ' ' + f1(x + w * 1.2 + lean * 0.5) + ' ' + f1(y - h * 0.6) + ' ' + f1(x + w * 0.6) + ' ' + f1(y) + 'Z', furB);
        add(ell(x + lean * 0.55, y - h * 0.55, w * 0.36, h * 0.33), darkFur ? '#C98FA2' : inner, 0.9);
      }
      function eyes(x, y, sep, far, sleepy) {
        var er = 3.3;
        [[x - sep, far < 0 ? 0.82 : 1], [x + sep, far > 0 ? 0.82 : 1]].forEach(function (e) {
          if (sleepy) { add('M' + f1(e[0] - 2.4) + ' ' + f1(y) + ' q2.4 1.8 4.8 0', 'none', 1, ink, 0.95); return; }
          if (special) add(circ(e[0], y, er + 2.2), eye, 0.35);
          if (darkFur) add(ell(e[0], y, er * e[1] + 0.8, er + 0.8), '#FFFFFF', 0.25);
          add(ell(e[0], y, er * e[1], er), special ? eye : ink);
          if (special) add(ell(e[0], y, er * e[1] * 0.5, er * 0.6), '#1A1430');
          add(circ(e[0] + 1.1, y - 1.2, 1.25), '#FFFFFF'); add(circ(e[0] - 1, y + 1.3, 0.6), '#FFFFFF', 0.9);
        });
      }
      function mouth(x, y) {
        add('M' + f1(x - 1.5) + ' ' + f1(y) + ' Q' + x + ' ' + f1(y - 0.9) + ' ' + f1(x + 1.5) + ' ' + f1(y) + ' Q' + x + ' ' + f1(y + 1.9) + ' ' + f1(x - 1.5) + ' ' + f1(y) + 'Z', '#E8789A');
        add('M' + f1(x - 2.6) + ' ' + f1(y + 2.6) + ' q1.3 1.4 2.6 0 q1.3 1.4 2.6 0', 'none', 1, darkFur ? '#E8B8C8' : '#8A4A60', 0.6);
      }
      function book(y, cover) {
        add('M10 ' + (y + 4) + ' L50 ' + (y + 8) + ' L90 ' + (y + 4) + ' L92 ' + (y + 16) + ' L50 ' + (y + 20) + ' L8 ' + (y + 16) + 'Z', cover);
        add('M12 ' + (y + 2) + ' Q30 ' + (y - 2) + ' 50 ' + (y + 5) + ' L50 ' + (y + 17) + ' Q30 ' + (y + 11) + ' 10 ' + (y + 14) + 'Z', '#FBF5E6');
        add('M88 ' + (y + 2) + ' Q70 ' + (y - 2) + ' 50 ' + (y + 5) + ' L50 ' + (y + 17) + ' Q70 ' + (y + 11) + ' 90 ' + (y + 14) + 'Z', '#FFFBF1');
        for (var l = 0; l < 3; l++) add('M16 ' + (y + 4 + l * 3) + ' Q30 ' + (y + 1 + l * 3) + ' 44 ' + (y + 7 + l * 3) + ' M56 ' + (y + 7 + l * 3) + ' Q70 ' + (y + 1 + l * 3) + ' 84 ' + (y + 4 + l * 3), 'none', 0.5, '#B9B2A2', 0.5);
      }
      function clov(x, y, k) { for (var c4 = 0; c4 < 4; c4++) { var a4 = c4 * Math.PI / 2 + 0.4; add(circ(x + Math.cos(a4) * k, y + Math.sin(a4) * k, k * 0.95), '#6DBA4E'); } add(circ(x, y, k * 0.4), '#4E9A43'); }
      function bouquet(x, y) {
        add('M' + (x - 2) + ' ' + (y + 12) + ' L' + (x - 4) + ' ' + y + ' M' + x + ' ' + (y + 12) + ' L' + x + ' ' + (y - 2) + ' M' + (x + 2) + ' ' + (y + 12) + ' L' + (x + 5) + ' ' + y, 'none', 1, '#4E8F3A', 0.8);
        [[x - 4, y], [x, y - 2], [x + 5, y], [x - 2, y - 4], [x + 3, y - 4]].forEach(function (b) { for (var bp2 = 0; bp2 < 6; bp2++) { var ba = bp2 / 6 * Math.PI * 2; add(circ(b[0] + Math.cos(ba) * 1.7, b[1] + Math.sin(ba) * 1.7, 1.2), '#FFFFFF'); } add(circ(b[0], b[1], 0.85), '#F2C94C'); });
      }
      function paw(x, y) { add(fluff(x, y, 3.8, 3.3, 6), furB, 1, shade, 0.7); P[P.length - 1].nl = 1; }

      if (prop === 'back') {
        add(ell(50, 110, 19, 3.4), '#1E3A6E', 0.16);
        add(fluff(50, 97, 18, 13.5, 16), furB);
        ear(44, 60, 26, -2); ear(56, 60, 26, 2);
        add(fluff(50, 72, 18, 15, 14), furB);
        if (patch) add(ell(56, 70, 8, 7), patch);
        add(fluff(50, 104, 5.5, 5, 8), darkFur ? '#FFFFFF' : shade);
        hx = 50; hy = 72; hr = 16;
      } else if (prop === 'apple') {
        book(96, '#B83A3A');
        add(fluff(60, 97, 23, 10.5, 16), furB);
        add('M30 90 C40 78 58 78 72 84 C62 84 46 86 36 94Z', furB); add('M34 89 C42 82 54 82 64 84 C56 85 44 87 38 91Z', inner, 0.7);
        add(fluff(35, 90, 15, 13, 12), furB); if (patch) add(ell(30, 86, 6, 5), patch);
        eyes(35, 90, 6.2, 0, true); mouth(35, 94);
        add(ell(26.5, 94.5, 4, 2.6), cheek, 0.6); add(ell(43.5, 94.5, 4, 2.6), cheek, 0.6);
        add(circ(35, 72, 7.5), '#C8352E'); add(ell(32.5, 69.5, 2.4, 3), '#FFFFFF', 0.45); add('M35 65 q1 -3 3 -4', 'none', 1, '#6B4226', 1.2); add(ell(39.5, 62.5, 3, 1.6), '#5FA36A');
        hx = 35; hy = 90; hr = 13;
      } else if (prop === 'bookball' || prop === 'glasses') {
        book(98, prop === 'glasses' ? '#B83A3A' : '#3E6FB8');
        add(ell(50, 101, 22, 3.4), '#3A2A20', 0.15);
        ear(44, 72, prop === 'glasses' ? 14 : 18, -1, 5); ear(56, 72, prop === 'glasses' ? 14 : 18, 1, 5);
        add(fluff(50, 87, 21, 17, 18), furB); if (patch) { add(ell(57, 80, 7, 6), patch); add(ell(40, 94, 6, 4), patch); }
        add(ell(50, 97, 14, 4.5), shade, 0.45);
        eyes(50, 83, 7, 0, false); mouth(50, 88);
        add(ell(39, 88, 4, 2.6), cheek, 0.6); add(ell(61, 88, 4, 2.6), cheek, 0.6);
        if (prop === 'glasses') { add(circ(46.5, 66, 2.6) + circ(53.5, 66, 2.6), 'none', 1, '#C9A24A', 0.8); add('M49.1 66 h1.8', 'none', 1, '#C9A24A', 0.8); }
        hx = 50; hy = 83; hr = 15;
      } else if (ang === 'side') {
        var hxs = 50 + 9 * dir;
        add(ell(50, 110, 21, 3.4), '#1E3A6E', 0.16);
        add(fluff(50 - 15 * dir, 99, 5.6, 5.2, 8), darkFur ? '#FFFFFF' : shade);
        add(fluff(50 - 3 * dir, 96, 18, 13, 16), furB);
        add(ell(50 - 8 * dir, 108, 10, 3), furB); P[P.length - 1].nl = 1;
        if (patch) add(ell(50 - 6 * dir, 92, 7, 6), patch);
        ear(hxs - 5 * dir, 62, 27, -6 * dir); ear(hxs + 1 * dir, 61, 25, -4 * dir);
        add(fluff(hxs, 72, 16, 14, 14), furB);
        if (patch) add(ell(hxs - 4 * dir, 68, 6, 5), patch);
        var exs = hxs + 6 * dir;
        if (special) add(circ(exs, 71, 5.4), eye, 0.35);
        if (darkFur) add(ell(exs, 71, 4.1, 4.1), '#FFFFFF', 0.25);
        add(ell(exs, 71, 3.3, 3.4), special ? eye : ink); add(circ(exs + 1.1 * dir, 69.8, 1.25), '#FFFFFF'); add(circ(exs - 0.9 * dir, 72.4, 0.6), '#FFFFFF', 0.9);
        mouth(hxs + 13 * dir, 75); add(ell(hxs + 7 * dir, 78, 4, 2.6), cheek, 0.6);
        paw(hxs + 1 * dir, 106);
        hx = hxs; hy = 72; hr = 15;
        if (prop === 'bouquet') bouquet(hxs + 6 * dir, 88);
        if (prop === 'balloon') { add('M' + f1(hxs + 2 * dir) + ' 104 Q' + f1(hxs + 10 * dir) + ' 76 ' + f1(hxs + 16 * dir) + ' 50', 'none', 1, '#8E8E96', 0.6); add(ell(hxs + 18 * dir, 42, 8, 10), '#F2A3C0'); add(ell(hxs + 15.5 * dir, 39, 2, 3), '#FFFFFF', 0.5); }
        if (prop === 'juice') { var jx = hxs + 14 * dir - 6; add('M' + f1(jx) + ' 94 h12 v20 a2 2 0 0 1 -2 2 h-8 a2 2 0 0 1 -2 -2Z', '#E8443A'); add('M' + f1(jx) + ' 100 h12 v7 h-12Z', '#FFFFFF'); add(circ(jx + 6, 103.5, 2), '#E8443A', 0.8); add('M' + f1(jx + 5) + ' 94 L' + f1(jx + 8) + ' 84', 'none', 1, '#FFFFFF', 1.6); }
      } else {
        var three = ang === 'three', fx = 50 + (three ? 4 * dir : 0), hxf = 50 + (three ? 2 * dir : 0);
        if (prop === 'clover') book(100, '#FFFFFF');
        add(ell(50, 110, 20, 3.4), '#1E3A6E', 0.16);
        if (three) add(fluff(50 - 17 * dir, 100, 5.4, 5, 8), darkFur ? '#FFFFFF' : shade);
        if (prop !== 'lettuce') { ear(hxf - 7, 58, 27, three ? -3 * dir : -2); ear(hxf + 7, 58, 27, three ? -1 * dir : 2); }
        add(fluff(50, 97, 18, 13.5, 16), furB);
        if (patch) add(ell(42, 98, 6, 5), patch);
        add(ell(43, 109, 5.6, 2.8), furB); P[P.length - 1].nl = 1; add(ell(57, 109, 5.6, 2.8), furB); P[P.length - 1].nl = 1;
        if (g === 'R') for (var qb = 0; qb < 6; qb++) add(star4(38 + r() * 24, 88 + r() * 14, 1 + r()), RT.dots, 0.9);
        add(fluff(hxf, 70, 19, 16, 14), furB);
        if (patch) add(ell(hxf + 7, 64, 8, 7), patch);
        if (prop === 'lettuce') {
          add('M' + f1(hxf - 14) + ' 62 C' + f1(hxf - 22) + ' 66 ' + f1(hxf - 23) + ' 84 ' + f1(hxf - 19) + ' 92 C' + f1(hxf - 15) + ' 94 ' + f1(hxf - 12) + ' 88 ' + f1(hxf - 12) + ' 80 C' + f1(hxf - 11) + ' 72 ' + f1(hxf - 10) + ' 66 ' + f1(hxf - 10) + ' 62Z', shade);
          add('M' + f1(hxf + 14) + ' 62 C' + f1(hxf + 22) + ' 66 ' + f1(hxf + 23) + ' 84 ' + f1(hxf + 19) + ' 92 C' + f1(hxf + 15) + ' 94 ' + f1(hxf + 12) + ' 88 ' + f1(hxf + 12) + ' 80 C' + f1(hxf + 11) + ' 72 ' + f1(hxf + 10) + ' 66 ' + f1(hxf + 10) + ' 62Z', shade);
        }
        eyes(fx, 70, 7.4, three ? -dir : 0, prop === 'lettuce');
        mouth(fx, 75);
        add(ell(fx - 10.2, 76, 4.4, 2.8), cheek, 0.6); add(ell(fx + 10.2, 76, 4.4, 2.8), cheek, 0.6);
        hx = hxf; hy = 70; hr = 16;
        if (s.style === 'meadow') { var fs = '', fh = ''; for (var fz = 0; fz < 26; fz++) { var fa = fr2(), fb = fr2(); var px2 = 50 + (fa - 0.5) * 30, py2 = 90 + fb * 16; fs += 'M' + f1(px2) + ' ' + f1(py2) + 'q1 -1.6 2.4 -1.2'; var qx = hxf + (fr2() - 0.5) * 28, qy = 58 + fr2() * 8; fh += 'M' + f1(qx) + ' ' + f1(qy) + 'q1.2 -1 2.4 -0.4'; } add(fs, 'none', 0.45, shade, 0.7); add(fh, 'none', 0.6, '#FFFFFF', 0.6); }
        if (prop === 'comic') {
          add('M30 84 L50 88 L70 84 L72 104 L50 108 L28 104Z', '#FFE36B'); add('M50 88 L50 108', 'none', 1, '#C9A227', 0.8);
          add('M32 87 L48 90 L48 93 L32 90Z', '#E0457B'); add('M52 90 L68 87 L68 90 L52 93Z', '#3E7BD6');
          add(circ(40, 98, 3.4), '#3E7BD6'); add('M56 96 l4 -3 l3 4 l4 -2', 'none', 1, '#141414', 1); add(star5(62, 101, 2.6), '#E0457B');
          paw(42, 94); paw(58, 94);
          add('M' + f1(fx - 10.5) + ' 69.5 h7 a3.6 3.2 0 0 1 -7 1Z M' + f1(fx + 3.5) + ' 69.5 h7 a3.6 3.2 0 0 1 -7 1Z', '#141414');
          add('M' + f1(fx - 11) + ' 69 h8 M' + f1(fx + 3) + ' 69 h8 M' + f1(fx - 3) + ' 70 q3 -1.4 6 0', 'none', 1, '#141414', 1.1);
          add('M74 112 L78 96 L92 98 L90 114Z', '#D93A2B'); add('M78 100 L90 102 L89 106 L77 104Z', '#F2C94C');
        } else if (prop === 'chips') {
          add('M36 88 L64 88 L66 110 L34 110Z', '#D93A2B'); add('M36 88 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l3 3Z', '#D93A2B');
          add(ell(50, 99, 8, 5.4), '#F2C94C'); add(circ(47, 97, 1), '#D9744A'); add(circ(52, 100, 1), '#D9744A');
          paw(38, 90); paw(62, 90); add(ell(fx, 78.5, 2.4, 1.6), '#F2C94C');
        } else if (prop === 'juice') {
          paw(43, 94); paw(57, 94);
          add('M74 94 h12 v20 a2 2 0 0 1 -2 2 h-8 a2 2 0 0 1 -2 -2Z', '#E8443A'); add('M74 100 h12 v7 h-12Z', '#FFFFFF'); add(circ(80, 103.5, 2), '#E8443A', 0.8);
          add('M79 94 L82 84', 'none', 1, '#FFFFFF', 1.6);
        } else if (prop === 'carrot') {
          add('M36 106 L60 84 L64 88 Z', '#F08A3A'); add('M60 84 q4 -6 8 -6 q-2 4 -4 10 M62 86 q6 -2 9 1 q-4 1 -7 3', '#5FA36A', 1, '#5FA36A', 0.8);
          add('M44 98 l3 1 M50 92 l3 1', 'none', 0.6, '#C9672F', 0.6); paw(44, 95); paw(56, 92);
        } else if (prop === 'crown') {
          var cols2 = ['#F6A9BE', '#FFFFFF', '#F2C94C', '#B9A6FF', '#F6A9BE', '#FFFFFF', '#F2C94C'];
          for (var fc = 0; fc < 7; fc++) { var ax = hxf - 13 + fc * 4.4, ay = 56 + Math.abs(fc - 3) * 1.4; add(circ(ax, ay, 2.5), cols2[fc]); add(circ(ax, ay, 0.9), '#F2C94C'); }
          paw(43, 94); paw(57, 94);
        } else if (prop === 'phones') {
          add('M' + f1(hxf - 19) + ' 68 Q' + f1(hxf - 19) + ' 46 ' + hxf + ' 46 Q' + f1(hxf + 19) + ' 46 ' + f1(hxf + 19) + ' 68', 'none', 1, '#3E3A56', 2.2); add(ell(hxf - 19, 70, 3.8, 5.6), '#F2A3C0'); add(ell(hxf + 19, 70, 3.8, 5.6), '#F2A3C0');
          add('M74 58 l2 -6 l3 2 M80 62 l1.6 -5 l2.6 1.6', 'none', 0.8, '#3E7BD6', 1); paw(43, 94); paw(57, 94);
        } else if (prop === 'tea') {
          add('M42 90 h16 v8 a8 6 0 0 1 -16 0Z', '#FFFFFF'); add('M42 90 h16 v8 a8 6 0 0 1 -16 0Z', 'none', 1, '#B9C3CF', 0.6); add(ell(50, 90, 8, 1.8), '#C98B4B');
          add('M58 92 q4 0 4 3 q0 3 -4 3', 'none', 1, '#B9C3CF', 1.2); add('M46 84 q-2 -3 0 -6 M52 84 q-2 -3 0 -6', 'none', 0.7, '#FFFFFF', 0.8);
          paw(41, 96); paw(59, 96);
        } else if (prop === 'scarf') {
          add('M' + f1(hxf - 15) + ' 84 Q' + hxf + ' 90 ' + f1(hxf + 15) + ' 84 L' + f1(hxf + 15) + ' 88 Q' + hxf + ' 94 ' + f1(hxf - 15) + ' 88Z', '#E0457B'); add('M' + f1(hxf + 7) + ' 88 l3 10 l-3.4 1 l-2.8 -9Z', '#E0457B'); paw(43, 96); paw(57, 96);
        } else if (prop === 'balloon') {
          add('M60 94 Q68 72 76 52', 'none', 1, '#8E8E96', 0.6); add(ell(78, 44, 8, 10), '#F2A3C0'); add(ell(75.5, 41, 2, 3), '#FFFFFF', 0.5); paw(43, 95); paw(59, 94);
        } else if (prop === 'lettuce') {
          add('M' + f1(fx) + ' 78 C' + f1(fx + 8) + ' 74 ' + f1(fx + 22) + ' 76 ' + f1(fx + 26) + ' 84 C' + f1(fx + 22) + ' 90 ' + f1(fx + 10) + ' 90 ' + f1(fx + 2) + ' 84Z', '#7CC46A'); add('M' + f1(fx + 2) + ' 80 C' + f1(fx + 10) + ' 78 ' + f1(fx + 18) + ' 80 ' + f1(fx + 24) + ' 84', 'none', 1, '#4E9A43', 0.8);
          paw(44, 93);
        } else if (prop === 'clover') {
          clov(hxf - 3, 55, 2.6); clov(16, 112, 3); clov(84, 106, 3.4); clov(18, 82, 2.2); clov(84, 80, 2.4);
          paw(43, 102); paw(57, 102);
        } else { bouquet(50, 86); paw(46, 96); paw(55, 96); }
      }
    } else if (sp === 'whale') {
      add(ell(52, 90, 34, 18), bodyFill); add(ell(54, 98, 26, 9), fur.light || '#FFFFFF', 0.9);
      add('M84 86 L98 74 L96 90 L98 104 Z', bodyFill);
      add(circ(34, 86, 2.4), '#141414'); add(circ(33.3, 85.3, 0.8), '#FFFFFF');
      add('M36 94 q4 3 8 0', 'none', 1, '#141414', 0.8);
      add('M48 70 q-2 -8 -6 -10 M48 70 q2 -8 6 -10 M48 70 v-10', 'none', 1, '#CFE8F3', 1.4);
      add(circ(30, 92, 2.4), '#F6C1D0', 0.6);
      hx = 40; hy = 80; hr = 10;
    } else if (sp === 'house') {
      var wall = pick(r, ['#F2E2C6', '#F7D9C4', '#E3EED8', '#E8E1F5', '#F5E6A8']), roof = pick(r, [s.w2, '#B85C3C', '#5E8A4E', '#7E66B5']);
      add('M28 74 H72 V104 H28 Z', special ? '#FFF4D6' : wall);
      add('M22 76 L50 48 L78 76 Z', special ? '#D98A1E' : roof);
      add('M62 56 H68 V66 H62 Z', special ? '#B86A10' : roof);
      add(circ(66, 50, 3), '#FFFFFF', 0.5); add(circ(70, 44, 4), '#FFFFFF', 0.4);
      add(ell(40, 84, 5, 5), '#FFFFFF'); add(ell(60, 84, 5, 5), '#FFFFFF');
      add(circ(40.6, 85, 2.4), '#141414'); add(circ(60.6, 85, 2.4), '#141414');
      add('M44 94 h12 v10 h-12 Z', '#7E4A2C'); add('M46 92 q4 3 8 0', 'none', 1, '#141414', 0.8);
      add(circ(35, 92, 2.2), '#F6C1D0', 0.7); add(circ(65, 92, 2.2), '#F6C1D0', 0.7);
      hx = 50; hy = 62; hr = 20;
    } else if (sp === 'ghost' || sp === 'blob') {
      if (sp === 'ghost') add('M34 104 V70 a16 16 0 0 1 32 0 V104 l-5.3 -5 l-5.3 5 l-5.4 -5 l-5.3 5 l-5.4 -5Z', bodyFill);
      else { add(ell(50, 84, 20, 18), bodyFill); add(ell(50, 100, 14, 3), '#000000', 0.15); add(ell(44, 76, 5, 3), '#FFFFFF', 0.45); }
      hx = 50; hy = sp === 'ghost' ? 76 : 82; hr = 13;
      face(hx, hy, hr, true);
    } else if (pose === 'back') {
      add('M62 96 q13 1 14 -8 q1 -7 -5 -8 q-3 0 -3 3', 'none', 1, fur.base, 3.6);
      add('M36 100 C33 84 38 74 50 74 C62 74 67 84 64 100 Q50 104 36 100Z', bodyFill);
      add(circ(50, 64, 11), bodyFill);
      ears(50, 64, 11, true);
      add('M40 73 Q50 78 60 73 L60.3 76.6 Q50 82 39.7 76.6Z', '#E0457B');
      hx = 50; hy = 64; hr = 11;
    } else if (pose === 'sleep') {
      add('M70 102 q12 -2 10 -10', 'none', 1, fur.base, 3.4);
      add(ell(52, 96, 24, 10), bodyFill);
      if (fur.stripes) { add('M50 88 q2 4 0 8 M56 88 q2 4 0 8 M62 89 q2 4 0 7', 'none', 1, fur.dark, 1.4); }
      add(circ(32, 92, 10), bodyFill); ears(32, 92, 10, false);
      add('M27 92 q2 2 4 0 M33 92 q2 2 4 0', 'none', 1, '#141414', 0.8);
      add('M31 96 l1 1 l1 -1', 'none', 1, '#141414', 0.6);
      add('M42 74 h4 l-4 4 h4 M48 66 h5 l-5 5 h5', 'none', 0.8, '#FFFFFF', 0.9);
      hx = 32; hy = 92; hr = 10;
    } else {
      var loaf = pose === 'loaf';
      if (!loaf) add('M62 98 C76 96 76 82 70 78', 'none', 1, fur.base, 4);
      if (loaf) add(ell(50, 96, 22, 11), bodyFill);
      else add('M37 102 C33 86 38 72 50 72 C62 72 67 86 63 102Z', bodyFill);
      if (fur.chest || fur.patches || fur.points || g === 'L') add(ell(50, loaf ? 96 : 90, loaf ? 10 : 7, loaf ? 7 : 9), fur.light);
      if (fur.patches) { add(ell(41, 94, 6, 5), fur.patches[0]); add(ell(60, 86, 5, 4), fur.patches[1]); }
      if (fur.stripes) add((loaf ? 'M60 90 q3 3 0 7 M65 91 q3 3 0 6' : 'M58 82 q3 3 0 6 M60 90 q3 3 0 6'), 'none', 1, fur.dark, 1.4);
      if (g === 'R') for (var q = 0; q < 6; q++) add(star4(40 + r() * 20, 80 + r() * 18, 1 + r()), RT.dots, 0.9);
      if (!loaf) { add(ell(45, 102, 4.2, 2.6), fur.points ? fur.dark : bodyFill); add(ell(55, 102, 4.2, 2.6), fur.points ? fur.dark : bodyFill); }
      hx = 50; hy = loaf ? 80 : 62; hr = loaf ? 13 : 14;
      ears(hx, hy, hr, false);
      add(circ(hx, hy, hr), bodyFill);
      if (sp === 'fox') add('M' + f1(hx - hr * 0.9) + ' ' + f1(hy + 1) + ' Q' + hx + ' ' + f1(hy + hr * 1.4) + ' ' + f1(hx + hr * 0.9) + ' ' + f1(hy + 1) + ' Q' + hx + ' ' + f1(hy + hr * 0.4) + ' ' + f1(hx - hr * 0.9) + ' ' + f1(hy + 1) + 'Z', fur.light);
      if (sp === 'bear') add(ell(hx, hy + hr * 0.38, hr * 0.42, hr * 0.32), fur.light);
      if (fur.points) add(ell(hx, hy + 3, hr * 0.55, hr * 0.5), fur.dark, 0.55);
      if (fur.patches) add(ell(hx - 6, hy - 6, 6, 5), fur.patches[0]);
      if (fur.stripes) add('M' + f1(hx - 3) + ' ' + f1(hy - hr + 2) + ' v4 M' + hx + ' ' + f1(hy - hr + 1.5) + ' v5 M' + f1(hx + 3) + ' ' + f1(hy - hr + 2) + ' v4', 'none', 1, fur.dark, 1.3);
      if (fur.chest) add(ell(hx, hy + hr * 0.55, hr * 0.42, hr * 0.32), fur.light);
      if (g === 'L') add('M' + f1(hx + 2) + ' ' + f1(hy - 9) + ' a4 4 0 1 1 -1 -7 a3 3 0 1 0 1 7Z', '#FFE9A8');
      face(hx, hy, hr, sp !== 'bear');
    }

    // 소품
    var nx = hx, ny = hy + hr * 0.95;
    if (sp !== 'whale' && sp !== 'house' && sp !== 'bunny' && pose !== 'sleep' && pose !== 'back') {
      if (acc === 'scarf') { var sc = pick(r, ['#E0457B', '#3E7BD6', '#F2C94C', '#5FA36A']); add('M' + f1(nx - 11) + ' ' + f1(ny - 2) + ' Q' + nx + ' ' + f1(ny + 3) + ' ' + f1(nx + 11) + ' ' + f1(ny - 2) + ' L' + f1(nx + 11) + ' ' + f1(ny + 1.6) + ' Q' + nx + ' ' + f1(ny + 7) + ' ' + f1(nx - 11) + ' ' + f1(ny + 1.6) + 'Z', sc); add('M' + f1(nx + 5) + ' ' + f1(ny + 2) + ' l3 9 l-3 1 l-3 -8Z', sc); }
      if (acc === 'bell') { add('M' + f1(nx - 10) + ' ' + f1(ny - 1) + ' Q' + nx + ' ' + f1(ny + 3) + ' ' + f1(nx + 10) + ' ' + f1(ny - 1), 'none', 1, '#E0457B', 2); add(circ(nx, ny + 3.6, 2.6), '#F2C94C'); add('M' + f1(nx - 1.2) + ' ' + f1(ny + 4) + ' h2.4', 'none', 1, '#A07A12', 0.6); }
      if (acc === 'bow') { var bx = hx + hr * 0.62, by = hy - hr * 0.7, bc = pick(r, ['#E0457B', '#F2A3C0', '#6FB7F0']); add(tri([bx, by], [bx - 6, by - 4], [bx - 6, by + 4]), bc); add(tri([bx, by], [bx + 6, by - 4], [bx + 6, by + 4]), bc); add(circ(bx, by, 1.6), '#FFFFFF', 0.8); }
      if (acc === 'hat') { var hc = pick(r, ['#3E2F7A', '#2B4A7A', '#7A2F4E']); add(tri([hx - hr * 0.9, hy - hr * 0.6], [hx + hr * 0.4, hy - hr * 2.3], [hx + hr * 0.9, hy - hr * 0.6]), hc); add(ell(hx, hy - hr * 0.6, hr * 1.1, 2.6), hc); add(star5(hx + hr * 0.1, hy - hr * 1.2, 2.6), '#F2C94C'); }
      if (acc === 'glasses') { add(circ(hx - hr * 0.36, hy, 3.8) + circ(hx + hr * 0.36, hy, 3.8), 'none', 1, '#141414', 0.9); add('M' + f1(hx - 1.2) + ' ' + f1(hy) + ' h2.4', 'none', 1, '#141414', 0.9); }
      if (acc === 'fish') { add('M58 104 q8 -6 14 0 q-6 6 -14 0Z', '#8FB7D6'); add(tri([72, 104], [77, 100], [77, 108]), '#8FB7D6'); add(circ(61, 103.4, 0.8), '#141414'); }
      if (acc === 'flower') { var fx = hx - hr * 0.7, fy = hy - hr * 0.75, fc = pick(r, ['#F6C1D0', '#FFFFFF', '#F2C94C']); for (var p = 0; p < 5; p++) { var an = p * 1.2566; add(circ(fx + Math.cos(an) * 2.4, fy + Math.sin(an) * 2.4, 1.9), fc); } add(circ(fx, fy, 1.4), '#F2C94C'); }
    }
    // 특별 카드 앞쪽 장식
    if (g === 'E' && ET.role === 'wizard') {
      add(tri([hx - hr * 0.95, hy - hr * 0.6], [hx + hr * 0.5, hy - hr * 2.5], [hx + hr * 0.95, hy - hr * 0.6]), '#4A1E7A'); add(ell(hx, hy - hr * 0.6, hr * 1.2, 2.8), '#4A1E7A');
      add(star5(hx + hr * 0.15, hy - hr * 1.3, 2.8), '#F2C94C'); add(circ(hx - hr * 0.3, hy - hr * 1.0, 0.9), '#F2C94C');
      add('M70 104 L80 70', 'none', 1, '#8A5A2E', 2); add(star5(80.6, 68, 4.4), '#F2C94C'); add(circ(80.6, 68, 7), '#FFE08A', 0.3);
    }
    if (g === 'E' && ET.role === 'knight') {
      add('M' + f1(hx - 9) + ' ' + f1(hy - hr * 0.7) + ' Q' + hx + ' ' + f1(hy - hr * 1.5) + ' ' + f1(hx + 9) + ' ' + f1(hy - hr * 0.7) + 'Z', '#AEB6C8');
      add('M' + hx + ' ' + f1(hy - hr * 1.3) + ' q8 -8 14 -2 q-8 0 -14 6Z', '#E0457B');
      add('M74 108 L74 70', 'none', 1, '#DDE3EE', 2.4); add('M69 92 H79', 'none', 1, '#D9B24A', 2.2); add(circ(74, 68.6, 1.6), '#D9B24A');
    }
    if (g === 'E' && ET.role === 'guardian') {
      add(ell(hx, hy - hr - 5, 10, 2.6), 'none', 1, '#F2D27A', 1.6);
      add('M70 80 h16 v10 q0 10 -8 14 q-8 -4 -8 -14Z', '#1F8A7A'); add('M70 80 h16 v10 q0 10 -8 14 q-8 -4 -8 -14Z', 'none', 1, '#F2D27A', 1.2); add(star5(78, 89, 3.6), '#F2D27A');
    }
    if (g === 'E' && ET.role === 'king') {
      var cy = hy - hr * 0.95;
      add('M' + f1(hx - 10) + ' ' + f1(cy) + ' L' + f1(hx - 10) + ' ' + f1(cy - 9) + ' L' + f1(hx - 5) + ' ' + f1(cy - 4) + ' L' + hx + ' ' + f1(cy - 11) + ' L' + f1(hx + 5) + ' ' + f1(cy - 4) + ' L' + f1(hx + 10) + ' ' + f1(cy - 9) + ' L' + f1(hx + 10) + ' ' + f1(cy) + 'Z', '#F2C94C');
      add(circ(hx, cy - 4, 1.6), '#E0457B'); add(circ(hx - 6, cy - 2.4, 1.1), '#6FB7F0'); add(circ(hx + 6, cy - 2.4, 1.1), '#7ED37A');
    }
    if (g === 'L') add(ell(hx, hy - hr - 6, 11, 3), 'none', 1, '#FFE9A8', 1.6);
    if (special) for (var z = 0; z < (g === 'L' ? 14 : 9); z++) add(star4(6 + r() * 88, 8 + r() * 96, 1.2 + r() * 2.6), '#FFFFFF', 0.6 + r() * 0.4);

    function ears(x, y, rr, back) {
      var e = fur.ear;
      if (sp === 'bunny') {
        add(ell(x - rr * 0.42, y - rr * 1.5, rr * 0.3, rr * 0.9), bodyFill); add(ell(x + rr * 0.42, y - rr * 1.5, rr * 0.3, rr * 0.9), bodyFill);
        if (!back) { add(ell(x - rr * 0.42, y - rr * 1.45, rr * 0.15, rr * 0.65), e); add(ell(x + rr * 0.42, y - rr * 1.45, rr * 0.15, rr * 0.65), e); }
      } else if (sp === 'bear') {
        add(circ(x - rr * 0.75, y - rr * 0.72, rr * 0.38), bodyFill); add(circ(x + rr * 0.75, y - rr * 0.72, rr * 0.38), bodyFill);
        add(circ(x - rr * 0.75, y - rr * 0.72, rr * 0.2), e); add(circ(x + rr * 0.75, y - rr * 0.72, rr * 0.2), e);
      } else {
        var big = sp === 'fox' ? 1.65 : 1.35;
        add(tri([x - rr * 0.92, y - rr * 0.28], [x - rr * 0.72, y - rr * big], [x - rr * 0.1, y - rr * 0.86]), bodyFill);
        add(tri([x + rr * 0.92, y - rr * 0.28], [x + rr * 0.72, y - rr * big], [x + rr * 0.1, y - rr * 0.86]), bodyFill);
        add(tri([x - rr * 0.72, y - rr * 0.5], [x - rr * 0.64, y - rr * (big - 0.3)], [x - rr * 0.32, y - rr * 0.78]), e);
        add(tri([x + rr * 0.72, y - rr * 0.5], [x + rr * 0.64, y - rr * (big - 0.3)], [x + rr * 0.32, y - rr * 0.78]), e);
      }
    }
    function face(x, y, rr, whiskers) {
      var ex = rr * 0.36, ey = y - rr * 0.02;
      if (special) { add(circ(x - ex, ey, 4.2), eye, 0.3); add(circ(x + ex, ey, 4.2), eye, 0.3); }
      add(ell(x - ex, ey, 2.9, 3.4), eye); add(ell(x + ex, ey, 2.9, 3.4), eye);
      add(ell(x - ex, ey + 0.2, 1.1, 2.7), '#141414'); add(ell(x + ex, ey + 0.2, 1.1, 2.7), '#141414');
      add(circ(x - ex + 1, ey - 1.2, 0.9), '#FFFFFF'); add(circ(x + ex + 1, ey - 1.2, 0.9), '#FFFFFF');
      var ny2 = y + rr * 0.32;
      add(tri([x - 1.6, ny2], [x + 1.6, ny2], [x, ny2 + 1.8]), '#E88AA2');
      add('M' + x + ' ' + f1(ny2 + 1.8) + ' q-1.8 2 -3.6 1 M' + x + ' ' + f1(ny2 + 1.8) + ' q1.8 2 3.6 1', 'none', 1, '#141414', 0.6);
      add(circ(x - rr * 0.6, ny2 + 1.5, 1.9), '#F6A9BE', 0.5); add(circ(x + rr * 0.6, ny2 + 1.5, 1.9), '#F6A9BE', 0.5);
      if (whiskers && (sp === 'cat' || sp === 'fox')) add('M' + f1(x - 4) + ' ' + f1(ny2 + 1) + ' l-8 -1.6 M' + f1(x - 4) + ' ' + f1(ny2 + 2.4) + ' l-8 1 M' + f1(x + 4) + ' ' + f1(ny2 + 1) + ' l8 -1.6 M' + f1(x + 4) + ' ' + f1(ny2 + 2.4) + ' l8 1', 'none', 0.8, fur.base === '#F3F0EA' || fur.base === '#EFE3CF' ? '#9C9384' : '#FFFFFF', 0.45);
    }

    if (meadow) {
      var fr = rng(hash('front:' + s.id + ':' + n));
      if (scene === 1) for (var hq = 0; hq < 3; hq++) { var hx3 = [8, 50, 92][hq], hy3 = 122; for (var hp2 = 0; hp2 < 10; hp2++) { var px = hx3 + (fr() - 0.5) * 18, py = hy3 + (fr() - 0.5) * 10, pc = ['#4C7BE0', '#7FA6F0', '#3E6FD8'][hp2 % 3]; for (var q5 = 0; q5 < 4; q5++) { var qa2 = q5 * Math.PI / 2 + 0.6; add(circ(px + Math.cos(qa2) * 1.4, py + Math.sin(qa2) * 1.4, 1.35), pc); } add(circ(px, py, 0.5), '#F2C94C'); } }
      if (scene === 3) { var gr = ''; for (var gb = 0; gb < 60; gb++) { var gx = fr() * 100; gr += 'M' + f1(gx) + ' 130 q' + f1((fr() - 0.5) * 3) + ' -' + f1(5 + fr() * 6) + ' ' + f1((fr() - 0.5) * 6) + ' -' + f1(9 + fr() * 8); } add(gr, 'none', 0.9, '#1F3A2A', 0.9); }
      else for (var d2 = 0; d2 < 7; d2++) { var dx = fr() * 100, dy = 114 + fr() * 14, dr = 2.6 + fr() * 1.6; for (var pe = 0; pe < 7; pe++) { var pa = pe / 7 * Math.PI * 2; add(ell(dx + Math.cos(pa) * dr, dy + Math.sin(pa) * dr * 0.8, dr * 0.55, dr * 0.42), '#FFFFFF'); } add(circ(dx, dy, dr * 0.45), '#F2C230'); }
      for (var c3 = 0; c3 < 8; c3++) { var cx3 = fr() * 100, cy3 = 112 + fr() * 16; for (var cp = 0; cp < 5; cp++) add(circ(cx3 + (fr() - 0.5) * 4, cy3 + (fr() - 0.5) * 3, 1.1 + fr() * 0.6), cp % 2 ? '#3E6FD8' : '#6A93F0'); }
      var mx = n % 2 ? 12 : 88; if (scene !== 3) { add('M' + (mx - 2) + ' 126 h4 v-6 h-4Z', '#F4E6CC'); add('M' + (mx - 6) + ' 121 Q' + mx + ' 110 ' + (mx + 6) + ' 121Z', '#D9412E'); add(circ(mx - 2, 117, 0.9), '#FFFFFF'); add(circ(mx + 2, 118, 0.8), '#FFFFFF'); }
    }
    if (ph && !gray) for (var o2 = figStart; o2 < P.length; o2++) { var q2 = P[o2]; if (!q2.nl && q2.s === 'none' && q2.f !== 'none' && q2.o > 0.6) { q2.s = '#2A4470'; q2.w = 0.55; } }
    if (gray) P = P.map(function (x, i) { if (x.img) return { d: 'M0 0H100V130H0Z', f: '#E6E5EA', o: 1, s: 'none', w: 0 }; return { d: x.d, f: x.f === 'none' ? 'none' : (i === 0 ? '#E6E5EA' : '#CFCED6'), o: i === 0 ? 1 : Math.min(1, x.o + 0.2), s: x.s === 'none' ? 'none' : '#CFCED6', w: x.w }; });
    return P;
  }

  /* 뽑기: 확률 50/25/15/8/2, 10회는 마지막 장 Rare 이상 확정 */
  function rollOne(minRare) {
    var x = Math.random() * 100, g;
    if (minRare) g = x < 60 ? 'R' : x < 90 ? 'E' : 'L';
    else g = x < 50 ? 'C' : x < 75 ? 'U' : x < 90 ? 'R' : x < 98 ? 'E' : 'L';
    var range = { C: [0, 25], U: [25, 38], R: [38, 45], E: [45, 49], L: [49, 50] }[g];
    return range[0] + Math.floor(Math.random() * (range[1] - range[0]));
  }

  function param(k) { try { var m = new RegExp('[?&]' + k + '=([^&#]+)').exec(location.search); return m ? decodeURIComponent(m[1]) : ''; } catch (e) { return ''; } }

  window.GCARD = {
    N: N, GRADES: GRADES, grade: grade, name: name, draw: draw,
    info: function (n) { return GRADES[grade(n)]; },
    no: function (n) { return ('00' + (n + 1)).slice(-3) + '/050'; },
    roll: function () { return rollOne(false); },
    roll10: function () { var a = []; for (var i = 0; i < 9; i++) a.push(rollOne(false)); a.push(rollOne(true)); return a; },
    param: param,
    // 내가 가진 카드 번호 목록 (로그인 계정이 있으면 그 기록, 없으면 예시)
    owned: function (sid) {
      var GA = window.GA;
      if (GA && GA.signedIn) { var o = {}; (GA.prof.pulls || []).forEach(function (q) { if (q.s === sid && q.i >= 0 && q.i < N) o[q.i] = 1; }); return Object.keys(o).map(Number).sort(function (a, b) { return a - b; }); }
      var want = { night: 23, bunny: 31, sea: 12, dusk: 18, forest: 50, pink: 9 }[sid] || 0, r = rng(hash('own:' + sid)), set = {};
      while (Object.keys(set).length < want) { var x = Math.floor(Math.pow(r(), 1.35) * N); set[x] = 1; }
      return Object.keys(set).map(Number).sort(function (a, b) { return a - b; });
    }
  };
})();

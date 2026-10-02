/* 가챠 아트 예시 데이터: 시리즈·작가 목록 (모든 화면이 같이 씀) */
(function () {
  var A = {
    'moonlit_draws': { name: '달빛 그리는 사람', av: '#B3AEEA', followers: '2,410', fans: 86, bio: '밤에만 그림 그려요. 고양이 좋아함' },
    'sea_mint': { name: '바다 민트', av: '#9CCBD3', followers: '1,870', fans: 54, bio: '새벽 바다랑 고래를 그려요' },
    'pixel_hana': { name: '픽셀 하나', av: '#F1C6A8', followers: '3,102', fans: 121, bio: '한 칸 한 칸 찍어 그리는 픽셀 골목' },
    'yeon.art': { name: '연', av: '#C6D8A9', followers: '958', fans: 37, bio: '작은 집과 정원을 그립니다' },
    'ddong_gom': { name: '똥곰', av: '#CFC7B8', followers: '4,330', fans: 203, bio: '겨울잠 자는 곰 이야기' },
    'coral.p': { name: '코랄', av: '#E8C6D8', followers: '612', fans: 18, bio: '분홍빛 섬과 바다' },
    'sunny.d': { name: '써니', av: '#F2E3A0', followers: '402', fans: 9, bio: '노란 오후를 좋아해요' },
    'fox.and': { name: '여우와', av: '#E9B48F', followers: '1,240', fans: 44, bio: '여우랑 같이 산책하는 그림일기' },
    'moa.moa': { name: '모아', av: '#BCD4F0', followers: '5,780', fans: 260, bio: '구름 위 토끼 캐릭터 작가' },
    'lav.field': { name: '라벤더 들', av: '#D4C6EC', followers: '733', fans: 25, bio: '보라색 들판만 그려요' },
    'boo.boo': { name: '부부', av: '#8F86B0', followers: '1,505', fans: 61, bio: '귀여운 꼬마 유령 시리즈' }
  };
  // fig: 그림 속 주인공 (cat 고양이, house 집, whale 고래, ghost 유령, bunny 토끼, fox 여우, '' 없음)
  var S = [
    ['night', '밤의 고양이', 'moonlit_draws', 3000, '인기', '동물', 'D-7', 1208, '#26215C', '#F4E9C8', '#F2C94C', '#4B3FB0', '#342A86', '#120F2E', 'cat'],
    ['sea', '새벽 바다', 'sea_mint', 2500, 'D-3', '풍경', 'D-3', 876, '#123E4C', '#F5D7A8', '#F5D7A8', '#2E8C98', '#1D6672', '#0B2A33', ''],
    ['dusk', '노을 골목', 'pixel_hana', 3000, '', '픽셀', 'D-10', 842, '#F2B38A', '#FFF1D6', '#FFF1D6', '#D9745B', '#A64B3C', '#7E3428', 'house'],
    ['forest', '숲속 우체국', 'yeon.art', 2000, '신규', '일러스트', 'D-14', 2031, '#DCE8C8', '#FFFFFF', '#FFFFFF', '#7FA36A', '#4E7440', '#B85C3C', 'house'],
    ['snow', '겨울 곰', 'ddong_gom', 3500, '', '캐릭터', 'D-5', 615, '#E8EDF4', '#FFFFFF', '#C7D2E3', '#AEBBD0', '#7C8BA6', '#6B5A4A', 'bear'],
    ['pink', '분홍 섬', 'coral.p', 2500, '', '풍경', 'D-9', 377, '#F7D5DE', '#FFF4F6', '#FFFFFF', '#E08CA3', '#B85C78', '#8E3F5A', ''],
    ['lemon', '레몬 오후', 'sunny.d', 2000, '신규', '일러스트', 'D-12', 120, '#FFF3C4', '#FFFFFF', '#FFFFFF', '#F2C94C', '#C9A227', '#8C7012', ''],
    ['fox', '여우 산책', 'fox.and', 3000, '', '동물', 'D-6', 534, '#F6D8C2', '#FFF6EE', '#FFFFFF', '#E2895A', '#B35E36', '#C9672F', 'fox'],
    ['bunny', '구름 토끼', 'moa.moa', 2500, '인기', '캐릭터', 'D-4', 3340, '#DCEBFA', '#FFFFFF', '#FFFFFF', '#9DC3EA', '#6C9BCB', '#FFFFFF', 'bunny'],
    ['store', '밤 편의점', 'pixel_hana', 3000, '', '픽셀', 'D-8', 711, '#1F2A44', '#9FE3D6', '#9FE3D6', '#3C5A7A', '#2A4060', '#F5E6A8', 'house'],
    ['lav', '보라 들판', 'lav.field', 2500, 'D-2', '풍경', 'D-2', 298, '#E7DDF6', '#FFFFFF', '#FFFFFF', '#B39DDB', '#7E66B5', '#5B4690', ''],
    ['whale', '고래 꿈', 'sea_mint', 3500, '', '동물', 'D-11', 455, '#0F2E4A', '#CFE8F3', '#CFE8F3', '#2B6C93', '#174D70', '#5FA8CF', 'whale'],
    ['tea', '찻잔 정원', 'yeon.art', 2000, '', '일러스트', 'D-13', 189, '#EAF2E3', '#FFFFFF', '#FFFFFF', '#9CC08A', '#5E8A4E', '#C98B6B', 'house'],
    ['ghost', '꼬마 유령', 'boo.boo', 2500, '신규', '캐릭터', 'D-15', 402, '#2B2440', '#F4F0FF', '#F4F0FF', '#5C4F86', '#3E345E', '#F4F0FF', 'ghost']
  ];
  var series = {}, order = [];
  S.forEach(function (x) {
    series[x[0]] = { id: x[0], title: x[1], artist: x[2], price: x[3], priceText: x[3].toLocaleString() + '원', tag: x[4], cat: x[5],
      due: x[6], pulls: x[7], pullsText: x[7].toLocaleString(), sky: x[8], sun: x[9], star: x[10], w1: x[11], w2: x[12], fig: x[13], kind: x[14] };
    order.push(x[0]);
  });
  // 구름 토끼: 실제 사진을 가로 10 × 세로 5 = 50조각으로 나눔. 다 모으면 사진 한 장이 완성
  series.bunny.photo = { src: 'img/cloud-bunny.jpg', cols: 10, rows: 5, w: 1200, h: 1167 };
  function param(k) {
    try { var m = new RegExp('[?&]' + k + '=([^&#]+)').exec(location.search); return m ? decodeURIComponent(m[1]) : ''; } catch (e) { return ''; }
  }
  window.GACHA = {
    series: series, order: order, artists: A,
    get: function (id) { return series[id] || series.night; },
    list: function () { return order.map(function (k) { return series[k]; }); },
    current: function () { return series[param('s')] || series.night; },
    artist: function (id) { var a = A[id] || A.moonlit_draws; return Object.assign({ id: A[id] ? id : 'moonlit_draws' }, a); },
    currentArtist: function () {
      var a = param('a');
      if (A[a]) return this.artist(a);
      return this.artist(this.current().artist);
    },
    byArtist: function (id) { return this.list().filter(function (s) { return s.artist === id; }); }
  };
})();

export const ITEM_CATALOG = {
  animals: {
    label: '동물',
    groups: {
      land: [
        {
          id: 'animal-land-001',
          name: '다람쥐',
          category: '동물/육지',
          description: '숲과 공원에서 자주 볼 수 있는 작은 포유류입니다.',
          image: '/images/items/animals/squirrel.png',
          rarity: 'common',
        },
        {
          id: 'animal-land-002',
          name: '호랑이',
          category: '동물/육지',
          description: '강한 힘과 날카로운 감각을 가진 대표적인 대형 포식자입니다.',
          image: '/images/items/animals/tiger.png',
          rarity: 'rare',
        },
      ],
      sea: [
        {
          id: 'animal-sea-001',
          name: '돌고래',
          category: '동물/바다',
          description: '무리를 이루어 생활하며 높은 지능을 가진 해양 포유류입니다.',
          image: '/images/items/animals/dolphin.png',
          rarity: 'uncommon',
        },
      ],
      sky: [
        {
          id: 'animal-sky-001',
          name: '독수리',
          category: '동물/하늘',
          description: '높은 하늘을 비행하며 넓은 시야를 가진 맹금류입니다.',
          image: '/images/items/animals/eagle.png',
          rarity: 'uncommon',
        },
      ],
      polar: [
        {
          id: 'animal-polar-001',
          name: '북극곰',
          category: '동물/극지방',
          description: '두꺼운 털과 지방층으로 추운 지역에 적응한 동물입니다.',
          image: '/images/items/animals/polar-bear.png',
          rarity: 'rare',
        },
      ],
      desert: [
        {
          id: 'animal-desert-001',
          name: '낙타',
          category: '동물/사막',
          description: '사막 환경에서 오래 이동할 수 있도록 진화한 동물입니다.',
          image: '/images/items/animals/camel.png',
          rarity: 'uncommon',
        },
      ],
      endangered: [
        {
          id: 'animal-endangered-001',
          name: '수달',
          category: '동물/멸종위기',
          description: '깨끗한 하천 생태계의 건강도를 보여주는 지표 동물입니다.',
          image: '/images/items/animals/otter.png',
          rarity: 'epic',
        },
      ],
      dinosaur: [
        {
          id: 'animal-dinosaur-001',
          name: '티라노사우루스',
          category: '동물/공룡',
          description: '백악기 시대를 대표하는 육식 공룡입니다.',
          image: '/images/items/animals/trex.png',
          rarity: 'legendary',
        },
      ],
    },
  },
  plants: {
    label: '식물',
    groups: {
      nearby: [
        {
          id: 'plant-nearby-001',
          name: '민들레',
          category: '식물/주변 식물',
          description: '학교 주변에서도 쉽게 관찰할 수 있는 대표적인 초본 식물입니다.',
          image: '/images/items/plants/dandelion.png',
          rarity: 'common',
        },
      ],
      grass: [
        {
          id: 'plant-grass-001',
          name: '억새',
          category: '식물/풀',
          description: '가을 들판에서 자주 보이는 여러해살이 풀입니다.',
          image: '/images/items/plants/reed.png',
          rarity: 'common',
        },
      ],
      tree: [
        {
          id: 'plant-tree-001',
          name: '소나무',
          category: '식물/나무',
          description: '사계절 내내 잎을 유지하는 우리나라 대표 상록수입니다.',
          image: '/images/items/plants/pine-tree.png',
          rarity: 'uncommon',
        },
      ],
      dokdo: [
        {
          id: 'plant-dokdo-001',
          name: '섬기린초',
          category: '식물/독도 식물',
          description: '독도의 바위지형에 적응한 희귀 자생 식물입니다.',
          image: '/images/items/plants/dokdo-sedum.png',
          rarity: 'epic',
        },
      ],
      endangered: [
        {
          id: 'plant-endangered-001',
          name: '광릉요강꽃',
          category: '식물/멸종위기 식물',
          description: '서식지 파괴로 개체 수가 감소한 멸종위기 야생식물입니다.',
          image: '/images/items/plants/lady-slipper.png',
          rarity: 'legendary',
        },
      ],
    },
  },
  artifacts: {
    label: '역사적 유물',
    groups: {
      paleolithic: [
        {
          id: 'artifact-paleolithic-001',
          name: '주먹도끼',
          category: '역사적 유물/구석기',
          description: '돌을 다듬어 만든 구석기 시대의 대표적인 도구입니다.',
          image: '/images/items/artifacts/hand-axe.png',
          rarity: 'uncommon',
        },
      ],
      neolithic: [
        {
          id: 'artifact-neolithic-001',
          name: '빗살무늬 토기',
          category: '역사적 유물/신석기',
          description: '무늬를 새긴 토기로 신석기 생활 문화를 보여줍니다.',
          image: '/images/items/artifacts/comb-pattern-pottery.png',
          rarity: 'rare',
        },
      ],
      goguryeo: [
        {
          id: 'artifact-goguryeo-001',
          name: '고구려 벽화',
          category: '역사적 유물/고구려',
          description: '무덤 내부에 그려진 그림으로 당시 문화를 알려줍니다.',
          image: '/images/items/artifacts/goguryeo-mural.png',
          rarity: 'epic',
        },
      ],
      baekje: [
        {
          id: 'artifact-baekje-001',
          name: '백제 금동대향로',
          category: '역사적 유물/백제',
          description: '정교한 조형미를 보여주는 백제의 대표 유물입니다.',
          image: '/images/items/artifacts/baekje-incense-burner.png',
          rarity: 'epic',
        },
      ],
      silla: [
        {
          id: 'artifact-silla-001',
          name: '신라 금관',
          category: '역사적 유물/신라',
          description: '화려한 장식으로 신라의 금속 공예 수준을 보여줍니다.',
          image: '/images/items/artifacts/silla-crown.png',
          rarity: 'legendary',
        },
      ],
      joseon: [
        {
          id: 'artifact-joseon-001',
          name: '백자 달항아리',
          category: '역사적 유물/조선',
          description: '단아한 형태와 색감이 특징인 조선 시대 도자기입니다.',
          image: '/images/items/artifacts/moon-jar.png',
          rarity: 'rare',
        },
      ],
    },
  },
  careers: {
    label: '진로 아이템',
    groups: {
      car: [
        {
          id: 'career-car-001',
          name: '자동차 설계도',
          category: '진로 아이템/자동차',
          description: '자동차 엔지니어의 설계 과정을 상징하는 학습 아이템입니다.',
          image: '/images/items/careers/car-blueprint.png',
          rarity: 'uncommon',
        },
      ],
      clothes: [
        {
          id: 'career-clothes-001',
          name: '패션 스케치북',
          category: '진로 아이템/옷',
          description: '의상 디자이너의 아이디어를 담아내는 기본 도구입니다.',
          image: '/images/items/careers/fashion-sketchbook.png',
          rarity: 'uncommon',
        },
      ],
    },
  },
};

const flattenGroups = (groups) => Object.values(groups).flatMap((items) => items);

export const ALL_ITEMS = Object.values(ITEM_CATALOG).flatMap((category) =>
  flattenGroups(category.groups),
);

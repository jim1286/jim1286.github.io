export type PortfolioApp = {
  id: string;
  index: string;
  name: string;
  englishName: string;
  description: string;
  icon: string;
  status: string;
  statusTone: 'live' | 'development';
  tags: string[];
  githubUrl: string;
  iosUrl?: string;
  androidUrl?: string;
  featured?: boolean;
};

export const apps: PortfolioApp[] = [
  {
    id: 'yajalal',
    index: '01',
    name: '야잘알',
    englishName: 'Yajalal',
    description: 'KBO 경기 일정과 선수 기록, AI 분석, FA 현황을 한곳에서 확인하는 프로야구 정보 앱입니다.',
    icon: '/apps/yajalal.png',
    status: 'STORE LIVE · v1.19.4',
    statusTone: 'live',
    tags: ['Flutter', 'NestJS', 'KBO'],
    githubUrl: 'https://github.com/jim1286/yajalal',
    iosUrl: 'https://apps.apple.com/kr/app/%EC%95%BC%EC%9E%98%EC%95%8C/id6749580205?uo=4',
    androidUrl: 'https://play.google.com/store/apps/details?id=dev.hjm.yajalal&hl=ko',
    featured: true,
  },
  {
    id: 'choose-window',
    index: '02',
    name: '창가 선택',
    englishName: 'Choose Window',
    description: '이동 시간과 방향, 태양 위치를 분석해 햇빛을 덜 받는 좌석을 추천하는 여행 도우미입니다.',
    icon: '/apps/choose-window.png',
    status: 'STORE LIVE · v1.1.4',
    statusTone: 'live',
    tags: ['Flutter', 'Maps', 'Mobility'],
    githubUrl: 'https://github.com/jim1286/choose_window',
    iosUrl: 'https://apps.apple.com/kr/app/%EC%84%A0%ED%83%9D%EC%9D%98%EC%B0%BD/id6759096524?uo=4',
    androidUrl: 'https://play.google.com/store/apps/details?id=dev.hjm.choosewindow&hl=ko',
  },
  {
    id: 'burntok',
    index: '03',
    name: '번뚝',
    englishName: 'BurnTok',
    description: '한 문장으로 앱을 만들고, 대화로 수정하고, 다른 사람의 결과를 리믹스하는 AI 창작 커뮤니티입니다.',
    icon: '/apps/burntok.png',
    status: 'IN DEVELOPMENT · v1.1.0',
    statusTone: 'development',
    tags: ['React Native', 'Next.js', 'NestJS'],
    githubUrl: 'https://github.com/jim1286/BurnTok',
  },
  {
    id: 'taground',
    index: '04',
    name: '태그라운드',
    englishName: 'Taground',
    description: '정확한 위치나 개인 목록을 노출하지 않고 국가와 관심사로 연결되는 로컬 코호트·그룹 채팅 앱입니다.',
    icon: '/apps/taground.png',
    status: 'IN DEVELOPMENT · v0.1.0',
    statusTone: 'development',
    tags: ['Expo', 'NestJS', 'PostgreSQL'],
    githubUrl: 'https://github.com/jim1286/taground',
  },
  {
    id: 'unairplane',
    index: '05',
    name: '비행중',
    englishName: 'Unairplane',
    description: '미리 확인한 운항 일정과 내장 공개 데이터를 이용해 인터넷 없이 비행 진행 상황을 추정하는 앱입니다.',
    icon: '/apps/unairplane.png',
    status: 'IN DEVELOPMENT · v1.0.0',
    statusTone: 'development',
    tags: ['Expo', 'React Native', 'Offline'],
    githubUrl: 'https://github.com/jim1286/unairplane',
  },
];

type LegalDocument = {
  id: string;
  index: string;
  name: string;
  note: string;
  privacyUrl: string;
  supportUrl: string;
  deletionUrl?: string;
};

const policyOrigin = 'https://hjm-app-policies.jimin1286.chatgpt.site';

export const legalDocuments: LegalDocument[] = [
  {
    id: 'yajalal',
    index: '01',
    name: '야잘알 · Yajalal',
    note: 'KBO 정보 및 AI 분석 앱',
    privacyUrl: `${policyOrigin}/privacy/yajalal`,
    supportUrl: `${policyOrigin}/support/yajalal`,
  },
  {
    id: 'choose-window',
    index: '02',
    name: '창가 선택 · Choose Window',
    note: '햇빛 회피 좌석 추천 앱',
    privacyUrl: `${policyOrigin}/privacy/choose-window`,
    supportUrl: `${policyOrigin}/support/choose-window`,
  },
  {
    id: 'burntok',
    index: '03',
    name: '번뚝 · BurnTok',
    note: 'AI 앱 창작 커뮤니티',
    privacyUrl: `${policyOrigin}/privacy/burntok`,
    deletionUrl: `${policyOrigin}/privacy/burntok/delete-account`,
    supportUrl: `${policyOrigin}/support/burntok`,
  },
];

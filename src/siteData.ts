// 정책 URL은 Hub config에서 생성한 policyLinks.generated.ts가 단일 원천이다(손으로 복사하지 않음).
import { policyUrl } from './policyLinks.generated';
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
  webUrl?: string;
  iosUrl?: string;
  androidUrl?: string;
  socialHook?: string;
  featured?: boolean;
};

// 2026-09-27 공개 스토어/웹 페이지를 직접 확인해 연결한다. 버전 숫자는 릴리스마다
// 달라지므로 카드 상태에서 빼고, 확인되지 않은 Android 주소는 추측해 넣지 않는다.
export const apps: PortfolioApp[] = [
  {
    id: 'yajalal',
    index: '01',
    name: '야잘알',
    englishName: 'Yajalal',
    description: 'KBO 경기 일정과 선수 기록, AI 분석, FA 현황을 한곳에서 확인하는 프로야구 정보 앱입니다.',
    icon: '/apps/yajalal.png',
    status: 'iOS · Android 공개',
    statusTone: 'live',
    tags: ['Flutter', 'NestJS', 'KBO'],
    githubUrl: 'https://github.com/jim1286/yajalal',
    iosUrl: 'https://apps.apple.com/kr/app/%EC%95%BC%EC%9E%98%EC%95%8C/id6749580205?uo=4',
    androidUrl: 'https://play.google.com/store/apps/details?id=dev.hjm.yajalal&hl=ko',
    socialHook: '타율 하나만 보면 선수 이야기를 다 알 수 있을까?',
    featured: true,
  },
  {
    id: 'choose-window',
    index: '02',
    name: '선택의창',
    englishName: 'Choose Window',
    description: '이동 시간과 방향, 태양 위치를 분석해 햇빛을 덜 받는 좌석을 추천하는 여행 도우미입니다.',
    icon: '/apps/choose-window.png',
    status: 'iOS · Android 공개',
    statusTone: 'live',
    tags: ['Flutter', 'Maps', 'Mobility'],
    githubUrl: 'https://github.com/jim1286/choose_window',
    iosUrl: 'https://apps.apple.com/kr/app/%EC%84%A0%ED%83%9D%EC%9D%98%EC%B0%BD/id6759096524?uo=4',
    androidUrl: 'https://play.google.com/store/apps/details?id=dev.hjm.choosewindow&hl=ko',
    socialHook: '같은 길도 출발 시간이 달라지면 햇빛 드는 쪽이 달라질까?',
  },
  {
    id: 'burntok',
    index: '03',
    name: '번뚝',
    englishName: 'BurnTok',
    description: '작은 앱을 만들고 직접 써본 뒤, 수정·공유·리믹스하며 서로의 생각을 이어가는 창작 놀이터입니다.',
    icon: '/apps/burntok.png',
    status: '웹 · iOS 공개',
    statusTone: 'live',
    tags: ['React Native', 'Next.js', 'NestJS'],
    githubUrl: 'https://github.com/jim1286/BurnTok',
    webUrl: 'https://burntok.jmstudioapps.com/',
    iosUrl: 'https://apps.apple.com/kr/app/id6810606625',
    socialHook: '오늘만 쓸 작은 앱이 떠올랐다면?',
  },
  {
    id: 'taground',
    index: '04',
    name: '태그라운드',
    englishName: 'Taground',
    description: '정확한 위치나 개인 목록을 노출하지 않고 국가와 관심사로 연결되는 로컬 코호트·그룹 채팅 앱입니다.',
    icon: '/apps/taground.png',
    status: '보관 중',
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
    status: 'iOS 공개',
    statusTone: 'live',
    tags: ['Expo', 'React Native', 'Offline'],
    githubUrl: 'https://github.com/jim1286/unairplane',
    iosUrl: 'https://apps.apple.com/kr/app/id6806942992',
    socialHook: '비행기 모드에선 지금 어디쯤인지 어떻게 알지?',
  },
];

// 앱 카드와 다른 숫자를 수동 관리하면 소개 목록 변경 뒤 현황이 어긋난다.
// URL 존재만으로 실제 출시를 증명할 수 없으므로 이 집계는 연결된 스토어만 센다.
export const portfolioSummary = {
  appCount: apps.length,
  storeLinkedAppCount: apps.filter((app) => app.iosUrl || app.androidUrl).length,
  storePlatforms: [
    ...(apps.some((app) => app.iosUrl) ? ['iOS'] : []),
    ...(apps.some((app) => app.androidUrl) ? ['Android'] : []),
  ],
};

type LegalDocument = {
  id: string;
  index: string;
  name: string;
  note: string;
  privacyUrl: string;
  supportUrl: string;
  deletionUrl?: string;
};


export const legalDocuments: LegalDocument[] = [
  {
    id: 'yajalal',
    index: '01',
    name: '야잘알 · Yajalal',
    note: 'KBO 정보 및 AI 분석 앱',
    privacyUrl: policyUrl('yajalal', 'privacyPolicy'),
    supportUrl: policyUrl('yajalal', 'support'),
  },
  {
    id: 'choose-window',
    index: '02',
    name: '선택의창 · Choose Window',
    note: '햇빛 회피 좌석 추천 앱',
    privacyUrl: policyUrl('choose-window', 'privacyPolicy'),
    supportUrl: policyUrl('choose-window', 'support'),
  },
  {
    id: 'burntok',
    index: '03',
    name: '번뚝 · BurnTok',
    note: 'AI 앱 창작 커뮤니티',
    privacyUrl: policyUrl('burntok', 'privacyPolicy'),
    deletionUrl: policyUrl('burntok', 'accountDeletion'),
    supportUrl: policyUrl('burntok', 'support'),
  },
];

import { getCopy } from './i18n';
// 정책 URL은 Hub config에서 생성한 policyLinks.generated.ts가 단일 원천이다(손으로 복사하지 않음).
import { policyUrl } from './policyLinks.generated';
const copy = getCopy();
export type PortfolioApp = {
  id: string;
  index: string;
  name: string;
  englishName: string;
  description: string;
  icon: string;
  status: string;
  statusTone: 'live' | 'archived';
  sourceAccess: 'public' | 'private' | 'archived';
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
    name: copy.product001,
    englishName: 'Yajalal',
    description: copy.product002,
    icon: '/apps/yajalal.png',
    status: copy.product003,
    statusTone: 'live',
    // Anonymous GitHub navigation is 404; owner metadata confirms private.
    // Retain the repository URL as historical data, not public navigation.
    sourceAccess: 'private',
    tags: ['Flutter', 'NestJS', 'KBO'],
    githubUrl: 'https://github.com/jim1286/yajalal',
    iosUrl: 'https://apps.apple.com/kr/app/%EC%95%BC%EC%9E%98%EC%95%8C/id6749580205?uo=4',
    androidUrl: 'https://play.google.com/store/apps/details?id=dev.hjm.yajalal&hl=ko',
    socialHook: copy.product004,
    featured: true,
  },
  {
    id: 'choose-window',
    index: '02',
    name: copy.product005,
    englishName: 'Choose Window',
    description: copy.product006,
    icon: '/apps/choose-window.png',
    status: copy.product007,
    statusTone: 'live',
    sourceAccess: 'private',
    tags: ['Flutter', 'Maps', 'Mobility'],
    githubUrl: 'https://github.com/jim1286/choose_window',
    iosUrl: 'https://apps.apple.com/kr/app/%EC%84%A0%ED%83%9D%EC%9D%98%EC%B0%BD/id6759096524?uo=4',
    androidUrl: 'https://play.google.com/store/apps/details?id=dev.hjm.choosewindow&hl=ko',
    socialHook: copy.product008,
  },
  {
    id: 'burntok',
    index: '03',
    name: copy.product009,
    englishName: 'BurnTok',
    description: copy.product010,
    icon: '/apps/burntok.png',
    status: copy.product011,
    statusTone: 'live',
    sourceAccess: 'private',
    tags: ['React Native', 'Next.js', 'NestJS'],
    githubUrl: 'https://github.com/jim1286/BurnTok',
    webUrl: 'https://burntok.jmstudioapps.com/',
    iosUrl: 'https://apps.apple.com/kr/app/id6810606625',
    socialHook: copy.product012,
  },
  {
    id: 'taground',
    index: '04',
    name: copy.product013,
    englishName: 'Taground',
    description: copy.product014,
    icon: '/apps/taground.png',
    status: copy.product015,
    // Central retirement tombstone makes this an archived portfolio entry,
    // not a currently developed product. See the HJM adoption QA report.
    statusTone: 'archived',
    sourceAccess: 'archived',
    tags: ['Expo', 'NestJS', 'PostgreSQL'],
    githubUrl: 'https://github.com/jim1286/taground',
  },
  {
    id: 'unairplane',
    index: '05',
    name: copy.product016,
    englishName: 'Unairplane',
    description: copy.product017,
    icon: '/apps/unairplane.png',
    status: copy.product018,
    statusTone: 'live',
    sourceAccess: 'private',
    tags: ['Expo', 'React Native', 'Offline'],
    githubUrl: 'https://github.com/jim1286/unairplane',
    iosUrl: 'https://apps.apple.com/kr/app/id6806942992',
    socialHook: copy.product019,
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
    name: copy.product020,
    note: copy.product021,
    privacyUrl: policyUrl('yajalal', 'privacyPolicy'),
    supportUrl: policyUrl('yajalal', 'support'),
  },
  {
    id: 'choose-window',
    index: '02',
    name: copy.product022,
    note: copy.product023,
    privacyUrl: policyUrl('choose-window', 'privacyPolicy'),
    supportUrl: policyUrl('choose-window', 'support'),
  },
  {
    id: 'burntok',
    index: '03',
    name: copy.product024,
    note: copy.product025,
    privacyUrl: policyUrl('burntok', 'privacyPolicy'),
    deletionUrl: policyUrl('burntok', 'accountDeletion'),
    supportUrl: policyUrl('burntok', 'support'),
  },
];

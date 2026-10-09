import { getCopy } from './i18n';

// The existing catalog/URL loader remains the only copy source. Meaningful
// aliases let the HJM layout change while the catalog owns complete phrases;
// completed phrases live in every registered source catalog, never in JSX.
const catalog = getCopy();
export const siteCopy = {
  skip: catalog.page001, home: catalog.page002, brandName: catalog.page004,
  navigation: catalog.page005, menu: catalog.navigationMenu, appsNav: catalog.page007, strategyNav: catalog.strategyNav,
  legalNav: catalog.page008, developerNav: catalog.page009, contact: catalog.page010,
  eyebrow: catalog.page011, heroStart: catalog.page012, heroFocus: catalog.page013,
  heroEnd: catalog.heroEnding, heroDescription: catalog.heroDescription,
  browse: catalog.page018, github: catalog.page019, summary: catalog.page020, summaryIndex: catalog.page021,
  appsCount: catalog.page022, storesCount: catalog.page023, platformsCount: catalog.page024,
  appsIndex: catalog.page037, appsTitle: catalog.page038, appsDescription: catalog.appsDescription,
  web: catalog.page043, appStore: catalog.page044, googlePlay: catalog.page045, source: catalog.page046, privateSource: catalog.privateSource,
  legalIndex: catalog.page047, legalTitle: catalog.page048, legalDescription: catalog.legalDescription,
  privacy: catalog.page051, deletion: catalog.page052, support: catalog.page053, legalNote: catalog.page054,
  developerAlt: catalog.page055, seoul: catalog.page056, developerIndex: catalog.page057,
  developerStart: catalog.page058, developerEnd: catalog.developerTitle,
  developerDescription: catalog.page062, developer: catalog.page063, developerName: catalog.page064,
  email: catalog.page065, githubAddress: catalog.page067, storybook: catalog.storybook, contactIndex: catalog.page068,
  contactQuestion: catalog.page069, mail: catalog.page070, copyright: catalog.page073,
  topLabel: catalog.page074, top: catalog.page075, appIndex: catalog.appIndex,
} as const;

export const appCopy = {
  open: catalog.page030, web: catalog.page031, ios: catalog.page033,
  android: catalog.page035, technologies: catalog.page042,
};

export const strategyCopy = {
  strategyIndex: catalog.strategyIndex,
  strategyTitle: catalog.strategyTitle,
  strategyDescription: catalog.strategyDescription,
  developmentStrategyTitle: catalog.developmentStrategyTitle,
  marketingStrategyTitle: catalog.marketingStrategyTitle,
  developmentDiagram: catalog.developmentDiagram,
  marketingDiagram: catalog.marketingDiagram,
  developmentProblem: catalog.developmentProblem,
  developmentProblemDetail: catalog.developmentProblemDetail,
  developmentScope: catalog.developmentScope,
  developmentScopeDetail: catalog.developmentScopeDetail,
  developmentDesign: catalog.developmentDesign,
  developmentDesignDetail: catalog.developmentDesignDetail,
  developmentImplementation: catalog.developmentImplementation,
  developmentImplementationDetail: catalog.developmentImplementationDetail,
  developmentQa: catalog.developmentQa,
  developmentQaDetail: catalog.developmentQaDetail,
  developmentRelease: catalog.developmentRelease,
  developmentReleaseDetail: catalog.developmentReleaseDetail,
  developmentImprovement: catalog.developmentImprovement,
  developmentImprovementDetail: catalog.developmentImprovementDetail,
  marketingBrandTitle: catalog.marketingBrandTitle,
  marketingBrandDetail: catalog.marketingBrandDetail,
  marketingChannelsDetail: catalog.marketingChannelsDetail,
  marketingBrandBoundary: catalog.marketingBrandBoundary,
  marketingProblem: catalog.marketingProblem,
  marketingProblemDetail: catalog.marketingProblemDetail,
  marketingDiscovery: catalog.marketingDiscovery,
  marketingDiscoveryDetail: catalog.marketingDiscoveryDetail,
  marketingSearch: catalog.marketingSearch,
  marketingSearchDetail: catalog.marketingSearchDetail,
  marketingDiscover: catalog.marketingDiscover,
  marketingDiscoverDetail: catalog.marketingDiscoverDetail,
  marketingValue: catalog.marketingValue,
  marketingValueDetail: catalog.marketingValueDetail,
  marketingReaction: catalog.marketingReaction,
  marketingReactionDetail: catalog.marketingReactionDetail,
  marketingImprovement: catalog.marketingImprovement,
  marketingImprovementDetail: catalog.marketingImprovementDetail,
} as const;

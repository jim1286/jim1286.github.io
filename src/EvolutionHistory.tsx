import { useState } from 'react';
import { Card, Tag } from '@hjmds/react/display';
import { Stack, Text } from '@hjmds/react/layout';
import { Collapsible } from '@hjmds/react/collapsible';
import { Tabs, TabPanel } from '@hjmds/react/navigation';
import { Heading } from '@hjmds/react/heading';
import { getCopy } from './i18n';

const c = getCopy();
// Record dates are not release dates. Evidence and audit boundaries live in
// docs/EVOLUTION_HISTORY_SOURCES.md; private repository links stay off the public page.
const entries = [
  { topic: 'safety', id: 'memberprofiles', date: '2026-10-25', status: c.evolutionMemberprofilesProduct, title: c.evolutionMemberprofilesTitle, why: c.evolutionMemberprofilesWhy, change: c.evolutionMemberprofilesChange, result: c.evolutionMemberprofilesResult, evidence: c.evolutionMemberprofilesEvidence },
  { topic: 'design', id: 'sharedinteractions', date: '2026-10-25', status: c.evolutionSharedinteractionsProduct, title: c.evolutionSharedinteractionsTitle, why: c.evolutionSharedinteractionsWhy, change: c.evolutionSharedinteractionsChange, result: c.evolutionSharedinteractionsResult, evidence: c.evolutionSharedinteractionsEvidence },
  { topic: 'clients', id: 'privateroom', date: '2026-10-23', status: c.evolutionPrivateroomProduct, title: c.evolutionPrivateroomTitle, why: c.evolutionPrivateroomWhy, change: c.evolutionPrivateroomChange, result: c.evolutionPrivateroomResult, evidence: c.evolutionPrivateroomEvidence },
  { topic: 'design', id: 'stepsrail', date: '2026-10-23', status: c.evolutionStepsrailProduct, title: c.evolutionStepsrailTitle, why: c.evolutionStepsrailWhy, change: c.evolutionStepsrailChange, result: c.evolutionStepsrailResult, evidence: c.evolutionStepsrailEvidence },
  { topic: 'clients', id: 'imageflow', date: '2026-10-23', status: c.evolutionImageflowProduct, title: c.evolutionImageflowTitle, why: c.evolutionImageflowWhy, change: c.evolutionImageflowChange, result: c.evolutionImageflowResult, evidence: c.evolutionImageflowEvidence },
  { topic: 'safety', id: 'versionedconsent', date: '2026-10-22', status: c.evolutionVersionedconsentProduct, title: c.evolutionVersionedconsentTitle, why: c.evolutionVersionedconsentWhy, change: c.evolutionVersionedconsentChange, result: c.evolutionVersionedconsentResult, evidence: c.evolutionVersionedconsentEvidence },
  { topic: 'design', id: 'strongselection', date: '2026-10-23', status: c.evolutionStrongselectionProduct, title: c.evolutionStrongselectionTitle, why: c.evolutionStrongselectionWhy, change: c.evolutionStrongselectionChange, result: c.evolutionStrongselectionResult, evidence: c.evolutionStrongselectionEvidence },
  { topic: 'design', id: 'postcardslots', date: '2026-10-21', status: c.evolutionPostcardslotsProduct, title: c.evolutionPostcardslotsTitle, why: c.evolutionPostcardslotsWhy, change: c.evolutionPostcardslotsChange, result: c.evolutionPostcardslotsResult, evidence: c.evolutionPostcardslotsEvidence },
  { topic: 'clients', id: 'letterpages', date: '2026-10-21', status: c.evolutionLetterpagesProduct, title: c.evolutionLetterpagesTitle, why: c.evolutionLetterpagesWhy, change: c.evolutionLetterpagesChange, result: c.evolutionLetterpagesResult, evidence: c.evolutionLetterpagesEvidence },
  { topic: 'clients', id: 'boardingphoto', date: '2026-10-20', status: c.evolutionBoardingphotoProduct, title: c.evolutionBoardingphotoTitle, why: c.evolutionBoardingphotoWhy, change: c.evolutionBoardingphotoChange, result: c.evolutionBoardingphotoResult, evidence: c.evolutionBoardingphotoEvidence },
  { topic: 'data', id: 'dbbaseline', date: '2026-10-20', status: c.evolutionDbbaselineProduct, title: c.evolutionDbbaselineTitle, why: c.evolutionDbbaselineWhy, change: c.evolutionDbbaselineChange, result: c.evolutionDbbaselineResult, evidence: c.evolutionDbbaselineEvidence },
  { topic: 'quality', id: 'nativecompat', date: '2026-10-21', status: c.evolutionNativecompatProduct, title: c.evolutionNativecompatTitle, why: c.evolutionNativecompatWhy, change: c.evolutionNativecompatChange, result: c.evolutionNativecompatResult, evidence: c.evolutionNativecompatEvidence },
  { topic: 'data', id: 'jobs', date: '2026-10-23', status: c.historyDocsCode, title: c.historyJobsTitle, why: c.historyJobsWhy, change: c.historyJobsChange, result: c.historyJobsResult, evidence: c.historyJobsEvidence },
  { topic: 'ops', id: 'flutter', date: '2026-10-18', status: c.historyRetired, title: c.historyFlutterTitle, why: c.historyFlutterWhy, change: c.historyFlutterChange, result: c.historyFlutterResult, evidence: c.historyFlutterEvidence },
  { topic: 'design', id: 'screens', date: '2026-10-15', status: c.historyAdopted, title: c.historyScreensTitle, why: c.historyScreensWhy, change: c.historyScreensChange, result: c.historyScreensResult, evidence: c.historyScreensEvidence },
  { topic: 'design', id: 'api', date: '2026-09-10', status: c.historyPublished, title: c.historyApiTitle, why: c.historyApiWhy, change: c.historyApiChange, result: c.historyApiResult, evidence: c.historyApiEvidence },
  { topic: 'quality', id: 'baseline', date: '2026-09-04', status: c.historyMigrated, title: c.historyBaselineTitle, why: c.historyBaselineWhy, change: c.historyBaselineChange, result: c.historyBaselineResult, evidence: c.historyBaselineEvidence },
  { topic: 'design', id: 'foundation', date: '2026-08-12', status: c.historyStarted, title: c.historyFoundationTitle, why: c.historyFoundationWhy, change: c.historyFoundationChange, result: c.historyFoundationResult, evidence: c.historyFoundationEvidence },
  { topic: 'design', id: 'catalog', date: '2026-10-18', status: c.evolutionCatalogProduct, title: c.evolutionCatalogTitle, why: c.evolutionCatalogWhy, change: c.evolutionCatalogChange, result: c.evolutionCatalogResult, evidence: c.evolutionCatalogEvidence },
  { topic: 'design', id: 'parity', date: '2026-10-17', status: c.evolutionParityProduct, title: c.evolutionParityTitle, why: c.evolutionParityWhy, change: c.evolutionParityChange, result: c.evolutionParityResult, evidence: c.evolutionParityEvidence },
  { topic: 'clients', id: 'expo', date: '2026-10-18', status: c.evolutionExpoProduct, title: c.evolutionExpoTitle, why: c.evolutionExpoWhy, change: c.evolutionExpoChange, result: c.evolutionExpoResult, evidence: c.evolutionExpoEvidence },
  { topic: 'clients', id: 'locales', date: '2026-10-04', status: c.evolutionLocalesProduct, title: c.evolutionLocalesTitle, why: c.evolutionLocalesWhy, change: c.evolutionLocalesChange, result: c.evolutionLocalesResult, evidence: c.evolutionLocalesEvidence },
  { topic: 'clients', id: 'simplechat', date: '2026-10-03', status: c.evolutionSimplechatProduct, title: c.evolutionSimplechatTitle, why: c.evolutionSimplechatWhy, change: c.evolutionSimplechatChange, result: c.evolutionSimplechatResult, evidence: c.evolutionSimplechatEvidence },
  { topic: 'clients', id: 'island', date: '2026-09-28', status: c.evolutionIslandProduct, title: c.evolutionIslandTitle, why: c.evolutionIslandWhy, change: c.evolutionIslandChange, result: c.evolutionIslandResult, evidence: c.evolutionIslandEvidence },
  { topic: 'clients', id: 'letters', date: '2026-09-09', status: c.evolutionLettersProduct, title: c.evolutionLettersTitle, why: c.evolutionLettersWhy, change: c.evolutionLettersChange, result: c.evolutionLettersResult, evidence: c.evolutionLettersEvidence },
  { topic: 'clients', id: 'offline', date: '2026-09-03', status: c.evolutionOfflineProduct, title: c.evolutionOfflineTitle, why: c.evolutionOfflineWhy, change: c.evolutionOfflineChange, result: c.evolutionOfflineResult, evidence: c.evolutionOfflineEvidence },
  { topic: 'clients', id: 'widgets', date: '2026-09-03', status: c.evolutionWidgetsProduct, title: c.evolutionWidgetsTitle, why: c.evolutionWidgetsWhy, change: c.evolutionWidgetsChange, result: c.evolutionWidgetsResult, evidence: c.evolutionWidgetsEvidence },
  { topic: 'clients', id: 'sharedcore', date: '2026-08-07', status: c.evolutionSharedcoreProduct, title: c.evolutionSharedcoreTitle, why: c.evolutionSharedcoreWhy, change: c.evolutionSharedcoreChange, result: c.evolutionSharedcoreResult, evidence: c.evolutionSharedcoreEvidence },
  { topic: 'safety', id: 'restore', date: '2026-10-21', status: c.evolutionRestoreProduct, title: c.evolutionRestoreTitle, why: c.evolutionRestoreWhy, change: c.evolutionRestoreChange, result: c.evolutionRestoreResult, evidence: c.evolutionRestoreEvidence },
  { topic: 'ai', id: 'flightlookup', date: '2026-10-08', status: c.evolutionFlightlookupProduct, title: c.evolutionFlightlookupTitle, why: c.evolutionFlightlookupWhy, change: c.evolutionFlightlookupChange, result: c.evolutionFlightlookupResult, evidence: c.evolutionFlightlookupEvidence },
  { topic: 'ai', id: 'bridge', date: '2026-10-03', status: c.evolutionBridgeProduct, title: c.evolutionBridgeTitle, why: c.evolutionBridgeWhy, change: c.evolutionBridgeChange, result: c.evolutionBridgeResult, evidence: c.evolutionBridgeEvidence },
  { topic: 'safety', id: 'drafts', date: '2026-10-02', status: c.evolutionDraftsProduct, title: c.evolutionDraftsTitle, why: c.evolutionDraftsWhy, change: c.evolutionDraftsChange, result: c.evolutionDraftsResult, evidence: c.evolutionDraftsEvidence },
  { topic: 'safety', id: 'deletion', date: '2026-10-01', status: c.evolutionDeletionProduct, title: c.evolutionDeletionTitle, why: c.evolutionDeletionWhy, change: c.evolutionDeletionChange, result: c.evolutionDeletionResult, evidence: c.evolutionDeletionEvidence },
  { topic: 'data', id: 'dbworker', date: '2026-10-01', status: c.evolutionDbworkerProduct, title: c.evolutionDbworkerTitle, why: c.evolutionDbworkerWhy, change: c.evolutionDbworkerChange, result: c.evolutionDbworkerResult, evidence: c.evolutionDbworkerEvidence },
  { topic: 'safety', id: 'auth', date: '2026-10-21', status: c.evolutionAuthProduct, title: c.evolutionAuthTitle, why: c.evolutionAuthWhy, change: c.evolutionAuthChange, result: c.evolutionAuthResult, evidence: c.evolutionAuthEvidence },
  { topic: 'ai', id: 'generation', date: '2026-09-29', status: c.evolutionGenerationProduct, title: c.evolutionGenerationTitle, why: c.evolutionGenerationWhy, change: c.evolutionGenerationChange, result: c.evolutionGenerationResult, evidence: c.evolutionGenerationEvidence },
  { topic: 'safety', id: 'identity', date: '2026-09-27', status: c.evolutionIdentityProduct, title: c.evolutionIdentityTitle, why: c.evolutionIdentityWhy, change: c.evolutionIdentityChange, result: c.evolutionIdentityResult, evidence: c.evolutionIdentityEvidence },
  { topic: 'data', id: 'geo', date: '2026-09-04', status: c.evolutionGeoProduct, title: c.evolutionGeoTitle, why: c.evolutionGeoWhy, change: c.evolutionGeoChange, result: c.evolutionGeoResult, evidence: c.evolutionGeoEvidence },
  { topic: 'ai', id: 'baseballai', date: '2026-04-27', status: c.evolutionBaseballaiProduct, title: c.evolutionBaseballaiTitle, why: c.evolutionBaseballaiWhy, change: c.evolutionBaseballaiChange, result: c.evolutionBaseballaiResult, evidence: c.evolutionBaseballaiEvidence },
  { topic: 'data', id: 'ingestion', date: '2026-04-21', status: c.evolutionIngestionProduct, title: c.evolutionIngestionTitle, why: c.evolutionIngestionWhy, change: c.evolutionIngestionChange, result: c.evolutionIngestionResult, evidence: c.evolutionIngestionEvidence },
  { topic: 'ops', id: 'intent', date: '2026-10-17', status: c.evolutionIntentProduct, title: c.evolutionIntentTitle, why: c.evolutionIntentWhy, change: c.evolutionIntentChange, result: c.evolutionIntentResult, evidence: c.evolutionIntentEvidence },
  { topic: 'ops', id: 'hosts', date: '2026-10-09', status: c.evolutionHostsProduct, title: c.evolutionHostsTitle, why: c.evolutionHostsWhy, change: c.evolutionHostsChange, result: c.evolutionHostsResult, evidence: c.evolutionHostsEvidence },
  { topic: 'ops', id: 'static', date: '2026-10-09', status: c.evolutionStaticProduct, title: c.evolutionStaticTitle, why: c.evolutionStaticWhy, change: c.evolutionStaticChange, result: c.evolutionStaticResult, evidence: c.evolutionStaticEvidence },
  { topic: 'ops', id: 'ota', date: '2026-10-08', status: c.evolutionOtaProduct, title: c.evolutionOtaTitle, why: c.evolutionOtaWhy, change: c.evolutionOtaChange, result: c.evolutionOtaResult, evidence: c.evolutionOtaEvidence },
  { topic: 'ops', id: 'submit', date: '2026-09-26', status: c.evolutionSubmitProduct, title: c.evolutionSubmitTitle, why: c.evolutionSubmitWhy, change: c.evolutionSubmitChange, result: c.evolutionSubmitResult, evidence: c.evolutionSubmitEvidence },
  { topic: 'ops', id: 'hub', date: '2026-09-03', status: c.evolutionHubProduct, title: c.evolutionHubTitle, why: c.evolutionHubWhy, change: c.evolutionHubChange, result: c.evolutionHubResult, evidence: c.evolutionHubEvidence },
  { topic: 'quality', id: 'analytics', date: '2026-10-04', status: c.evolutionAnalyticsProduct, title: c.evolutionAnalyticsTitle, why: c.evolutionAnalyticsWhy, change: c.evolutionAnalyticsChange, result: c.evolutionAnalyticsResult, evidence: c.evolutionAnalyticsEvidence },
  { topic: 'quality', id: 'qa', date: '2026-10-21', status: c.evolutionQaProduct, title: c.evolutionQaTitle, why: c.evolutionQaWhy, change: c.evolutionQaChange, result: c.evolutionQaResult, evidence: c.evolutionQaEvidence },

  { topic: 'design', id: 'renderers', date: '2026-08-22', status: c.evolutionRenderersProduct, title: c.evolutionRenderersTitle, why: c.evolutionRenderersWhy, change: c.evolutionRenderersChange, result: c.evolutionRenderersResult, evidence: c.evolutionRenderersEvidence },
  { topic: 'design', id: 'brandprofiles', date: '2026-10-07', status: c.evolutionBrandprofilesProduct, title: c.evolutionBrandprofilesTitle, why: c.evolutionBrandprofilesWhy, change: c.evolutionBrandprofilesChange, result: c.evolutionBrandprofilesResult, evidence: c.evolutionBrandprofilesEvidence },
  { topic: 'design', id: 'dataviz', date: '2026-10-21', status: c.evolutionDatavizProduct, title: c.evolutionDatavizTitle, why: c.evolutionDatavizWhy, change: c.evolutionDatavizChange, result: c.evolutionDatavizResult, evidence: c.evolutionDatavizEvidence },
  { topic: 'design', id: 'usageexamples', date: '2026-10-17', status: c.evolutionUsageexamplesProduct, title: c.evolutionUsageexamplesTitle, why: c.evolutionUsageexamplesWhy, change: c.evolutionUsageexamplesChange, result: c.evolutionUsageexamplesResult, evidence: c.evolutionUsageexamplesEvidence },
  { topic: 'design', id: 'adoptionloop', date: '2026-10-18', status: c.evolutionAdoptionloopProduct, title: c.evolutionAdoptionloopTitle, why: c.evolutionAdoptionloopWhy, change: c.evolutionAdoptionloopChange, result: c.evolutionAdoptionloopResult, evidence: c.evolutionAdoptionloopEvidence },
  { topic: 'clients', id: 'sunroute', date: '2026-02-06', status: c.evolutionSunrouteProduct, title: c.evolutionSunrouteTitle, why: c.evolutionSunrouteWhy, change: c.evolutionSunrouteChange, result: c.evolutionSunrouteResult, evidence: c.evolutionSunrouteEvidence },
  { topic: 'clients', id: 'seatflow', date: '2026-09-27', status: c.evolutionSeatflowProduct, title: c.evolutionSeatflowTitle, why: c.evolutionSeatflowWhy, change: c.evolutionSeatflowChange, result: c.evolutionSeatflowResult, evidence: c.evolutionSeatflowEvidence },
  { topic: 'clients', id: 'tagroundspint', date: '2026-09-26', status: c.evolutionTagroundspintProduct, title: c.evolutionTagroundspintTitle, why: c.evolutionTagroundspintWhy, change: c.evolutionTagroundspintChange, result: c.evolutionTagroundspintResult, evidence: c.evolutionTagroundspintEvidence },
  { topic: 'clients', id: 'meadow', date: '2026-10-13', status: c.evolutionMeadowProduct, title: c.evolutionMeadowTitle, why: c.evolutionMeadowWhy, change: c.evolutionMeadowChange, result: c.evolutionMeadowResult, evidence: c.evolutionMeadowEvidence },
  { topic: 'clients', id: 'toolbox', date: '2026-10-01', status: c.evolutionToolboxProduct, title: c.evolutionToolboxTitle, why: c.evolutionToolboxWhy, change: c.evolutionToolboxChange, result: c.evolutionToolboxResult, evidence: c.evolutionToolboxEvidence },
  { topic: 'clients', id: 'handwriting', date: '2026-10-05', status: c.evolutionHandwritingProduct, title: c.evolutionHandwritingTitle, why: c.evolutionHandwritingWhy, change: c.evolutionHandwritingChange, result: c.evolutionHandwritingResult, evidence: c.evolutionHandwritingEvidence },
  { topic: 'data', id: 'journeyengine', date: '2026-09-07', status: c.evolutionJourneyengineProduct, title: c.evolutionJourneyengineTitle, why: c.evolutionJourneyengineWhy, change: c.evolutionJourneyengineChange, result: c.evolutionJourneyengineResult, evidence: c.evolutionJourneyengineEvidence },
  { topic: 'data', id: 'livesnapshot', date: '2026-08-29', status: c.evolutionLivesnapshotProduct, title: c.evolutionLivesnapshotTitle, why: c.evolutionLivesnapshotWhy, change: c.evolutionLivesnapshotChange, result: c.evolutionLivesnapshotResult, evidence: c.evolutionLivesnapshotEvidence },
  { topic: 'data', id: 'pushoutbox', date: '2026-08-21', status: c.evolutionPushoutboxProduct, title: c.evolutionPushoutboxTitle, why: c.evolutionPushoutboxWhy, change: c.evolutionPushoutboxChange, result: c.evolutionPushoutboxResult, evidence: c.evolutionPushoutboxEvidence },
  { topic: 'data', id: 'baseballrecords', date: '2026-10-16', status: c.evolutionBaseballrecordsProduct, title: c.evolutionBaseballrecordsTitle, why: c.evolutionBaseballrecordsWhy, change: c.evolutionBaseballrecordsChange, result: c.evolutionBaseballrecordsResult, evidence: c.evolutionBaseballrecordsEvidence },
  { topic: 'data', id: 'livechat', date: '2026-10-02', status: c.evolutionLivechatProduct, title: c.evolutionLivechatTitle, why: c.evolutionLivechatWhy, change: c.evolutionLivechatChange, result: c.evolutionLivechatResult, evidence: c.evolutionLivechatEvidence },
  { topic: 'safety', id: 'moderation', date: '2026-10-02', status: c.evolutionModerationProduct, title: c.evolutionModerationTitle, why: c.evolutionModerationWhy, change: c.evolutionModerationChange, result: c.evolutionModerationResult, evidence: c.evolutionModerationEvidence },
  { topic: 'data', id: 'mofunledger', date: '2026-09-25', status: c.evolutionMofunledgerProduct, title: c.evolutionMofunledgerTitle, why: c.evolutionMofunledgerWhy, change: c.evolutionMofunledgerChange, result: c.evolutionMofunledgerResult, evidence: c.evolutionMofunledgerEvidence },
  { topic: 'safety', id: 'mofuncapability', date: '2026-09-19', status: c.evolutionMofuncapabilityProduct, title: c.evolutionMofuncapabilityTitle, why: c.evolutionMofuncapabilityWhy, change: c.evolutionMofuncapabilityChange, result: c.evolutionMofuncapabilityResult, evidence: c.evolutionMofuncapabilityEvidence },
  { topic: 'ai', id: 'collaborative', date: '2026-08-07', status: c.evolutionCollaborativeProduct, title: c.evolutionCollaborativeTitle, why: c.evolutionCollaborativeWhy, change: c.evolutionCollaborativeChange, result: c.evolutionCollaborativeResult, evidence: c.evolutionCollaborativeEvidence },
  { topic: 'ai', id: 'executionreview', date: '2026-09-29', status: c.evolutionExecutionreviewProduct, title: c.evolutionExecutionreviewTitle, why: c.evolutionExecutionreviewWhy, change: c.evolutionExecutionreviewChange, result: c.evolutionExecutionreviewResult, evidence: c.evolutionExecutionreviewEvidence },
  { topic: 'ai', id: 'kitregistry', date: '2026-10-12', status: c.evolutionKitregistryProduct, title: c.evolutionKitregistryTitle, why: c.evolutionKitregistryWhy, change: c.evolutionKitregistryChange, result: c.evolutionKitregistryResult, evidence: c.evolutionKitregistryEvidence },
  { topic: 'ai', id: 'filecapability', date: '2026-10-02', status: c.evolutionFilecapabilityProduct, title: c.evolutionFilecapabilityTitle, why: c.evolutionFilecapabilityWhy, change: c.evolutionFilecapabilityChange, result: c.evolutionFilecapabilityResult, evidence: c.evolutionFilecapabilityEvidence },
  { topic: 'ops', id: 'releaseintents', date: '2026-10-23', status: c.evolutionReleaseintentsProduct, title: c.evolutionReleaseintentsTitle, why: c.evolutionReleaseintentsWhy, change: c.evolutionReleaseintentsChange, result: c.evolutionReleaseintentsResult, evidence: c.evolutionReleaseintentsEvidence },
  { topic: 'ops', id: 'minimalci', date: '2026-10-14', status: c.evolutionMinimalciProduct, title: c.evolutionMinimalciTitle, why: c.evolutionMinimalciWhy, change: c.evolutionMinimalciChange, result: c.evolutionMinimalciResult, evidence: c.evolutionMinimalciEvidence },
  { topic: 'ops', id: 'policyowner', date: '2026-09-10', status: c.evolutionPolicyownerProduct, title: c.evolutionPolicyownerTitle, why: c.evolutionPolicyownerWhy, change: c.evolutionPolicyownerChange, result: c.evolutionPolicyownerResult, evidence: c.evolutionPolicyownerEvidence },
  { topic: 'quality', id: 'sourcerelease', date: '2026-10-12', status: c.evolutionSourcereleaseProduct, title: c.evolutionSourcereleaseTitle, why: c.evolutionSourcereleaseWhy, change: c.evolutionSourcereleaseChange, result: c.evolutionSourcereleaseResult, evidence: c.evolutionSourcereleaseEvidence },
  { topic: 'quality', id: 'modulecontracts', date: '2026-09-09', status: c.evolutionModulecontractsProduct, title: c.evolutionModulecontractsTitle, why: c.evolutionModulecontractsWhy, change: c.evolutionModulecontractsChange, result: c.evolutionModulecontractsResult, evidence: c.evolutionModulecontractsEvidence },
  { topic: 'quality', id: 'guidancerouting', date: '2026-10-17', status: c.evolutionGuidanceroutingProduct, title: c.evolutionGuidanceroutingTitle, why: c.evolutionGuidanceroutingWhy, change: c.evolutionGuidanceroutingChange, result: c.evolutionGuidanceroutingResult, evidence: c.evolutionGuidanceroutingEvidence },
  { topic: 'quality', id: 'attachqa', date: '2026-09-28', status: c.evolutionAttachqaProduct, title: c.evolutionAttachqaTitle, why: c.evolutionAttachqaWhy, change: c.evolutionAttachqaChange, result: c.evolutionAttachqaResult, evidence: c.evolutionAttachqaEvidence },
  { topic: 'quality', id: 'evidenceqa', date: '2026-09-26', status: c.evolutionEvidenceqaProduct, title: c.evolutionEvidenceqaTitle, why: c.evolutionEvidenceqaWhy, change: c.evolutionEvidenceqaChange, result: c.evolutionEvidenceqaResult, evidence: c.evolutionEvidenceqaEvidence },
  { topic: 'safety', id: 'secretboundary', date: '2026-09-09', status: c.evolutionSecretboundaryProduct, title: c.evolutionSecretboundaryTitle, why: c.evolutionSecretboundaryWhy, change: c.evolutionSecretboundaryChange, result: c.evolutionSecretboundaryResult, evidence: c.evolutionSecretboundaryEvidence },
  { topic: 'marketing', id: 'contentops', date: '2026-10-09', status: c.evolutionContentopsProduct, title: c.evolutionContentopsTitle, why: c.evolutionContentopsWhy, change: c.evolutionContentopsChange, result: c.evolutionContentopsResult, evidence: c.evolutionContentopsEvidence },

  { topic: 'clients', id: 'runnablefeed', date: '2026-09-26', status: c.evolutionRunnablefeedProduct, title: c.evolutionRunnablefeedTitle, why: c.evolutionRunnablefeedWhy, change: c.evolutionRunnablefeedChange, result: c.evolutionRunnablefeedResult, evidence: c.evolutionRunnablefeedEvidence },
  { topic: 'data', id: 'matchup', date: '2026-05-19', status: c.evolutionMatchupProduct, title: c.evolutionMatchupTitle, why: c.evolutionMatchupWhy, change: c.evolutionMatchupChange, result: c.evolutionMatchupResult, evidence: c.evolutionMatchupEvidence },
  { topic: 'quality', id: 'multisurfaceqa', date: '2026-08-12', status: c.evolutionMultisurfaceqaProduct, title: c.evolutionMultisurfaceqaTitle, why: c.evolutionMultisurfaceqaWhy, change: c.evolutionMultisurfaceqaChange, result: c.evolutionMultisurfaceqaResult, evidence: c.evolutionMultisurfaceqaEvidence },
].sort((a, b) => b.date.localeCompare(a.date));
const topics = [
  { id: 'design', label: c.historyTopicDesign, description: c.historyTopicDesignIntro },
  { id: 'clients', label: c.historyTopicClients, description: c.historyTopicClientsIntro },
  { id: 'ai', label: c.historyTopicAi, description: c.historyTopicAiIntro },
  { id: 'data', label: c.historyTopicData, description: c.historyTopicDataIntro },
  { id: 'safety', label: c.historyTopicSafety, description: c.historyTopicSafetyIntro },
  { id: 'ops', label: c.historyTopicOps, description: c.historyTopicOpsIntro },
  { id: 'quality', label: c.historyTopicQuality, description: c.historyTopicQualityIntro },
  { id: 'marketing', label: c.historyTopicMarketing, description: c.historyTopicMarketingIntro },
];

export function EvolutionHistory() {
  const [topic, setTopic] = useState('design');
  const selected = topics.find(item => item.id === topic)!;
  return <Stack gap="xl">
    <Text as="p" variant="caption" tone="muted">{c.historyNotice}</Text>
    <Tabs id="evolution-topics" label={c.historyTopicLabel} value={topic} onValueChange={setTopic}
      indicator="solid" items={topics.map(item => ({ id: item.id, label: `${item.label} · ${entries.filter(entry => entry.topic === item.id).length}` }))} renderPanels={false} />
    <TabPanel tabsId="evolution-topics" value={topic} activeValue={topic} mode="keyed" key={topic}>
      <Stack gap="xl">
        <Stack gap="sm"><Heading level="level2">{selected.label}</Heading><Text as="p" tone="muted">{selected.description}</Text></Stack>
        {entries.filter(entry => entry.topic === topic).sort((a, b) => b.date.localeCompare(a.date)).map(entry => <article key={entry.id} aria-labelledby={`history-${entry.id}`}>
          <Card title={<span id={`history-${entry.id}`}>{entry.title}</span>} headingLevel={3} padding="lg">
            <Stack gap="lg">
              <Stack axis="inline" gap="md" wrap>
                <Text fontRole="code" variant="caption"><time dateTime={entry.date}>{entry.date.replaceAll('-', '.')}</time></Text>
                <Tag>{entry.status}</Tag>
              </Stack>
              <Text as="p" tone="muted">{entry.why}</Text>
              <Text as="p">{entry.change}</Text>
              <Collapsible trigger={c.historyDetails}>
                <Stack gap="md"><Text emphasis="strong">{c.historyResult}</Text><Text as="p" tone="muted">{entry.result}</Text>
                  <Text as="p" variant="caption" tone="muted">{entry.evidence}</Text></Stack>
              </Collapsible>
            </Stack>
          </Card>
        </article>)}
      </Stack>
    </TabPanel>
  </Stack>;
}

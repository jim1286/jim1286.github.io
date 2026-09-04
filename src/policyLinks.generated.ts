// 생성 파일 — 손으로 고치지 말고 `pnpm run policy:sync`를 실행한다.
// 원천: app-release-hub/config/portfolio.json(policySite)과 config/apps/<id>/policy.json 존재 여부.
export const policyOrigin = "https://hjm-app-policies.jimin1286.chatgpt.site";
export const policyPaths = {
  "privacyPolicy": "/privacy/{id}",
  "accountDeletion": "/privacy/{id}/delete-account",
  "support": "/support/{id}"
} as const;
export const appsWithPolicy = ["burntok","choose-window","spint","taground","unairplane","yajalal"] as const;
export type PolicyAppId = (typeof appsWithPolicy)[number];
export function policyUrl(appId: PolicyAppId, kind: keyof typeof policyPaths): string {
  return `${policyOrigin}${policyPaths[kind].replace('{id}', appId)}`;
}

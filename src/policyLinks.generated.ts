// Generated from the public Hub projection. Run pnpm policy:sync; do not edit.
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

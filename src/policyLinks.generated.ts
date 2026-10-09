// Generated from the public Hub projection. Run pnpm policy:sync; do not edit.
export const policyOrigin = "https://hjm-app-policies.jimin1286.chatgpt.site";
export const policyPaths = {
  "privacyPolicy": "/privacy/{id}",
  "accountDeletion": "/privacy/{id}/delete-account",
  "support": "/support/{id}"
} as const;
export const appsWithPolicy = ["burntok","choose-window","diairy","spint","taground","unairplane","yajalal"] as const;
export const policyUrls = {
  "burntok": {
    "privacyPolicy": "https://burntok.jmstudioapps.com/legal/privacy",
    "accountDeletion": "https://burntok.jmstudioapps.com/legal/account-deletion",
    "support": "https://burntok.jmstudioapps.com/legal/"
  },
  "choose-window": {
    "privacyPolicy": "https://hjm-app-policies.jimin1286.chatgpt.site/privacy/choose-window",
    "accountDeletion": "https://hjm-app-policies.jimin1286.chatgpt.site/privacy/choose-window/delete-account",
    "support": "https://hjm-app-policies.jimin1286.chatgpt.site/support/choose-window"
  },
  "diairy": {
    "privacyPolicy": "https://airy.jmstudioapps.com/legal/privacy",
    "accountDeletion": "https://airy.jmstudioapps.com/legal/account-deletion",
    "support": "https://airy.jmstudioapps.com/legal/"
  },
  "spint": {
    "privacyPolicy": "https://api.spint.jmstudioapps.com/legal/privacy",
    "accountDeletion": "https://api.spint.jmstudioapps.com/legal/account-deletion",
    "support": "https://api.spint.jmstudioapps.com/legal/"
  },
  "taground": {
    "privacyPolicy": "https://hjm-app-policies.jimin1286.chatgpt.site/privacy/taground",
    "accountDeletion": "https://hjm-app-policies.jimin1286.chatgpt.site/privacy/taground/delete-account",
    "support": "https://hjm-app-policies.jimin1286.chatgpt.site/support/taground"
  },
  "unairplane": {
    "privacyPolicy": "https://hjm-app-policies.jimin1286.chatgpt.site/privacy/unairplane",
    "accountDeletion": "https://hjm-app-policies.jimin1286.chatgpt.site/privacy/unairplane/delete-account",
    "support": "https://hjm-app-policies.jimin1286.chatgpt.site/support/unairplane"
  },
  "yajalal": {
    "privacyPolicy": "https://hjm-app-policies.jimin1286.chatgpt.site/privacy/yajalal",
    "accountDeletion": "https://hjm-app-policies.jimin1286.chatgpt.site/privacy/yajalal/delete-account",
    "support": "https://hjm-app-policies.jimin1286.chatgpt.site/support/yajalal"
  }
} as const;
export type PolicyAppId = (typeof appsWithPolicy)[number];
export function policyUrl(appId: PolicyAppId, kind: keyof typeof policyPaths): string {
  return policyUrls[appId][kind];
}

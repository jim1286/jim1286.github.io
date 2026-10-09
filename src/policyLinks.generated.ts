// Generated from the public Hub projection. Run pnpm policy:sync; do not edit.
export const policyOrigin = "https://policies.jmstudioapps.com";
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
    "privacyPolicy": "https://policies.jmstudioapps.com/privacy/choose-window",
    "accountDeletion": "https://policies.jmstudioapps.com/privacy/choose-window/delete-account",
    "support": "https://policies.jmstudioapps.com/support/choose-window"
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
    "privacyPolicy": "https://policies.jmstudioapps.com/privacy/taground",
    "accountDeletion": "https://policies.jmstudioapps.com/privacy/taground/delete-account",
    "support": "https://policies.jmstudioapps.com/support/taground"
  },
  "unairplane": {
    "privacyPolicy": "https://policies.jmstudioapps.com/privacy/unairplane",
    "accountDeletion": "https://policies.jmstudioapps.com/privacy/unairplane/delete-account",
    "support": "https://policies.jmstudioapps.com/support/unairplane"
  },
  "yajalal": {
    "privacyPolicy": "https://policies.jmstudioapps.com/privacy/yajalal",
    "accountDeletion": "https://policies.jmstudioapps.com/privacy/yajalal/delete-account",
    "support": "https://policies.jmstudioapps.com/support/yajalal"
  }
} as const;
export type PolicyAppId = (typeof appsWithPolicy)[number];
export function policyUrl(appId: PolicyAppId, kind: keyof typeof policyPaths): string {
  return policyUrls[appId][kind];
}

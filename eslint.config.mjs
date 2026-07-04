import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

import { camDssRules } from "./kit/eslint-cam-dss.mjs";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Stock/vendored shadcn code: components/ui (shadcn add --all),
    // components/*-example.tsx + example.tsx (registry example items),
    // components/blocks/** and app/b/** (registry blocks), hooks/** (stock
    // hooks). None of this is edited locally - a preset change reinstalls
    // it wholesale - so it is excluded from lint entirely rather than
    // patched to satisfy rules it was never written against.
    "components/ui/**",
    "components/*-example.tsx",
    "components/example.tsx",
    "components/blocks/**",
    "hooks/**",
    "app/b/**",
  ]),
  {
    name: "cam-dss",
    files: ["app/**/*.tsx", "components/**/*.tsx"],
    rules: {
      "no-restricted-syntax": ["error", ...camDssRules],
    },
  },
]);

export default eslintConfig;

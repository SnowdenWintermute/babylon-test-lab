import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Override rules here
  {
    rules: {
      "no-unused-vars": "warn", // make 'defined but never used' a warning
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];

export default eslintConfig;

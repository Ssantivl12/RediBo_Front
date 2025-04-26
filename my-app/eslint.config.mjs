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
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",  // Cambiar a "warn" para solo advertencias en vez de errores
      "@typescript-eslint/no-explicit-any": "warn", // Cambiar a "warn" para solo advertencias en vez de errores
      "@next/next/no-img-element": "warn",  // Cambiar a "warn" si no quieres que falle por el uso de <img>
    },
  },
];

export default eslintConfig;

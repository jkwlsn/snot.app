import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import eslintjs from "@eslint/js";
import tseslint from "typescript-eslint";
import vueParser from "vue-eslint-parser";
import vue from "eslint-plugin-vue";
import prettier from "eslint-config-prettier";

export default defineConfig([
  globalIgnores([
    "vite.config.ts",
    "*.config.ts",
    "eslint.config.js",
    "src/*.d.ts",
    "./dist",
  ]),

  eslintjs.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: globals.browser,
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        extraFileExtensions: [".vue"],
        parser: tseslint.parser,
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: globals.browser,
    },
    plugins: {
      vue,
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",

      "vue/no-unused-components": "warn",
      "vue/no-unused-vars": "warn",
    },
  },

  {
    files: ["**/*.ts", "**/*.vue"],
    plugins: {
      vue,
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/strict-boolean-expressions": "warn",

      "no-console": "warn",
      "no-debugger": "warn",
      eqeqeq: ["warn", "always"],

      "vue/no-unused-components": "warn",
      "vue/no-unused-vars": "warn",
      "vue/require-default-prop": "warn",
      "vue/require-prop-types": "warn",

      "sort-vars": ["warn"],
      "sort-keys": [
        "warn",
        "asc",
        { caseSensitive: true, natural: false, minKeys: 2 },
      ],
      "sort-imports": [
        "warn",
        {
          ignoreCase: false,
          ignoreDeclarationSort: false,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ["none", "all", "multiple", "single"], // Order of import syntaxes
          allowSeparatedGroups: false, // Whether to allow separated groups in imports
        },
      ],
    },
  },

  prettier,
]);

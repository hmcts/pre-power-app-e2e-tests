import { LintingConfig } from '@hmcts/playwright-common';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

// If path to tests is different, directly overwride the path:
// const tsConfig = LintingConfig.tseslintPlugin;
// const pwConfig = LintingConfig.playwright;
// tsConfig.files = ["tests/**/*.ts"];
// pwConfig.files = ["tests/**/*.ts"];
// tseslint.config(..., config, ...)

export default tseslint.config(
  LintingConfig.tseslintRecommended,
  LintingConfig.ignored,
  LintingConfig.tseslintPlugin,
  LintingConfig.playwright,
  prettier,
);

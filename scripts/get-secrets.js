import { populateSecrets } from '@hmcts/playwright-common';
// pre-hmctskv-test used for common secrets across all environments
// pre-hmctskv-dev used for dev specific secrets, Update as needed
const vaultNames = ['pre-hmctskv-test', 'pre-hmctskv-dev'];
populateSecrets(vaultNames);


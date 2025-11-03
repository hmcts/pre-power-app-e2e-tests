import { test as setup } from './fixtures';

/**
 * Sets up test sessions for all required user roles and stores session data.
 * This setup script can be reused for each user type individually.
 * Note: Manually signing out during tests will invalidate the stored session.
 */
setup.describe('Set up users and retrieve tokens', () => {
  setup('Store session data for Level 3 user', async ({ portal_HomePage, portal_B2cLoginPage, context, config }) => {
    const user = config.portalUsers.preLevel3User;
    await portal_HomePage.goTo();
    await portal_B2cLoginPage.signIn(user.username, user.password);
    await portal_HomePage.verifyUserIsOnHomePage();
    await context.storageState({ path: user.sessionFile });
  });
});

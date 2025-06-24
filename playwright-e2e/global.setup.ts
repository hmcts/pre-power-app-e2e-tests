import { test as setup } from './fixtures';

/**
 * Sets up test sessions for all required user roles and stores session data.
 * This setup script can be reused for each user type individually.
 * Note: Manually signing out during tests will invalidate the stored session.
 */
setup.describe('Set up users and retrieve tokens', () => {
  /**
   * Signs in as the pre-configured user and stores the session state.
   *
   * This setup logs in using the provided credentials and saves the browser
   * storage state to a file, allowing tests to reuse the authenticated session.
   */
  setup('Store session data', async ({ msSignInPage, context, config }) => {
    const user = config.users.preUser;
    await msSignInPage.signIn(user.username, user.password);
    await context.storageState({ path: user.sessionFile });
  });
});

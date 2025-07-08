import path from 'path';
import fs from 'fs';
import { Page } from '@playwright/test';

export class NetworkInterceptUtils {
  constructor(public readonly page: Page) {}

  /**
   * Intercepts the network response for the user data and stores it in a specified file.
   * This method waits for a response from the Power App API that contains user and court information.
   * If the response is not received within the specified timeout, an error is thrown.
   * @param pathToFile - The path to the file where user data will be stored.
   */
  public async interceptAndStoreUserDataUponLogin(pathToFile: string): Promise<void> {
    const timeoutMs = 60000;
    const startTime = Date.now();

    let responseBody;
    let userId: string | null = null;
    let defaultCourtId: string | null = null;

    while ((!userId || !defaultCourtId) && Date.now() - startTime < timeoutMs) {
      const response = await this.page
        .waitForResponse((res) => res.url().includes('custom.uk.azure-apihub.net/invoke') && res.request().method() === 'POST', { timeout: 5000 })
        .catch(() => null);

      if (!response) {
        continue;
      }

      try {
        responseBody = await response.json();

        if (Array.isArray(responseBody.app_access)) {
          for (const access of responseBody.app_access) {
            if (access.default_court === true) {
              userId = access.id;
              defaultCourtId = access.court.id;
              break;
            }
          }
        }
      } catch {
        continue;
      }
    }

    if (!userId || !defaultCourtId) {
      throw new Error(`Timeout: Did not find valid /invoke response with default court within ${timeoutMs / 1000} seconds.`);
    }

    const dir = path.dirname(pathToFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(pathToFile, JSON.stringify({ userId, defaultCourtId }));
  }
}

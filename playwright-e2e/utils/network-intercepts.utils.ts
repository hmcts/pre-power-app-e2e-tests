import path from 'path';
import fs from 'fs';
import { Page, expect } from '@playwright/test';

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

    let userId: string | undefined;
    let x_userId: string | undefined;
    let defaultCourtId: string | undefined;

    await expect
      .poll(
        async () => {
          const response = await this.page
            .waitForResponse((res) => res.url().includes('custom.uk.azure-apihub.net/invoke') && res.request().method() === 'POST', { timeout: 5000 })
            .catch(() => null);

          if (!response) return false;

          try {
            const responseBody = await response.json();
            userId = responseBody?.user?.id;
            x_userId = responseBody?.app_access?.[0]?.id;

            if (Array.isArray(responseBody.app_access)) {
              for (const access of responseBody.app_access) {
                if (access.default_court === true) {
                  defaultCourtId = access.court?.id;
                  break;
                }
              }
            }
          } catch (err) {
            console.warn('Failed to parse response body:', err);
            return false;
          }

          return !!userId && !!x_userId && !!defaultCourtId;
        },
        {
          timeout: timeoutMs,
          message: `Timeout: Did not find valid /invoke response with default court within ${timeoutMs / 1000} seconds.`,
        },
      )
      .toBeTruthy();

    const dir = path.dirname(pathToFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(pathToFile, JSON.stringify({ userId, x_userId, defaultCourtId }));
  }

  /**
   * Intercepts a network request to verify that a recording is taking place for a specific case reference.
   * It waits for a response from the Power App API and checks if the response body contains the expected case reference
   * and that the status is 'RECORDING'. If the expected response is not received within the specified timeout, an error is thrown.
   * @param caseReference - The case reference to verify in the response.
   * @param timeoutMs - The maximum time to wait for the expected response.
   */
  public async interceptNetworkRequestToVerifyRecordingIsTakingPlace(caseReference: string, timeoutMs: number): Promise<void> {
    await expect
      .poll(
        async () => {
          const response = await this.page
            .waitForResponse((res) => res.url().includes('/invoke') && res.request().method() === 'POST', { timeout: 5000 })
            .catch(() => null);

          if (!response) return false;

          try {
            const body = await response.json();

            const hasExpectedReference = body?.case_dto?.reference === caseReference;
            const isRecording = body?.capture_sessions?.[0]?.status === 'RECORDING';

            return hasExpectedReference && isRecording;
          } catch (err) {
            console.warn('Error parsing JSON response:', err);
            return false;
          }
        },
        {
          timeout: timeoutMs,
          message: `Timeout: Expected POST /invoke response with 'RECORDING' status and reference '${caseReference}' within ${timeoutMs / 1000} seconds in order to confrim recording is taking place in powerapps.`,
        },
      )
      .toBeTruthy();
  }
}

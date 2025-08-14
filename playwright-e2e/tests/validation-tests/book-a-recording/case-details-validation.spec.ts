import { test, expect } from '../../../fixtures';
import { config } from '../../../utils';
import { faker } from '@faker-js/faker';

test.describe('Set of tests to verify validation of case details page is correct', () => {
  test.use({ storageState: config.powerAppUsers.preLevel1User.sessionFile });

  test.beforeEach(async ({ navigateToCaseDetailsPage }) => {
    await navigateToCaseDetailsPage();
  });

  test(
    'Verify case reference field when left empty shows validation error',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ caseDetailsPage, dataUtils }) => {
      await test.step('Pre-requisite step in order to fill out defendants and wintness fields with valid values', async () => {
        await caseDetailsPage.$inputs.defendants.fill(dataUtils.generateRandomNames('fullName', 1)[0]);
        await caseDetailsPage.$inputs.witnesses.fill(dataUtils.generateRandomNames('firstName', 1)[0]);
      });

      await caseDetailsPage.$interactive.saveButton.click();
      await expect(caseDetailsPage.$static.validationErrorHeading).toBeVisible();
      await expect(caseDetailsPage.$static.validationErrorText).toBeVisible();
      await expect(caseDetailsPage.$static.validationErrorText).toHaveText('Please enter a case reference between 9 and 13 characters.');
    },
  );

  test(
    'Verify case reference containing less than 9 characters is rejected',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ caseDetailsPage, dataUtils }) => {
      await test.step('Pre-requisite step in order to fill out defendant and wintness fields with valid values', async () => {
        await caseDetailsPage.$inputs.defendants.fill(dataUtils.generateRandomNames('fullName', 1)[0]);
        await caseDetailsPage.$inputs.witnesses.fill(dataUtils.generateRandomNames('firstName', 1)[0]);
      });

      for (const length of [0, 8]) {
        const value = faker.string.alphanumeric(length);
        await caseDetailsPage.$inputs.caseReference.clear();
        await caseDetailsPage.$inputs.caseReference.fill(value);
        await caseDetailsPage.$interactive.saveButton.click();

        await expect(caseDetailsPage.$static.validationErrorHeading).toBeVisible();
        await expect(caseDetailsPage.$static.validationErrorText).toBeVisible();
        await expect(caseDetailsPage.$static.validationErrorText).toHaveText('Please enter a case reference between 9 and 13 characters.');

        await caseDetailsPage.$interactive.validationErrorCloseButton.click();
        await expect(caseDetailsPage.$static.validationErrorHeading).toBeHidden();
      }
    },
  );

  test(
    'Verify case reference field trims values above 13 characters',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ caseDetailsPage }) => {
      const value = faker.string.alphanumeric(14);
      await caseDetailsPage.$inputs.caseReference.fill(value);
      await expect(caseDetailsPage.$inputs.caseReference).toHaveValue(value.slice(0, 13));
    },
  );

  test(
    'Verify user is unable to create a dupiclate case using an existing case reference of a case in open status',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ caseDetailsPage, apiClient, dataUtils }) => {
      await test.step('Pre-requisite step in order to create a case via api', async () => {
        await apiClient.createCase(2, 2);
      });

      const caseData = await apiClient.getCaseData();
      const defendantNames = dataUtils.generateRandomNames('fullName', 1);
      const witnessNames = dataUtils.generateRandomNames('firstName', 1);

      await test.step('Populate case details and click on save button', async () => {
        await caseDetailsPage.populateCaseDetails({
          caseReference: caseData.caseReference,
          defendantNames: defendantNames,
          witnessNames: witnessNames,
        });

        await caseDetailsPage.$interactive.saveButton.click();
      });

      await test.step('Verify error message is displayed to state case reference already exists', async () => {
        await expect(caseDetailsPage.$static.validationErrorHeading).toBeVisible();
        await expect(caseDetailsPage.$static.validationErrorText).toBeVisible();
        await expect(caseDetailsPage.$static.validationErrorText).toHaveText(
          'The case reference you have entered already exists, please navigate to that case or re-enter a new Case Ref.',
        );
      });
    },
  );

  test(
    'Verify user is unable to create a dupiclate case using an existing case reference of a case in deleted status',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ caseDetailsPage, apiClient, dataUtils }) => {
      test.fail(true, 'To be discussed with BA');

      await test.step('Pre-requisite step in order to create a new case and set it to deleted status via api', async () => {
        const caseData = await apiClient.createCase(2, 2);
        await apiClient.deleteCaseByCaseId(caseData.caseId);
      });

      const caseData = await apiClient.getCaseData();
      const defendantNames = dataUtils.generateRandomNames('fullName', 1);
      const witnessNames = dataUtils.generateRandomNames('firstName', 1);

      await test.step('Populate case details and click on save button', async () => {
        await caseDetailsPage.populateCaseDetails({
          caseReference: caseData.caseReference,
          defendantNames: defendantNames,
          witnessNames: witnessNames,
        });

        await caseDetailsPage.$interactive.saveButton.click();
      });

      await test.step('Verify error message is displayed to state case reference already exists', async () => {
        await expect(caseDetailsPage.$static.validationErrorHeading).toBeVisible();
        await expect(caseDetailsPage.$static.validationErrorText).toBeVisible();
        await expect(caseDetailsPage.$static.validationErrorText).toHaveText(
          'The case reference you have entered already exists, please navigate to that case or re-enter a new Case Ref.',
        );
      });
    },
  );

  test(
    'Verify case reference containing special characters is rejected',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ caseDetailsPage, dataUtils }) => {
      test.fail(true, 'Known bug - S28-4032 & S28-4031');

      await test.step('Fill out prerequisite fields with valid data', async () => {
        await caseDetailsPage.$inputs.defendants.fill(dataUtils.generateRandomNames('fullName', 1)[0]);
        await caseDetailsPage.$inputs.witnesses.fill(dataUtils.generateRandomNames('firstName', 1)[0]);
      });

      const specialCharacters = Array.from(new Set(';#<>?+_{}@:~=¬`|\\/*&^%$£"!'));

      for (const char of specialCharacters) {
        await test.step(`Validate invalid case reference containing special character '${char}' is rejected`, async () => {
          const invalidValue = faker.string.alphanumeric(12) + char;

          await caseDetailsPage.$inputs.caseReference.clear();
          await caseDetailsPage.$inputs.caseReference.fill(invalidValue);
          await caseDetailsPage.$interactive.saveButton.click();

          const errorTextLocator = caseDetailsPage.$static.validationErrorText;
          const headingLocator = caseDetailsPage.$static.validationErrorHeading;

          await expect(headingLocator).toBeVisible();
          await expect(errorTextLocator).toBeVisible();
          await expect(errorTextLocator).toHaveText('Case reference cannot include special characters: ;#<?>+_{}@:~=¬`|\\/*&^%$£""!');

          await caseDetailsPage.$interactive.validationErrorCloseButton.click();
          await expect(headingLocator).toBeHidden();
        });
      }
    },
  );

  test(
    'Verify Defendants field when left empty shows validation error',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ caseDetailsPage, dataUtils }) => {
      await test.step('Pre-requisite step in order to fill out case Reference and wintness fields with valid values', async () => {
        await caseDetailsPage.$inputs.caseReference.fill(dataUtils.generateRandomCaseReference());
        await caseDetailsPage.$inputs.witnesses.fill(dataUtils.generateRandomNames('firstName', 1)[0]);
      });

      await caseDetailsPage.$interactive.saveButton.click();
      await expect(caseDetailsPage.$static.validationErrorHeading).toBeVisible();
      await expect(caseDetailsPage.$static.validationErrorText).toBeVisible();
      await expect(caseDetailsPage.$static.validationErrorText).toHaveText('Please enter a defendant name into the defendant field.');
    },
  );

  test(
    'Verify Defendants first name or Last name containing more than 25 characters are rejected',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ caseDetailsPage, dataUtils }) => {
      await test.step('Pre-requisite step in order to fill out case Reference and witness fields with valid values', async () => {
        await caseDetailsPage.$inputs.caseReference.fill(dataUtils.generateRandomCaseReference());
        await caseDetailsPage.$inputs.witnesses.fill(dataUtils.generateRandomNames('firstName', 1)[0]);
      });
      const validationErrorHeading = caseDetailsPage.$static.validationErrorHeading;
      const validationErrorText = caseDetailsPage.$static.validationErrorText;

      await test.step('Verify defendants first name containing more than 25 is rejected', async () => {
        const firstName = faker.string.alpha(26);
        const lastName = faker.string.alpha(10);
        await caseDetailsPage.$inputs.defendants.fill(`${firstName} ${lastName}`);

        await caseDetailsPage.$interactive.saveButton.click();
        await expect(validationErrorHeading).toBeVisible();
        await expect(validationErrorText).toBeVisible();
        await expect(validationErrorText).toHaveText('Defendant name must be between 1 and 25 characters.');
        await caseDetailsPage.$interactive.validationErrorCloseButton.click();
        await expect(validationErrorHeading).toBeHidden();
      });
      await test.step('Verify defendants last name containing more than 25 is rejected', async () => {
        const firstName = faker.string.alpha(10);
        const lastName = faker.string.alpha(26);
        await caseDetailsPage.$inputs.defendants.fill(`${firstName} ${lastName}`);

        await caseDetailsPage.$interactive.saveButton.click();
        await expect(validationErrorHeading).toBeVisible();
        await expect(validationErrorText).toBeVisible();
        await expect(validationErrorText).toHaveText('Defendant name must be between 1 and 25 characters.');
      });
    },
  );

  test(
    'Verify Defendants containing first name only is rejected',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ caseDetailsPage, dataUtils }) => {
      await test.step('Pre-requisite step in order to fill out case Reference and wintness fields with valid values', async () => {
        await caseDetailsPage.$inputs.caseReference.fill(dataUtils.generateRandomCaseReference());
        await caseDetailsPage.$inputs.witnesses.fill(dataUtils.generateRandomNames('firstName', 1)[0]);
      });
      const firstName = dataUtils.generateRandomNames('firstName', 1)[0];
      await caseDetailsPage.$inputs.defendants.fill(firstName);

      await caseDetailsPage.$interactive.saveButton.click();
      await expect(caseDetailsPage.$static.validationErrorHeading).toBeVisible();
      await expect(caseDetailsPage.$static.validationErrorText).toBeVisible();
      await expect(caseDetailsPage.$static.validationErrorText).toHaveText('Defendant names should be first and last name only.');
    },
  );

  test(
    'Verify Defendants name containing special characters is rejected',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ caseDetailsPage, dataUtils }) => {
      test.fail(true, 'Known bug - S28-4081');

      await test.step('Pre-requisite step in order to fill out case Reference and witness fields with valid values', async () => {
        await caseDetailsPage.$inputs.caseReference.fill(dataUtils.generateRandomCaseReference());
        await caseDetailsPage.$inputs.witnesses.fill(dataUtils.generateRandomNames('firstName', 1)[0]);
      });

      const specialCharacters = Array.from(new Set(';#<>?+_{}@:~=¬`|\\/*&^%$£"!'));

      for (const char of specialCharacters) {
        await test.step(`Validate Defendants name containing special character '${char}' is rejected`, async () => {
          const invalidValue = dataUtils.generateRandomNames('fullName', 1)[0] + char;
          await caseDetailsPage.$inputs.defendants.clear();
          await caseDetailsPage.$inputs.defendants.fill(invalidValue);
          await caseDetailsPage.$interactive.saveButton.click();

          const errorTextLocator = caseDetailsPage.$static.validationErrorText;
          const headingLocator = caseDetailsPage.$static.validationErrorHeading;

          await expect(headingLocator).toBeVisible();
          await expect(errorTextLocator).toBeVisible();
          await expect(errorTextLocator).toHaveText('Defendant name cannot include special characters: ;#<?>+_{}@:~=¬`|\\/*&^%$£\\""!');

          await caseDetailsPage.$interactive.validationErrorCloseButton.click();
          await expect(headingLocator).toBeHidden();
        });
      }
    },
  );

  test(
    'Verify Witness field when left empty shows validation error',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ caseDetailsPage, dataUtils }) => {
      await test.step('Pre-requisite step in order to fill out case Reference and Defendants fields with valid values', async () => {
        await caseDetailsPage.$inputs.caseReference.fill(dataUtils.generateRandomCaseReference());
        await caseDetailsPage.$inputs.defendants.fill(dataUtils.generateRandomNames('fullName', 1)[0]);
      });

      await caseDetailsPage.$interactive.saveButton.click();
      await expect(caseDetailsPage.$static.validationErrorHeading).toBeVisible();
      await expect(caseDetailsPage.$static.validationErrorText).toBeVisible();
      await expect(caseDetailsPage.$static.validationErrorText).toHaveText('Please enter a witness name into the witness field.');
    },
  );

  test(
    'Verify Witness containing last name is rejected',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ caseDetailsPage, dataUtils }) => {
      await test.step('Pre-requisite step in order to fill out case Reference and Defendants fields with valid values', async () => {
        await caseDetailsPage.$inputs.caseReference.fill(dataUtils.generateRandomCaseReference());
        await caseDetailsPage.$inputs.defendants.fill(dataUtils.generateRandomNames('fullName', 1)[0]);
      });
      const name = dataUtils.generateRandomNames('fullName', 1)[0];

      await caseDetailsPage.$inputs.witnesses.fill(name);

      await caseDetailsPage.$interactive.saveButton.click();
      await expect(caseDetailsPage.$static.validationErrorHeading).toBeVisible();
      await expect(caseDetailsPage.$static.validationErrorText).toBeVisible();
      await expect(caseDetailsPage.$static.validationErrorText).toHaveText('Witness names should be first name only.');
    },
  );

  test(
    'Verify Witness name containing special characters is rejected',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ caseDetailsPage, dataUtils }) => {
      test.fail(true, 'Known bug - S28-4081');

      await test.step('Pre-requisite step in order to fill out case Reference and Defendants fields with valid values', async () => {
        await caseDetailsPage.$inputs.caseReference.fill(dataUtils.generateRandomCaseReference());
        await caseDetailsPage.$inputs.defendants.fill(dataUtils.generateRandomNames('fullName', 1)[0]);
      });

      const specialCharacters = Array.from(new Set(';#<>?+_{}@:~=¬`|\\/*&^%$£"!'));

      for (const char of specialCharacters) {
        await test.step(`Validate Witnesses name containing special character '${char}' is rejected`, async () => {
          const invalidValue = dataUtils.generateRandomNames('firstName', 1)[0] + char;
          await caseDetailsPage.$inputs.witnesses.clear();
          await caseDetailsPage.$inputs.witnesses.fill(invalidValue);
          await caseDetailsPage.$interactive.saveButton.click();

          const errorTextLocator = caseDetailsPage.$static.validationErrorText;
          const headingLocator = caseDetailsPage.$static.validationErrorHeading;

          await expect(headingLocator).toBeVisible();
          await expect(errorTextLocator).toBeVisible();
          await expect(errorTextLocator).toHaveText('Witness name cannot include special characters: ;#<?>+_{}@:~=¬`|\\/*&^%$£\\""!');

          await caseDetailsPage.$interactive.validationErrorCloseButton.click();
          await expect(headingLocator).toBeHidden();
        });
      }
    },
  );

  test(
    'Verify Witness first name containing more than 25 characters are rejected',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ caseDetailsPage, dataUtils }) => {
      await test.step('Pre-requisite step in order to fill out case Reference and Defendants fields with valid values', async () => {
        await caseDetailsPage.$inputs.caseReference.fill(dataUtils.generateRandomCaseReference());
        await caseDetailsPage.$inputs.defendants.fill(dataUtils.generateRandomNames('fullName', 1)[0]);
      });
      const validationErrorHeading = caseDetailsPage.$static.validationErrorHeading;
      const validationErrorText = caseDetailsPage.$static.validationErrorText;

      await test.step('Verify Witnesses first name containing more than 25 is rejected', async () => {
        const firstName = faker.string.alpha(26);

        await caseDetailsPage.$inputs.witnesses.fill(firstName);

        await caseDetailsPage.$interactive.saveButton.click();
        await expect(validationErrorHeading).toBeVisible();
        await expect(validationErrorText).toBeVisible();
        await expect(validationErrorText).toHaveText('Witness name must be between 1 and 25 characters.');
        await caseDetailsPage.$interactive.validationErrorCloseButton.click();
        await expect(validationErrorHeading).toBeHidden();
      });
    },
  );

  test(
    'Verify user is unable to modify an existing witness name with blank first name',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ caseDetailsPage, apiClient }) => {
      await test.step('Pre-requisite step in order to create a case via api and search / select the case that has been created', async () => {
        const caseData = await apiClient.createCase(1, 1);
        await caseDetailsPage.searchAndSelectExistingCase(caseData.caseReference);
      });

      await test.step('Modify case by amending witness first name to be blank', async () => {
        const caseData = await apiClient.getCaseData();
        await caseDetailsPage.$interactive.modifyButton.click();
        await expect(caseDetailsPage.$interactive.modifyCaseAddNewParticipantButton).toBeVisible();
        await caseDetailsPage.$modifyCaseSelectOptionToAmendParticipant(caseData.witnessNames[0]);
        await caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.firstNameInput.clear();
        await expect(caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.firstNameInput).toBeEmpty();
      });

      await test.step('Verify user is unable to select the submit button', async () => {
        await expect(caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.submitButton).toBeDisabled();
      });
    },
  );

  test(
    'Verify user is unable to modify an existing defendant name with blank first name or last name',
    {
      tag: ['@regression', '@validation'],
    },
    async ({ caseDetailsPage, apiClient }) => {
      await test.step('Pre-requisite step in order to create a case via api and search / select the case that has been created', async () => {
        const caseData = await apiClient.createCase(1, 1);
        await caseDetailsPage.searchAndSelectExistingCase(caseData.caseReference);
      });

      await test.step('Modify case by amending defendant first name to be blank', async () => {
        const caseData = await apiClient.getCaseData();
        await caseDetailsPage.$interactive.modifyButton.click();
        await expect(caseDetailsPage.$interactive.modifyCaseAddNewParticipantButton).toBeVisible();
        await caseDetailsPage.$modifyCaseSelectOptionToAmendParticipant(caseData.defendantNames[0]);
        await caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.firstNameInput.clear();
        await expect(caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.firstNameInput).toBeEmpty();
      });

      await test.step('Verify user is unable to select the submit button', async () => {
        await expect(caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.submitButton).toBeDisabled();
      });

      await test.step('Re-populate first name field and set last name to be blank', async () => {
        await caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.firstNameInput.fill('John');
        await expect(caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.firstNameInput).toHaveValue('John');
        await caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.lastNameInput.clear();
        await expect(caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.lastNameInput).toBeEmpty();
      });

      await test.step('Verify user is unable to select the submit button', async () => {
        await expect(caseDetailsPage.$modifyCaseAmendOrAddNewParticipantModal.submitButton).toBeDisabled();
      });
    },
  );
});

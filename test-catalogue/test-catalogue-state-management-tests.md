# state-management-tests catalogue

----------------------------------------------------------------------------------------------------
** File:** `playwright-e2e/tests/state-management-tests/book-a-recording/case-details-state.spec.ts`

## Verify when accessing the caseDetailsPage all the three buttons are in the correct state
- Verify all the buttons on case details page are visible
- Verify modify and bookings buttons are disabled when accessing case details page
- Verify save button is enabled when accessing case details page

## Verify when selecting an exisiting case, four buttons are in the correct state
- Pre-requisite step in order to create a case via api
- Verify all four buttons are visible
- Verify three buttons are enabled
- Verify save button is disabled upon selecting an exisiting case

## Verify when selecting options to close case,all the buttons are in the correct state
- Pre-requisite step in order to create and select a new case
- Verify buttons to cancel or save are visible upon selecting close case button
- Verify buttons to cancel or save are enabled upon selecting close case button
- Verify buttons to select yes or no are visible upon selecting save button
- Verify buttons to select yes or no are enabled upon selecting save button


----------------------------------------------------------------------------------------------------
** File:** `playwright-e2e/tests/state-management-tests/home-page-state.spec.ts`

## Verify all buttons on the homepage are visible and enabled
- Verify all buttons on homepage are visible
- Verify all buttons on homepage are enabled

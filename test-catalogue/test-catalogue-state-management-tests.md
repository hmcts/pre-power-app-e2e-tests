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


----------------------------------------------------------------------------------------------------
** File:** `playwright-e2e/tests/state-management-tests/manage-bookings/manage-bookings-state.spec.ts`

## Verify when accessing the manage bookings Page and selecting an exisiting case all the buttons are in correct state
- Pre-requisite step in order to create and select a exising case via api
- Verify following manage, amend and record buttons are visible
- Verify following manage, amend and record buttons are enabled

## Verify when selecting option to manage a case all buttons are in the correct state
- Pre-requisite step in order to select the option to manage an exisitng case
- Verify following cancel, share and audit buttons are visible
- Verify following cancel, share and audit buttons are enabled
- Verify following manage, amend and record buttons are disabled

## Verify when selecting an option to share a case all buttons are in the correct state
- Pre-requisite step in order to select the option to share an exisitng case
- Verify following cancel and grant access buttons are visible and enabled
- Verify following manage, amend and record buttons are disabled

## Verify when selecting option to audit a case all buttons are in the correct state
- Pre-requisite step in order to select the option to audit an exisitng case
- Verify close button is enabled and visible
- Verify following manage, amend and record buttons are disabled

## Verify when selecting a option to amend a case all three buttons are in the correct state
- Pre-requisite step in order to select the option to amend an exisiitng case
- Verify following cancel, save and delete buttons are visible
- Verify cancel and delete buttons are enabled
- Verify save button is disabled
- Verify following manage, amend and record buttons are disabled

## Verify when cancelling amendments to an exisitng case, all buttons are in the correct state
- Pre-requisite step in order to cancel amendment of an exisitng case
- Verify yes and no buttons are visible and enabled

## Verify when selecting option to delete an exisiting case, all buttons are in the correct state
- Pre-requisite step in order to delete an exisitng case
- Verify yes and no buttons are visible and enabled
- Verify following manage,amend and record buttons are disabled

## Verify when selecting option to record for an existing case, two buttons are in the correct state
- Pre-requisite step in order to select the option to record an exisiting case
- Verify following back and start recording buttons are visible and enabled

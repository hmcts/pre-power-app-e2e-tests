# visual-tests catalogue

----------------------------------------------------------------------------------------------------
** File:** `playwright-e2e/tests/visual-tests/book-a-recording/case-details-visual.spec.ts`

## Verify when accessing case details page, it is visually correct
- Verify upon accessing case details page, it is visually correct

## Verify error message is visualy correct when trying to create a case with null values
- Attempt to create a case with null values
- Verify error message is visually correct

## Verify when searching for a case, it is visually correct
- Pre-requisite step in order to begin searching for a case
- Verify UI is visually correct when searching for a case

## Verify when selecting an existing case, it is visually correct
- Pre-requisite step in order to create a new case to search and select
- Verify UI is visually correct once an existing case has been selected

## Verify once option to close case has been selected, it is visually correct
- Pre-requisite step in order to create a new case to search and select
- Verify UI is visually correct once close case button has been selected
- Verify UI is visualy correct once save option in close case modal has been selected
- Verify UI is visualy correct once yes option in close case modal has been selected

## Verify when selecting option to cancel closure of an existing case, it is visually correct
- Pre-requisite step in order to set a newly created case to status pending closure
- Verify UI is visually correct once cancel button for case that is pending closure has been selected

## Verify when selecting option to modify an existing case, it is visually correct
- Pre-requisite step in order to setup a new case and search/select the new case
- Verify UI is visually correct once user has selected option to modify case
- Verify UI is visually correct once user has selected option to modify case reference
- Hide participant full names so that they do not appear in screenshots for the remaining test steps
- Verify UI is visually correct once user has selected option to add new participant
- Verify UI is visually correct once user has selected option to amend existing witness
- Verify UI is visually correct once user has selected option to amend existing defendant


----------------------------------------------------------------------------------------------------
** File:** `playwright-e2e/tests/visual-tests/book-a-recording/schedule-recording-visual.spec.ts`

## Verify when accessing schedule recording page for an existing case that has no booking, it is visually correct
- Pre-requisite step in order to create a case and navigate to schedule recording page
- Verify upon accessing schedule recording page, it is visually correct

## Verify when accessing schedule recording page for an existing case that has a booking, it is visually correct
- Pre-requisite step in order to create a case and navigate to schedule recording page
- Redact dynamic test data
- Verify upon accessing schedule recording page, it is visually correct

## Verify when attempting to delete a scheduled recording on scheduled recording page, it is visually correct
- Pre-requisite step in order to create a case, navigate to schedule recording page
- Select option to delete scheduled recording
- Redact dynamic test data
- Verify upon selecting option to delete a scheduled recording, it is visually correct

## Verify when viewing a booking that has a recording on scheduled recording page, it is visually correct
- Pre-requisite step in order to create a case and navigate to schedule recording page
- Redact dynamic test data
- Verify upon accessing schedule recording page, it is visually correct


----------------------------------------------------------------------------------------------------
** File:** `playwright-e2e/tests/visual-tests/home-page-visual.spec.ts`

## Verify homepage is visually correct
- Verify upon accessing homepage, it is visually correct


----------------------------------------------------------------------------------------------------
** File:** `playwright-e2e/tests/visual-tests/manage-bookings/manage-bookings-visual.spec.ts`

## Verify manage bookings page is visually correct
- Verify manage bookings page is visually correct

## Verify whilst searching for an existing case, the manage bookings page is visually correct
- Pre-requisite step in order to create a case and assign a booking via api
- Search for an existing case and redact test data
- Verify manage bookings page is visually correct

## Verify booking page is visually correct when user selects option to manage an existing booking
- Pre-requisite step in order to create a case and assign a booking via api
- Search for an existing case and select option to manage case
- Redact dynamic test data
- Verify manage booking modal is visually correct
- Select audit option and redact test data
- Verify audit information is visually correct
- Close audit and select option to share
- Verify whilst sharing booking, it is visually correct

## Verify booking page is visually correct when user selects option to amend an existing booking
- Pre-requisite step in order to create a case and assign a booking via api
- Search for an existing case and select option to manage case
- Redact dynamic test data
- Verify amend booking modal is visually correct
- Select option to delete case and redact dynamic test data
- Upon selecting option to delete case, verify amend booking modal is visually correct
- Select option to cancel deletion of case and cancel amendmendts
- Upon selecting option to cancel case amendments, verify amend booking modal is visually correct

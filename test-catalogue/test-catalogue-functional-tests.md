# functional-tests catalogue

----------------------------------------------------------------------------------------------------
** File:** `playwright-e2e/tests/functional-tests/book-a-recording/case-details-functional.spec.ts`

## Verify user is able to open a new case and is redirected to the schedule recordings page
- Enter details for a new case and select save button
- Verify logo and text is displayed to indicate details have been saved
- Verify user is redirected to the schedule recordings page

## Verify case details are correct when searching and selecting an exisiting case
- Pre-requisite step in order to create a case via api
- Verify case appears in search list when searched for
- Verify correct details of case are displayed in search list
- Verify case details are correct when exisiting case is selected from search list


----------------------------------------------------------------------------------------------------
** File:** `playwright-e2e/tests/functional-tests/book-a-recording/schedule-recording-functional.spec.ts`

## Verify user is able to book a recording for an existing case
- Pre-requisite step in order to create a case via api and navigate to schedule recordings page
- Verify user is able to schedule a recording
- Verify correct details for case have been saved

## Verify user is able to delete a booking that has been scheduled
- Pre-requisite step in order to create a booking via api and navigate to schedule recordings page
- Verify recording scheduled is visisble
- Verify user is able to delete scheduled recording
- Navigate to manage bookings page
- Verify user is unable to find deleted scheduled recording within manage bookings page

## Verify user is unable to delete a scheduled booking that has a recording
- Pre-requisite step in order to create a case / assign a recording via api and navigate to schedule recordings page
- Verify recording scheduled is visisble
- Verify delete button is disabled


----------------------------------------------------------------------------------------------------
** File:** `playwright-e2e/tests/functional-tests/manage-bookings/manage-bookings-functional.spec.ts`

## Verify user is able to find a booking by selecting a date from the date picker
- Pre-requisite step in order to create a booking for tomorrow via api
- Verify todays date is default within date picker
- Select date for tomorrow via date picker
- Verify booking case reference is returned within list of results for tomorrows date


----------------------------------------------------------------------------------------------------
** File:** `playwright-e2e/tests/functional-tests/manage-bookings/view-live-feed-functional.spec.ts`

## Verify correct recording details are displayed when user selects show link button
- Given user has selected option to start a recording
- When user selects the show link button
- The correct details are displayed on modal


----------------------------------------------------------------------------------------------------
** File:** `playwright-e2e/tests/functional-tests/view-recordings/view-recordings-functional.spec.ts`

## Verify user is able to search for a case and confirm the list search details are correct
- Verify recording can be found in view recordings page
- Verify case and recording details are correct in search list

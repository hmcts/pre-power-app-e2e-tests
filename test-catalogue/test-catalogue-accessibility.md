# accessibility catalogue

----------------------------------------------------------------------------------------------------
** File:** `playwright-e2e/tests/accessibility/accessibility.spec.ts`

## Verify accessibility on home page
- Navigate to home page
- Check accessibility on home page

## Verify accessibility on case details page
- Select option to book a recording in order to navigate to case details page
- Check accessibility on case details page

## Verify accessibility on case details page once user begins searching for a case
- Select option to book a recording in order to navigate to case details page
- Search for cases beginning with PR- to obtain a list of existing cases
- Check accessibility on case details page

## Verify accessibility on case details page once user has selected an existing case from the search results
- Pre-requisite step in order to setup an existing case via api
- Select option to book a recording in order to navigate to case details page
- Search and select an existing case
- Check accessibility on case details page

## Verify accessibility on case details page once user has selected option to modify an existing case from the search results
- Pre-requisite step in order to setup an existing case via api
- Select option to book a recording in order to navigate to case details page
- Search and select an existing case
- Select option to modify case that has been selected
- Check accessibility on case details page

## Verify accessibility on schedule a recording page
- Pre-requisite step in order to setup an existing case with a booking assigned via api
- Select option to book a recording in order to navigate to schedule recording page
- Check accessibility on schedule recordings page

## Verify accessibility on manage bookings page
- Navigate to manage bookings page
- Check accessibility on manage bookings page

## Verify accessibility when selecting option to manage an existing case on manage bookings page
- Pre-requisite step in order to setup an existing case with a booking assigned via api
- Navigate to manage bookings page and search for an existing case
- Select option to manage existing case
- Check accessibility of manage modal on manage bookings page
- Select option to audit within manage bookings modal
- Check accessibility of audit option within manage bookings modal
- Select option to share within manage bookings modal
- Check accessibility of share option within manage bookings modal

## Verify accessibility when selecting option to amend an existing case on manage bookings page
- Pre-requisite step in order to setup an existing case with a booking assigned via api
- Navigate to manage bookings page and search for an existing case
- Select option to amend existing case
- Check accessibility of amend modal on manage bookings page
- Select option to delete case via amend modal
- Check accessibility of delete option within amend modal

## Verify accessibility on view live recording page
- Pre-requisite step in order to setup an existing case with a booking assigned via api
- Select option to record on manage bookings page in order to navigate to view live recording page
- Check accessibility on view live recording page

## Verify accessibility on view recordings page
- Navigate to view recordings page
- Check accessibility on view recordings page

# validation-tests catalogue

----------------------------------------------------------------------------------------------------
** File:** `playwright-e2e/tests/validation-tests/book-a-recording/case-details-validation.spec.ts`

## Verify case reference field when left empty shows validation error
- Pre-requisite step in order to fill out defendants and wintness fields with valid values
- Verify error message is displayed once save button has been selected

## Verify case reference containing less than 9 characters is rejected
- Pre-requisite step in order to fill out defendant and wintness fields with valid values
- Verify case reference field is rejected when less than 9 characters

## Verify case reference field trims values above 13 characters
- Attempt to enter a case reference of 14 characters
- Verify case reference field is trimmed to 13 characters

## Verify user is unable to create a dupiclate case using an existing case reference of a case in open status
- Pre-requisite step in order to create a case via api
- Populate case details and click on save button
- Verify error message is displayed to state case reference already exists

## Verify user is unable to create a dupiclate case using an existing case reference of a case in deleted status
- Pre-requisite step in order to create a new case and set it to deleted status via api
- Populate case details and click on save button
- Verify error message is displayed to state case reference already exists

## Verify case reference containing special characters is rejected
- Pre-requisite step in order to fill out defendants and wintness fields with valid values
- Validate invalid case reference containing special character 

## Verify Defendants field when left empty shows validation error
- Pre-requisite step in order to fill out case Reference and wintness fields with valid values
- Verify error message is displayed once save button has been selected

## Verify Defendants first name or Last name containing more than 25 characters are rejected
- Pre-requisite step in order to fill out case Reference and witness fields with valid values
- Verify defendants first name containing more than 25 is rejected
- Verify defendants last name containing more than 25 is rejected

## Verify Defendants containing first name only is rejected
- Pre-requisite step in order to fill out case Reference and wintness fields with valid values
- Verify error is shown when only first name is entered for defendants field

## Verify Defendants name containing special characters is rejected
- Pre-requisite step in order to fill out case Reference and witness fields with valid values
- Validate Defendants name containing special character 

## Verify Witness field when left empty shows validation error
- Pre-requisite step in order to fill out case Reference and Defendants fields with valid values
- Verify error message is displayed once save button has been selected

## Verify Witness containing last name is rejected
- Pre-requisite step in order to fill out case Reference and Defendants fields with valid values
- Verify error is shown when witness name contains both first and last name

## Verify Witness name containing special characters is rejected
- Pre-requisite step in order to fill out case Reference and Defendants fields with valid values
- Validate Witnesses name containing special character 

## Verify Witness first name containing more than 25 characters are rejected
- Pre-requisite step in order to fill out case Reference and Defendants fields with valid values
- Verify Witnesses first name containing more than 25 is rejected

## Verify user is unable to modify an existing witness name with blank first name
- Pre-requisite step in order to create a case via api and search / select the case that has been created
- Modify case by amending witness first name to be blank
- Verify user is unable to select the submit button

## Verify user is unable to modify an existing defendant name with blank first name or last name
- Pre-requisite step in order to create a case via api and search / select the case that has been created
- Modify case by amending defendant first name to be blank
- Verify user is unable to select the submit button
- Re-populate first name field and set last name to be blank
- Verify user is unable to select the submit button


----------------------------------------------------------------------------------------------------
** File:** `playwright-e2e/tests/validation-tests/manage-bookings/manager Bookings-state.spec.ts`

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

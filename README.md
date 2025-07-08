## Features

- **Cross-browser testing**: Supports Chromium.
- **Responsive testing**: Test conducted on desktop viewport.
- **Parallel test execution**: Run tests concurrently for faster feedback.
- **Accessibility tests**: Integrate basic accessibility checks using libraries like Axe Core.
- **Performance tests**: Provides an implementation of Lighthouse which can be used for quick feedback on UI performance.
- **Test tagging**: Use tags like `@a11y` for accessibility, `@smoke` for smoke tests, and more.

## Project Structure

The repository follows a **Page Object Model (POM)** design pattern, ensuring that locators and actions are well-organized and reusable.

See the [POM docs](https://github.com/hmcts/tcoe-playwright-example/blob/master/docs/PAGE_OBECT_MODEL.md) for more info

```sh
├── tests/                  # Test files
|                  
├── page-objects/           # Page objects
├   ├── components/         # Common components shared across pages
├   ├── pages/              # Unique pages that contain locators and functions
|
├── utils/                  # Utility functions or common tasks (Helpers for the project
├── api-requests/           # Reusable api requests
├── fixtures.ts             # Used to import corresponding fixtures from utils, page-objects and api-requests
├── global.setup.ts         # Global setup logic
├── global.teardown.ts      # Global teardown logic
├── playwright.config.ts    # Playwright config
```

TCoE Best Practices for setting up playwright in your service can be found in the [playwright-e2e/readme.md](https://github.com/hmcts/tcoe-playwright-example/blob/master/docs/BEST_PRACTICE.md).

## Contributing

We all share the responsibility of ensuring this repo is up to date and accurate in terms of best practice. If you would like to contribute you can raise a github issue with the improvement you are suggesting or raise a PR yourself. See the [contribution guide](https://github.com/hmcts/tcoe-playwright-example/blob/master/CONTRIBUTING.md) for more info.

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- Node.js (v14+)
- Yarn

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/hmcts/pre-power-app-e2e-tests.git
```

within the cloned project run the following command to install dev dependencies:
```bash
yarn install
```

run the following command after running yarn install in order to install playwright browsers
```bash
yarn setup
```

### Running Tests

Run all tests using the Playwright test runner:

```bash
yarn playwright test
```

To run a specific test file:

```bash
yarn playwright test tests/specific_test_file.spec.ts
```

### Test Tagging

You can use tags to group tests, for example:

```bash
yarn playwright test --grep @smoke
```

### Debugging Tests

To run tests with tracing, screenshots, and video recording for debugging purposes:

```bash
yarn playwright test --trace on --video on --screenshot on
```

Alternatively, you can use `page.pause()` inside your test whilst in `--headed` mode to pause execution at a specific point.

### Accessibility Tests

Run accessibility checks as part of your tests using Axe Core:

```bash
yarn playwright test --grep @a11y
```

### Running via docker container

Confirm docker is running and then run the following command

```bash
yarn build-container
```

once this completes start the container

```bash
yarn start-container
```

Now run the following whilst within container

```bash
yarn playwright test
```

# Contributing

We encourage everyone to contribute to this project, We all have the responsibility of improving the standard in our testing frameworks and helping to share best practice.

## Setting Up the Project

2. **Install Dependencies**:
   Navigate to the repository directory and install required dependencies:

   ```bash
   yarn install
   ```

3. **Run Tests**:
   To ensure everything works correctly before making changes, execute the Playwright tests:

   ```bash
   yarn playwright test
   ```

4. **Linter**:
   Run the linter to adhere to the style guide/ensure it works:
   ```bash
   yarn lint
   ```

## Raising a PR

You are free to create a PR with your changes which will be reviewed by Test Leads and the Pre QA team. There are a few things to be aware of when working in this repo:

### Linting

This project uses ESLint (with a playwright plugin), you can run `yarn lint` to run the linting rules on your changes (the pipeline will also run these checks).

### Testing changes

After you've made your changes, ensure that all the tests are stil working correctly by running them.

Your changes should also work in the pipeline via the docker container. Confirm docker is running and then run the following command

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

Confirm tests run successfully in pipeline upon merging changes.

### Documentation

When making changes to this repo, consider whether you need to update documentation. There is a `docs` directly containing markdown files which describe some concepts used in this repo.

### Submit a PR for review

Simply raise a PR to master from your branch, CODEOWNERS will be notified the PR is created. However, you can also link your PR in the slack channels below for visibility. Some things to consider:

- Ensure your PR accurately describes what it is addressing in the title and description.
- If you are addressing an active issue, link the issue.
- Ensure your commits are squashed when merging

## Creating an issue

You can also contribute by raising an issue, this can be something you would like to see examples of or things you would like to change/remove/add. There are several tags (enhancement, documentation, bug etc) so please choose the most appropriate.

## Support

Reach out in the `#testing_centre_of_excellence` or `#playwright-community` channels should you need any help with contributing to this repo.

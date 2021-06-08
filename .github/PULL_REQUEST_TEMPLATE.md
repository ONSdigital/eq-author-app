> ### BEFORE MAKING YOUR PR
>
> Please ensure:
>
> - There are no linting errors, all tests must pass
> - PR is named after JIRA ticket number e.g. EAR-###
> - **Accesibility** checks are completed:
>   - Elements have discernible and consistent focus states
>   - Elements can be navigated to and used by just a keyboard
>   - Elements and text can be read out by a screen reader, and the descriptions are understandable
> - Your feature / bug fix works across **GCP** and **AWS** (where appropriate)
>   - Are modifications to eq-publisher-v3 required?
>   - Are modifications to the Firestore data source required?

---

### What is the context of this PR?

> Describe what you have changed as part of this task and why; include a link to the Trello card/GitHub issue, related pull requests, etc as required.
>
> E.g. _"Currently, if you add a new question to Author the entire app crashed. This is because..."_

### How to review

> Add to the list below as appropriate, including screenshots when necessary

- Import the **Capability examples** questionnaire from pre-prod Author into your local environment and:
  - ensure it can be opened in Author;
  - then, ensure it can be viewed in Runner by pressing the **view survey** button
- Does this require a migration? We need one if existing JSON schema properties change

### What to do after everything is green

1. - [ ] Bring this branch up-to-date with Origin/Master
2. - [ ] If there are a lot of commits or some are not helpful to read, squash them down
3. - [ ] Click the **Merge** button on this pull request
4. - [ ] Does this change mean the **Capability examples** questionnaire should be updated?
5. - [ ] Move the Jira ticket for this task into the next stage of the process

import { testId, typeIntoDraftEditor } from "../utils";

const updateDetails = ({ alias, title }) => {
  if (alias) {
    cy.get(testId("section-alias")).type(alias);
  }
  if (title) {
    typeIntoDraftEditor(testId("txt-section-title", "testid"), title);
  }
};

export const add = config => {
  cy.get(testId("add-menu")).within(() => {
    cy.get("button")
      .contains("Add")
      .click()
      .get("button")
      .contains("Section")
      .click();
  });

  updateDetails(config);
};

export const updateInitial = config => {
  cy.get(testId("nav-section-link"))
    .first()
    .click();

  updateDetails(config);
};

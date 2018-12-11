import { testId, typeIntoDraftEditor } from "../utils";

export const updateDetails = ({ title, positive, negative }) => {
  typeIntoDraftEditor(testId("txt-confirmation-title", "testid"), title);

  cy.get(testId("positive-option-label"))
    .type(positive)
    .blur();

  cy.get(testId("negative-option-label"))
    .type(negative)
    .blur();
};

export const add = config => {
  cy.get(testId("add-menu")).within(() => {
    cy.get("button")
      .contains("Add")
      .click()
      .get("button")
      .contains("Confirmation question")
      .click();
  });
  if (config) {
    updateDetails(config);
  }
};

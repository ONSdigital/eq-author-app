import { testId } from "../utils";

export const add = () => {
  cy.get(testId("add-menu")).within(() => {
    cy.get("button")
      .contains("Add")
      .click()
      .get("button")
      .contains("Confirmation question")
      .click();
  });
};

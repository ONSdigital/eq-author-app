import { testId } from "../utils";

const checkIsOnDesignPage = () => cy.hash().should("match", /\/design$/);

const updateDetails = ({ title }) => {
  cy.get(testId("questionnaire-settings-modal")).within(() => {
    cy.get(testId("txt-questionnaire-title"))
      .clear()
      .type(title);
    cy.get("label[for='navigation']").click();

    cy.get("form").submit();
  });
};

export const add = config => {
  cy.get(testId("create-questionnaire")).click();
  updateDetails(config);
  checkIsOnDesignPage();
  return cy.hash().then(hash => {
    const id = /questionnaire\/(\d+)\//.exec(hash)[1];
    return { id };
  });
};

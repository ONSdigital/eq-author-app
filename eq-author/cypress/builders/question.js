import { testId, typeIntoDraftEditor } from "../utils";
import { answer } from "../builders";

const updateDetails = ({ title, alias, answer: answerConfig }) => {
  if (alias) {
    cy.get(testId("question-alias")).type(alias);
  }
  if (title) {
    typeIntoDraftEditor(testId("txt-question-title", "testid"), title);
  }
  if (answerConfig) {
    answer.add(answerConfig);
  }
};

export const updateInitial = config => {
  cy.get(testId("nav-section-link"))
    .parent()
    .within(() => {
      cy.contains(config.sectionDisplayName)
        .parent()
        .within(() => {
          cy.contains("Untitled Page").click();
        });
    });
  updateDetails(config);
};

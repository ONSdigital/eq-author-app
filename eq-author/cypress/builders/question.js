import { testId, typeIntoDraftEditor } from "../utils";
import { answer, questionConfirmation, routingBuilder } from "../builders";

const updateDetails = ({
  title,
  alias,
  answer: answerConfig,
  confirmation,
  routing
}) => {
  if (alias) {
    cy.get(testId("question-alias")).type(alias);
  }
  if (title) {
    typeIntoDraftEditor(testId("txt-question-title", "testid"), title);
  }
  if (answerConfig) {
    answer.add(answerConfig);
  }
  if (confirmation) {
    questionConfirmation.add(confirmation);
  }
  if (routing) {
    routingBuilder.add(routing);
  }
};

export const updateInitial = config => {
  navigateToPage(config.sectionDisplayName, "Untitled Page");
  updateDetails(config);
};

const navigateToPage = (sectionDisplayName, previousPageDisplayName) =>
  cy
    .get(testId("nav-section-link"))
    .parent()
    .within(() => {
      cy.contains(sectionDisplayName)
        .parent()
        .within(() => {
          cy.contains(previousPageDisplayName).then(
            ele => (ele.attr("aria-current") ? null : cy.wrap(ele).click())
          );
        });
    });

export const add = config => {
  navigateToPage(config.sectionDisplayName, config.previousPageDisplayName);
  cy.get(testId("add-menu")).within(() => {
    cy.get("button")
      .contains("Add")
      .click()
      .get("button")
      .contains("Question page")
      .click();
  });

  updateDetails(config);
};

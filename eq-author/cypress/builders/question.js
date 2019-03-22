import { testId, typeIntoDraftEditor, enableDescription } from "../utils";
import { answer, questionConfirmation, routingBuilder } from "../builders";

const updateDetails = ({
  title,
  alias,
  answer: answerConfig,
  answers,
  confirmation,
  routing,
  description,
}) => {
  if (alias) {
    cy.get(testId("alias")).type(alias);
  }
  if (title) {
    typeIntoDraftEditor(testId("txt-question-title", "testid"), title);
  }
  if (answerConfig) {
    answer.add(answerConfig);
  }

  if (answers && answers.length > 0) {
    answers.forEach((ans, index) => {
      answer.add(ans, index);
    });
  }

  if (confirmation) {
    questionConfirmation.add(confirmation);
  }
  if (routing) {
    routingBuilder.add(routing);
  }
  if (description) {
    enableDescription();
    typeIntoDraftEditor(
      testId("txt-question-description", "testid"),
      description
    );
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
          cy.contains(previousPageDisplayName).then(ele =>
            ele.attr("aria-current") ? null : cy.wrap(ele).click()
          );
        });
    });

export const add = config => {
  navigateToPage(config.sectionDisplayName, config.previousPageDisplayName);
  let prevCount;
  cy.get(testId("nav-page-link")).then(items => {
    prevCount = items.length;
    cy.get(testId("add-menu")).within(() => {
      cy.get("button")
        .contains("Add")
        .click()
        .get("button")
        .contains("Question page")
        .click();
    });
    cy.get(testId("nav-page-link")).should("have.length", prevCount + 1);
  });
  updateDetails(config);
};

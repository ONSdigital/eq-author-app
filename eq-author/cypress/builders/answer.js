import { testId } from "../utils";

const configureMultipleChoice = (
  { initialCount },
  { options, label: answerLabel }
) => {
  if (answerLabel) {
    cy.get(testId("txt-answer-label")).type(answerLabel);
  }

  options.forEach(({ label }, index) => {
    cy.get(testId("option-label")).should(
      "have.length",
      Math.max(index + 1, initialCount)
    );
    cy.get(testId("option-label"))
      .eq(index)
      .type(label)
      .blur();

    const nextIndex = index + 1;
    const shouldAddOne =
      initialCount <= nextIndex && options.length > nextIndex; // index + 1 === options.length;
    if (shouldAddOne) {
      cy.get(testId("btn-add-option")).click();
    }
  });
  cy.get(testId("option-label")).should("have.length", options.length);
};

const configueBasicAnswer = ({ label, description }) => {
  if (label) {
    cy.get(testId("txt-answer-label"))
      .type(label)
      .blur();
  }
  if (description) {
    cy.get(testId("txt-answer-description")).then($el =>
      $el
        ? cy.wrap($el).type(description)
        : new Error(`Answer type doesn't support description`)
    );
  }
};

const configure = (config, index) => {
  cy.get(testId("answer-editor")).should("have.length", index + 1);
  cy.get(testId("answer-editor"))
    .eq(index)
    .within(() => {
      switch (config.type.toLowerCase()) {
        case "checkbox":
          configureMultipleChoice({ initialCount: 1 }, config);
          break;
        case "radio":
          configureMultipleChoice({ initialCount: 2 }, config);
          break;
        case "number":
        case "currency":
        case "textfield":
          configueBasicAnswer(config);
          break;
        default:
          throw new Error(`Answer type not supported: ${config.type}`);
      }
    });
};

export const add = (config, index = 0) => {
  cy.get(testId("btn-add-answer")).click();
  cy.get(testId(`btn-answer-type-${config.type.toLowerCase()}`)).click();
  configure(config, index);
};

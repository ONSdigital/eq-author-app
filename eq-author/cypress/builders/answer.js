import { testId } from "../utils";

const configureCheckbox = ({ options }) => {
  options.forEach(({ label }, index) => {
    cy.get(testId("option-label")).should("have.length", index + 1);
    cy.get(testId("option-label"))
      .last()
      .type(label)
      .blur();
    const isLast = index + 1 === options.length;
    if (!isLast) {
      cy.get(testId("btn-add-option")).click();
    }
  });
};

const configure = config => {
  switch (config.type.toLowerCase()) {
    case "checkbox":
      configureCheckbox(config);
      break;
    default:
      throw new Error(`Answer type not supported: ${config.type}`);
  }
};

export const add = config => {
  cy.get(testId("btn-add-answer")).click();
  cy.get(testId(`btn-answer-type-${config.type.toLowerCase()}`)).click();
  configure(config);
};

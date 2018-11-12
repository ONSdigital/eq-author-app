import {
  addQuestionnaire,
  addAnswerType,
  addSection,
  testId,
  selectFirstAnswerFromContentPicker
} from "../../utils";

describe("Piping", () => {
  const questionnaireTitle = "Piping test";
  beforeEach(() => {
    cy.visit("/");
    cy.login();
    addQuestionnaire(questionnaireTitle);
  });

  it("Can add pipe a previous answer to a page title", () => {
    addAnswerType("Number");
    cy.get(testId("txt-answer-label")).type("Number answer");
    addSection();

    cy.get(testId("nav-page-link"))
      .last()
      .click();

    cy.get(testId("txt-question-title", "testid")).focus();
    cy.get(testId("piping-button"))
      .first()
      .click();

    selectFirstAnswerFromContentPicker();

    cy.get(testId("txt-question-title", "testid")).should(
      "contain",
      "[Number answer]"
    );
  });

  it("Can pipe metadata to a question title", () => {
    cy.get(testId("metadata-btn")).click();
    cy.get(testId("metadata-add-row")).click();
    cy.get("[name='key']")
      .focus()
      .type("example_metadata")
      .blur();
    cy.get(testId("metadata-table-row")).within(() =>
      cy
        .get("[name='alias']")
        .click()
        .type("example")
        .blur()
    );
    cy.get("[name='textValue']")
      .focus()
      .type("test")
      .blur();
    cy.get("[aria-label='Close']").click();

    cy.get(testId("txt-question-title", "testid")).focus();
    cy.get(testId("piping-button"))
      .first()
      .click();

    cy.get(testId("picker-option"))
      .first()
      .click();

    cy.get(testId("submit-button")).click();

    cy.get(testId("txt-question-title", "testid")).should(
      "contain",
      "[example]"
    );
  });

  afterEach(() => {
    cy.deleteQuestionnaire(questionnaireTitle);
  });
});

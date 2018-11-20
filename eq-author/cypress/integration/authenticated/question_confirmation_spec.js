import { testId, typeIntoDraftEditor } from "../../utils";
import { questionnaire, questionConfirmation } from "../../builders";

describe("Question Confirmation", () => {
  const questionnaireTitle = "Question Confirmation Test";

  afterEach(() => {
    cy.deleteQuestionnaire(questionnaireTitle);
  });

  beforeEach(() => {
    cy.visit("/");
    cy.login();
    questionnaire.add({ title: questionnaireTitle });
  });

  it("should be creatable from a question page", () => {
    cy.get(testId("add-menu")).within(() => {
      cy.get("button")
        .contains("Add")
        .click()
        .get("button")
        .contains("Confirmation question")
        .as("createQuestionConfirmation");
    });

    cy.get("@createQuestionConfirmation").should("be.enabled");
  });

  it("should navigate to when the question confirmation when created", () => {
    questionConfirmation.add();
    cy.hash().should("match", /\/questionnaire\/\d+\/\d+\/\d+\/\d+\/design$/);
  });

  it("should allow modification of the properties", () => {
    questionConfirmation.add();
    typeIntoDraftEditor(
      testId("txt-confirmation-title", "testid"),
      "My confirmation title"
    );

    cy.get(testId("positive-option-label"))
      .type("Positive label")
      .blur();

    cy.get(testId("positive-option-description"))
      .type("Positive description")
      .blur();

    cy.get(testId("negative-option-label"))
      .type("Negative label")
      .blur();

    cy.get(testId("negative-option-description"))
      .type("Negative description")
      .blur();
  });

  it("should be delete-able and navigate back to the question page", () => {
    questionConfirmation.add();
    cy.get(testId("question-confirmation-item")).should("have.length", 1);
    cy.get(testId("btn-delete")).click();
    cy.hash().should("match", /\/questionnaire\/\d+\/\d+\/\d+\/design$/);
    cy.get(testId("question-confirmation-item")).should("have.length", 0);
  });
});

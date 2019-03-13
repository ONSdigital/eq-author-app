import { idRegex, testId, typeIntoDraftEditor } from "../../utils";
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
    const pattern = new RegExp(
      `/q/${idRegex}/question-confirmation/${idRegex}/design`
    );
    cy.hash().should("match", pattern);
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
    cy.get(testId("btn-delete-modal")).click();
    const pattern = new RegExp(`/q/${idRegex}/page/${idRegex}/design`);
    cy.hash().should("match", pattern);
    cy.get(testId("question-confirmation-item")).should("have.length", 0);
  });

  it("should be preview-able", () => {
    questionConfirmation.add();
    cy.get(testId("question-confirmation-item")).should("be.visible");
    cy.get(testId("preview")).contains("Preview");
    cy.get(testId("preview")).click();
    cy.hash().should("match", /\/preview$/);
  });
});

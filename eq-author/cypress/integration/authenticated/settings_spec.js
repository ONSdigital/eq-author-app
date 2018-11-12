import { testId, setQuestionnaireSettings } from "../../utils";
import createQuestionnaire from "../../fixtures/createQuestionnaire";
import GetQuestionPage from "../../fixtures/GetQuestionPage";
import GetQuestionnaire from "../../fixtures/GetQuestionnaire";
import GetQuestionnaireList from "../../fixtures/GetQuestionnaireList";

describe("settings", () => {
  const settingsModal = testId("questionnaire-settings-modal");
  const questionnaireTitle = "Settings Spec Questionnaire";

  beforeEach(() => {
    cy.visitStubbed("/", {
      createQuestionnaire,
      GetQuestionPage,
      GetQuestionnaire,
      GetQuestionnaireList
    });
    cy.login();
    cy.get(testId("create-questionnaire")).click();
  });

  it("should display settings", () => {
    cy.get(settingsModal).should("be.visible");
  });

  it("should allow setting a title", () => {
    cy.get(settingsModal).within(() => {
      cy.get(testId("txt-questionnaire-title"))
        .clear()
        .type(questionnaireTitle);

      cy.get(testId("txt-questionnaire-title")).should(
        "have.value",
        questionnaireTitle
      );
    });
  });

  it("should toggle on navigation", () => {
    cy.get("label[for='navigation']").click();
    cy.get("#navigation").should("be.checked");
  });

  it("should toggle on questionnaire summary", () => {
    cy.get("label[for='summary']").click();
    cy.get("#summary").should("be.checked");
  });

  it("should cancel out of settings", () => {
    cy.get(settingsModal).within(() => {
      cy.contains("Cancel").click();
    });

    cy.get(settingsModal).should("not.be.visible");
  });

  it("should navigate to builder tab upon creating questionnaire", () => {
    setQuestionnaireSettings(questionnaireTitle);
    cy.hash().should("to.match", /\/design$/);
  });
});

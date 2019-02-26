/* eslint-disable camelcase */
import {
  addQuestionnaire,
  testId,
  typeIntoDraftEditor,
  navigateToFirstSection,
  questionPageRegex,
  sectionRegex,
} from "../../utils";

describe("Duplicate", () => {
  describe("Page duplication", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.login();
      addQuestionnaire("page duplication");

      typeIntoDraftEditor(testId("txt-question-title", "testid"), "Question 1");
      cy.get(testId("side-nav")).should("contain", "Question 1");
      cy.get(testId("btn-duplicate-page")).click();
    });

    it("should display copy of page in sidebar and navigate to it", () => {
      cy.get(testId("side-nav")).should("contain", "Copy of Question 1");
      cy.hash().should("match", questionPageRegex);
    });

    afterEach(() => {
      cy.deleteQuestionnaire("page duplication");
    });
  });

  describe("Section duplication", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.login();
      addQuestionnaire("section duplication");
      navigateToFirstSection();
      typeIntoDraftEditor(testId("txt-section-title", "testid"), "Section 1");
      cy.get(testId("btn-duplicate-section")).click();
    });

    it("should display the new section in the sidebar and navigate to it", () => {
      cy.get(testId("side-nav")).should("contain", "Copy of Section 1");
      cy.hash().should("match", sectionRegex);
    });

    afterEach(() => {
      cy.deleteQuestionnaire("section duplication");
    });
  });

  describe("Questionnaire duplication", () => {
    const title = "Duplicate Questionnaire";
    const duplicateTitle = `Copy of ${title}`;

    it("can duplicate a questionnaire", () => {
      cy.visit("/");
      cy.login();
      addQuestionnaire(title);
      cy.hash().should("match", /\/design$/);

      cy.get(testId("logo"))
        .should("be.visible")
        .click();

      cy.contains(title)
        .closest("tr")
        .within(() => {
          cy.get(testId("btn-duplicate-questionnaire")).click();
        });

      cy.contains(duplicateTitle).should("be.visible");
    });

    afterEach(() => {
      cy.deleteQuestionnaire(duplicateTitle);
      cy.deleteQuestionnaire(title);
    });
  });
});

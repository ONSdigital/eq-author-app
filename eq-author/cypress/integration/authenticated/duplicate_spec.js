/* eslint-disable camelcase */
import {
  addQuestionnaire,
  testId,
  typeIntoDraftEditor,
  navigateToFirstSection
} from "../../utils";

const pageAfterDup = /\/questionnaire\/\d+\/\d+\/\d+\/design$/;
const sectionAfterDup = /\/questionnaire\/\d+\/\d+\/design$/;

describe("Duplicate", () => {
  describe("Page duplication", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.login();
      addQuestionnaire("questionnaireTitle");

      typeIntoDraftEditor(testId("txt-question-title", "testid"), "Question 1");
      cy.get(testId("side-nav")).should("contain", "Question 1");
      cy.get(testId("btn-duplicate-page")).click();
    });

    it("should display copy of page in sidebar", () => {
      cy.get(testId("side-nav")).should("contain", "Copy of Question 1");
    });

    it("should navigate to new page after duplicating", () => {
      cy.hash().should("match", pageAfterDup);
    });
  });

  describe("Section duplication", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.login();
      addQuestionnaire("questionnaireTitle");
      navigateToFirstSection();
      typeIntoDraftEditor(testId("txt-section-title", "testid"), "Section 1");
      cy.get(testId("btn-duplicate-section")).click();
    });

    it("should display the new section in the sidebar", () => {
      cy.get(testId("side-nav")).should("contain", "Copy of Section 1");
    });

    it("should navigate to the new section after duplicating", () => {
      cy.hash().should("match", sectionAfterDup);
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

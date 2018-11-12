/* eslint-disable camelcase */
import { addQuestionnaire, testId, typeIntoDraftEditor } from "../../utils";

import createQuestionnaire from "../../fixtures/createQuestionnaire";
import GetQuestionPage from "../../fixtures/GetQuestionPage";
import GetQuestionnaire from "../../fixtures/GetQuestionnaire";
import UpdateQuestionPage from "../../fixtures/duplicatePage/UpdateQuestionPage";
import duplicatePage from "../../fixtures/duplicatePage/duplicatePage";
import GetQuestionnaire_Piping from "../../fixtures/GetQuestionnaire_Piping";
import SectionQuery from "../../fixtures/SectionQuery";
import duplicateSection from "../../fixtures/duplicateSection";

describe("Duplicate", () => {
  describe("Page duplication", () => {
    beforeEach(() => {
      cy.visitStubbed("#/questionnaire/1/1/1/design", {
        createQuestionnaire,
        GetQuestionPage,
        GetQuestionnaire,
        GetQuestionnaire_Piping,
        UpdateQuestionPage,
        duplicatePage
      });
      cy.login();

      typeIntoDraftEditor(testId("txt-question-title", "testid"), "Question 1");
      cy.get(testId("side-nav")).should("contain", "Question 1");
      cy.get(testId("btn-duplicate-page")).click();
    });

    it("should display copy of page in sidebar", () => {
      cy.get(testId("side-nav")).should("contain", "Copy of Question 1");
    });

    it("should navigate to new page after duplicating", () => {
      cy.hash().should("match", /\/questionnaire\/1\/1\/2\/design$/);
    });
  });

  describe("Section duplication", () => {
    beforeEach(() => {
      cy.visitStubbed("#/questionnaire/1/1/design", {
        createQuestionnaire,
        GetQuestionnaire,
        GetQuestionnaire_Piping,
        duplicateSection,
        SectionQuery: req => {
          const {
            variables: { id }
          } = JSON.parse(req.body);
          if (id === "1") {
            return SectionQuery();
          }
          if (id === "2") {
            return SectionQuery({
              id: "2",
              title: "Copy of Section 1",
              displayName: "Copy of Section 1"
            });
          }
        }
      });
      cy.login();
      cy.get(testId("btn-duplicate-section")).click();
    });

    it("should display the new section in the sidebar", () => {
      cy.get(testId("side-nav")).should("contain", "Copy of Section 1");
    });

    it("should navigate to the new section after duplicating", () => {
      cy.hash().should("match", /\/questionnaire\/1\/2\/design$/);
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

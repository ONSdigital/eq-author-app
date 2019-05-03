/* eslint-disable camelcase */
import omitDeep from "omit-deep-lodash";

import {
  addQuestionnaire,
  testId,
  typeIntoDraftEditor,
  navigateToFirstSection,
  questionPageRegex,
  sectionRegex,
  idRegex,
} from "../../utils";
import { question, questionnaire, section } from "../../builders";

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
      cy.get(testId("side-nav")).should("contain", "Section 1");
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
    let originalQuestionnaireId;

    it("can duplicate a questionnaire", () => {
      cy.visit("/");
      cy.login();
      questionnaire.add({ title }).then(({ id }) => {
        originalQuestionnaireId = id;
      });
      section.updateInitial({
        title: "Section 1",
      });
      question.updateInitial({
        sectionDisplayName: "Section 1",
        alias: "1.1",
        title: "Question 1",
        answers: [
          {
            type: "Currency",
            label: "Currency 1",
          },
          {
            type: "Currency",
            label: "Currency 2",
          },
        ],
      });

      cy.get(testId("logo"))
        .should("be.visible")
        .click();

      cy.contains(title)
        .closest("tr")
        .within(() => {
          cy.get(testId("btn-duplicate-questionnaire")).click();
        });

      cy.contains(duplicateTitle).should("be.visible");
      cy.contains(duplicateTitle).should($title => {
        expect($title.attr("disabled")).not.to.equal("disabled");
      });

      cy.hash().should("match", /\/design\/settings$/);

      cy.get(testId("txt-questionnaire-title")).should("be.visible");
      cy.get(testId("questionnaire-settings-modal")).within(() => {
        cy.get("button[aria-label='Close']").click();
      });
      cy.get(testId("txt-questionnaire-title")).should("not.be.visible");

      cy.hash()
        .then(hash => {
          const pattern = new RegExp(`/q/(${idRegex})/`);
          const result = pattern.exec(hash);
          const id = result[1];
          return cy.getPublisherOutput(id).then(dupe => {
            return cy
              .getPublisherOutput(originalQuestionnaireId)
              .then(original => {
                return [original.body, dupe.body];
              });
          });
        })
        .then(publishedResults => {
          const [originalOutput, dupeOutput] = publishedResults;
          // We don't care about ids changing or the questionnaire title
          const fieldsToIgnore = ["id", "form_type", "eq_id", "survey_id"];
          originalOutput.title = duplicateTitle;
          expect(omitDeep(dupeOutput, ...fieldsToIgnore)).to.deep.equal(
            omitDeep(originalOutput, ...fieldsToIgnore)
          );
        });
    });

    afterEach(() => {
      cy.deleteQuestionnaire(duplicateTitle);
      cy.deleteQuestionnaire(title, true);
    });
  });
});

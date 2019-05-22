import { question, questionnaire, section } from "../../builders";
import {
  testId,
  assertHash,
  addCalculatedSummaryPage,
  typeIntoDraftEditor,
} from "../../utils";
import { Routes } from "../../../src/utils/UrlUtils";

import {
  NUMBER,
  CURRENCY,
  PERCENTAGE,
} from "../../../src/constants/answer-types";

const selectAnswerFromContentPicker = ({ questionTitle, answerTitle }) => {
  cy.get(`button[aria-controls='answers']`).contains("Answer");
  cy.get(testId("picker-title"))
    .contains("Question")
    .click();
  cy.get(testId("picker-option"))
    .contains(questionTitle)
    .click();
  cy.get(testId("picker-title"))
    .contains("Answer")
    .click();
  cy.get(testId("picker-option"))
    .contains(answerTitle)
    .click();
  cy.get(testId("submit-button")).click();
};

describe("calculated summary", () => {
  beforeEach(() => {
    cy.login();
    cy.get(testId("nav-page-link")).should("have.length", 3);
  });
  before(() => {
    cy.visit("/");
    cy.login();
    questionnaire.add({ title: "CalculatedSummary" });
    section.updateInitial({
      title: "Section 1",
      alias: "Section 1",
    });
    question.updateInitial({
      sectionDisplayName: "Section 1",
      alias: "1.1",
      title: "Question 1",
      answers: [
        {
          type: CURRENCY,
          label: "Currency 1",
        },
        {
          type: NUMBER,
          label: "Number 1",
        },
        {
          type: PERCENTAGE,
          label: "Percentage 1",
        },
      ],
    });
    question.add({
      sectionDisplayName: "Section 1",
      previousPageDisplayName: "1.1",
      title: "1.2",
      answers: [
        {
          type: CURRENCY,
          label: "Currency 2",
        },
        {
          type: NUMBER,
          label: "Number 2",
        },
        {
          type: PERCENTAGE,
          label: "Percentage 2",
        },
      ],
    });
    question.add({
      sectionDisplayName: "Section 1",
      previousPageDisplayName: "1.2",
      title: "1.3",
      answers: [
        {
          type: CURRENCY,
          label: "Currency 3",
        },
        {
          type: NUMBER,
          label: "Number 3",
        },
        {
          type: PERCENTAGE,
          label: "Percentage 3",
        },
      ],
    });
  });

  it("can add a calculated summary page and edit textfields", () => {
    let prevHash;

    cy.hash()
      .then(hash => {
        prevHash = hash;
        addCalculatedSummaryPage();
      })
      .then(() => {
        assertHash({
          previousPath: Routes.QUESTIONNAIRE,
          previousHash: prevHash,
          currentPath: Routes.QUESTIONNAIRE,
          equality: {
            entityName: true,
            entityId: false,
          },
        });
      });

    cy.get(testId("alias")).type("question alias");

    typeIntoDraftEditor(testId("txt-summary-title", "testid"), "Hello there");

    typeIntoDraftEditor(testId("txt-total-title", "testid"), "General total");

    cy.get(testId("btn-delete")).click();

    cy.get(testId("delete-confirm-modal")).within(() => {
      cy.get("button")
        .contains("Delete")
        .click();
    });
  });

  it("can add each of the answer types and the others are disqualified", () => {
    [NUMBER, CURRENCY, PERCENTAGE].forEach(answerType => {
      cy.get(testId("nav-page-link")).should("have.length", 3);
      addCalculatedSummaryPage();
      cy.get(testId("answer-selector-empty")).click();
      selectAnswerFromContentPicker({
        questionTitle: "1.1",
        answerTitle: `${answerType}`,
      });
      cy.get(testId("answer-selector")).click();
      cy.get(testId("picker-title"))
        .contains("Question")
        .click();
      cy.get(testId("picker-option"))
        .should("have.length", 2)
        .contains("1.2")
        .click();
      cy.get(testId("picker-title"))
        .contains("Answer")
        .click();
      cy.get(testId("picker-option"))
        .should("have.length", 1)
        .contains(`${answerType} 2`)
        .click();
      cy.get(testId("submit-button")).click();

      cy.get(testId("btn-delete")).click();

      cy.get(testId("delete-confirm-modal")).within(() => {
        cy.get("button")
          .contains("Delete")
          .click();
      });
    });
  });

  it("should add all available answers when a shortcut is used", () => {
    [NUMBER, CURRENCY, PERCENTAGE].forEach(answerType => {
      cy.get(testId("nav-page-link")).should("have.length", 3);
      addCalculatedSummaryPage();
      cy.get(testId(`${answerType}-suggestion`)).click();
      cy.get(testId("answer-selector")).click();
      cy.get(testId("no-previous-answers"));

      cy.get("[aria-label='Close']").click();
      cy.get(testId("btn-delete")).click();

      cy.get(testId("delete-confirm-modal")).within(() => {
        cy.get("button")
          .contains("Delete")
          .click();
      });
    });
  });

  it("should be able to preview correctly", () => {
    cy.get(testId("nav-page-link")).should("have.length", 3);
    addCalculatedSummaryPage();

    typeIntoDraftEditor(testId("txt-summary-title", "testid"), "Hello there");

    typeIntoDraftEditor(testId("txt-total-title", "testid"), "General total");

    cy.get(testId("saving-indicator")).should("have.length", 0);

    cy.get(testId(`${NUMBER}-suggestion`)).click();

    cy.get(testId("remove-answer-button")).should("have.length", 3);

    cy.get(testId("preview")).click();

    cy.get(testId("page-title")).should("contain", "Hello there");
    cy.get(testId("total-title")).should("contain", "General total");
    cy.get(testId("answer-item")).should("have.length", 3);

    cy.get(testId("design")).click();

    cy.get(testId("btn-delete")).click();

    cy.get(testId("delete-confirm-modal")).within(() => {
      cy.get("button")
        .contains("Delete")
        .click();
    });
  });

  it("should be able to remove a single answer chip", () => {
    addCalculatedSummaryPage();
    cy.get(testId(`Currency-suggestion`)).click();
    cy.get(testId("remove-answer-button")).should("have.length", 3);
    cy.get(testId("remove-answer-button"))
      .first()
      .click();
    cy.get(testId("remove-answer-button")).should("have.length", 2);
    cy.get(testId("btn-delete")).click();
    cy.get(testId("delete-confirm-modal")).within(() => {
      cy.get("button")
        .contains("Delete")
        .click();
    });
  });

  it("should be able to remove multiple answer chips", () => {
    addCalculatedSummaryPage();
    cy.get(testId(`Currency-suggestion`)).click();
    cy.get(testId("remove-answer-button")).should("have.length", 3);
    cy.get(testId("remove-all"))
      .first()
      .click();
    cy.get(testId("remove-answer-button")).should("have.length", 0);
    cy.get(testId("btn-delete")).click();
    cy.get(testId("delete-confirm-modal")).within(() => {
      cy.get("button")
        .contains("Delete")
        .click();
    });
  });
});

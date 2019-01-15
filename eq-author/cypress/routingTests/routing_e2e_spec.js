import { question, questionnaire, section, routingBuilder } from "../builders";
import { testId } from "../utils";

describe("Routing_e2e", () => {
  after(() => {
    cy.visit("/");
    cy.login();
    cy.deleteQuestionnaire("Routing e2e");
  });

  it("builds the questionnaire", () => {
    cy.visit("/");
    cy.login();
    questionnaire.add({ title: "Routing e2e" });

    section.updateInitial({
      title: "Section 1",
    });

    question.updateInitial({
      sectionDisplayName: "Section 1",
      title: "Section 1, Page 1",
      answer: {
        type: "Radio",
        options: [
          { label: "Goto S1P4" },
          { label: "Goto end of questionnaire" },
        ],
      },
    });

    question.add({
      sectionDisplayName: "Section 1",
      previousPageDisplayName: "Section 1, Page 1",
      title: "Section 1, Page 2",
      confirmation: {
        title: "Confirmation question for Section 1, Page 2",
        positive: "Yes",
        negative: "No",
      },
      answer: {
        type: "Number",
        label: "Less than 5 goes to S1P4 Greater than 5 goes to EoQ",
      },
    });

    question.add({
      sectionDisplayName: "Section 1",
      previousPageDisplayName: "Section 1, Page 2",
      title: "Section 1, Page 3",
      answer: {
        type: "Number",
        label: "Placeholder Answer",
      },
    });

    question.add({
      sectionDisplayName: "Section 1",
      previousPageDisplayName: "Section 1, Page 3",
      title: "Section 1, Page 4",
      answer: {
        type: "Number",
        label: "Placeholder Answer",
      },
    });

    routingBuilder.add(
      {
        rules: [
          {
            destination: {
              pageTitle: "Section 1, Page 4",
            },
            leftSide: {
              sectionTitle: "Section 1",
              pageTitle: "Section 1, Page 1",
            },
            rightSide: ["Goto S1P4"],
          },
          {
            destination: {
              logical: "End of questionnaire",
            },
            leftSide: {
              sectionTitle: "Section 1",
              pageTitle: "Section 1, Page 1",
            },
            rightSide: ["Goto end of questionnaire"],
          },
        ],
      },
      "Section 1, Page 1"
    );

    routingBuilder.add(
      {
        rules: [
          {
            destination: {
              pageTitle: "Section 1, Page 4",
            },
            leftSide: {
              sectionTitle: "Section 1",
              pageTitle: "Section 1, Page 2",
            },
            condition: "LessThan",
            rightSide: 5,
          },
          {
            destination: {
              logical: "End of questionnaire",
            },
            leftSide: {
              sectionTitle: "Section 1",
              pageTitle: "Section 1, Page 2",
            },
            condition: "GreaterThan",
            rightSide: 5,
          },
        ],
      },
      "Section 1, Page 2"
    );

    section.add({ title: "Section 2" });

    question.updateInitial({
      sectionDisplayName: "Section 2",
      title: "Section 2, Page 1",
      answer: {
        type: "Number",
        label: "Placeholder Answer",
      },
    });
  });

  describe("Runner", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.login();
      cy.contains("Routing e2e")
        .first()
        .click();
      cy.get(`[data-test="btn-preview"]`)
        .invoke("removeAttr", "target")
        .click();

      cy.get(testId("question-title", "qa")).should(
        "contain",
        "Section 1, Page 1"
      );
    });

    it("Has all pages", () => {
      cy.get(testId("btn-submit", "qa")).click();
      cy.get(testId("question-title", "qa")).should(
        "contain",
        "Section 1, Page 2"
      );

      cy.get(testId("btn-submit", "qa")).click();
      cy.get(testId("question-title", "qa")).should(
        "contain",
        "Confirmation question for Section 1, Page 2"
      );

      cy.get("[value='Yes']").click();
      cy.get(testId("btn-submit", "qa")).click();
      cy.get(testId("question-title", "qa")).should(
        "contain",
        "Section 1, Page 3"
      );

      cy.get(testId("btn-submit", "qa")).click();
      cy.get(testId("question-title", "qa")).should(
        "contain",
        "Section 1, Page 4"
      );

      cy.get(testId("btn-submit", "qa")).click();
      cy.get(testId("question-title", "qa")).should(
        "contain",
        "Section 2, Page 1"
      );

      cy.get(testId("btn-submit", "qa")).click();
      cy.get(testId("question-title", "qa")).should("contain", "Submission");
    });

    it("Runner routing path 1", () => {
      cy.get("[value='Goto S1P4']").click();

      cy.get(testId("btn-submit", "qa")).click();

      cy.get(testId("question-title", "qa")).should(
        "contain",
        "Section 1, Page 4"
      );
    });

    it("Runner routing path 2", () => {
      cy.get("[value='Goto end of questionnaire']").click();

      cy.get(testId("btn-submit", "qa")).click();

      cy.get(testId("question-title", "qa")).should("contain", "Submission");
    });

    it("Runner routing path 3", () => {
      cy.get(testId("btn-submit", "qa")).click();

      cy.get(testId("question-title", "qa")).should(
        "contain",
        "Section 1, Page 2"
      );

      cy.get(testId("input-text", "qa")).type("4");

      cy.get(testId("btn-submit", "qa")).click();

      cy.get(testId("question-title", "qa")).should(
        "contain",
        "Confirmation question for Section 1, Page 2"
      );

      cy.get("[value='Yes']").click();
      cy.get(testId("btn-submit", "qa")).click();

      cy.get(testId("question-title", "qa")).should(
        "contain",
        "Section 1, Page 4"
      );
    });

    it("Runner routing path 4", () => {
      cy.get(testId("btn-submit", "qa")).click();

      cy.get(testId("question-title", "qa")).should(
        "contain",
        "Section 1, Page 2"
      );

      cy.get(testId("input-text", "qa")).type("6");

      cy.get(testId("btn-submit", "qa")).click();

      cy.get(testId("question-title", "qa")).should(
        "contain",
        "Confirmation question for Section 1, Page 2"
      );

      cy.get("[value='Yes']").click();
      cy.get(testId("btn-submit", "qa")).click();

      cy.get(testId("question-title", "qa")).should("contain", "Submission");
    });

    it("Runner routing path 5", () => {
      cy.get(testId("btn-submit", "qa")).click();

      cy.get(testId("question-title", "qa")).should(
        "contain",
        "Section 1, Page 2"
      );

      cy.get(testId("input-text", "qa")).type("6");

      cy.get(testId("btn-submit", "qa")).click();

      cy.get(testId("question-title", "qa")).should(
        "contain",
        "Confirmation question for Section 1, Page 2"
      );

      cy.get("[value='No']").click();
      cy.get(testId("btn-submit", "qa")).click();

      cy.get(testId("question-title", "qa")).should(
        "contain",
        "Section 1, Page 2"
      );
    });
  });
});

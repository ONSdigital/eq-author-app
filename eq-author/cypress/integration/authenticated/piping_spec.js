import { addMetadata } from "../../builders/metadata";
import {
  addQuestionnaire,
  addAnswerType,
  addSection,
  testId,
  selectFirstAnswerFromContentPicker,
  selectFirstMetadataContentPicker,
  selectAnswerFromContentPicker,
  enableDescription,
  enableGuidance,
} from "../../utils";
import { questionConfirmation } from "../../builders";
import { NUMBER, DATE_RANGE } from "../../../src/constants/answer-types";

const ANSWER = "Number Answer";
const METADATA = "example_metadata";

const clickPipingButton = selector =>
  cy
    .get(testId(`${selector}-toolbar`))
    .should("be.visible")
    .within(() => {
      cy.get(testId("piping-button"))
        .first()
        .should("be.visible");
      cy.get(testId("piping-button"))
        .first()
        .should("be.enabled");
      cy.get(testId("piping-button"))
        .first()
        .click();
    });

const clickLastPage = () =>
  cy
    .get(testId("nav-page-link"))
    .last()
    .click({ force: true }); //Metadata modal transition is sometimes too slow

const clickFirstPage = () =>
  cy
    .get(testId("nav-page-link"))
    .first()
    .click({ force: true }); //Metadata modal transition is sometimes too slow

const canPipePreviousAnswer = ({ selector }) => {
  cy.get(testId(selector, "testid")).click();
  cy.focused()
    .should("have.attr", "data-testid")
    .and("eq", selector);
  clickPipingButton(selector);
  selectFirstAnswerFromContentPicker();
  cy.focused()
    .should("have.attr", "data-testid")
    .and("eq", selector);
  cy.get(testId(selector, "testid")).should("contain", `[${ANSWER}]`);
};

const clickLastSection = () =>
  cy
    .get(testId("nav-section-link"))
    .last()
    .click({ force: true }); //Metadata modal transition is sometimes too slow

const canPipeMetadata = ({ selector }) => {
  cy.get(testId(selector, "testid")).click();
  cy.focused()
    .should("have.attr", "data-testid")
    .and("eq", selector);
  clickPipingButton(selector);
  selectFirstMetadataContentPicker();
  cy.get(testId(selector, "testid")).should("contain", `[${METADATA}]`);
};

describe("Piping", () => {
  const questionnaireTitle = "Piping test";
  beforeEach(() => {
    cy.visit("/");
    cy.login();
    addQuestionnaire(questionnaireTitle);
  });

  describe("Answers", () => {
    beforeEach(() => {
      addAnswerType(NUMBER);
      cy.get(testId("txt-answer-label")).type(ANSWER);
      addSection();
    });
    describe("Page", () => {
      beforeEach(() => {
        clickLastPage();
      });
      it("Can pipe previous answer into page title", () => {
        cy.get(testId("txt-question-title", "testid")).type("title");
        canPipePreviousAnswer({ selector: "txt-question-title" });
      });
      it("Can pipe previous answer into page description", () => {
        enableDescription();
        cy.get(testId("txt-question-description", "testid")).type(
          "description"
        );
        canPipePreviousAnswer({ selector: "txt-question-description" });
      });
      it("Can pipe previous answer into page guidance", () => {
        enableGuidance();
        cy.get(testId("txt-question-guidance", "testid")).type("guidance");
        canPipePreviousAnswer({ selector: "txt-question-guidance" });
      });
      it("Can pipe to the cursor location after making an edit", () => {
        cy.get(testId("txt-question-title", "testid")).type("hello ");
        clickPipingButton("txt-question-title");
        selectFirstAnswerFromContentPicker();
        cy.get(testId("txt-question-title", "testid")).type(" world");
        cy.get(testId("txt-question-title", "testid")).should(
          "contain",
          `hello [${ANSWER}] world`
        );
      });
      it("Can display both From & To options on Date Range answer type", () => {
        const testAttr = testId("date-answer-label");

        clickFirstPage();
        addAnswerType(DATE_RANGE);

        cy.get(`${testAttr}[name="label"]`).type("From label");
        cy.get(`${testAttr}[name="secondaryLabel"]`).type("To label");

        clickLastPage();
        cy.get(testId("txt-question-title", "testid")).type("hello ");
        clickPipingButton("txt-question-title");

        selectAnswerFromContentPicker({
          sectionTitle: "Untitled Section",
          questionTitle: "Untitled Page",
          answerTitle: "From label",
        });

        clickPipingButton("txt-question-title");

        selectAnswerFromContentPicker({
          sectionTitle: "Untitled Section",
          questionTitle: "Untitled Page",
          answerTitle: "To label",
        });
      });
    });
    describe("Question Confirmation", () => {
      beforeEach(() => {
        clickFirstPage();
        questionConfirmation.add();
      });

      it("Can pipe answer on page into title", () => {
        cy.get(testId("txt-confirmation-title", "testid")).type(
          "confirmation title"
        );
        canPipePreviousAnswer({ selector: "txt-confirmation-title" });
      });
    });
    describe("Section Introduction", () => {
      beforeEach(() => {
        cy.focused()
          .should("have.attr", "data-testid")
          .and("eq", "txt-section-title");
        cy.get(testId("txt-section-title", "testid")).type("section title");
      });
      it("Can pipe previous answer into section introduction title", () => {
        cy.get(testId("txt-introduction-title", "testid")).click();
        cy.get(testId("txt-introduction-title", "testid")).type(
          "introduction title"
        );
        canPipePreviousAnswer({ selector: "txt-introduction-title" });
      });
      it("Can pipe previous answer into section introduction content", () => {
        cy.get(testId("txt-introduction-content", "testid")).click();
        cy.get(testId("txt-introduction-content", "testid")).type(
          "introduction content"
        );
        canPipePreviousAnswer({ selector: "txt-introduction-content" });
      });
    });
  });

  describe("Metadata", () => {
    beforeEach(() => {
      addMetadata(METADATA, "Text");
    });
    describe("Page", () => {
      it("Can pipe metadata into page title", () => {
        cy.get(testId("txt-question-title", "testid")).type("title");
        canPipeMetadata({ selector: "txt-question-title" });
      });
      it("Can pipe metadata into page description", () => {
        enableDescription();
        cy.get(testId("txt-question-description", "testid")).type(
          "description"
        );
        canPipeMetadata({ selector: "txt-question-description" });
      });
      it("Can pipe metadata into page guidance", () => {
        enableGuidance();
        cy.get(testId("txt-question-guidance", "testid")).type("guidance");
        canPipeMetadata({ selector: "txt-question-guidance" });
      });
    });

    describe("Section Introduction", () => {
      beforeEach(() => {
        clickLastSection();
        cy.focused()
          .should("have.attr", "data-testid")
          .and("eq", "txt-section-title");
        cy.get(testId("txt-section-title", "testid")).type("section title");
      });
      it("Can pipe metadata into section introduction title", () => {
        cy.get(testId("txt-introduction-title", "testid")).type(
          "section intro title"
        );
        canPipeMetadata({ selector: "txt-introduction-title" });
      });
      it("Can pipe metadata into section introduction content", () => {
        cy.get(testId("txt-introduction-content", "testid")).type(
          "section intro content"
        );
        canPipeMetadata({ selector: "txt-introduction-content" });
      });
    });

    describe("Question Confirmation", () => {
      beforeEach(() => {
        questionConfirmation.add();
      });

      it("Can pipe metadata into title", () => {
        cy.get(testId("txt-confirmation-title", "testid")).type(
          "confirmation title"
        );
        canPipeMetadata({ selector: "txt-confirmation-title" });
      });
    });
  });

  afterEach(() => {
    cy.deleteQuestionnaire(questionnaireTitle);
  });
});

import { addMetadata } from "../../builders/metadata";
import {
  addQuestionnaire,
  addAnswerType,
  addSection,
  testId,
  selectFirstAnswerFromContentPicker,
  selectFirstMetadataContentPicker,
  enableDescription,
  enableGuidance,
} from "../../utils";
import { questionConfirmation } from "../../builders";

const ANSWER = "Number Answer";
const METADATA = "example_metadata";

const clickPipingButton = () =>
  cy
    .get(testId("piping-button"))
    .should("have.length", 1)
    .first()
    .click();

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
  cy.get(testId(selector, "testid")).focus();
  clickPipingButton();
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
  cy.get(testId(selector, "testid")).focus();
  clickPipingButton();
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
      addAnswerType("Number");
      cy.get(testId("txt-answer-label")).type(ANSWER);
      addSection();
    });
    describe("Page", () => {
      beforeEach(() => {
        clickLastPage();
      });
      it("Can pipe previous answer into page title", () => {
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
        clickPipingButton();
        selectFirstAnswerFromContentPicker();
        cy.get(testId("txt-question-title", "testid")).type(" world");
        cy.get(testId("txt-question-title", "testid")).should(
          "contain",
          `hello [${ANSWER}] world`
        );
      });
    });
    describe("Question Confirmation", () => {
      beforeEach(() => {
        clickFirstPage();
        questionConfirmation.add();
      });

      it("Can pipe answer on page into title", () => {
        canPipePreviousAnswer({ selector: "txt-confirmation-title" });
      });
    });
    describe("Section Introduction", () => {
      beforeEach(() => {
        clickLastSection();
      });
      it("Can pipe previous answer into section introduction title", () => {
        canPipePreviousAnswer({ selector: "txt-introduction-title" });
      });
      it("Can pipe previous answer into section introduction content", () => {
        canPipePreviousAnswer({ selector: "txt-introduction-content" });
      });
    });
  });

  describe("Metadata", () => {
    beforeEach(() => {
      addMetadata(METADATA, "Text");
    });
    describe("Page", () => {
      beforeEach(() => {
        clickLastPage();
      });
      it("Can pipe metadata into page title", () => {
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
      });
      it("Can pipe metadata into section introduction title", () => {
        canPipeMetadata({ selector: "txt-introduction-title" });
      });
      it("Can pipe metadata into section introduction content", () => {
        canPipeMetadata({ selector: "txt-introduction-content" });
      });
    });

    describe("Question Confirmation", () => {
      beforeEach(() => {
        clickLastPage();
        questionConfirmation.add();
      });

      it("Can pipe metadata into title", () => {
        canPipeMetadata({ selector: "txt-confirmation-title" });
      });
    });
  });

  afterEach(() => {
    cy.deleteQuestionnaire(questionnaireTitle);
  });
});

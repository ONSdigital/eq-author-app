import { addMetadata } from "../../builders/metadata";
import {
  addQuestionnaire,
  addAnswerType,
  addSection,
  testId,
  selectFirstAnswerFromContentPicker,
  selectFirstMetadataContentPicker
} from "../../utils";

const ANSWER = "Number Answer";
const METADATA = "example_metadata";

const clickPipingButton = () =>
  cy
    .get(testId("piping-button"))
    .first()
    .click();

const clickLastSection = () =>
  cy
    .get(testId("nav-section-link"))
    .last()
    .click({ force: true }); //Metadata modal transition is sometimes too slow

const clickLastPage = () =>
  cy
    .get(testId("nav-page-link"))
    .last()
    .click({ force: true }); //Metadata modal transition is sometimes too slow

const addSectionIntro = () => cy.get(testId("btn-add-intro")).click();

const canPipePreviousAnswer = ({ selector }) => {
  cy.get(testId(selector, "testid")).focus();
  clickPipingButton();
  selectFirstAnswerFromContentPicker();
  cy.get(testId(selector, "testid")).should("contain", `[${ANSWER}]`);
};

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
        canPipePreviousAnswer({ selector: "txt-question-description" });
      });
      it("Can pipe previous answer into page guidance", () => {
        canPipePreviousAnswer({ selector: "txt-question-guidance" });
      });
    });
    describe("Section Introduction", () => {
      beforeEach(() => {
        clickLastSection();
        addSectionIntro();
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
        canPipeMetadata({ selector: "txt-question-description" });
      });
      it("Can pipe metadata into page guidance", () => {
        canPipeMetadata({ selector: "txt-question-guidance" });
      });
    });
    describe("Section Introduction", () => {
      beforeEach(() => {
        clickLastSection();
        addSectionIntro();
      });
      it("Can pipe metadata into section introduction title", () => {
        canPipeMetadata({ selector: "txt-introduction-title" });
      });
      it("Can pipe metadata into section introduction content", () => {
        canPipeMetadata({ selector: "txt-introduction-content" });
      });
    });
  });

  afterEach(() => {
    cy.deleteQuestionnaire(questionnaireTitle);
  });
});

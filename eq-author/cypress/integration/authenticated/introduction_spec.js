import { idRegex, testId, findInputByLabel } from "../../utils";
import { questionnaire } from "../../builders";

describe("Questionnaire Introduction", () => {
  const questionnaireTitle = "Questionnaire Introduction Test";

  afterEach(() => {
    cy.deleteQuestionnaire(questionnaireTitle);
  });

  beforeEach(() => {
    cy.visit("/");
    cy.login();
    questionnaire.add({ title: questionnaireTitle, type: "Business" });
  });

  it("should be the default launch page", () => {
    const pattern = new RegExp(`/q/${idRegex}/introduction/${idRegex}/design`);
    cy.hash().should("match", pattern);

    cy.get(testId("logo")).click();
    cy.contains(questionnaireTitle).click();

    cy.hash().should("match", pattern);
  });

  it("should allow modification of the properties", () => {
    cy.get(testId("txt-intro-description", "testid")).should("to.not.be.empty");
    cy.get(testId("txt-intro-description", "testid"))
      .clear()
      .type("Introduction description")
      .blur();

    cy.get(testId("txt-intro-secondary-title", "testid")).should(
      "to.not.be.empty"
    );
    cy.get(testId("txt-intro-secondary-title", "testid"))
      .clear()
      .type("Secondary title")
      .blur();

    cy.get(testId("txt-intro-secondary-description", "testid")).should(
      "to.not.be.empty"
    );
    cy.get(testId("txt-intro-secondary-description", "testid"))
      .clear()
      .type("Secondary description")
      .blur();

    findInputByLabel("Notice 2").click();
    cy.get(`${testId("intro-legal-basis")} [value='NOTICE_2']`).should(
      "be.checked"
    );

    cy.get(testId("txt-intro-tertiary-title", "testid")).should(
      "to.not.be.empty"
    );
    cy.get(testId("txt-intro-tertiary-title", "testid"))
      .clear()
      .type("tertiary title")
      .blur();

    cy.get(testId("txt-intro-tertiary-description", "testid")).should(
      "to.not.be.empty"
    );
    cy.get(testId("txt-intro-tertiary-description", "testid"))
      .clear()
      .type("tertiary description")
      .blur();
  });

  it("should be able to add and modify collapsibles", () => {
    cy.get(testId("collapsible-editor")).should("have.length", 0);
    cy.get(testId("add-collapsible-btn")).click();
    cy.get(testId("collapsible-editor")).should("have.length", 1);

    cy.get(testId("txt-collapsible-title"))
      .type("Collapsible title")
      .blur();

    cy.get(testId("txt-collapsible-description", "testid"))
      .type("Collapsible description")
      .blur();
  });

  it("should be able to re-order collapsibles", () => {
    cy.get(testId("collapsible-editor")).should("have.length", 0);

    cy.get(testId("add-collapsible-btn")).click();
    cy.get(testId("collapsible-editor")).should("have.length", 1);
    cy.get(testId("txt-collapsible-title"))
      .eq(0)
      .type("Title 1")
      .blur();

    cy.get(testId("add-collapsible-btn")).click();
    cy.get(testId("collapsible-editor")).should("have.length", 2);
    cy.get(testId("txt-collapsible-title"))
      .eq(1)
      .type("Title 2")
      .blur();

    cy.get(testId("move-up-btn"))
      .eq(1)
      .click();

    cy.contains("Untitled Section").click();
    cy.hash().should("match", new RegExp(`/q/${idRegex}/section`));
    cy.get(testId("side-nav")).within(() => {
      cy.contains("Introduction").click();
    });
    cy.hash().should("match", new RegExp(`/q/${idRegex}/introduction`));

    cy.get(testId("txt-collapsible-title")).should("have.length", 2);

    cy.get(testId("txt-collapsible-title"))
      .eq(0)
      .should("contain", "Title 2");
  });

  it("should be able to delete collapsibles", () => {
    cy.get(testId("collapsible-editor")).should("have.length", 0);
    cy.get(testId("add-collapsible-btn")).click();
    cy.get(testId("collapsible-editor")).should("have.length", 1);
    cy.get(testId("delete-collapsible-btn")).click();
    cy.get(testId("collapsible-editor")).should("have.length", 0);
  });

  it("should be previewable", () => {
    cy.get(testId("preview"))
      .contains("Preview")
      .click();
    cy.hash().should("match", /\/preview$/);
  });
});

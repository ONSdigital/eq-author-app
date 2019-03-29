import { testId } from "../../utils";
describe("errors", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.login();
  });

  it("displays page not found page if navigating to non-existant questionnaire", done => {
    cy.on("uncaught:exception", () => {
      // return false to prevent the error from
      // failing this test
      return false;
    });

    cy.visit("/#/q/not-existant-id");

    cy.get(testId("not-found-page-title"))
      .should("have.length", 1)
      .then(() => {
        done();
      });
  });
});

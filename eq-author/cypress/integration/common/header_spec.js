import { testId } from "../../utils";

describe("header", () => {
  before(() => {
    cy.visit("/");
  });

  it("should display logo with link to home page", () => {
    cy.get(testId("logo")).should("have.attr", "href", "#/");
  });

  describe("after log in", () => {
    const displayName = "Header Spec";

    beforeEach(() => {
      cy.login({
        displayName
      });
    });

    it("should display user name", () => {
      cy.get(testId("username")).should("contain", displayName);
    });

    it("should sign out when button is clicked", () => {
      cy.get(testId("username")).click();
      cy.hash().should("equal", "#/sign-in");
    });
  });
});

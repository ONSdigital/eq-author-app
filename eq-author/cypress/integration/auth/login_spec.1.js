/* eslint-disable import/unambiguous */
describe("login", () => {
  const firebase = "#firebaseui_container";
  const firebaseErrors = ".firebaseui-error-wrapper";
  const email = "input[type='email']";
  const password = "input[type='password']";

  before(() => {
    cy.visit("/");
  });

  it("should redirect to the sign-in page", () => {
    cy.hash().should("equal", "#/sign-in");
  });

  it("should prompt user to sign in with email", () => {
    cy.get(firebase).within(() => {
      cy.get("h1").should("contain", "Sign in with email");
    });
  });

  it("should display an error when a user doesn't enter an email", () => {
    cy.get(firebase).within(() => {
      cy.get(email)
        .clear()
        .type("Not an email{enter}");
      cy.get(firebaseErrors)
        .children()
        .should("have.length", 1);
    });
  });

  it("should prompt user for password if account exists", () => {
    cy.get(firebase).within(() => {
      cy.get(email)
        .clear()
        .type("cypressTest@ons.com{enter}");
      cy.get(password).should("be.visible");
    });
  });

  it("should allow user to sign in", () => {
    cy.login();
    cy.hash().should("equal", "#/");
  });
});

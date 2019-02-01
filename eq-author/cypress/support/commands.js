/* eslint-disable camelcase */
import { setQuestionnaireSettings, testId, createAccessToken } from "../utils";
import { get } from "lodash/fp";

Cypress.Commands.add("login", options => {
  const tokenPayload = {
    sub: "CypressUserId",
    name: get("displayName", options) || "Cypress",
    email: "cypresstest@ons.gov.uk",
    picture: "",
  };

  const accessToken = createAccessToken(tokenPayload);
  window.localStorage.setItem("accessToken", accessToken);

  const payload = Object.assign(
    {
      id: tokenPayload.user_id,
      name: tokenPayload.name,
      displayName: tokenPayload.name,
      email: tokenPayload.email,
      photoURL: tokenPayload.picture,
    },
    options
  );
  cy.window()
    .its("__store__")
    .then(store => {
      store.dispatch({
        type: "SIGN_IN_USER",
        payload,
      });
    });
});

Cypress.Commands.add("logout", () => {
  window.localStorage.removeItem("accessToken");
  cy.window()
    .its("__store__")
    .then(store => {
      store.dispatch({
        type: "SIGN_OUT_USER",
      });
    });
});

Cypress.Commands.add("dismissAllToast", () => {
  cy.window()
    .its("__store__")
    .then(store => {
      cy.get("[data-test='toast']").each(elem => {
        store.dispatch({
          type: "TOAST_DISMISS",
          payload: { id: elem.attr("id") },
        });
      });
    });
});

Cypress.Commands.add("createQuestionnaire", title => {
  cy.get(testId("logo")).click();
  cy.get(testId("create-questionnaire")).click();
  setQuestionnaireSettings(title);
});

Cypress.Commands.add("deleteQuestionnaire", title => {
  cy.get(testId("logo")).click();
  cy.get("table").within(() => {
    cy.contains(new RegExp(`^${title}`))
      .closest("tr")
      .within(() => {
        cy.get(testId("btn-delete-questionnaire")).click();
      });
  });
  cy.dismissAllToast();
});
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

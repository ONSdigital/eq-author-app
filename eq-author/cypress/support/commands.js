import { setQuestionnaireSettings, testId } from "../utils";

Cypress.Commands.add("login", options => {
  const payload = Object.assign(
    {
      displayName: "Cypress",
      email: "cypresstest@ons.gov.uk",
      photoURL: "https://avatars0.githubusercontent.com/u/8908513?s=64"
    },
    options
  );
  cy.window()
    .its("__store__")
    .then(store => {
      store.dispatch({
        type: "SIGN_IN_USER",
        payload
      });
    });
});

Cypress.Commands.add("logout", () => {
  cy.window()
    .its("__store__")
    .then(store => {
      store.dispatch({
        type: "SIGN_OUT_USER"
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
          payload: { id: elem.attr("id") }
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

Cypress.Commands.add("visitStubbed", function(url, operations = {}) {
  cy.visit(url, {
    onBeforeLoad: win => {
      cy.stub(win, "fetch", serverStub).withArgs("/graphql");
    }
  });

  function serverStub(_, req) {
    const { operationName } = JSON.parse(req.body);

    let resultStub = operations[operationName];
    if (typeof resultStub === "function") {
      resultStub = resultStub(req);
    }
    if (resultStub) {
      return Promise.resolve(responseStub(resultStub));
    }
    // eslint-disable-next-line no-console
    console.log(`${operationName} has not been stubbed`);
    return Promise.reject(new Error(`${operationName} has not been stubbed`));
  }
});

function responseStub(result) {
  return {
    json() {
      return Promise.resolve(result);
    },
    text() {
      return Promise.resolve(JSON.stringify(result));
    },
    ok: true
  };
}
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

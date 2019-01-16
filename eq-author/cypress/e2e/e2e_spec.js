import { question, questionnaire, section } from "../builders";

const assertSecurityHeaders = response => {
  expect(response.headers["referrer-policy"]).to.equal("no-referrer");
  expect(response.headers["strict-transport-security"]).to.equal(
    "max-age=15552000; includeSubDomains"
  );
  expect(response.headers["x-content-type-options"]).to.equal("nosniff");
  expect(response.headers["x-dns-prefetch-control"]).to.equal("off");
  expect(response.headers["x-download-options"]).to.equal("noopen");
  expect(response.headers["x-frame-options"]).to.equal("DENY");
  expect(response.headers["x-xss-protection"]).to.equal("1; mode=block");
};

describe("End to end", () => {
  let questionnaireId;
  it("Has correct response headers", () => {
    cy.request({
      url: "http://localhost:14000/graphql",
      method: "POST",
      failOnStatusCode: false,
    }).then(response => {
      expect(response.headers["access-control-allow-origin"]).to.equal("*");
      assertSecurityHeaders(response);
    });
  });

  it("Can create a questionnaire", () => {
    cy.visit("/");
    cy.login();
    questionnaire.add({ title: "UKIS" }).then(({ id }) => {
      questionnaireId = id;
    });
    section.updateInitial({
      title: "General Business Information",
    });
    question.updateInitial({
      sectionDisplayName: "General Business Information",
      alias: "1.1",
      title:
        "In which geographic markets did Enterprise Ltd offer goods and / or services?",
      answer: {
        type: "Checkbox",
        options: [
          {
            label:
              "UK regional within approximately 100 miles of this business",
          },
          {
            label: "UK National",
          },
          {
            label: "European countries",
          },
          {
            label: "All other countries",
          },
        ],
      },
    });
  });

  it("Publishes successfully", () => {
    cy.request(`http://localhost:19000/publish/${questionnaireId}`).then(
      response => {
        // Use this to grab a copy of what was sent from publisher
        // cy.writeFile(
        //   "cypress/fixtures/publisher_new.json",
        //   JSON.stringify(response.body, null, 2)
        // );
        assertSecurityHeaders(response);
        cy.fixture("publisher.json").then(expectedBody => {
          expect(response.body).to.deep.equal(expectedBody);
        });
      }
    );
  });
});

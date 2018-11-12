import { question, questionnaire, section } from "../builders";

describe("End to end", () => {
  let questionnaireId;

  it("Can create a questionnaire", () => {
    cy.visit("/");
    cy.login();
    questionnaire.add({ title: "UKIS" }).then(({ id }) => {
      questionnaireId = id;
    });
  });

  it("Can create General Business Information Section", () => {
    section.updateInitial({
      title: "General Business Information"
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
            label: "UK regional within approximately 100 miles of this business"
          },
          {
            label: "UK National"
          },
          {
            label: "European countries"
          },
          {
            label: "All other countries"
          }
        ]
      }
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
        cy.fixture("publisher.json").then(expectedBody => {
          expect(response.body).to.deep.equal(expectedBody);
        });
      }
    );
  });
});

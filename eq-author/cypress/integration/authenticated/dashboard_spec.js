import { testId } from "../../utils";
describe("dashboard", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.login();
  });

  it("should display correct title", () => {
    cy.get("h1").should("contain", "Your Questionnaires");
  });

  it("should contain button to create a questionnaire", () => {
    cy.get(testId("create-questionnaire")).click();
    cy.get(testId("questionnaire-settings-modal")).should("be.visible");
  });

  describe("empty state", () => {
    beforeEach(() => {
      cy.visitStubbed("/", {
        GetQuestionnaireList: {
          data: {
            questionnaires: []
          }
        }
      });
      cy.login();
    });

    it("should not display any results", () => {
      cy.contains("You have no questionnaires").should("be.visible");
    });
  });

  describe("existing questionnaires", () => {
    beforeEach(() => {
      cy.visitStubbed("/", {
        GetQuestionnaireList: {
          data: {
            questionnaires: [
              {
                id: "1",
                title: "Test Questionnaire",
                createdAt: "2018-08-01",
                createdBy: { name: "Test user", __typename: "User" },
                __typename: "Questionnaire"
              }
            ]
          }
        }
      });

      cy.login();
    });

    it("should title of existing questionnaires", () => {
      cy.contains("Test Questionnaire").should("be.visible");
    });

    it("should display the name of the person who created the questionnaires", () => {
      cy.contains("Test user").should("be.visible");
    });

    describe("deleting a questionnaire", () => {
      beforeEach(() => {
        cy.visitStubbed("/", {
          GetQuestionnaireList: {
            data: {
              questionnaires: [
                {
                  id: "1",
                  title: "Test Questionnaire",
                  createdAt: "2018-08-01",
                  createdBy: { name: "Test user", __typename: "User" },
                  __typename: "Questionnaire"
                }
              ]
            }
          },
          DeleteQuestionnaire: {
            data: {
              deleteQuestionnaire: {
                id: "1",
                title: "Test Questionnaire",
                createdAt: "2018-08-01",
                createdBy: { name: "Test user", __typename: "User" },
                __typename: "Questionnaire"
              }
            }
          },
          UndeleteQuestionnaire: {
            data: {
              undeleteQuestionnaire: {
                id: "1",
                title: "Test Questionnaire",
                createdAt: "2018-08-01",
                createdBy: { name: "Test user", __typename: "User" },
                __typename: "Questionnaire"
              }
            }
          }
        });

        cy.login();
      });

      it("should delete the questionnaire", () => {
        cy.get(testId("btn-delete-questionnaire")).click();
        cy.contains("You have no questionnaires").should("be.visible");
      });

      it("should display toast when questionnaire is deleted", () => {
        cy.get(testId("btn-delete-questionnaire")).click();
        cy.get(testId("btn-undo")).should("be.visible");
      });

      it("should restore questionnaire when undo is clicked", () => {
        cy.get(testId("btn-delete-questionnaire")).click();
        cy.get(testId("btn-undo")).click();
        cy.get(testId("anchor-questionnaire-title")).should("be.visible");
      });
    });
  });
});

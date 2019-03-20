import { testId } from "../../utils";

const stubs = {
  GetQuestionnaireList: {
    data: {
      questionnaires: [
        {
          createdAt: "2019-01-01",
          createdBy: { id: "1", name: "Test user", __typename: "User" },
          id: "893182fe-75ae-446c-b801-367dfdc2d728",
          displayName: "Test Questionnaire",
          __typename: "Questionnaire",
        },
      ],
    },
  },
  GetCurrentUser: {
    data: {
      me: {
        id: "1",
        name: "Test user",
        picture: "",
        email: "cypress@ons.gov.uk",
        __typename: "User",
      },
    },
  },
  DeleteQuestionnaire: {
    data: {
      deleteQuestionnaire: {
        id: "893182fe-75ae-446c-b801-367dfdc2d728",
        __typename: "Questionnaire",
      },
    },
  },
};

describe("dashboard", () => {
  describe("Populated", () => {
    beforeEach(() => {
      cy.visitStubbed("/", stubs);
      cy.login();
    });

    it("should display correct title", () => {
      cy.get("h1").should("contain", "Your Questionnaires");
    });

    it("should contain button to create a questionnaire", () => {
      cy.get(testId("create-questionnaire")).click();
      cy.get(testId("questionnaire-settings-modal")).should("be.visible");
    });

    describe("questionnaire info", () => {
      it("should title of existing questionnaires", () => {
        cy.contains("Test Questionnaire").should("be.visible");
      });

      it("should display the name of the person who created the questionnaires", () => {
        cy.contains("Test user").should("be.visible");
      });
    });

    describe("deleting a questionnaire", () => {
      it("should delete the questionnaire", () => {
        cy.get(testId("btn-delete-questionnaire")).click();
        cy.get(testId("btn-delete-modal")).click();
        cy.contains("You have no questionnaires").should("be.visible");
      });

      it("should display toast when questionnaire is deleted", () => {
        cy.get(testId("btn-delete-questionnaire")).click();
        cy.get(testId("btn-delete-modal")).click();
        cy.contains("Questionnaire deleted").should("be.visible");
      });
    });
  });

  describe("empty state", () => {
    beforeEach(() => {
      cy.visitStubbed("/", {
        ...stubs,
        GetQuestionnaireList: {
          data: {
            questionnaires: [],
          },
        },
      });
      cy.login();
    });

    it("should not display any results", () => {
      cy.contains("You have no questionnaires").should("be.visible");
    });
  });
});

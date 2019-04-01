import {
  addAnswerType,
  addQuestionnaire,
  findInputByLabel,
  removeAnswers,
  testId,
  toggleCheckboxOn,
  toggleCheckboxOff,
} from "../../utils";

import {
  TEXTFIELD,
  NUMBER,
  CURRENCY,
  DATE,
  PERCENTAGE,
} from "../../../src/constants/answer-types";

const questionnaireTitle = "Answer Properties Question Test";
describe("Answer Properties", () => {
  before(() => {
    cy.visit("/");
    cy.login();
    addQuestionnaire(questionnaireTitle);
  });

  beforeEach(() => {
    cy.login();
  });

  describe("Title", () => {
    it("Should show answers grouped by type", () => {
      const answerTypeTitles = [
        {
          type: NUMBER,
          label: "NUMBER",
        },
        {
          type: NUMBER,
          label: "NUMBER 2",
        },
        {
          type: TEXTFIELD,
          label: "TEXTFIELD",
        },
        {
          type: NUMBER,
          label: "NUMBER 3",
        },
        {
          type: TEXTFIELD,
          label: "TEXTFIELD",
        },
      ];

      for (let index = 0; index < answerTypeTitles.length; index += 1) {
        const { type, label } = answerTypeTitles[index];
        addAnswerType(type);
        cy.get(testId("txt-answer-label")).should("have.length", index + 1);
        cy.get(testId("txt-answer-label"))
          .eq(index)
          .type(label)
          .blur();
        cy.get(testId(`accordion-${type.toLowerCase()}-properties-button`))
          .should("have.length", 1)
          .should("contain", `${type} properties`.toUpperCase());
        cy.get(
          testId(`accordion-${type.toLowerCase()}-properties-body`)
        ).should("contain", label);
      }

      cy.get(testId("btn-delete-answer")).should("have.length", 5);
      removeAnswers();
    });
  });
  describe("Answer Type", () => {
    describe("Text", () => {
      beforeEach(() => {
        addAnswerType(TEXTFIELD);
        cy.get(testId("btn-delete-answer")).should("have.length", 1);
      });
      it("Can toggle 'Required' property on and off", () => {
        findInputByLabel("Required")
          .parent()
          .as("requiredInput");
        toggleCheckboxOn("@requiredInput");
        toggleCheckboxOff("@requiredInput");
      });
      afterEach(() => {
        removeAnswers();
      });
    });
    [NUMBER, CURRENCY, PERCENTAGE].forEach(type => {
      describe(type, () => {
        beforeEach(() => {
          addAnswerType(type);
          cy.get(testId("btn-delete-answer")).should("have.length", 1);
          cy.get(testId("txt-answer-label"))
            .first()
            .type(`${type} 1`)
            .blur();

          addAnswerType(type);
          cy.get(testId("btn-delete-answer")).should("have.length", 2);
          cy.get(testId("txt-answer-label"))
            .last()
            .type(`${type} 2`)
            .blur();
        });
        describe("Required", () => {
          it("Can toggle 'Required' property on and off", () => {
            findInputByLabel("Required")
              .parent()
              .as("requiredInput");
            toggleCheckboxOn("@requiredInput");
            toggleCheckboxOff("@requiredInput");
          });
        });
        describe("Decimals", () => {
          const labelText = "Decimals";
          it("Can be changed", () => {
            findInputByLabel(labelText).should("have.value", "0");
            findInputByLabel(labelText)
              .type("{backspace}3")
              .blur()
              .should("have.value", "3");
          });

          it("removing an answer should not change its value", () => {
            findInputByLabel(labelText)
              .type("{backspace}3")
              .blur()
              .should("have.value", "3");
            cy.get(testId("btn-delete-answer"))
              .first()
              .click();
            cy.get(testId("btn-delete-answer")).should("have.length", 1);
            findInputByLabel(labelText).should("have.value", "3");
          });
        });
        afterEach(() => {
          removeAnswers();
        });
      });
    });

    describe("Date", () => {
      beforeEach(() => {
        addAnswerType(DATE);
        cy.get(testId("btn-delete-answer")).should("have.length", 1);
      });
      describe("Required", () => {
        it("Can toggle 'Required' property on and off", () => {
          findInputByLabel("Required")
            .parent()
            .as("requiredInput");
          toggleCheckboxOn("@requiredInput");
          toggleCheckboxOff("@requiredInput");
        });
      });
      describe("Date format", () => {
        it("Should default to dd/mm/yyyy", () => {
          cy.get("select").should("have.value", "dd/mm/yyyy");
          cy.get("select")
            .select("yyyy")
            .should("have.value", "yyyy");
        });
        it("Should update date formatter", () => {
          cy.get("select")
            .select("yyyy")
            .should("have.value", "yyyy");
          cy.get(testId("dummy-date")).within(() => {
            cy.get(testId("dummy-date-day")).should("not.exist");
            cy.get(testId("dummy-date-month")).should("not.exist");
            cy.get(testId("dummy-date-year")).should("exist");
          });
          cy.get("select")
            .select("mm/yyyy")
            .should("have.value", "mm/yyyy");
          cy.get(testId("dummy-date")).within(() => {
            cy.get(testId("dummy-date-day")).should("not.exist");
            cy.get(testId("dummy-date-month")).should("exist");
            cy.get(testId("dummy-date-year")).should("exist");
          });
          cy.get("select")
            .select("dd/mm/yyyy")
            .should("have.value", "dd/mm/yyyy");
          cy.get(testId("dummy-date")).within(() => {
            cy.get(testId("dummy-date-day")).should("exist");
            cy.get(testId("dummy-date-month")).should("exist");
            cy.get(testId("dummy-date-year")).should("exist");
          });
        });
      });
      afterEach(() => {
        removeAnswers();
      });
    });
  });

  after(() => {
    cy.deleteQuestionnaire(questionnaireTitle);
  });
});

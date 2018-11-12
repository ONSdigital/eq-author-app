import { toUpper } from "lodash";

import {
  addAnswerType,
  addQuestionnaire,
  findByLabel,
  removeAnswer,
  testId
} from "../../utils";

import {
  TEXTFIELD,
  NUMBER,
  CURRENCY,
  TEXTAREA,
  DATE
} from "../../../src/constants/answer-types";

const questionnaireTitle = "Answer Properties Question Test";
describe("Answer Properties", () => {
  it("Can create a questionnaire", () => {
    cy.visit("/");
    cy.login();
    addQuestionnaire(questionnaireTitle);
  });
  describe("Title", () => {
    it("Should show answer type as uppercase text", () => {
      [TEXTFIELD, NUMBER, CURRENCY, TEXTAREA].forEach(answerType => {
        addAnswerType(answerType);
        cy.get(`[data-test="properties-title-0"]`)
          .should("have.length", 1)
          .contains(toUpper(answerType));
        removeAnswer({ multiple: false });
      });
    });
    it("Should show numbered answer types", () => {
      const answerTypeTitles = [
        {
          type: NUMBER,
          title: "NUMBER"
        },
        {
          type: NUMBER,
          title: "NUMBER 2"
        },
        {
          type: TEXTFIELD,
          title: "TEXTFIELD"
        },
        {
          type: NUMBER,
          title: "NUMBER 3"
        },
        {
          type: TEXTFIELD,
          title: "TEXTFIELD"
        }
      ];

      answerTypeTitles.forEach(({ title, type }, index) => {
        addAnswerType(type);
        cy.get(`[data-test="properties-title-${index}"]`).contains(title);
      });

      removeAnswer({ multiple: true });
    });
  });
  describe("Answer Type", () => {
    describe("Text", () => {
      beforeEach(() => {
        addAnswerType(TEXTFIELD);
        cy.get('[data-test="properties-0"]').as("answerProperty");
        cy.get("@answerProperty").should("be.visible");
      });
      describe("Required", () => {
        const labelText = "Required";
        it("Should be first in list of properties", () => {
          cy.get("@answerProperty").within(() => {
            cy.get("label")
              .first()
              .contains(labelText);
          });
        });
        it("Should show 'Required' label", () => {
          cy.get("@answerProperty").within(() => {
            findByLabel(labelText);
          });
        });
        it("Should default to off", () => {
          cy.get("@answerProperty").within(() => {
            findByLabel(labelText).should("not.be.checked");
          });
        });
        it("Can toggle 'Required' property on and off", () => {
          cy.get("@answerProperty").within(() => {
            findByLabel(labelText)
              .click({ force: true })
              .should("be.checked");
            findByLabel(labelText)
              .click({ force: true })
              .should("not.be.checked");
          });
        });
      });
      afterEach(() => {
        removeAnswer();
      });
    });
    describe("Number", () => {
      beforeEach(() => {
        addAnswerType(NUMBER);
        cy.get('[data-test="properties-0"]').as("answerProperty");
        cy.get("@answerProperty").should("be.visible");
      });
      describe("Required", () => {
        const labelText = "Required";
        it("Should be first in list of properties", () => {
          cy.get("@answerProperty").within(() => {
            cy.get("label")
              .first()
              .contains("Required");
          });
        });
        it("Should show 'Required' label", () => {
          cy.get("@answerProperty").within(() => {
            findByLabel(labelText);
          });
        });
        it("Should default to off", () => {
          cy.get("@answerProperty").within(() => {
            findByLabel(labelText).should("not.be.checked");
          });
        });
        it("Can toggle 'Required' property on and off", () => {
          cy.get("@answerProperty").within(() => {
            findByLabel(labelText)
              .click({ force: true })
              .should("be.checked");
            findByLabel(labelText)
              .click({ force: true })
              .should("not.be.checked");
          });
        });
      });
      describe("Decimals", () => {
        const labelText = "Decimals";
        it("Should show 'Decimals' label", () => {
          cy.get("@answerProperty").within(() => {
            findByLabel(labelText);
          });
        });
        it("Should default to 0", () => {
          cy.get("@answerProperty").within(() => {
            findByLabel(labelText).should("have.value", "0");
          });
        });
        it("Can change value", () => {
          cy.get("@answerProperty").within(() => {
            findByLabel(labelText)
              .type("{backspace}3")
              .blur()
              .should("have.value", "3");
          });
        });
      });
      afterEach(() => {
        removeAnswer();
      });
    });
    describe("Currency", () => {
      beforeEach(() => {
        addAnswerType(CURRENCY);
        cy.get('[data-test="properties-0"]').as("answerProperty");
        cy.get("@answerProperty").should("be.visible");
      });
      describe("Required", () => {
        const labelText = "Required";
        it("Should be first in list of properties", () => {
          cy.get("@answerProperty").within(() => {
            cy.get("label")
              .first()
              .contains(labelText);
          });
        });
        it("Should show 'Required' label", () => {
          cy.get("@answerProperty").within(() => {
            findByLabel(labelText);
          });
        });
        it("Should default to off", () => {
          cy.get("@answerProperty").within(() => {
            findByLabel(labelText).should("not.be.checked");
          });
        });
        it("Can toggle 'Required' property on and off", () => {
          cy.get("@answerProperty").within(() => {
            findByLabel(labelText)
              .click({ force: true })
              .should("be.checked");
            findByLabel(labelText)
              .click({ force: true })
              .should("not.be.checked");
          });
        });
      });
      describe("Decimals", () => {
        const labelText = "Decimals";
        it("Should show 'Decimals' label", () => {
          cy.get("@answerProperty").within(() => {
            findByLabel(labelText);
          });
        });
        it("Should default to 0", () => {
          cy.get("@answerProperty").within(() => {
            findByLabel(labelText).should("have.value", "0");
          });
        });
        it("Can change value", () => {
          cy.get("@answerProperty").within(() => {
            findByLabel(labelText)
              .type("{backspace}3")
              .blur()
              .should("have.value", "3");
          });
        });
      });
      afterEach(() => {
        removeAnswer();
      });
    });
    describe("Date", () => {
      beforeEach(() => {
        addAnswerType(DATE);
        cy.get('[data-test="properties-0"]').as("answerProperty");
        cy.get("@answerProperty").should("be.visible");
      });
      describe("Required", () => {
        const labelText = "Required";
        it("Should be first in list of properties", () => {
          cy.get("@answerProperty").within(() => {
            cy.get("label")
              .first()
              .contains(labelText);
          });
        });
        it("Should show 'Required' label", () => {
          cy.get("@answerProperty").within(() => {
            findByLabel(labelText);
          });
        });
        it("Should default to off", () => {
          cy.get("@answerProperty").within(() => {
            findByLabel(labelText).should("not.be.checked");
          });
        });
        it("Can toggle 'Required' property on and off", () => {
          cy.get("@answerProperty").within(() => {
            findByLabel(labelText)
              .click({ force: true })
              .should("be.checked");
            findByLabel(labelText)
              .click({ force: true })
              .should("not.be.checked");
          });
        });
      });
      describe("Date", () => {
        const labelText = "Date type";
        it("Should show 'Date type' label", () => {
          cy.get("@answerProperty").within(() => {
            findByLabel(labelText);
          });
        });
        it("Should default to dd/mm/yyyy", () => {
          cy.get("@answerProperty").within(() => {
            cy.get("select").should("have.value", "dd/mm/yyyy");
          });
        });
        it("Can change value", () => {
          cy.get("@answerProperty").within(() => {
            cy.get("select")
              .select("yyyy")
              .should("have.value", "yyyy");
          });
        });
        it("Should update date formatter", () => {
          cy.get("@answerProperty").within(() => {
            cy.get("select")
              .select("yyyy")
              .should("have.value", "yyyy");
          });
          cy.get(testId("dummy-date")).within(() => {
            cy.get(testId("dummy-date-day")).should("not.exist");
            cy.get(testId("dummy-date-month")).should("not.exist");
            cy.get(testId("dummy-date-year")).should("exist");
          });
          cy.get("@answerProperty").within(() => {
            cy.get("select")
              .select("mm/yyyy")
              .should("have.value", "mm/yyyy");
          });
          cy.get(testId("dummy-date")).within(() => {
            cy.get(testId("dummy-date-day")).should("not.exist");
            cy.get(testId("dummy-date-month")).should("exist");
            cy.get(testId("dummy-date-year")).should("exist");
          });
          cy.get("@answerProperty").within(() => {
            cy.get("select")
              .select("dd/mm/yyyy")
              .should("have.value", "dd/mm/yyyy");
          });
          cy.get(testId("dummy-date")).within(() => {
            cy.get(testId("dummy-date-day")).should("exist");
            cy.get(testId("dummy-date-month")).should("exist");
            cy.get(testId("dummy-date-year")).should("exist");
          });
        });
      });
      afterEach(() => {
        removeAnswer();
      });
    });
  });

  after(() => {
    cy.deleteQuestionnaire(questionnaireTitle);
  });
});

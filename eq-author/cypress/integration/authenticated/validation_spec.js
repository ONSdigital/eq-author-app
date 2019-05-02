/* eslint-disable  camelcase */
import {
  CURRENCY,
  DATE,
  DATE_RANGE,
  NUMBER,
  PERCENTAGE,
} from "../../../src/constants/answer-types";

import {
  addAnswerType,
  addQuestionPage,
  addQuestionnaire,
  removeAnswers,
  testId,
  toggleCheckboxOn,
  toggleCheckboxOff,
  selectFirstAnswerFromContentPicker,
  selectFirstMetadataContentPicker,
  switchPilltab,
} from "../../utils";

import { addMetadata, deleteFirstMetadata } from "../../builders/metadata";

const METADATA_KEY = "ru_ref_custom";

const validatePreviousAnswer = sidebar => {
  cy.get(sidebar)
    .last()
    .click();
  cy.get(testId("validation-view-toggle")).within(() => {
    cy.get("[role='switch']").as("viewToggle");
  });
  toggleCheckboxOn("@viewToggle");
  switchPilltab("PreviousAnswer");
  cy.get(testId("content-picker-select")).as("previousAnswer");
  cy.get("@previousAnswer").contains("Please select...");
  cy.get("@previousAnswer").click();
  selectFirstAnswerFromContentPicker();
  cy.get("@previousAnswer").contains("Validation Answer");
  cy.get(sidebar).contains("Validation Answer");
};

const cleanUpAfterPreviousAnswer = () => {
  cy.get("button")
    .contains("Done")
    .click();
  cy.get(testId("btn-delete")).click();
  cy.get(testId("btn-delete-modal"))
    .contains("Delete")
    .click();
  cy.get(testId("page-item"))
    .first()
    .click();
};

const setPreviousAnswer = (sidebar, answerType) => {
  cy.get("button")
    .contains("Done")
    .click();
  addQuestionPage();
  addAnswerType(answerType);
  validatePreviousAnswer(sidebar);
  cleanUpAfterPreviousAnswer();
};

const setMetadata = (sidebar, METADATA_KEY) => {
  switchPilltab("Metadata");
  cy.get(testId("content-picker-select")).as("metadata");
  cy.get("@metadata").contains("Please select...");
  cy.get("@metadata").click();
  selectFirstMetadataContentPicker();
  cy.get("@metadata").contains(METADATA_KEY);
  cy.get(sidebar).contains(METADATA_KEY);
};

const closeValidationModal = buttonTestAttribute => {
  cy.get("button")
    .contains("Done")
    .should("be.visible")
    .click();
  cy.focused().should("have.attr", "data-test", buttonTestAttribute);
};

describe("Validation", () => {
  before(() => {
    cy.visit("/");
    cy.login();
    addQuestionnaire("Validation Question Test");
  });

  beforeEach(() => {
    cy.login();
  });

  describe("Answer Validation", () => {
    [NUMBER, CURRENCY, PERCENTAGE].forEach(type => {
      describe(type, () => {
        beforeEach(() => {
          addAnswerType(type);
          cy.get(testId("txt-answer-label")).type("Validation Answer");
        });

        const numberInputId = testId("numeric-value-input");

        describe("Min Value", () => {
          const sidebarButton = "sidebar-button-min-value";
          beforeEach(() => {
            cy.get(testId(sidebarButton)).as("minValue");
            cy.get("@minValue").should("be.visible");
            cy.get("@minValue").click();
            cy.get(testId("sidebar-title")).contains(`${type} validation`);
            cy.get(testId("validation-view-toggle")).within(() => {
              cy.get('[role="switch"]').as("minValueToggle");
            });
          });
          it("Can toggle on/off", () => {
            toggleCheckboxOn("@minValueToggle");
            toggleCheckboxOff("@minValueToggle");
            closeValidationModal(sidebarButton);
          });
          it("Can set input value", () => {
            cy.log(numberInputId);
            toggleCheckboxOn("@minValueToggle");
            cy.get(numberInputId)
              .type("3")
              .should("have.value", "3");
            closeValidationModal(sidebarButton);
          });
          it("Can set previous answer", () => {
            setPreviousAnswer("@minValue", type);
          });
          it("Can toggle include/exclude", () => {
            toggleCheckboxOn("@minValueToggle");
            toggleCheckboxOn(testId("inclusive"));
            closeValidationModal(sidebarButton);
          });
          it("Can retain input value after on/off toggle", () => {
            toggleCheckboxOn("@minValueToggle");
            cy.get(numberInputId)
              .type("3")
              .blur();
            toggleCheckboxOff("@minValueToggle");
            toggleCheckboxOn("@minValueToggle");
            cy.get(numberInputId).should("have.value", "3");
            closeValidationModal(sidebarButton);
          });
        });

        describe("Max Value", () => {
          const sidebarButton = "sidebar-button-max-value";
          beforeEach(() => {
            cy.get(testId(sidebarButton)).as("maxValue");
            cy.get("@maxValue").should("be.visible");
            cy.get("@maxValue").click();
            cy.get(testId("sidebar-title")).contains(`${type} validation`);
            cy.get(testId("validation-view-toggle")).within(() => {
              cy.get('[role="switch"]').as("maxValueToggle");
            });
          });

          it("Can toggle on/off", () => {
            toggleCheckboxOn("@maxValueToggle");
            toggleCheckboxOff("@maxValueToggle");
            closeValidationModal(sidebarButton);
          });
          it("Can set input value", () => {
            toggleCheckboxOn("@maxValueToggle");
            cy.get(numberInputId)
              .type("3")
              .should("have.value", "3");
            closeValidationModal(sidebarButton);
          });
          it("Can set previous answer", () => {
            setPreviousAnswer("@maxValue", type);
          });
          it("Can toggle include/exclude", () => {
            toggleCheckboxOn("@maxValueToggle");
            toggleCheckboxOn(testId("inclusive"));
            closeValidationModal(sidebarButton);
          });
          it("Can retain input value after on/off toggle", () => {
            toggleCheckboxOn("@maxValueToggle");
            cy.get(numberInputId)
              .type("3")
              .blur();
            toggleCheckboxOff("@maxValueToggle");
            toggleCheckboxOn("@maxValueToggle");
            cy.get(numberInputId).should("have.value", "3");
            closeValidationModal(sidebarButton);
          });
        });

        afterEach(() => {
          removeAnswers();
        });
      });
    });

    describe("Date", () => {
      before(() => {
        cy.login();
        addMetadata(METADATA_KEY, "Date");
      });

      beforeEach(() => {
        cy.login();
      });

      describe("Earliest date", () => {
        const sidebarButton = "sidebar-button-earliest-date";
        beforeEach(() => {
          addAnswerType(DATE);
          cy.get(testId("date-answer-label")).type("Validation Answer");
          cy.get(testId(sidebarButton)).as("earliestDate");
          cy.get("@earliestDate").click();
          cy.get(testId("validation-view-toggle")).within(() => {
            cy.get('[role="switch"]').as("earliestDateToggle");
          });
        });

        it("should exist in the side bar", () => {
          cy.get("@earliestDate").should("be.visible");
          closeValidationModal(sidebarButton);
        });

        it("should show the date validation modal", () => {
          cy.get(testId("sidebar-title")).contains("Date validation");
          closeValidationModal(sidebarButton);
        });

        it("can be toggled on", () => {
          cy.get(testId("earliest-date-validation")).contains(
            "Earliest date is disabled"
          );

          toggleCheckboxOn("@earliestDateToggle");

          cy.get(testId("earliest-date-validation")).should(
            "not.contain",
            "Earliest date is disabled"
          );
          closeValidationModal(sidebarButton);
        });

        it("should update the offset value", () => {
          toggleCheckboxOn("@earliestDateToggle");
          cy.get('[name="offset.value"]')
            .type("{backspace}5")
            .blur()
            .should("have.value", "5");
          closeValidationModal(sidebarButton);
        });

        it("should update the offset unit", () => {
          toggleCheckboxOn("@earliestDateToggle");

          cy.get('[name="offset.unit"]')
            .select("Months")
            .blur()
            .should("have.value", "Months");
          closeValidationModal(sidebarButton);
        });

        it("should update the relativePosition", () => {
          toggleCheckboxOn("@earliestDateToggle");

          cy.get(testId("relative-position-select"))
            .select("After")
            .blur();
          cy.get(testId("relative-position-select")).should(
            "have.value",
            "After"
          );
          closeValidationModal(sidebarButton);
        });

        it("should default as start date and render correct text", () => {
          toggleCheckboxOn("@earliestDateToggle");
          cy.get(`button[aria-selected='true']`).should(
            "contain",
            "Start date"
          );
          cy.get(`[aria-labelledby="Now"]`).should(
            "contain",
            "The date the respondent begins the survey"
          );
          closeValidationModal(sidebarButton);
        });

        it("should update the custom value", () => {
          toggleCheckboxOn("@earliestDateToggle");

          switchPilltab("Custom");

          cy.get('[type="date"]')
            .type("1985-09-14")
            .blur()
            .should("have.value", "1985-09-14");
          closeValidationModal(sidebarButton);
        });

        it("should update previous answer", () => {
          setPreviousAnswer("@earliestDate", DATE);
        });

        it("should update metadata", () => {
          toggleCheckboxOn("@earliestDateToggle");
          setMetadata("@earliestDate", METADATA_KEY);
          closeValidationModal(sidebarButton);
        });

        afterEach(() => {
          removeAnswers();
        });
      });

      describe("Latest date", () => {
        const sidebarButton = "sidebar-button-latest-date";
        beforeEach(() => {
          addAnswerType(DATE);
          cy.get(testId("date-answer-label")).type("Validation Answer");
          cy.get(testId(sidebarButton)).as("latestDate");
          cy.get("@latestDate").click();
          cy.get(testId("validation-view-toggle")).within(() => {
            cy.get('[role="switch"]').as("latestDateToggle");
          });
        });

        it("should exist in the side bar", () => {
          cy.get(testId(sidebarButton)).should("be.visible");
          closeValidationModal(sidebarButton);
        });

        it("should show the date validation modal", () => {
          cy.get(testId("sidebar-title")).contains("Date validation");
          closeValidationModal(sidebarButton);
        });

        it("can be toggled on", () => {
          toggleCheckboxOn("@latestDateToggle");
          cy.get(testId("latest-date-validation")).should(
            "not.contain",
            "Latest date is disabled"
          );
          closeValidationModal(sidebarButton);
        });

        it("should update the offset value", () => {
          toggleCheckboxOn("@latestDateToggle");
          cy.get('[name="offset.value"]')
            .type("{backspace}5")
            .blur()
            .should("have.value", "5");
          closeValidationModal(sidebarButton);
        });

        it("should update the offset unit", () => {
          toggleCheckboxOn("@latestDateToggle");
          cy.get('[name="offset.unit"]')
            .select("Months")
            .blur()
            .should("have.value", "Months");
          closeValidationModal(sidebarButton);
        });

        it("should update the relativePosition", () => {
          toggleCheckboxOn("@latestDateToggle");
          cy.get(testId("relative-position-select"))
            .select("Before")
            .blur();
          cy.get(testId("relative-position-select")).should(
            "have.value",
            "Before"
          );
          closeValidationModal(sidebarButton);
        });

        it("should default as start date and render correct text", () => {
          toggleCheckboxOn("@latestDateToggle");
          cy.get(`button[aria-selected='true']`).should(
            "contain",
            "Start date"
          );
          cy.get(`[aria-labelledby="Now"]`).should(
            "contain",
            "The date the respondent begins the survey"
          );
          closeValidationModal(sidebarButton);
        });

        it("should update the custom value", () => {
          toggleCheckboxOn("@latestDateToggle");
          switchPilltab("Custom");
          cy.get('[type="date"]')
            .type("1985-09-14")
            .blur()
            .should("have.value", "1985-09-14");
          closeValidationModal(sidebarButton);
        });

        it("should update previous answer", () => {
          setPreviousAnswer("@latestDate", DATE);
        });

        it("should update metadata", () => {
          toggleCheckboxOn("@latestDateToggle");
          setMetadata("@latestDate", METADATA_KEY);
          closeValidationModal(sidebarButton);
        });

        afterEach(() => {
          removeAnswers();
        });
      });

      after(() => {
        deleteFirstMetadata();
      });
    });

    describe("Date Range", () => {
      before(() => {
        cy.login();
        addMetadata(METADATA_KEY, "Date");
      });

      beforeEach(() => {
        cy.login();
      });

      describe("Earliest date", () => {
        const sidebarButton = "sidebar-button-earliest-date";
        beforeEach(() => {
          addAnswerType(DATE_RANGE);
          cy.get(testId("date-answer-label"))
            .eq(0)
            .type("Validation Answer 1");
          cy.get(testId("date-answer-label"))
            .eq(1)
            .type("Validation Answer 2");
          cy.get(testId(sidebarButton)).as("earliestDate");
          cy.get("@earliestDate").click();
          cy.get(testId("validation-view-toggle")).within(() => {
            cy.get('[role="switch"]').as("earliestDateToggle");
          });
        });

        it("should exist in the side bar", () => {
          cy.get("@earliestDate").should("be.visible");
          closeValidationModal(sidebarButton);
        });

        it("should show the date validation modal", () => {
          cy.get(testId("sidebar-title")).contains("Date Range validation");
          closeValidationModal(sidebarButton);
        });

        it("can be toggled on", () => {
          cy.get(testId("earliest-date-validation")).contains(
            "Earliest date is disabled"
          );

          toggleCheckboxOn("@earliestDateToggle");

          cy.get(testId("earliest-date-validation")).should(
            "not.contain",
            "Earliest date is disabled"
          );
          closeValidationModal(sidebarButton);
        });

        it("should update the offset value", () => {
          toggleCheckboxOn("@earliestDateToggle");
          cy.get('[name="offset.value"]')
            .type("{backspace}5")
            .blur()
            .should("have.value", "5");
          closeValidationModal(sidebarButton);
        });

        it("should update the offset unit", () => {
          toggleCheckboxOn("@earliestDateToggle");

          cy.get('[name="offset.unit"]')
            .select("Months")
            .blur()
            .should("have.value", "Months");
          closeValidationModal(sidebarButton);
        });

        it("should update the custom value", () => {
          toggleCheckboxOn("@earliestDateToggle");

          cy.get('[type="date"]')
            .type("1985-09-14")
            .blur()
            .should("have.value", "1985-09-14");
          closeValidationModal(sidebarButton);
        });

        it("should update metadata", () => {
          toggleCheckboxOn("@earliestDateToggle");
          setMetadata("@earliestDate", METADATA_KEY);
          closeValidationModal(sidebarButton);
        });

        afterEach(() => {
          removeAnswers();
        });
      });

      describe("Latest date", () => {
        const sidebarButton = "sidebar-button-latest-date";
        beforeEach(() => {
          addAnswerType(DATE_RANGE);
          cy.get(testId("date-answer-label"))
            .eq(0)
            .type("Validation Answer 1");
          cy.get(testId("date-answer-label"))
            .eq(1)
            .type("Validation Answer 2");
          cy.get(testId(sidebarButton)).as("latestDate");
          cy.get("@latestDate").click();
          cy.get(testId("validation-view-toggle")).within(() => {
            cy.get('[role="switch"]').as("latestDateToggle");
          });
        });

        it("should exist in the side bar", () => {
          cy.get(testId("sidebar-button-latest-date")).should("be.visible");
          closeValidationModal(sidebarButton);
        });

        it("should show the date validation modal", () => {
          cy.get(testId("sidebar-title")).contains("Date Range validation");
          closeValidationModal(sidebarButton);
        });

        it("can be toggled on", () => {
          toggleCheckboxOn("@latestDateToggle");
          cy.get(testId("latest-date-validation")).should(
            "not.contain",
            "Latest date is disabled"
          );
          closeValidationModal(sidebarButton);
        });

        it("should update the offset value", () => {
          toggleCheckboxOn("@latestDateToggle");
          cy.get('[name="offset.value"]')
            .type("{backspace}5")
            .blur()
            .should("have.value", "5");
          closeValidationModal(sidebarButton);
        });

        it("should update the offset unit", () => {
          toggleCheckboxOn("@latestDateToggle");
          cy.get('[name="offset.unit"]')
            .select("Months")
            .blur()
            .should("have.value", "Months");
          closeValidationModal(sidebarButton);
        });

        it("should update the custom value", () => {
          toggleCheckboxOn("@latestDateToggle");
          cy.get('[type="date"]')
            .type("1985-09-14")
            .blur()
            .should("have.value", "1985-09-14");
          closeValidationModal(sidebarButton);
        });

        it("should update metadata", () => {
          toggleCheckboxOn("@latestDateToggle");
          setMetadata("@latestDate", METADATA_KEY);
          closeValidationModal(sidebarButton);
        });

        afterEach(() => {
          removeAnswers();
        });
      });

      describe("Min duration", () => {
        const sidebarButton = "sidebar-button-min-duration";
        beforeEach(() => {
          addAnswerType(DATE_RANGE);
          cy.get(testId("date-answer-label"))
            .eq(0)
            .type("Validation Answer 1");
          cy.get(testId("date-answer-label"))
            .eq(1)
            .type("Validation Answer 2");
          cy.get(testId(sidebarButton)).as("minDuration");
          cy.get("@minDuration").click();
          cy.get(testId("validation-view-toggle")).within(() => {
            cy.get('[role="switch"]').as("minDurationToggle");
          });
        });

        it("should exist in the side bar", () => {
          cy.get("@minDuration").should("be.visible");
        });

        it("should show the validation modal", () => {
          cy.get(testId("sidebar-title")).contains("Date Range validation");
        });

        it("can be toggled on", () => {
          cy.get(testId("min-duration-validation")).contains(
            "Min duration is disabled"
          );

          toggleCheckboxOn("@minDurationToggle");

          cy.get(testId("min-duration-validation")).should(
            "not.contain",
            "Min duration is disabled"
          );
        });

        it("should update the duration value", () => {
          toggleCheckboxOn("@minDurationToggle");
          cy.get('[name="duration.value"]')
            .type("{backspace}5")
            .blur()
            .should("have.value", "5");
        });

        it("should update the duration unit", () => {
          toggleCheckboxOn("@minDurationToggle");

          cy.get('[name="duration.unit"]')
            .select("Months")
            .blur()
            .should("have.value", "Months");
        });

        afterEach(() => {
          closeValidationModal(sidebarButton);
          removeAnswers();
        });
      });

      describe("Max duration", () => {
        const sidebarButton = "sidebar-button-max-duration";
        beforeEach(() => {
          addAnswerType(DATE_RANGE);
          cy.get(testId("date-answer-label"))
            .eq(0)
            .type("Validation Answer 1");
          cy.get(testId("date-answer-label"))
            .eq(1)
            .type("Validation Answer 2");
          cy.get(testId(sidebarButton)).as("maxDuration");
          cy.get("@maxDuration").click();
          cy.get(testId("validation-view-toggle")).within(() => {
            cy.get('[role="switch"]').as("maxDurationToggle");
          });
        });

        it("should exist in the side bar", () => {
          cy.get("@maxDuration").should("be.visible");
        });

        it("should show the validation modal", () => {
          cy.get(testId("sidebar-title")).contains("Date Range validation");
        });

        it("can be toggled on", () => {
          cy.get(testId("max-duration-validation")).contains(
            "Max duration is disabled"
          );

          toggleCheckboxOn("@maxDurationToggle");

          cy.get(testId("max-duration-validation")).should(
            "not.contain",
            "Max duration is disabled"
          );
        });

        it("should update the duration value", () => {
          toggleCheckboxOn("@maxDurationToggle");
          cy.get('[name="duration.value"]')
            .type("{backspace}5")
            .blur()
            .should("have.value", "5");
        });

        it("should update the duration unit", () => {
          toggleCheckboxOn("@maxDurationToggle");

          cy.get('[name="duration.unit"]')
            .select("Months")
            .blur()
            .should("have.value", "Months");
        });

        afterEach(() => {
          closeValidationModal(sidebarButton);
          removeAnswers();
        });
      });

      after(() => {
        deleteFirstMetadata();
      });
    });
  });

  describe("Answer Group Validation", () => {
    describe("Total", () => {
      const sidebarButton = "sidebar-button-total-value";
      beforeEach(() => {
        addAnswerType(NUMBER);
        cy.get(testId("txt-answer-label")).should("have.length", 1);
        cy.get(testId("txt-answer-label"))
          .last()
          .type("Group Validation Answer 1");
        addAnswerType(NUMBER);
        cy.get(testId("txt-answer-label")).should("have.length", 2);
        cy.get(testId("txt-answer-label"))
          .last()
          .type("Group Validation Answer 2");

        cy.get(testId(sidebarButton)).as("totalValue");
        cy.get("@totalValue").scrollIntoView();
        cy.get("@totalValue").should("be.visible");
        cy.get("@totalValue").click();
        cy.get(testId("validation-view-toggle")).within(() => {
          cy.get('[role="switch"]').as("totalValueToggle");
        });
      });

      afterEach(() => {
        closeValidationModal(sidebarButton);
        removeAnswers();
      });

      it("Can set input value", () => {
        toggleCheckboxOn("@totalValueToggle");
        cy.get(testId("total-validation-number-input")).should("be.visible");
        cy.get(testId("total-validation-number-input"))
          .type("300")
          .blur()
          .should("have.value", "300");
      });

      it("Can set previous answer", () => {
        closeValidationModal(sidebarButton);
        cy.contains("Untitled Section").click();
        addQuestionPage();
        addAnswerType(NUMBER);
        cy.get(testId("txt-answer-label")).type("Validation Answer");
        cy.contains("Untitled Page").click();
        validatePreviousAnswer("@totalValue");
      });

      it("Can retain input value after on/off toggle", () => {
        toggleCheckboxOn("@totalValueToggle");
        cy.get(testId("total-validation-number-input"))
          .type("3")
          .blur();
        toggleCheckboxOff("@totalValueToggle");
        toggleCheckboxOn("@totalValueToggle");
        cy.get(testId("total-validation-number-input")).should(
          "have.value",
          "3"
        );
      });
    });
  });
});

/* eslint-disable  camelcase */
import { CURRENCY, DATE, NUMBER } from "../../../src/constants/answer-types";

import {
  addAnswerType,
  addQuestionPage,
  addQuestionnaire,
  removeAnswer,
  testId,
  toggleCheckboxOn,
  toggleCheckboxOff,
  selectFirstAnswerFromContentPicker,
  selectFirstMetadataContentPicker,
  switchPilltab
} from "../../utils";

import { addMetadata } from "../../builders/metadata";

const METADATA_KEY = "ru_ref_custom";

const setPreviousAnswer = (sidebar, answerType) => {
  cy.get(testId("btn-done")).click();
  addQuestionPage();
  addAnswerType(answerType);
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

const setMetadata = (sidebar, METADATA_KEY) => {
  switchPilltab("Metadata");
  cy.get(testId("content-picker-select")).as("metadata");
  cy.get("@metadata").contains("Please select...");
  cy.get("@metadata").click();
  selectFirstMetadataContentPicker();
  cy.get("@metadata").contains(METADATA_KEY);
  cy.get(sidebar).contains(METADATA_KEY);
  cy.get("button")
    .contains("Done")
    .click();
};

describe("Answer Validation", () => {
  it("Can create a questionnaire", () => {
    cy.visit("/");
    cy.login();
    addQuestionnaire("Answer Validation Question Test");
  });
  describe("Number", () => {
    beforeEach(() => {
      addAnswerType(NUMBER);
      cy.get(testId("txt-answer-label")).type("Validation Answer");
    });

    describe("Min Value", () => {
      beforeEach(() => {
        cy.get(testId("sidebar-button-min-value")).as("minValue");
        cy.get("@minValue").should("be.visible");
        cy.get("@minValue").click();
        cy.get(testId("sidebar-title")).contains("Number validation");
        cy.get(testId("validation-view-toggle")).within(() => {
          cy.get('[role="switch"]').as("minValueToggle");
        });
      });
      it("Can toggle on/off", () => {
        toggleCheckboxOn("@minValueToggle");
        toggleCheckboxOff("@minValueToggle");
      });
      it("Can set input value", () => {
        toggleCheckboxOn("@minValueToggle");
        cy.get(testId("min-value-input"))
          .type("3")
          .should("have.value", "3");
      });
      it("Can toggle include/exclude", () => {
        toggleCheckboxOn("@minValueToggle");
        toggleCheckboxOn(testId("min-value-include"));
      });
      it("Can retain input value after on/off toggle", () => {
        toggleCheckboxOn("@minValueToggle");
        cy.get(testId("min-value-input")).type("3");
        toggleCheckboxOff("@minValueToggle");
        toggleCheckboxOn("@minValueToggle");
        cy.get(testId("min-value-input")).should("have.value", "3");
      });
    });

    describe("Max Value", () => {
      beforeEach(() => {
        cy.get(testId("sidebar-button-max-value")).as("maxValue");
        cy.get("@maxValue").should("be.visible");
        cy.get("@maxValue").click();
        cy.get(testId("sidebar-title")).contains("Number validation");
        cy.get(testId("validation-view-toggle")).within(() => {
          cy.get('[role="switch"]').as("maxValueToggle");
        });
      });
      it("Can toggle on/off", () => {
        toggleCheckboxOn("@maxValueToggle");
        toggleCheckboxOff("@maxValueToggle");
      });
      it("Can set input value", () => {
        toggleCheckboxOn("@maxValueToggle");
        cy.get(testId("max-value-input"))
          .type("3")
          .should("have.value", "3");
      });
      it("Can set previous answer", () => {
        setPreviousAnswer("@maxValue", NUMBER);
      });
      it("Can toggle include/exclude", () => {
        toggleCheckboxOn("@maxValueToggle");
        toggleCheckboxOn(testId("max-value-include"));
      });
      it("Can retain input value after on/off toggle", () => {
        toggleCheckboxOn("@maxValueToggle");
        cy.get(testId("max-value-input")).type("3");
        toggleCheckboxOff("@maxValueToggle");
        toggleCheckboxOn("@maxValueToggle");
        cy.get(testId("max-value-input")).should("have.value", "3");
      });
    });

    afterEach(() => {
      removeAnswer();
    });
  });

  describe("Currency", () => {
    beforeEach(() => {
      addAnswerType(CURRENCY);
      cy.get(testId("txt-answer-label")).type("Validation Answer");
    });

    describe("Min Value", () => {
      beforeEach(() => {
        cy.get(testId("sidebar-button-min-value")).as("minValue");
        cy.get("@minValue").should("be.visible");
        cy.get("@minValue").click();
        cy.get(testId("sidebar-title")).contains("Currency validation");
        cy.get(testId("validation-view-toggle")).within(() => {
          cy.get('[role="switch"]').as("minValueToggle");
        });
      });
      it("Can toggle on/off", () => {
        toggleCheckboxOn("@minValueToggle");
        toggleCheckboxOff("@minValueToggle");
      });
      it("Can set input value", () => {
        toggleCheckboxOn("@minValueToggle");
        cy.get(testId("min-value-input"))
          .type("3")
          .should("have.value", "3");
      });
      it("Can toggle include/exclude", () => {
        toggleCheckboxOn("@minValueToggle");
        toggleCheckboxOn(testId("min-value-include"));
      });
      it("Can retain input value after on/off toggle", () => {
        toggleCheckboxOn("@minValueToggle");
        cy.get(testId("min-value-input")).type("3");
        toggleCheckboxOff("@minValueToggle");
        toggleCheckboxOn("@minValueToggle");
        cy.get(testId("min-value-input")).should("have.value", "3");
      });
    });

    describe("Max Value", () => {
      beforeEach(() => {
        cy.get(testId("sidebar-button-max-value")).as("maxValue");
        cy.get("@maxValue").should("be.visible");
        cy.get("@maxValue").click();
        cy.get(testId("sidebar-title")).contains("Currency validation");
        cy.get(testId("validation-view-toggle")).within(() => {
          cy.get('[role="switch"]').as("maxValueToggle");
        });
      });
      it("Can toggle on/off", () => {
        toggleCheckboxOn("@maxValueToggle");
        toggleCheckboxOff("@maxValueToggle");
      });
      it("Can set input value", () => {
        toggleCheckboxOn("@maxValueToggle");
        cy.get(testId("max-value-input"))
          .type("3")
          .should("have.value", "3");
      });
      it("Can set previous answer", () => {
        setPreviousAnswer("@maxValue", CURRENCY);
      });
      it("Can toggle include/exclude", () => {
        toggleCheckboxOn("@maxValueToggle");
        toggleCheckboxOn(testId("max-value-include"));
      });
      it("Can retain input value after on/off toggle", () => {
        toggleCheckboxOn("@maxValueToggle");
        cy.get(testId("max-value-input")).type("3");
        toggleCheckboxOff("@maxValueToggle");
        toggleCheckboxOn("@maxValueToggle");
        cy.get(testId("max-value-input")).should("have.value", "3");
      });
    });

    afterEach(() => {
      removeAnswer();
    });
  });

  describe("Date", () => {
    before(() => {
      addMetadata(METADATA_KEY, "Date");
    });
    describe("Earliest date", () => {
      beforeEach(() => {
        addAnswerType(DATE);
        cy.get(testId("date-answer-label")).type("Validation Answer");
        cy.get(testId("sidebar-button-earliest-date")).as("earliestDate");
        cy.get("@earliestDate").click();
        cy.get(testId("validation-view-toggle")).within(() => {
          cy.get('[role="switch"]').as("earliestDateToggle");
        });
      });

      it("should exist in the side bar", () => {
        cy.get("@earliestDate").should("be.visible");
      });

      it("should show the date validation modal", () => {
        cy.get(testId("sidebar-title")).contains("Date validation");
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
      });

      it("should update the offset value", () => {
        toggleCheckboxOn("@earliestDateToggle");
        cy.get('[name="offset.value"]')
          .type("{backspace}5")
          .blur()
          .should("have.value", "5");
      });

      it("should update the offset unit", () => {
        toggleCheckboxOn("@earliestDateToggle");

        cy.get('[name="offset.unit"]')
          .select("Months")
          .blur()
          .should("have.value", "Months");
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
      });

      it("should default as start date and render correct text", () => {
        toggleCheckboxOn("@earliestDateToggle");
        cy.get(`button[aria-selected='true']`).should("contain", "Start date");
        cy.get(`[aria-labelledby="Now"]`).should(
          "contain",
          "The date the respondent begins the survey"
        );
      });

      it("should update the custom value", () => {
        toggleCheckboxOn("@earliestDateToggle");

        switchPilltab("Custom");

        cy.get('[type="date"]')
          .type("1985-09-14")
          .blur()
          .should("have.value", "1985-09-14");
      });

      it("should update previous answer", () => {
        setPreviousAnswer("@earliestDate", DATE);
      });

      it("should update metadata", () => {
        toggleCheckboxOn("@earliestDateToggle");
        setMetadata("@earliestDate", METADATA_KEY);
      });

      afterEach(() => {
        removeAnswer();
      });
    });

    describe("Latest date", () => {
      beforeEach(() => {
        addAnswerType(DATE);
        cy.get(testId("date-answer-label")).type("Validation Answer");
        cy.get(testId("sidebar-button-latest-date")).as("latestDate");
        cy.get("@latestDate").click();
        cy.get(testId("validation-view-toggle")).within(() => {
          cy.get('[role="switch"]').as("latestDateToggle");
        });
      });

      it("should exist in the side bar", () => {
        cy.get(testId("sidebar-button-latest-date")).should("be.visible");
      });

      it("should show the date validation modal", () => {
        cy.get(testId("sidebar-title")).contains("Date validation");
      });

      it("can be toggled on", () => {
        toggleCheckboxOn("@latestDateToggle");
        cy.get(testId("latest-date-validation")).should(
          "not.contain",
          "Latest date is disabled"
        );
      });

      it("should update the offset value", () => {
        toggleCheckboxOn("@latestDateToggle");
        cy.get('[name="offset.value"]')
          .type("{backspace}5")
          .blur()
          .should("have.value", "5");
      });

      it("should update the offset unit", () => {
        toggleCheckboxOn("@latestDateToggle");
        cy.get('[name="offset.unit"]')
          .select("Months")
          .blur()
          .should("have.value", "Months");
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
      });

      it("should default as start date and render correct text", () => {
        toggleCheckboxOn("@latestDateToggle");
        cy.get(`button[aria-selected='true']`).should("contain", "Start date");
        cy.get(`[aria-labelledby="Now"]`).should(
          "contain",
          "The date the respondent begins the survey"
        );
      });

      it("should update the custom value", () => {
        toggleCheckboxOn("@latestDateToggle");
        switchPilltab("Custom");
        cy.get('[type="date"]')
          .type("1985-09-14")
          .blur()
          .should("have.value", "1985-09-14");
      });

      it("should update previous answer", () => {
        setPreviousAnswer("@latestDate", DATE);
      });

      it("should update metadata", () => {
        toggleCheckboxOn("@latestDateToggle");
        setMetadata("@latestDate", METADATA_KEY);
      });

      afterEach(() => {
        removeAnswer();
      });
    });
  });
});

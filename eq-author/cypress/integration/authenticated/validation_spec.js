/* eslint-disable  camelcase */
import { kebabCase, startCase } from "lodash";

import {
  CURRENCY,
  DATE,
  DATE_RANGE,
  NUMBER,
  PERCENTAGE,
} from "../../../src/constants/answer-types";

import {
  testId,
  toggleCheckboxOn,
  toggleCheckboxOff,
  selectFirstAnswerFromContentPicker,
  switchPilltab,
} from "../../utils";

const METADATA_KEY = "ru_ref_custom";

const setPreviousAnswer = sidebar => {
  switchPilltab("PreviousAnswer");
  cy.get(testId("content-picker-select")).as("previousAnswer");
  cy.get("@previousAnswer").contains("Please select...");
  cy.get("@previousAnswer").click();
  selectFirstAnswerFromContentPicker();
  cy.get("@previousAnswer").contains("Previous Answer");
  cy.get(sidebar).contains("Previous Answer");
};

const setMetadata = (sidebar, METADATA_KEY) => {
  switchPilltab("Metadata");
  cy.get(testId("content-picker-select")).as("metadata");
  cy.get("@metadata").contains("Please select...");
  cy.get("@metadata").click();
  cy.contains(METADATA_KEY).click();
  cy.get(testId("submit-button")).click();
  cy.get("@metadata").contains(METADATA_KEY);
  cy.get(sidebar).contains(METADATA_KEY);
};

const closeValidationModal = () =>
  cy
    .get("button")
    .contains("Done")
    .click();

describe("Answer Validation", () => {
  let title;

  beforeEach(() => {
    title = null;
  });

  afterEach(() => {
    closeValidationModal();
    cy.deleteQuestionnaire(title);
  });

  [NUMBER, CURRENCY, PERCENTAGE].forEach(type => {
    describe(type, () => {
      beforeEach(() => {
        title = `Test Validation ${type}`;
        cy.seedQuestionnaire(title);
        cy.contains("Current Page").click();
        cy.contains(`${type} Answer`).should("be.visible");
      });

      const numberInputId = testId("numeric-value-input");

      describe("Min Value", () => {
        beforeEach(() => {
          cy.get(testId("sidebar-button-min-value")).as("minValue");
          cy.get("@minValue").should("be.visible");
          cy.get("@minValue").click();
          cy.get(testId("sidebar-title")).contains(`${type} validation`);
          cy.get(testId("validation-view-toggle")).within(() => {
            cy.get('[role="switch"]').as("minValueToggle");
          });
          toggleCheckboxOn("@minValueToggle");
        });
        it("Can change values", () => {
          cy.get(numberInputId)
            .type("3")
            .should("have.value", "3");

          toggleCheckboxOn(testId("inclusive"));
        });
        it("Can set previous answer", () => {
          setPreviousAnswer("@minValue");
        });
        it("Can retain input value after on/off toggle", () => {
          cy.get(numberInputId)
            .type("3")
            .blur();
          toggleCheckboxOff("@minValueToggle");
          toggleCheckboxOn("@minValueToggle");
          cy.get(numberInputId).should("have.value", "3");
        });
      });

      describe("Max Value", () => {
        beforeEach(() => {
          cy.get(testId("sidebar-button-max-value")).as("maxValue");
          cy.get("@maxValue").should("be.visible");
          cy.get("@maxValue").click();
          cy.get(testId("sidebar-title")).contains(`${type} validation`);
          cy.get(testId("validation-view-toggle")).within(() => {
            cy.get('[role="switch"]').as("maxValueToggle");
          });
          toggleCheckboxOn("@maxValueToggle");
        });

        it("Can change values", () => {
          cy.get(numberInputId)
            .type("3")
            .should("have.value", "3");

          toggleCheckboxOn(testId("inclusive"));
        });
        it("Can set previous answer", () => {
          setPreviousAnswer("@maxValue", type);
        });
        it("Can retain input value after on/off toggle", () => {
          cy.get(numberInputId)
            .type("3")
            .blur();
          toggleCheckboxOff("@maxValueToggle");
          toggleCheckboxOn("@maxValueToggle");
          cy.get(numberInputId).should("have.value", "3");
        });
      });
    });
  });

  [DATE, DATE_RANGE].forEach(answerType => {
    describe(answerType, () => {
      beforeEach(() => {
        title = `Test Validation ${startCase(answerType)}`;
        cy.seedQuestionnaire(title);
        cy.contains("Current Page").click();
      });

      ["Earliest date", "Latest date"].forEach(validationType => {
        describe(validationType, () => {
          beforeEach(() => {
            cy.get(testId(`sidebar-button-${kebabCase(validationType)}`)).as(
              "sidebarButton"
            );
            cy.get("@sidebarButton").click();
            cy.get(testId("validation-view-toggle")).within(() => {
              cy.get('[role="switch"]').as("toggle");
            });
            cy.get(testId(`${kebabCase(validationType)}-validation`)).contains(
              `${validationType} is disabled`
            );
            toggleCheckboxOn("@toggle");
            cy.get(testId(`${kebabCase(validationType)}-validation`)).should(
              "not.contain",
              `${validationType} is disabled`
            );
          });

          it("should show it selected and you can update the values", () => {
            cy.get(testId("sidebar-title")).contains(
              `${startCase(answerType)} validation`
            );

            if (answerType === DATE) {
              cy.get(`button[aria-selected='true']`).should(
                "contain",
                "Start date"
              );
              cy.get(`[aria-labelledby="Now"]`).should(
                "contain",
                "The date the respondent begins the survey"
              );
            }

            cy.get('[name="offset.value"]')
              .type("{backspace}5")
              .blur()
              .should("have.value", "5");

            cy.get('[name="offset.unit"]')
              .select("Months")
              .blur()
              .should("have.value", "Months");

            if (answerType === DATE) {
              cy.get(testId("relative-position-select"))
                .select("After")
                .blur();
              cy.get(testId("relative-position-select")).should(
                "have.value",
                "After"
              );
            }
          });

          it("should update the custom value", () => {
            switchPilltab("Custom");

            cy.get('[type="date"]')
              .type("1985-09-14")
              .blur()
              .should("have.value", "1985-09-14");
          });

          if (answerType === DATE) {
            it("should update previous answer", () => {
              setPreviousAnswer("@sidebarButton");
            });
          }

          it("should update metadata", () => {
            setMetadata("@sidebarButton", METADATA_KEY);
          });
        });
      });

      if (answerType === DATE_RANGE) {
        ["Min duration", "Max duration"].forEach(validationType => {
          describe(validationType, () => {
            beforeEach(() => {
              cy.get(testId(`sidebar-button-${kebabCase(validationType)}`)).as(
                "sidebarButton"
              );
              cy.get("@sidebarButton").click();
              cy.get(testId("validation-view-toggle")).within(() => {
                cy.get('[role="switch"]').as("toggle");
              });
              cy.get(
                testId(`${kebabCase(validationType)}-validation`)
              ).contains(`${validationType} is disabled`);
              toggleCheckboxOn("@toggle");
              cy.get(testId(`${kebabCase(validationType)}-validation`)).should(
                "not.contain",
                `${validationType} is disabled`
              );
            });

            it("should show it selected and update the values", () => {
              cy.get(testId("sidebar-title")).contains("Date Range validation");

              cy.get('[name="duration.value"]')
                .type("{backspace}5")
                .blur()
                .should("have.value", "5");

              cy.get('[name="duration.unit"]')
                .select("Months")
                .blur()
                .should("have.value", "Months");
            });
          });
        });
      }
    });
  });

  // describe("Date Range", () => {
  //   before(() => {
  //     cy.login();
  //     addMetadata(METADATA_KEY, "Date");
  //   });

  //   beforeEach(() => {
  //     cy.login();
  //   });

  //   describe("Min duration", () => {
  //     beforeEach(() => {
  //       addAnswerType(DATE_RANGE);
  //       cy.get(testId("date-answer-label"))
  //         .eq(0)
  //         .type("Validation Answer 1");
  //       cy.get(testId("date-answer-label"))
  //         .eq(1)
  //         .type("Validation Answer 2");
  //       cy.get(testId("sidebar-button-min-duration")).as("minDuration");
  //       cy.get("@minDuration").click();
  //       cy.get(testId("validation-view-toggle")).within(() => {
  //         cy.get('[role="switch"]').as("minDurationToggle");
  //       });
  //     });

  //     it("should exist in the side bar", () => {
  //       cy.get("@minDuration").should("be.visible");
  //     });

  //     it("should show the validation modal", () => {
  //       cy.get(testId("sidebar-title")).contains("Date Range validation");
  //     });

  //     it("can be toggled on", () => {
  //       cy.get(testId("min-duration-validation")).contains(
  //         "Min duration is disabled"
  //       );

  //       toggleCheckboxOn("@minDurationToggle");

  //       cy.get(testId("min-duration-validation")).should(
  //         "not.contain",
  //         "Min duration is disabled"
  //       );
  //     });

  //     it("should update the duration value", () => {
  //       toggleCheckboxOn("@minDurationToggle");
  //       cy.get('[name="duration.value"]')
  //         .type("{backspace}5")
  //         .blur()
  //         .should("have.value", "5");
  //     });

  //     it("should update the duration unit", () => {
  //       toggleCheckboxOn("@minDurationToggle");

  //       cy.get('[name="duration.unit"]')
  //         .select("Months")
  //         .blur()
  //         .should("have.value", "Months");
  //     });

  //     afterEach(() => {
  //       closeValidationModal();
  //       removeAnswers();
  //     });
  //   });

  //   describe("Max duration", () => {
  //     beforeEach(() => {
  //       addAnswerType(DATE_RANGE);
  //       cy.get(testId("date-answer-label"))
  //         .eq(0)
  //         .type("Validation Answer 1");
  //       cy.get(testId("date-answer-label"))
  //         .eq(1)
  //         .type("Validation Answer 2");
  //       cy.get(testId("sidebar-button-max-duration")).as("maxDuration");
  //       cy.get("@maxDuration").click();
  //       cy.get(testId("validation-view-toggle")).within(() => {
  //         cy.get('[role="switch"]').as("maxDurationToggle");
  //       });
  //     });

  //     it("should exist in the side bar", () => {
  //       cy.get("@maxDuration").should("be.visible");
  //     });

  //     it("should show the validation modal", () => {
  //       cy.get(testId("sidebar-title")).contains("Date Range validation");
  //     });

  //     it("can be toggled on", () => {
  //       cy.get(testId("max-duration-validation")).contains(
  //         "Max duration is disabled"
  //       );

  //       toggleCheckboxOn("@maxDurationToggle");

  //       cy.get(testId("max-duration-validation")).should(
  //         "not.contain",
  //         "Max duration is disabled"
  //       );
  //     });

  //     it("should update the duration value", () => {
  //       toggleCheckboxOn("@maxDurationToggle");
  //       cy.get('[name="duration.value"]')
  //         .type("{backspace}5")
  //         .blur()
  //         .should("have.value", "5");
  //     });

  //     it("should update the duration unit", () => {
  //       toggleCheckboxOn("@maxDurationToggle");

  //       cy.get('[name="duration.unit"]')
  //         .select("Months")
  //         .blur()
  //         .should("have.value", "Months");
  //     });

  //     afterEach(() => {
  //       closeValidationModal();
  //       removeAnswers();
  //     });
  //   });

  //   after(() => {
  //     deleteFirstMetadata();
  //   });
  // });
});

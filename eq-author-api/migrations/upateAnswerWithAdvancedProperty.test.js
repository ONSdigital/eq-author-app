const upateAnswerWithAdvancedProperty = require("./upateAnswerWithAdvancedProperty");
const { NUMBER, DATE, CHECKBOX, RADIO } = require("../constants/answerTypes");

describe("Migration: set advanced property", () => {
  let questionnaire;
  beforeEach(() => {
    questionnaire = {
      sections: [
        {
          folders: [
            {
              pages: [
                {
                  answers: [
                    {
                      type: NUMBER,
                      advancedProperties: false,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
  });

  it("should set advanced property when validation rule exists", () => {
    questionnaire.sections[0].folders[0].pages[0].answers[0].validation = {
      minValue: {
        enabled: true,
      },
    };
    const result = upateAnswerWithAdvancedProperty(questionnaire);
    expect(
      result.sections[0].folders[0].pages[0].answers[0].advancedProperties
    ).toBe(true);
  });

  it("should set advanced property when mutually exclusive option rule exists", () => {
    questionnaire.sections[0].folders[0].pages[0].answers[0].options = [
      { id: "123" },
    ];
    const result = upateAnswerWithAdvancedProperty(questionnaire);
    expect(
      result.sections[0].folders[0].pages[0].answers[0].advancedProperties
    ).toBe(true);
  });

  it("should set advanced property when fallback exists", () => {
    questionnaire.sections[0].folders[0].pages[0].answers[0] = {
      type: DATE,
      properties: {
        fallback: {
          enabled: true,
        },
      },
    };
    const result = upateAnswerWithAdvancedProperty(questionnaire);
    expect(
      result.sections[0].folders[0].pages[0].answers[0].advancedProperties
    ).toBe(true);
  });

  it("should not set advanced property when option exists for radio", () => {
    questionnaire.sections[0].folders[0].pages[0].answers[0] = {
      type: RADIO,
      advancedProperties: false,
      options: [{ id: "123" }],
    };

    const result = upateAnswerWithAdvancedProperty(questionnaire);
    expect(
      result.sections[0].folders[0].pages[0].answers[0].advancedProperties
    ).toBe(false);
  });

  it("should not set advanced property when option exists for checkbox", () => {
    questionnaire.sections[0].folders[0].pages[0].answers[0] = {
      type: CHECKBOX,
      advancedProperties: false,
      options: [{ id: "123" }],
    };

    const result = upateAnswerWithAdvancedProperty(questionnaire);
    expect(
      result.sections[0].folders[0].pages[0].answers[0].advancedProperties
    ).toBe(false);
  });
});

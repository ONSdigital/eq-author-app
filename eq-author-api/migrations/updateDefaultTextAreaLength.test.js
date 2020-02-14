const { cloneDeep } = require("lodash");
const updateDefaultTextAreaLength = require("./updateDefaultTextAreaLength.js");

const mockMaxlengthMissing = {
  sections: [
    {
      pages: [
        {
          answers: [
            {
              type: "TextArea",
              properties: {
                required: false,
              },
            },
            {
              type: "Text",
              properties: {
                required: false,
              },
            },
          ],
        },
      ],
    },
  ],
};

const mockMaxlengthIncluded = {
  sections: [
    {
      pages: [
        {
          answers: [
            {
              type: "TextArea",
              properties: {
                required: false,
                maxLength: "100",
              },
            },
          ],
        },
      ],
    },
  ],
};

describe("updateDefaultTextAreaLength", () => {
  // This test must remain for your migration to always work
  it("should be deterministic", () => {
    const questionnaire = mockMaxlengthMissing;
    expect(updateDefaultTextAreaLength(cloneDeep(questionnaire))).toEqual(
      updateDefaultTextAreaLength(cloneDeep(questionnaire))
    );
  });

  it("should add a default max length if missing for textarea answers only", () => {
    const questionnaire = mockMaxlengthMissing;
    const result = updateDefaultTextAreaLength(cloneDeep(questionnaire));
    expect(result.sections[0].pages[0].answers[0].properties.maxLength).toEqual(
      "2000"
    );
    expect(
      result.sections[0].pages[0].answers[1].properties.maxLength
    ).toBeUndefined();
  });

  it("should not add a default max length for text area if it is already there ", () => {
    const questionnaire = mockMaxlengthIncluded;
    const result = updateDefaultTextAreaLength(cloneDeep(questionnaire));
    expect(result.sections[0].pages[0].answers[0].properties.maxLength).toEqual(
      "100"
    );
  });
});

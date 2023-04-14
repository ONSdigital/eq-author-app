const upateRepeatingIndividualAnswersFields = require("./addRepeatingLabelAndInputFields");
const { NUMBER, RADIO } = require("../constants/answerTypes");

describe("Migration: set repeating individual answers fields", () => {
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

  it("should set fields if they are undefined for basic answer", () => {
    const result = upateRepeatingIndividualAnswersFields(questionnaire);

    expect(
      result.sections[0].folders[0].pages[0].answers[0].repeatingLabelAndInput
    ).toBe(false);
    expect(
      result.sections[0].folders[0].pages[0].answers[0]
        .repeatingLabelAndInputListId
    ).toBe("");
  });

  it("should not set fields if they are undefined for non basic answer", () => {
    questionnaire.sections[0].folders[0].pages[0].answers[0] = {
      type: RADIO,
    };

    const result = upateRepeatingIndividualAnswersFields(questionnaire);

    expect(
      result.sections[0].folders[0].pages[0].answers[0].repeatingLabelAndInput
    ).toBe(undefined);
    expect(
      result.sections[0].folders[0].pages[0].answers[0]
        .repeatingLabelAndInputListId
    ).toBe(undefined);
  });
});

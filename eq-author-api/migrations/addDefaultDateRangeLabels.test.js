const addDefaultDateRangeLabels = require("./addDefaultDateRangeLabels");
const { DATE_RANGE, NUMBER } = require("../constants/answerTypes");

describe("addDefaultDateRangeLabels", () => {
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
                      type: DATE_RANGE,
                      label: null,
                      secondaryLabel: undefined,
                    },
                    {
                      type: DATE_RANGE,
                      label: "From",
                      secondaryLabel: "To",
                    },
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

  it("should set empty string default values when DateRange labels are nullish", () => {
    const result = addDefaultDateRangeLabels(questionnaire);

    expect(result.sections[0].folders[0].pages[0].answers[0]).toMatchObject({
      label: "",
      secondaryLabel: "",
    });
  });

  it("should not change existing DateRange labels", () => {
    const result = addDefaultDateRangeLabels(questionnaire);

    expect(result.sections[0].folders[0].pages[0].answers[1]).toMatchObject({
      label: "From",
      secondaryLabel: "To",
    });
  });

  it("should not modify non-DateRange answers", () => {
    const result = addDefaultDateRangeLabels(questionnaire);

    expect(result.sections[0].folders[0].pages[0].answers[2]).toEqual({
      type: NUMBER,
    });
  });
});

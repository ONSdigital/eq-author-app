const updateCalculatedSummary = require("./updateCalculatedSummary");

describe("Migration: set missing Contact Details", () => {
  let questionnaire;
  beforeEach(() => {
    questionnaire = {
      sections: [
        {
          folders: [
            {
              pages: [
                {
                  pageType: "CalculatedSummaryPage",
                  type: "Currency",
                  totalTitle: "Test Total",
                },
              ],
            },
          ],
        },
      ],
    };
  });

  it("should add an answer to calulated summary", () => {
    const result = updateCalculatedSummary(questionnaire);
    expect(result.sections[0].folders[0].pages[0].answers.length).toEqual(1);
    expect(result.sections[0].folders[0].pages[0].answers[0].label).toEqual(
      "Test Total"
    );
    expect(result.sections[0].folders[0].pages[0].answers[0].type).toEqual(
      "Currency"
    );
  });
});

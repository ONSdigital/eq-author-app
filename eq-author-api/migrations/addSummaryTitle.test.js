const addSummaryTitle = require("./addSummaryTitle");

describe("addSummaryTitle", () => {
  let questionnaire;
  beforeEach(() => {
    questionnaire = {
      sections: [
        {
          id: "section1",
        },
        {
          id: "section2",
          summaryTitle: "section 2",
        },
      ],
    };
  });

  it("should add summarytitle if it doesn't exist", () => {
    expect(addSummaryTitle(questionnaire)).toMatchObject({
      sections: [
        {
          id: "section1",
          summaryTitle: null,
        },
        {
          id: "section2",
          summaryTitle: "section 2",
        },
      ],
    });
  });
});

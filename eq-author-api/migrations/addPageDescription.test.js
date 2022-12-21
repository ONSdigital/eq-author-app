const addPageDescription = require("./addPageDescription");

describe("adding pageDescription to sections and pages", () => {
  let questionnaire;
  beforeEach(() => {
    questionnaire = {
      sections: [
        {
          id: "section1",
          folders: [
            {
              pages: [
                {
                  pageType: "CalculatedSummaryPage",
                },
              ],
            },
          ],
        },
        {
          id: "section2",
          folders: [
            {
              pages: [
                {
                  pageType: "CalculatedSummaryPage",
                  pageDescription: "Page level page title",
                },
              ],
            },
          ],
        },
      ],
    };
  });

  it("should add pageDescription: null to each section if it doesn't exist", () => {
    expect(addPageDescription(questionnaire)).toMatchObject({
      sections: [
        {
          id: "section1",
          pageDescription: null,
        },
        {
          id: "section2",
          pageDescription: null,
        },
      ],
    });
  });

  it("should not make any changes to pageDescription if it already exists in a section", () => {
    questionnaire.sections[0].pageDescription = "Page Title";
    expect(addPageDescription(questionnaire)).toMatchObject({
      sections: [
        {
          id: "section1",
          pageDescription: "Page Title",
        },
        {
          id: "section2",
          pageDescription: null,
        },
      ],
    });
  });

  it("should have a pageDescription, and it should be null", () => {
    const update = addPageDescription(questionnaire);
    expect(update.sections[0].folders[0].pages[0].pageDescription).toBeNull();
  });

  it("should keep existing pageDescription values", () => {
    const update = addPageDescription(questionnaire);
    expect(update.sections[1].folders[0].pages[0].pageDescription).toBe(
      "Page level page title"
    );
  });
});

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
                {
                  pageType: "ListCollectorPage",
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
                {
                  pageType: "ListCollectorPage",
                  pageDescription: "Page level page title",
                  addItemPageDescription: "Add item page description",
                  anotherPageDescription: "Another page description",
                },
              ],
            },
          ],
        },
      ],
    };
  });

  it("should add pageDescription: null to each section if it doesn't exist", () => {
    const update = addPageDescription(questionnaire);
    expect(update.sections[0].pageDescription).toBeNull();
    expect(update.sections[1].pageDescription).toBeNull();
  });

  it("should not make any changes to pageDescription if it already exists in a section", () => {
    questionnaire.sections[0].pageDescription = "Section Page Title";
    const update = addPageDescription(questionnaire);
    expect(update.sections[0].pageDescription).toBe("Section Page Title");
    expect(update.sections[1].pageDescription).toBeNull();
  });

  it("should have a pageDescription, and it should be null in pages", () => {
    const update = addPageDescription(questionnaire);
    expect(update.sections[0].folders[0].pages[0].pageDescription).toBeNull();
  });

  it("should keep existing pageDescription values in pages", () => {
    const update = addPageDescription(questionnaire);
    expect(update.sections[1].folders[0].pages[0].pageDescription).toBe(
      "Page level page title"
    );
  });

  it("should have all 3 pageDescription fields, and they should be null in list collector pages", () => {
    const update = addPageDescription(questionnaire);
    expect(
      update.sections[0].folders[0].pages[1].addItemPageDescription
    ).toBeNull();
    expect(
      update.sections[0].folders[0].pages[1].anotherPageDescription
    ).toBeNull();
  });

  it("should keep existing pageDescription values for all 3 fields in list collector pages", () => {
    const update = addPageDescription(questionnaire);
    expect(update.sections[1].folders[0].pages[1].pageDescription).toBe(
      "Page level page title"
    );
    expect(update.sections[1].folders[0].pages[1].addItemPageDescription).toBe(
      "Add item page description"
    );
    expect(update.sections[1].folders[0].pages[1].anotherPageDescription).toBe(
      "Another page description"
    );
  });
});

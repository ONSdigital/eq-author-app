const convertSectionPageDescription = require("./convertSectionPageDescription");

describe("convertSectionPageDescription", () => {
  let questionnaire;

  beforeEach(() => {
    questionnaire = {
      sections: [
        {
          id: "section-1",
          pageDescription: "Section 1 description",
        },
        {
          id: "section-2",
          pageDescription: "Section 2 description",
        },
      ],
    };
  });

  it("should set sectionSummaryPageDescription value to section's pageDescription value and delete pageDescription value", () => {
    const updatedQuestionnaire = convertSectionPageDescription(questionnaire);

    expect(
      updatedQuestionnaire.sections[0].sectionSummaryPageDescription
    ).toEqual("Section 1 description");
    expect(updatedQuestionnaire.sections[0].pageDescription).toBeUndefined();

    expect(
      updatedQuestionnaire.sections[1].sectionSummaryPageDescription
    ).toEqual("Section 2 description");
    expect(updatedQuestionnaire.sections[1].pageDescription).toBeUndefined();
  });
});

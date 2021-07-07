const addSectionHubSettings = require("./addSectionHubSettings");

describe("addSectionHubSettings", () => {
  let questionnaire;
  beforeEach(() => {
    questionnaire = {
      sections: [
        {
          id: "section1",
        },
        {
          id: "section2",
        }
      ],
    };
  });

  it("should add requiredCompleted: false and showOnHub: true to each section if they don't exist", () => {
    expect(addSectionHubSettings(questionnaire)).toMatchObject({
        sections: [
          {
          id: "section1",
          requiredCompleted: false,
          showOnHub: true,
        },
        {
          id: "section2",
          requiredCompleted: false,
          showOnHub: true,
        }
      ]
    });
  });

  it("should not make any changes to requiredCompleted or showOnHub if they already exist in a section", () => {
    questionnaire.sections[0].requiredCompleted = true;
    questionnaire.sections[0].showOnHub = false;
    expect(addSectionHubSettings(questionnaire)).toMatchObject({
        sections: [
          {
          id: "section1",
          requiredCompleted: true,
          showOnHub: false,
        },
        {
          id: "section2",
          requiredCompleted: false,
          showOnHub: true,
        }
      ]
    });
  });

  
});

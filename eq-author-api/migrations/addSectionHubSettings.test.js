const { get } = require("lodash");
const addSectionHubSettings = require("./addSectionHubSettings");

describe("addOptionalFieldProperties", () => {
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

  it("should enable optional field when description has content", () => {

    expect(addSectionHubSettings(questionnaire)).toMatchObject({
      // questionnaire: {
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

  
});

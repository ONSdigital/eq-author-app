const updateEnabledHub = require("./updateEnabledHub");

describe("enableHub", () => {
  let questionnaire = {};
  beforeEach(() => {
    process.env.FEATURE_FLAGS = "hub";
    questionnaire = {
      id: "aca64645-98ef-43ae-8b77-d749b4e89a05",
      title: "laa",
      theme: "default",
      hub: false,
      navigation: false,
      metadata: [],
      sections: [
        {
          id: "section1",
        },
        {
          id: "section2",
        },
      ],
    };
  });

  it("should enable hub when there is more than section", () => {
    expect(updateEnabledHub(questionnaire).hub).toEqual(true);
  });
});

describe("disabledHub", () => {
  let questionnaire = {};
  beforeEach(() => {
    process.env.FEATURE_FLAGS = "hub";
    questionnaire = {
      id: "aca64645-98ef-43ae-8b77-d749b4e89a05",
      title: "laa",
      theme: "default",
      hub: true,
      navigation: false,
      metadata: [],
      sections: [
        {
          id: "section1",
        },
      ],
    };
  });

  it("shouldn't enable hub when there is only one section", () => {
    expect(updateEnabledHub(questionnaire).hub).toEqual(false);
  });
});

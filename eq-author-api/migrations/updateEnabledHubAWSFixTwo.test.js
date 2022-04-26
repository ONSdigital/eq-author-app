const updateEnabledHubAWSFixTwo = require("./updateEnabledHubAWSFixTwo");

describe("AWS", () => {
  let questionnaire = {};
  beforeEach(() => {
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
        {
          id: "section2",
        },
      ],
    };
  });

  it("should disable hub when in AWS", () => {
    expect(updateEnabledHubAWSFixTwo(questionnaire).hub).toEqual(false);
  });
});

describe("GCP", () => {
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
        {
          id: "section2",
        },
      ],
    };
  });

  it("should set hub to true", () => {
    expect(updateEnabledHubAWSFixTwo(questionnaire).hub).toEqual(true);
  });
});

describe("GCP - One section", () => {
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

  it("should set hub to true", () => {
    expect(updateEnabledHubAWSFixTwo(questionnaire).hub).toEqual(false);
  });
});

const updateEnabledHubAWSFix = require("./updateEnabledHubAWSFix");

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
    expect(updateEnabledHubAWSFix(questionnaire)).not.toHaveProperty("hub");
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

  it("should leave hub when in GCP", () => {
    expect(updateEnabledHubAWSFix(questionnaire)).toHaveProperty("hub");
  });

  it("should set hub to true", () => {
    expect(updateEnabledHubAWSFix(questionnaire).hub).toEqual(true);
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

  it("should leave hub when in GCP", () => {
    expect(updateEnabledHubAWSFix(questionnaire)).toHaveProperty("hub");
  });

  it("should set hub to true", () => {
    expect(updateEnabledHubAWSFix(questionnaire).hub).toEqual(false);
  });
});

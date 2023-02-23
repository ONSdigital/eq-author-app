const surveyDetails = require("./questionnaireEvents").surveyDetails;

describe("SurveyDetails", () => {
  let details, extraDetails;
  let bodyText = "<p>bodyText</p>";
  let publishDetails = [
    {
      surveyId: "ID_1",
      formType: "ONS_1",
      variants: [
        {
          language: "en",
          theme: "business",
          authorId: "77df029c-a3ab-4451-8ef5-6a265f0f1b6d",
        },
      ],
    },
  ];

  it("Should contain one form type", () => {
    details = surveyDetails(publishDetails, bodyText);
    expect(details).toContain("Form type");
    expect(details).not.toContain("NI_1");
    expect(details).toContain("ONS_1");
  });

  it("Should contain survey ID", () => {
    details = surveyDetails(publishDetails, bodyText);
    expect(details).toContain("ID_1");
  });

  describe("Multiple form types", () => {
    extraDetails = {
      surveyId: "ID_1",
      formType: "NI_1",
      variants: [
        {
          language: "en",
          theme: "northernireland",
          authorId: "77df029c-a3ab-4451-8ef5-6a265f0f1b6d",
        },
      ],
    };

    const extra = [...publishDetails, extraDetails];

    beforeEach(() => {
      details = surveyDetails(extra, bodyText);
    });

    it("Should contain both form types", () => {
      expect(details).toContain("Form types");
      expect(details).toContain("ONS_1");
      expect(details).toContain("NI_1");
    });

    it("Should contain bodyText", () => {
      expect(details).toMatch("bodyText");
      expect(details).toContain("div");
      expect(details).toContain("<p>");
    });

    it("Should not contain bodyText", () => {
      details = surveyDetails(extra, "");
      expect(details).not.toContain(bodyText);
      expect(details).not.toContain("div");
    });
  });
});

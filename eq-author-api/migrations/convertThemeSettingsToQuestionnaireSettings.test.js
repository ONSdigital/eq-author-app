const convertThemeSettingsToQuestionnaireSettings = require("./convertThemeSettingsToQuestionnaireSettings");

describe("convertThemeSettingsToQuestionnaireSettings", () => {
  const questionnaire = {
    id: "test-questionnaire",
    surveyId: "123",
    themeSettings: {
      previewTheme: "business",
      themes: [
        {
          id: "business",
          shortName: "business",
          formType: "1234",
          eqId: "test-business-eq-id",
          legalBasisCode: "NOTICE_2",
          enabled: true,
        },
        {
          id: "social",
          shortName: "social",
          formType: "5678",
          eqId: "test-social-eq-id",
          legalBasisCode: "NOTICE_3",
          enabled: true,
        },
      ],
    },
  };

  it("should convert themeSettings for previewTheme to questionnaire settings format", () => {
    const updatedQuestionnaire =
      convertThemeSettingsToQuestionnaireSettings(questionnaire);

    expect(updatedQuestionnaire.theme).toBe("business");
    expect(updatedQuestionnaire.surveyId).toBe("123");
    expect(updatedQuestionnaire.formType).toBe("1234");
    expect(updatedQuestionnaire.eqId).toBe("test-business-eq-id");
    expect(updatedQuestionnaire.legalBasis).toBe("NOTICE_2");

    expect(updatedQuestionnaire.themeSettings).toBeUndefined();
  });
});

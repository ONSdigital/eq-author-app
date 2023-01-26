const updateUKIStoBEISTheme = require("./updateDefaultToBusinessTheme");

describe("updateDefaultThemes", () => {
  it("should update default theme", () => {
    const questionnaire = {
      themeSettings: {
        id: "1",
        previewTheme: "default",
        themes: [
          {
            enabled: true,
            shortName: "default",
            legalBasisCode: "VOLUNTARY",
            eqId: "123",
            formType: "1234",
            id: "default",
          },
        ],
      },
    };

    const updatedTheme = updateUKIStoBEISTheme(questionnaire);
    expect(updatedTheme.themeSettings.themes[0].shortName).toBe("business");
    expect(updatedTheme.themeSettings.themes[0].id).toBe("business");
    expect(updatedTheme.themeSettings.previewTheme).toBe("business");
  });
});

const updateUKISEPEThemes = require("./updateUKISEPEThemes");

describe("updateUKISEPEThemes", () => {
  it("should update UKIS theme", () => {
    const questionnaire = {
      themeSettings: {
        id: "1",
        previewTheme: "ukisni",
        themes: [
          {
            enabled: true,
            shortName: "ukisni",
            legalBasisCode: "VOLUNTARY",
            eqId: "123",
            formType: "1234",
            id: "ukisni",
          },
        ],
      },
    };

    expect(
      updateUKISEPEThemes(questionnaire).themeSettings.themes[0].shortName
    ).toBe("ukis_ni");
    expect(updateUKISEPEThemes(questionnaire).themeSettings.themes[0].id).toBe(
      "ukis_ni"
    );
    expect(updateUKISEPEThemes(questionnaire).themeSettings.previewTheme).toBe(
      "ukis_ni"
    );
  });
});

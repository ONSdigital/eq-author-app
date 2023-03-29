const updateUKIStoBEISTheme = require("./updateUKIStoBEISTheme");

describe("updateUKISThemes", () => {
  it("should update UKIS theme", () => {
    const questionnaire = {
      themeSettings: {
        id: "1",
        previewTheme: "ukis",
        themes: [
          {
            enabled: true,
            shortName: "ukis",
            legalBasisCode: "VOLUNTARY",
            eqId: "123",
            formType: "1234",
            id: "ukis",
          },
        ],
      },
    };

    const updatedTheme = updateUKIStoBEISTheme(questionnaire);
    expect(updatedTheme.themeSettings.themes[0].shortName).toBe("dbt");
    expect(updatedTheme.themeSettings.themes[0].id).toBe("dbt");
    expect(updatedTheme.themeSettings.previewTheme).toBe("dbt");
  });

  it("should update UKIS NI theme", () => {
    const questionnaire = {
      themeSettings: {
        id: "1",
        previewTheme: "ukis_ni",
        themes: [
          {
            enabled: true,
            shortName: "ukis_ni",
            legalBasisCode: "VOLUNTARY",
            eqId: "123",
            formType: "1234",
            id: "ukis_ni",
          },
        ],
      },
    };

    const updatedTheme = updateUKIStoBEISTheme(questionnaire);
    expect(updatedTheme.themeSettings.themes[0].shortName).toBe("dbt_ni");
    expect(updatedTheme.themeSettings.themes[0].id).toBe("dbt_ni");
    expect(updatedTheme.themeSettings.previewTheme).toBe("dbt_ni");
  });
});

const updateUKIStoBEISTheme = require("./updateUKIStoBEISTheme");

describe("updateBEISThemes", () => {
  it("should update BEIS theme", () => {
    const questionnaire = {
      themeSettings: {
        id: "1",
        previewTheme: "beis",
        themes: [
          {
            enabled: true,
            shortName: "beis",
            legalBasisCode: "VOLUNTARY",
            eqId: "123",
            formType: "1234",
            id: "beis",
          },
        ],
      },
    };

    const updatedTheme = updateUKIStoBEISTheme(questionnaire);
    expect(updatedTheme.themeSettings.themes[0].shortName).toBe("dbt");
    expect(updatedTheme.themeSettings.themes[0].id).toBe("dbt");
    expect(updatedTheme.themeSettings.previewTheme).toBe("dbt");
  });

  it("should update BEIS NI theme", () => {
    const questionnaire = {
      themeSettings: {
        id: "1",
        previewTheme: "beis_ni",
        themes: [
          {
            enabled: true,
            shortName: "beis_ni",
            legalBasisCode: "VOLUNTARY",
            eqId: "123",
            formType: "1234",
            id: "beis_ni",
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

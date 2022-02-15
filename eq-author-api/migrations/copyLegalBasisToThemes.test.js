const copyLegalBasisToThemes = require("./copyLegalBasisToThemes");

describe("Migration: copy legal basis to themes", () => {
  it("should copy old-style global legal basis into all previously enabled themes", () => {
    const questionnaire = {
      introduction: {
        legalBasis: "VOLUNTARY",
      },
      themeSettings: {
        previewTheme: "default",
        themes: [
          {
            title: "GB theme",
            shortName: "default",
            enabled: true,
          },
          {
            title: "NI theme",
            shortName: "northernireland",
            enabled: false,
          },
          {
            title: "UKIS theme",
            shortName: "ukis",
            enabled: true,
          },
        ],
      },
    };

    const migratedThemes =
      copyLegalBasisToThemes(questionnaire).themeSettings.themes;

    for (const theme of migratedThemes) {
      expect(theme.legalBasisCode).toBe(questionnaire.introduction.legalBasis);
    }
  });
});

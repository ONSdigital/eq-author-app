const addThemeSettings = require("./addThemeSettings");

const themes = [
  {
    id: "default",
    shortName: "default",
    enabled: true,
    legalBasisCode: "NOTICE_1",
    eqId: "",
    formType: "",
  },
];

const previewTheme = "default";

describe("migrations: add theme settings structure", () => {
  it("shouldn't modify a questionnaire which already has theme settings", () => {
    const questionnaire = {
      themeSettings: {
        id: "ts-1",
        previewTheme,
        themes,
      },
    };

    expect(addThemeSettings({ ...questionnaire })).toMatchObject(questionnaire);
  });

  it("should migrate theme & previewTheme on root into ThemeSettings structure", () => {
    const questionnaire = {
      previewTheme,
      themes,
    };

    const migratedQuestionnaire = addThemeSettings(questionnaire);

    expect(migratedQuestionnaire).toMatchObject({
      themeSettings: {
        id: expect.any(String),
        previewTheme,
        themes,
      },
    });

    expect(migratedQuestionnaire).not.toHaveProperty("themes");
    expect(migratedQuestionnaire).not.toHaveProperty("previewTheme");
  });
});

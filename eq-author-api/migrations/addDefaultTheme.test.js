const addDefaultTheme = require("./addDefaultTheme");

describe("migrations: add default theme", () => {
  it("shouldn't modify a questionnaire which already has theme information", () => {
    const questionnaire = {
      themes: [{ shortName: "default", id: "qwerty" }],
      previewTheme: "default",
    };

    expect(addDefaultTheme(questionnaire)).toMatchObject(questionnaire);
  });

  it("should add default theme information to business questionnaires lacking it", () => {
    const questionnaire = { introduction: {} };

    expect(addDefaultTheme(questionnaire)).toMatchObject({
      previewTheme: "default",
      themes: [
        expect.objectContaining({
          id: expect.any(String),
          shortName: "default",
          enabled: true,
          legalBasisCode: expect.any(String),
          eqId: "",
          formType: "",
        }),
      ],
    });
  });

  it("should use the existing legal basis when making a new theme", () => {
    const legalBasis = "NOTICE_2";
    const questionnaire = {
      introduction: { legalBasis },
    };

    expect(addDefaultTheme(questionnaire)).toMatchObject({
      introduction: { legalBasis },
      previewTheme: "default",
      themes: [
        expect.objectContaining({
          id: expect.any(String),
          shortName: "default",
          enabled: true,
          legalBasisCode: legalBasis,
          eqId: "",
          formType: "",
        }),
      ],
    });
  });

  it("should give social surveys the social theme by default", () => {
    const questionnaire = {}; // Look ma, no intro

    expect(addDefaultTheme(questionnaire)).toMatchObject({
      previewTheme: "social",
      themes: [
        expect.objectContaining({
          shortName: "social",
        }),
      ],
    });
  });
});

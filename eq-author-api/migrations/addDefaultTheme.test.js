const addDefaultTheme = require("./addDefaultTheme");

describe("migrations: add default theme", () => {
  it("shouldn't modify a questionnaire which already has theme information", () => {
    const questionnaire = {
      themes: [{ shortName: "default", id: "qwerty" }],
      previewTheme: "default",
    };

    expect(addDefaultTheme(questionnaire)).toMatchObject(questionnaire);
  });

  it("should add default theme information to questionnaires lacking it", () => {
    const questionnaire = {};

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
});

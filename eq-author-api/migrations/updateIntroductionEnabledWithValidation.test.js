const updateIntroductionEnabledWithValidation = require("./updateIntroductionEnabledWithValidation");

describe("updateIntroductionEnabledWithValidation", () => {
  let questionnaire;

  beforeEach(() => {
    questionnaire = {
      sections: [
        {
          id: "section-1",
          introductionEnabled: false,
        },
        {
          id: "section-2",
          introductionEnabled: false,
        },
      ],
    };
  });

  it("should set introductionEnabled to true when section introductionTitle is truthy", () => {
    questionnaire.sections[0].introductionTitle =
      "Section 1 introduction title";

    // Test introductionTitle has been defined
    expect(questionnaire.sections[0].introductionTitle).toEqual(
      "Section 1 introduction title"
    );

    const updatedQuestionnaire =
      updateIntroductionEnabledWithValidation(questionnaire);

    // Test introductionTitle is defined after migration has run
    expect(updatedQuestionnaire.sections[0].introductionTitle).toEqual(
      "Section 1 introduction title"
    );
    expect(updatedQuestionnaire.sections[0].introductionEnabled).toBe(true);
    expect(updatedQuestionnaire.sections[1].introductionEnabled).toBe(false);
  });

  it("should set introductionEnabled to true when section introductionContent is truthy", () => {
    questionnaire.sections[0].introductionContent =
      "Section 1 introduction content";

    // Test introductionContent has been defined
    expect(questionnaire.sections[0].introductionContent).toEqual(
      "Section 1 introduction content"
    );

    const updatedQuestionnaire =
      updateIntroductionEnabledWithValidation(questionnaire);

    // Test introductionContent is defined after migration has run
    expect(updatedQuestionnaire.sections[0].introductionContent).toEqual(
      "Section 1 introduction content"
    );
    expect(updatedQuestionnaire.sections[0].introductionEnabled).toBe(true);
    expect(updatedQuestionnaire.sections[1].introductionEnabled).toBe(false);
  });

  it("should not set introductionEnabled to true when section introductionTitle is empty string", () => {
    questionnaire.sections[0].introductionTitle = "";

    // Test introductionContent has been defined
    expect(questionnaire.sections[0].introductionTitle).toEqual("");

    const updatedQuestionnaire =
      updateIntroductionEnabledWithValidation(questionnaire);

    // Test introductionContent is defined after migration has run
    expect(updatedQuestionnaire.sections[0].introductionTitle).toEqual("");
    expect(updatedQuestionnaire.sections[0].introductionEnabled).toBe(false);
    expect(updatedQuestionnaire.sections[1].introductionEnabled).toBe(false);
  });

  it("should not set introductionEnabled to true when section introductionContent is empty string", () => {
    questionnaire.sections[0].introductionContent = "";

    // Test introductionContent has been defined
    expect(questionnaire.sections[0].introductionContent).toEqual("");

    const updatedQuestionnaire =
      updateIntroductionEnabledWithValidation(questionnaire);

    // Test introductionContent is defined after migration has run
    expect(updatedQuestionnaire.sections[0].introductionContent).toEqual("");
    expect(updatedQuestionnaire.sections[0].introductionEnabled).toBe(false);
    expect(updatedQuestionnaire.sections[1].introductionEnabled).toBe(false);
  });

  it("should set introductionTitle to empty string when section introductionTitle is null", () => {
    questionnaire.sections[0].introductionTitle = null;

    expect(questionnaire.sections[0].introductionTitle).toBeNull();

    const updatedQuestionnaire =
      updateIntroductionEnabledWithValidation(questionnaire);

    expect(updatedQuestionnaire.sections[0].introductionTitle).not.toBeNull();
    expect(updatedQuestionnaire.sections[0].introductionTitle).toEqual("");
    expect(updatedQuestionnaire.sections[0].introductionEnabled).toBe(false);
    expect(updatedQuestionnaire.sections[1].introductionEnabled).toBe(false);
  });

  it("should set introductionContent to empty string when section introductionContent is null", () => {
    questionnaire.sections[0].introductionContent = null;

    expect(questionnaire.sections[0].introductionContent).toBeNull();

    const updatedQuestionnaire =
      updateIntroductionEnabledWithValidation(questionnaire);

    expect(updatedQuestionnaire.sections[0].introductionContent).not.toBeNull();
    expect(updatedQuestionnaire.sections[0].introductionContent).toEqual("");
    expect(updatedQuestionnaire.sections[0].introductionEnabled).toBe(false);
    expect(updatedQuestionnaire.sections[1].introductionEnabled).toBe(false);
  });
});

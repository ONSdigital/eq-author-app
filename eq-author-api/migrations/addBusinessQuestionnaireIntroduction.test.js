const { cloneDeep } = require("lodash");

const { SOCIAL, BUSINESS } = require("../constants/questionnaireTypes");

const addBusinessQuestionnaireIntroduction = require("./addBusinessQuestionnaireIntroduction.js");

describe("addBusinessQuestionnaireIntroduction", () => {
  it("should be deterministic", () => {
    const questionnaire = {
      type: BUSINESS,
      metadata: [],
    };

    expect(
      addBusinessQuestionnaireIntroduction(cloneDeep(questionnaire))
    ).toMatchObject(
      addBusinessQuestionnaireIntroduction(cloneDeep(questionnaire))
    );
  });

  it("should not touch social", () => {
    const questionnaire = {
      type: SOCIAL,
    };

    expect(addBusinessQuestionnaireIntroduction(questionnaire)).toEqual(
      questionnaire
    );
  });

  it("should add missing default metadata", () => {
    const questionnaire = {
      type: BUSINESS,
      metadata: [
        {
          key: "ru_name",
          alias: "Ru Name",
          type: "Text",
          value: "ESSENTIAL ENTERPRISE LTD.",
        },
      ],
    };

    expect(
      addBusinessQuestionnaireIntroduction(questionnaire).metadata.map(
        (md) => md.key
      )
    ).toEqual([
      "ru_name",
      "trad_as",
      "period_id",
      "ref_p_start_date",
      "ref_p_end_date",
    ]);
  });
});

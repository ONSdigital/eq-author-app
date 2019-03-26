const { SOCIAL, BUSINESS } = require("../constants/questionnaireTypes");

const addQuestionnaireType = require("./addQuestionnaireType.js");

describe("addQuestionnaireType", () => {
  it("should set the questionnaire type to social when unset", () => {
    const questionnaire = addQuestionnaireType({});
    expect(questionnaire.type).toEqual(SOCIAL);
  });

  it("should do nothing when the type is already set", () => {
    const questionnaire = addQuestionnaireType({ type: BUSINESS });
    expect(questionnaire.type).toEqual(BUSINESS);
  });
});

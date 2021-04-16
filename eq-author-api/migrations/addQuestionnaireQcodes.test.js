const addQuestionnaireQcodes = require("./addQuestionnaireQcodes");

describe("addQuestionnaireQcodes", () => {
  it("should set qcodes value to true when no qcodes value is set", () => {
    const questionnaire = {};

    expect(addQuestionnaireQcodes(questionnaire).qcodes).toBe(true);
  });

  it("should not set qcodes value when qcodes value is true", () => {
    const questionnaire = { qcodes: true };

    expect(addQuestionnaireQcodes(questionnaire).qcodes).toBe(true);
  });

  it("should not set qcodes value when qcodes value is false", () => {
    const questionnaire = { qcodes: false };

    expect(addQuestionnaireQcodes(questionnaire).qcodes).toBe(false);
  });
});

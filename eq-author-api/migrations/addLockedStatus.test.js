const addLockedStatus = require("./addLockedStatus");

describe("Migration: add lock status", () => {
  it("should add 'false' locked status to questionnaires lacking it", () => {
    const questionnaire = {};
    expect(addLockedStatus(questionnaire).locked).toBe(false);
  });
  it("should not change questionnaires with existing locked status", () => {
    const questionnaire = { locked: true };
    expect(addLockedStatus(questionnaire)).toEqual(questionnaire);
    questionnaire.locked = false;
    expect(addLockedStatus(questionnaire)).toEqual(questionnaire);
  });
});

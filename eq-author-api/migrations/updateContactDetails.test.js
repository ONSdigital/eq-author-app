const updateContactDetails = require("./updateContactDetails");

describe("Migration: set missing Contact Details", () => {
  let questionnaire;
  beforeEach(() => {
    questionnaire = {
      introduction: {
        id: "1",
      },
    };
  });

  it("should add missing defaults for Contact Details", () => {
    const result = updateContactDetails(questionnaire);
    expect(result.introduction.contactDetailsPhoneNumber).toEqual("0300 1234 931");
    expect(result.introduction.contactDetailsEmailAddress).toEqual("surveys@ons.gov.uk");
    expect(result.introduction.contactDetailsEmailSubject).toEqual("Change of details");
    expect(result.introduction.contactDetailsIncludeRuRef).toBe(true);
  });

});

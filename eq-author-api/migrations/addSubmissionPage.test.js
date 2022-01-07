const addSubmissionPage = require("./addSubmissionPage");

describe("addSubmissionPage", () => {
  it("should add submission page when questionnaire does not have submission page", () => {
    const questionnaire = {};

    expect(addSubmissionPage(questionnaire).submission).toBeInstanceOf(Object);
  });

  it("should not add submission page when questionnaire has submission page", () => {
    const questionnaire = {
      submission: {
        id: "1",
      },
    };

    expect(addSubmissionPage(questionnaire).submission.id).toBe("1");
  });
});

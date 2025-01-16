const removeConfirmationPageQCodes = require("./removeConfirmationPageQCodes");

describe("removeConfirmationPageQCodes", () => {
  it("should remove qCode from confirmation pages", () => {
    const questionnaire = {
      sections: [
        {
          id: "section-1",
          folders: [
            {
              id: "folder-1",
              pages: [
                {
                  id: "page-1",
                  confirmation: {
                    id: "confirmation-page-1",
                    qCode: "123",
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const result = removeConfirmationPageQCodes(questionnaire);

    expect(
      result.sections[0].folders[0].pages[0].confirmation.qCode
    ).toBeUndefined();
  });

  it("should not remove qCode from answers", () => {
    const questionnaire = {
      sections: [
        {
          id: "section-1",
          folders: [
            {
              id: "folder-1",
              pages: [
                {
                  id: "page-1",
                  answers: [
                    {
                      id: "answer-1",
                      qCode: "123",
                    },
                  ],
                  confirmation: {
                    id: "confirmation-page-1",
                    qCode: "123",
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const result = removeConfirmationPageQCodes(questionnaire);

    expect(
      result.sections[0].folders[0].pages[0].confirmation.qCode
    ).toBeUndefined();
    expect(result.sections[0].folders[0].pages[0].answers[0].qCode).toBe("123");
  });

  it("should not amend questionnaire data if the questionnaire does not contain any confirmation pages", () => {
    const questionnaire = {
      sections: [
        {
          id: "section-1",
          folders: [
            {
              id: "folder-1",
              pages: [
                {
                  id: "page-1",
                  answers: [
                    {
                      id: "answer-1",
                      qCode: "123",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const result = removeConfirmationPageQCodes(questionnaire);

    expect(result.sections[0].folders[0].pages[0].answers[0].qCode).toBe("123");
    expect(result).toEqual(questionnaire);
  });

  it("should not amend questionnaire data if the questionnaire does not contain any qCodes", () => {
    const questionnaire = {
      sections: [
        {
          id: "section-1",
          folders: [
            {
              id: "folder-1",
              pages: [
                {
                  id: "page-1",
                  answers: [
                    {
                      id: "answer-1",
                    },
                  ],
                  confirmation: {
                    id: "confirmation-page-1",
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const result = removeConfirmationPageQCodes(questionnaire);

    expect(result).toEqual(questionnaire);
  });
});

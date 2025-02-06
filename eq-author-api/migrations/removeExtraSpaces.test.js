const removeExtraSpaces = require("./removeExtraSpaces");

describe("removeExtraSpaces", () => {
  describe("Questionnaire", () => {
    it("should remove extra spaces from questionnaire title", () => {
      const questionnaire = { title: "  Test  questionnaire  title  " };
      const questionnaireWithoutExtraSpaces = removeExtraSpaces(questionnaire);

      expect(questionnaireWithoutExtraSpaces.title).toBe(
        "Test questionnaire title"
      );
    });
  });

  describe("Section", () => {
    it("should remove extra spaces from section title", () => {
      const questionnaire = {
        title: "Questionnaire title",
        sections: [{ title: "  Test  section  title  " }],
      };

      const questionnaireWithoutExtraSpaces = removeExtraSpaces(questionnaire);
      expect(questionnaireWithoutExtraSpaces.sections[0].title).toBe(
        "Test section title"
      );
    });
  });

  describe("Folder", () => {
    it("should remove extra spaces from folder title", () => {
      const questionnaire = {
        title: "Questionnaire title",
        sections: [
          {
            listId: "list-1",
            title: "Section title",
            folders: [{ title: "  Test  folder  title  " }],
          },
        ],
      };

      const questionnaireWithoutExtraSpaces = removeExtraSpaces(questionnaire);
      expect(questionnaireWithoutExtraSpaces.sections[0].folders[0].title).toBe(
        "Test folder title"
      );
    });
  });

  describe("Page", () => {
    it("should remove extra spaces from page title", () => {
      const questionnaire = {
        title: "Questionnaire title",
        sections: [
          {
            title: "Section title",
            folders: [
              {
                title: "Folder title",
                pages: [
                  {
                    title: "  Test  page  title  ",
                  },
                ],
              },
            ],
          },
        ],
      };

      const questionnaireWithoutExtraSpaces = removeExtraSpaces(questionnaire);
      expect(
        questionnaireWithoutExtraSpaces.sections[0].folders[0].pages[0].title
      ).toBe("Test page title");
    });

    it("should remove extra spaces from page guidance", () => {
      const questionnaire = {
        title: "Questionnaire title",
        sections: [
          {
            title: "Section title",
            folders: [
              {
                title: "Folder title",
                pages: [
                  {
                    guidance: "  Test  page  guidance  ",
                  },
                ],
              },
            ],
          },
        ],
      };

      const questionnaireWithoutExtraSpaces = removeExtraSpaces(questionnaire);
      expect(
        questionnaireWithoutExtraSpaces.sections[0].folders[0].pages[0].guidance
      ).toBe("Test page guidance");
    });

    it("should remove extra spaces from page description", () => {
      const questionnaire = {
        title: "Questionnaire title",
        sections: [
          {
            title: "Section title",
            folders: [
              {
                title: "Folder title",
                pages: [
                  {
                    description: "  Test  description  ",
                  },
                ],
              },
            ],
          },
        ],
      };

      const questionnaireWithoutExtraSpaces = removeExtraSpaces(questionnaire);
      expect(
        questionnaireWithoutExtraSpaces.sections[0].folders[0].pages[0]
          .description
      ).toBe("Test description");
    });

    it("should remove extra spaces from page additionalInfoContent", () => {
      const questionnaire = {
        title: "Questionnaire title",
        sections: [
          {
            title: "Section title",
            folders: [
              {
                title: "Folder title",
                pages: [
                  {
                    additionalInfoContent: "  Test  page  additional info  ",
                  },
                ],
              },
            ],
          },
        ],
      };

      const questionnaireWithoutExtraSpaces = removeExtraSpaces(questionnaire);
      expect(
        questionnaireWithoutExtraSpaces.sections[0].folders[0].pages[0]
          .additionalInfoContent
      ).toBe("Test page additional info");
    });
  });

  describe("Answer", () => {
    it("should remove extra spaces from answer label", () => {
      const questionnaire = {
        title: "Questionnaire title",
        sections: [
          {
            title: "Section title",
            folders: [
              {
                title: "Folder title",
                pages: [
                  {
                    title: "Page title",
                    answers: [
                      {
                        label: "  Test  answer  label  ",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const questionnaireWithoutExtraSpaces = removeExtraSpaces(questionnaire);
      expect(
        questionnaireWithoutExtraSpaces.sections[0].folders[0].pages[0]
          .answers[0].label
      ).toBe("Test answer label");
    });

    it("should remove extra spaces from answer guidance", () => {
      const questionnaire = {
        title: "Questionnaire title",
        sections: [
          {
            title: "Section title",
            folders: [
              {
                title: "Folder title",
                pages: [
                  {
                    title: "Page title",
                    answers: [
                      {
                        guidance: "  Test  answer  guidance  ",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const questionnaireWithoutExtraSpaces = removeExtraSpaces(questionnaire);
      expect(
        questionnaireWithoutExtraSpaces.sections[0].folders[0].pages[0]
          .answers[0].guidance
      ).toBe("Test answer guidance");
    });

    it("should remove extra spaces from answer description", () => {
      const questionnaire = {
        title: "Questionnaire title",
        sections: [
          {
            title: "Section title",
            folders: [
              {
                title: "Folder title",
                pages: [
                  {
                    title: "Page title",
                    answers: [
                      {
                        description: "  Test  answer  description  ",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const questionnaireWithoutExtraSpaces = removeExtraSpaces(questionnaire);
      expect(
        questionnaireWithoutExtraSpaces.sections[0].folders[0].pages[0]
          .answers[0].description
      ).toBe("Test answer description");
    });
  });
});

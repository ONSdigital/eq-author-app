const addFieldsToListCollectorFolderContents = require("./addFieldsToListCollectorFolderContents");

describe("addFieldsToListCollectorFolderContents", () => {
  let questionnaire;

  beforeEach(() => {
    questionnaire = {
      sections: [
        {
          id: "section-1",
          folders: [
            {
              id: "folder-1",
              listId: "list-1",
              pages: [
                {
                  id: "qualifier-page-1",
                  pageType: "ListCollectorQualifierPage",
                  answers: [
                    {
                      id: "answer-1",
                      type: "Radio",
                      options: [
                        {
                          id: "qualifier-option-positive-1",
                          description: "Qualifier positive description",
                        },
                        {
                          id: "qualifier-option-negative-1",
                          description: "Qualifier negative description",
                        },
                      ],
                    },
                  ],
                },
                {
                  id: "add-item-page-1",
                  pageType: "ListCollectorAddItemPage",
                  pageDescription: `Add item description`,
                },
                {
                  id: "confirmation-page-1",
                  pageType: "ListCollectorConfirmationPage",
                  pageDescription: `Confirmation description`,
                  answers: [
                    {
                      id: "answer-2",
                      type: "Radio",
                      options: [
                        {
                          id: "confirmation-option-positive-1",
                          description: "Confirmation positive description",
                        },
                        {
                          id: "confirmation-option-negative-1",
                          description: "Confirmation negative description",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
  });

  describe("Titles", () => {
    it("should add title to list collector pages", () => {
      const updatedQuestionnaire =
        addFieldsToListCollectorFolderContents(questionnaire);

      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[0].title
      ).not.toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[0].title
      ).toEqual("");

      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1].title
      ).not.toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1].title
      ).toEqual("");

      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[2].title
      ).not.toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[2].title
      ).toEqual("");
    });

    it("should not change title on list collector pages if title is defined", () => {
      questionnaire.sections[0].folders[0].pages[0].title =
        "Qualifier question";
      questionnaire.sections[0].folders[0].pages[1].title = "Add item question";
      questionnaire.sections[0].folders[0].pages[2].title =
        "Confirmation question";
      const updatedQuestionnaire =
        addFieldsToListCollectorFolderContents(questionnaire);

      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[0].title
      ).not.toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[0].title
      ).toEqual("Qualifier question");

      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1].title
      ).not.toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1].title
      ).toEqual("Add item question");

      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[2].title
      ).not.toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[2].title
      ).toEqual("Confirmation question");
    });

    it("should not add title to non-list-collector pages", () => {
      questionnaire.sections[0].folders[0].pages[0].pageType = "QuestionPage";

      const updatedQuestionnaire =
        addFieldsToListCollectorFolderContents(questionnaire);

      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[0].title
      ).toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[0].title
      ).not.toEqual("");

      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1].title
      ).not.toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1].title
      ).toEqual("");

      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[2].title
      ).not.toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[2].title
      ).toEqual("");
    });

    it("should not add title to pages in non-list-collector folders", () => {
      questionnaire.sections[0].folders[1] = {
        id: "folder-2",
        pages: [
          {
            id: "page-2",
            answers: [
              {
                id: "answer-3",
                type: "Radio",
                options: [
                  {
                    id: "positive-1",
                    label: "Positive",
                    description: "Positive description",
                  },
                  {
                    id: "negative-1",
                    label: "Negative",
                    description: "Negative description",
                  },
                ],
              },
            ],
          },
        ],
      };

      const updatedQuestionnaire =
        addFieldsToListCollectorFolderContents(questionnaire);

      expect(
        updatedQuestionnaire.sections[0].folders[1].pages[0].title
      ).toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[1].pages[0].title
      ).not.toEqual("");
    });
  });

  describe("Option labels", () => {
    it("should add option labels to list collector answers", () => {
      const updatedQuestionnaire =
        addFieldsToListCollectorFolderContents(questionnaire);

      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[0].answers[0]
          .options[0].label
      ).not.toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[0].answers[0]
          .options[0].label
      ).toEqual("");

      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[0].answers[0]
          .options[1].label
      ).not.toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[0].answers[0]
          .options[1].label
      ).toEqual("");

      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[2].answers[0]
          .options[0].label
      ).not.toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[2].answers[0]
          .options[1].label
      ).toEqual("");
    });

    it("should not change option labels on list collector answers if label is defined", () => {
      questionnaire.sections[0].folders[0].pages[0].answers[0].options[0].label =
        "Qualifier option positive";
      questionnaire.sections[0].folders[0].pages[0].answers[0].options[1].label =
        "Qualifier option negative";
      questionnaire.sections[0].folders[0].pages[2].answers[0].options[0].label =
        "Confirmation option positive";
      questionnaire.sections[0].folders[0].pages[2].answers[0].options[1].label =
        "Confirmation option negative";

      const updatedQuestionnaire =
        addFieldsToListCollectorFolderContents(questionnaire);

      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[0].answers[0]
          .options[0].label
      ).toEqual("Qualifier option positive");
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[0].answers[0]
          .options[1].label
      ).toEqual("Qualifier option negative");

      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[2].answers[0]
          .options[0].label
      ).toEqual("Confirmation option positive");
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[2].answers[0]
          .options[1].label
      ).toEqual("Confirmation option negative");
    });

    it("should not add label to non-list-collector answer options", () => {
      questionnaire.sections[0].folders[0].pages[0].pageType = "QuestionPage";

      const updatedQuestionnaire =
        addFieldsToListCollectorFolderContents(questionnaire);

      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[0].answers[0]
          .options[0].label
      ).toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[0].answers[0]
          .options[1].label
      ).toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[0].answers[0]
          .options[0].label
      ).not.toEqual("");
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[0].answers[0]
          .options[1].label
      ).not.toEqual("");

      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[2].answers[0]
          .options[0].label
      ).not.toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[2].answers[0]
          .options[0].label
      ).toEqual("");
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[2].answers[0]
          .options[1].label
      ).toEqual("");
    });

    it("should not add label to answer options in non-list-collector folders", () => {
      questionnaire.sections[0].folders[1] = {
        id: "folder-2",
        pages: [
          {
            id: "page-2",
            answers: [
              {
                id: "answer-3",
                type: "Radio",
                options: [
                  {
                    id: "qualifier-option-positive-1",
                    description: "Qualifier positive description",
                  },
                  {
                    id: "qualifier-option-negative-1",
                    description: "Qualifier negative description",
                  },
                ],
              },
            ],
          },
        ],
      };

      const updatedQuestionnaire =
        addFieldsToListCollectorFolderContents(questionnaire);

      expect(
        updatedQuestionnaire.sections[0].folders[1].pages[0].answers[0]
          .options[0].label
      ).toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[1].pages[0].answers[0]
          .options[0].label
      ).not.toEqual("");
    });
  });
});

const addAdditionalContentsToAddItemPage = require("./addAdditonalContentsToAddItemPage");

describe("addAdditionalContentsToAddItemPage", () => {
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

  describe("Additional Contents", () => {
    it("should add additional content fields to the add item list collector page", () => {
      const updatedQuestionnaire =
        addAdditionalContentsToAddItemPage(questionnaire);
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1].descriptionEnabled
      ).not.toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1].descriptionEnabled
      ).toBe(false);
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1].guidanceEnabled
      ).not.toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1].guidanceEnabled
      ).toBe(false);
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1].definitionEnabled
      ).not.toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1].definitionEnabled
      ).toBe(false);
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1]
          .additionalInfoEnabled
      ).not.toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1]
          .additionalInfoEnabled
      ).toBe(false);
    });

    it("should not change additional content fields to the add item list collector page if additional content fields are defined", () => {
      questionnaire.sections[0].folders[0].pages[1].descriptionEnabled = true;
      questionnaire.sections[0].folders[0].pages[1].guidanceEnabled = true;
      questionnaire.sections[0].folders[0].pages[1].additionalInfoEnabled = true;
      const updatedQuestionnaire =
        addAdditionalContentsToAddItemPage(questionnaire);
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1].descriptionEnabled
      ).not.toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1].descriptionEnabled
      ).toBe(true);
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1].guidanceEnabled
      ).not.toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1].guidanceEnabled
      ).toBe(true);
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1].definitionEnabled
      ).not.toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1].definitionEnabled
      ).toBe(false);
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1]
          .additionalInfoEnabled
      ).not.toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1]
          .additionalInfoEnabled
      ).toBe(true);
    });

    it("should not add additional content fields to non add item list collector pages", () => {
      const updatedQuestionnaire =
        addAdditionalContentsToAddItemPage(questionnaire);
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[0].descriptionEnabled
      ).toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[0].descriptionEnabled
      ).not.toBe(false);
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[0].guidanceEnabled
      ).toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[0].guidanceEnabled
      ).not.toBe(false);
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[0].definitionEnabled
      ).toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[0].definitionEnabled
      ).not.toBe(false);
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[0]
          .additionalInfoEnabled
      ).toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[0]
          .additionalInfoEnabled
      ).not.toBe(false);

      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1].descriptionEnabled
      ).not.toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1].descriptionEnabled
      ).toBe(false);
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1].guidanceEnabled
      ).not.toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1].guidanceEnabled
      ).toBe(false);
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1].definitionEnabled
      ).not.toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1].definitionEnabled
      ).toBe(false);
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1]
          .additionalInfoEnabled
      ).not.toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[1]
          .additionalInfoEnabled
      ).toBe(false);

      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[2].descriptionEnabled
      ).toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[2].descriptionEnabled
      ).not.toBe(false);
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[2].guidanceEnabled
      ).toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[2].guidanceEnabled
      ).not.toBe(false);
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[2].definitionEnabled
      ).toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[2].definitionEnabled
      ).not.toBe(false);
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[2]
          .additionalInfoEnabled
      ).toBeUndefined();
      expect(
        updatedQuestionnaire.sections[0].folders[0].pages[2]
          .additionalInfoEnabled
      ).not.toBe(false);
    });
  });
});

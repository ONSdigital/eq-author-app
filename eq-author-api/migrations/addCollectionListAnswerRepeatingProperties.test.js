const addCollectionListAnswerRepeatingProperties = require("./addCollectionListAnswerRepeatingProperties");

describe("addCollectionListAnswerRepeatingProperties", () => {
  const questionnaire = {
    id: "questionnaire-1",
    collectionLists: {
      id: "collection-list-1",
      lists: [
        {
          id: "list-1",
          listName: "List 1",
          answers: [
            {
              id: "list-answer-1",
              type: "TextField",
              label: "List answer 1",
            },
          ],
        },
      ],
    },
  };

  it("should add collection list repeating properties to list answers", () => {
    const updatedQuestionnaire =
      addCollectionListAnswerRepeatingProperties(questionnaire);

    expect(
      updatedQuestionnaire.collectionLists.lists[0].answers[0]
        .repeatingLabelAndInput
    ).not.toBeUndefined();
    expect(
      updatedQuestionnaire.collectionLists.lists[0].answers[0]
        .repeatingLabelAndInput
    ).toBe(false);
    expect(
      updatedQuestionnaire.collectionLists.lists[0].answers[0]
        .repeatingLabelAndInputListId
    ).not.toBeUndefined();
    expect(
      updatedQuestionnaire.collectionLists.lists[0].answers[0]
        .repeatingLabelAndInputListId
    ).toBe("");
  });

  it("should not change collection list repeating properties on list answers if they are defined", () => {
    questionnaire.collectionLists.lists[0].answers[0].repeatingLabelAndInput = true;

    questionnaire.collectionLists.lists[0].answers[0].repeatingLabelAndInputListId =
      "repeating-label-and-input-list-id";

    const updatedQuestionnaire =
      addCollectionListAnswerRepeatingProperties(questionnaire);

    expect(
      updatedQuestionnaire.collectionLists.lists[0].answers[0]
        .repeatingLabelAndInput
    ).not.toBeUndefined();
    expect(
      updatedQuestionnaire.collectionLists.lists[0].answers[0]
        .repeatingLabelAndInput
    ).toBe(true);
    expect(
      updatedQuestionnaire.collectionLists.lists[0].answers[0]
        .repeatingLabelAndInputListId
    ).not.toBeUndefined();
    expect(
      updatedQuestionnaire.collectionLists.lists[0].answers[0]
        .repeatingLabelAndInputListId
    ).toBe("repeating-label-and-input-list-id");
  });
});

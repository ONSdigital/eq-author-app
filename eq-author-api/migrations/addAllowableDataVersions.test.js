const addAllowableDataVersions = require("./addAllowableDataVersions");

describe("addAllowableDataVersions", () => {
  it("should set dataVersion to 3 and add allowableDataVersions with data version 3 when questionnaire has collection list", () => {
    const questionnaire = {
      id: "questionnaire-1",
      title: "Questionnaire 1",
      collectionLists: {
        lists: [{ id: "list-1" }],
      },
    };

    const updatedQuestionnaire = addAllowableDataVersions(questionnaire);

    expect(updatedQuestionnaire.dataVersion).toEqual("3");
    expect(updatedQuestionnaire.allowableDataVersions).toEqual(["3"]);
  });

  it("should set dataVersion to 3 and add allowableDataVersions with data version 3 when questionnaire has supplementary data", () => {
    const questionnaire = {
      id: "questionnaire-1",
      title: "Questionnaire 1",
      supplementaryData: { id: "supplementary-data-1" },
    };

    const updatedQuestionnaire = addAllowableDataVersions(questionnaire);

    expect(updatedQuestionnaire.dataVersion).toEqual("3");
    expect(updatedQuestionnaire.allowableDataVersions).toEqual(["3"]);
  });

  it("should set dataVersion to 3 and add allowableDataVersions with data version 3 when questionnaire has dynamic answer", () => {
    const questionnaire = {
      id: "questionnaire-1",
      title: "Questionnaire 1",
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
                      options: [
                        {
                          id: "option-1",
                          dynamicAnswer: true,
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

    const updatedQuestionnaire = addAllowableDataVersions(questionnaire);

    expect(updatedQuestionnaire.dataVersion).toEqual("3");
    expect(updatedQuestionnaire.allowableDataVersions).toEqual(["3"]);
  });

  it("should add allowableDataVersions with data versions 1 and 3 without updating dataVersion when questionnaire has no collection lists, supplementary data or dynamic answers", () => {
    const questionnaire = {
      id: "questionnaire-1",
      title: "Questionnaire 1",
      dataVersion: "1",
    };

    const updatedQuestionnaire = addAllowableDataVersions(questionnaire);

    expect(updatedQuestionnaire.dataVersion).toEqual("1");
    expect(updatedQuestionnaire.allowableDataVersions).toEqual(["1", "3"]);
  });
});

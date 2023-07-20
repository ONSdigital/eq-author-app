const convertListCollectorPageToFolder = require("./convertListCollectorPageToFolder");

describe("convertListCollectorPageToFolder", () => {
  const createQuestionnaire = (folders) => {
    return {
      sections: [
        {
          id: "section-1",
          folders: [...folders],
        },
      ],
    };
  };

  it("should convert all list collector page data to folder format", () => {
    const folders = [
      {
        id: "folder-1",
        pages: [
          {
            id: "list-page-1",
            alias: "p1",
            pageType: "ListCollectorPage",
            title: "List 1",
            listId: "list-1",
            drivingQuestion: "Driving question 1",
            pageDescription: "Driving description 1",
            additionalGuidancePanel: "Additional guidance",
            additionalGuidancePanelSwitch: true,
            drivingPositive: "Driving positive",
            drivingNegative: "Driving negative",
            drivingPositiveDescription: "Driving positive description",
            drivingNegativeDescription: "Driving negative description",
            anotherTitle: "Another question 1",
            anotherPageDescription: "Another description 1",
            anotherPositive: "Another positive",
            anotherNegative: "Another negative",
            anotherPositiveDescription: "Another positive description",
            anotherNegativeDescription: "Another negative description",
            addItemTitle: "Add item question 1",
            addItemPageDescription: "Add item description 1",
            drivingQCode: "driving-qcode-1",
            anotherQCode: "another-qcode-1",
          },
        ],
      },
    ];

    const questionnaire = createQuestionnaire(folders);

    const updatedQuestionnaire =
      convertListCollectorPageToFolder(questionnaire);

    expect(updatedQuestionnaire.sections[0].folders[0]).toMatchObject({
      id: "list-page-1",
      alias: "p1",
      title: "List 1",
      listId: "list-1",
      pages: [
        {
          id: expect.any(String),
          pageType: "ListCollectorQualifierPage",
          title: "Driving question 1",
          pageDescription: "Driving description 1",
          additionalGuidanceEnabled: true,
          additionalGuidanceContent: "Additional guidance",
          position: 0,
          answers: [
            {
              id: expect.any(String),
              type: "Radio",
              qCode: "driving-qcode-1",
              options: [
                {
                  id: expect.any(String),
                  label: "Driving positive",
                  description: "Driving positive description",
                },
                {
                  id: expect.any(String),
                  label: "Driving negative",
                  description: "Driving negative description",
                },
              ],
            },
          ],
        },
        {
          id: expect.any(String),
          pageType: "ListCollectorAddItemPage",
          title: "Add item question 1",
          pageDescription: "Add item description 1",
          position: 1,
        },
        {
          id: expect.any(String),
          pageType: "ListCollectorConfirmationPage",
          title: "Another question 1",
          pageDescription: "Another description 1",
          position: 2,
          answers: [
            {
              id: expect.any(String),
              type: "Radio",
              qCode: "another-qcode-1",
              options: [
                {
                  id: expect.any(String),
                  label: "Another positive",
                  description: "Another positive description",
                },
                {
                  id: expect.any(String),
                  label: "Another negative",
                  description: "Another negative description",
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it("should not convert folders which do not include list collector pages", () => {
    const folders = [
      {
        id: "folder-1",
        pages: [
          {
            id: "question-page-1",
            pageType: "QuestionPage",
            title: "Question page 1",
            pageDescription: "Question description 1",
            description: "",
            descriptionEnabled: false,
            guidanceEnabled: false,
            definitionsEnabled: false,
            additionalInfoEnabled: false,
            answers: [
              {
                id: "answer-1",
                label: "Answer 1",
                type: "Number",
              },
            ],
          },
          {
            id: "question-page-2",
            pageType: "QuestionPage",
            title: "Question page 2",
            pageDescription: "Question description 2",
            description: "",
            descriptionEnabled: false,
            guidanceEnabled: false,
            definitionsEnabled: false,
            additionalInfoEnabled: false,
            answers: [
              {
                id: "answer-2",
                label: "Answer 2",
                type: "Number",
              },
            ],
          },
        ],
      },
    ];

    const questionnaire = createQuestionnaire(folders);

    const updatedQuestionnaire =
      convertListCollectorPageToFolder(questionnaire);

    expect(updatedQuestionnaire.sections[0].folders[0]).toMatchObject(
      folders[0]
    );
  });
});

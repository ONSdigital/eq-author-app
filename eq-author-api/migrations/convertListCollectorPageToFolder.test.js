const convertListCollectorPageToFolder = require("./convertListCollectorPageToFolder");

describe("convertListCollectorPageToFolder", () => {
  const createQuestionnaire = (sections) => {
    return {
      sections: [...sections],
    };
  };

  it("should convert all list collector page data to folder format", () => {
    const pages = [
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
    ];

    const sections = [
      {
        id: "section-1",
        folders: [
          {
            id: "folder-1",
            pages: [...pages],
          },
        ],
      },
    ];

    const questionnaire = createQuestionnaire(sections);

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
    const pages = [
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
    ];

    const sections = [
      {
        id: "section-1",
        folders: [
          {
            id: "folder-1",
            pages: [...pages],
          },
        ],
      },
    ];

    const questionnaire = createQuestionnaire(sections);

    const updatedQuestionnaire =
      convertListCollectorPageToFolder(questionnaire);

    expect(updatedQuestionnaire.sections[0].folders[0]).toMatchObject(
      sections[0].folders[0]
    );
  });

  it("should convert folders containing both standard pages and list collector pages in one section", () => {
    const pages = [
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
      {
        id: "question-page-3",
        pageType: "QuestionPage",
        title: "Question page 3",
        pageDescription: "Question description 3",
        description: "",
        descriptionEnabled: false,
        guidanceEnabled: false,
        definitionsEnabled: false,
        additionalInfoEnabled: false,
        answers: [
          {
            id: "answer-3",
            label: "Answer 3",
            type: "Number",
          },
        ],
      },
      {
        id: "question-page-4",
        pageType: "QuestionPage",
        title: "Question page 4",
        pageDescription: "Question description 4",
        description: "",
        descriptionEnabled: false,
        guidanceEnabled: false,
        definitionsEnabled: false,
        additionalInfoEnabled: false,
        answers: [
          {
            id: "answer-4",
            label: "Answer 4",
            type: "Number",
          },
        ],
      },
    ];

    const sections = [
      {
        id: "section-1",
        folders: [
          {
            id: "folder-1",
            alias: "Fold1",
            pages: [...pages],
            skipConditions: [
              {
                id: "skip-condition-1",
                operator: "AND",
                expressions: [
                  {
                    id: "expression-1",
                    condition: "Equal",
                    left: {
                      type: "Answer",
                      answerId: "answer-1",
                    },
                    right: {
                      type: "Custom",
                      customValue: {
                        number: 1,
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const questionnaire = createQuestionnaire(sections);

    const updatedQuestionnaire =
      convertListCollectorPageToFolder(questionnaire);

    expect(updatedQuestionnaire.sections[0].folders.length).toEqual(3);

    expect(updatedQuestionnaire.sections[0].folders[0]).toMatchObject({
      id: expect.any(String),
      alias: "Fold1",
      pages: [pages[0], pages[1]],
      skipConditions: sections[0].folders[0].skipConditions,
    });

    expect(updatedQuestionnaire.sections[0].folders[1]).toMatchObject({
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

    expect(updatedQuestionnaire.sections[0].folders[2]).toMatchObject({
      id: expect.any(String),
      alias: "Fold1",
      pages: [pages[3], pages[4]],
      skipConditions: sections[0].folders[0].skipConditions,
    });
  });
});

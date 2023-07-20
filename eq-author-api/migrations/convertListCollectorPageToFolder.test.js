const convertListCollectorPageToFolder = require("./convertListCollectorPageToFolder");

describe("convertListCollectorPageToFolder", () => {
  const createQuestionnaire = (sections) => {
    return {
      sections: [...sections],
    };
  };

  const generatePage = (pageNumber, pageType) => {
    if (pageType === "ListCollectorPage") {
      return {
        id: `list-page-${pageNumber}`,
        alias: `L${pageNumber}`,
        pageType: "ListCollectorPage",
        title: `List ${pageNumber}`,
        listId: `list-${pageNumber}`,
        drivingQuestion: `Driving question ${pageNumber}`,
        pageDescription: `Driving description ${pageNumber}`,
        additionalGuidancePanel: "Additional guidance",
        additionalGuidancePanelSwitch: true,
        drivingPositive: "Driving positive",
        drivingNegative: "Driving negative",
        drivingPositiveDescription: "Driving positive description",
        drivingNegativeDescription: "Driving negative description",
        anotherTitle: `Another question ${pageNumber}`,
        anotherPageDescription: `Another description ${pageNumber}`,
        anotherPositive: "Another positive",
        anotherNegative: "Another negative",
        anotherPositiveDescription: "Another positive description",
        anotherNegativeDescription: "Another negative description",
        addItemTitle: `Add item question ${pageNumber}`,
        addItemPageDescription: `Add item description ${pageNumber}`,
        drivingQCode: `driving-qcode-${pageNumber}`,
        anotherQCode: `another-qcode-${pageNumber}`,
      };
    } else {
      return {
        id: `question-page-${pageNumber}`,
        pageType: "QuestionPage",
        title: `Question page ${pageNumber}`,
        pageDescription: `Question description ${pageNumber}`,
        description: "",
        descriptionEnabled: false,
        guidanceEnabled: false,
        definitionsEnabled: false,
        additionalInfoEnabled: false,
        answers: [
          {
            id: `answer-${pageNumber}`,
            label: `Answer ${pageNumber}`,
            type: "Number",
          },
        ],
      };
    }
  };

  it("should convert all list collector page data to folder format", () => {
    const pages = [generatePage("1", "ListCollectorPage")];

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
      alias: "L1",
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
      generatePage("1", "QuestionPage"),
      generatePage("2", "QuestionPage"),
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
    const firstFolderPages = [
      generatePage("1", "QuestionPage"),
      generatePage("2", "QuestionPage"),
      generatePage("1", "ListCollectorPage"),
      generatePage("3", "QuestionPage"),
      generatePage("4", "QuestionPage"),
    ];

    const secondFolderPages = [
      generatePage("5", "QuestionPage"),
      generatePage("6", "QuestionPage"),
      generatePage("2", "ListCollectorPage"),
      generatePage("7", "QuestionPage"),
      generatePage("8", "QuestionPage"),
    ];

    const skipConditions = [
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
    ];

    const sections = [
      {
        id: "section-1",
        folders: [
          {
            id: "folder-1",
            alias: "Fold1",
            pages: [...firstFolderPages],
          },
          {
            id: "folder-2",
            alias: "Fold2",
            pages: [...secondFolderPages],
            skipConditions: [...skipConditions],
          },
        ],
      },
    ];

    const questionnaire = createQuestionnaire(sections);

    const updatedQuestionnaire =
      convertListCollectorPageToFolder(questionnaire);

    expect(updatedQuestionnaire.sections[0].folders.length).toEqual(6);

    expect(updatedQuestionnaire.sections[0].folders[0]).toMatchObject({
      id: expect.any(String),
      alias: "Fold1",
      pages: [firstFolderPages[0], firstFolderPages[1]],
      skipConditions: undefined,
    });

    expect(updatedQuestionnaire.sections[0].folders[1]).toMatchObject({
      id: "list-page-1",
      alias: "L1",
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
      pages: [firstFolderPages[3], firstFolderPages[4]],
      skipConditions: undefined,
    });

    expect(updatedQuestionnaire.sections[0].folders[3]).toMatchObject({
      id: expect.any(String),
      alias: "Fold2",
      pages: [secondFolderPages[0], secondFolderPages[1]],
      skipConditions,
    });

    expect(updatedQuestionnaire.sections[0].folders[4]).toMatchObject({
      id: "list-page-2",
      alias: "L2",
      title: "List 2",
      listId: "list-2",
      pages: [
        {
          id: expect.any(String),
          pageType: "ListCollectorQualifierPage",
          title: "Driving question 2",
          pageDescription: "Driving description 2",
          additionalGuidanceEnabled: true,
          additionalGuidanceContent: "Additional guidance",
          position: 0,
          answers: [
            {
              id: expect.any(String),
              type: "Radio",
              qCode: "driving-qcode-2",
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
          title: "Add item question 2",
          pageDescription: "Add item description 2",
          position: 1,
        },
        {
          id: expect.any(String),
          pageType: "ListCollectorConfirmationPage",
          title: "Another question 2",
          pageDescription: "Another description 2",
          position: 2,
          answers: [
            {
              id: expect.any(String),
              type: "Radio",
              qCode: "another-qcode-2",
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

    expect(updatedQuestionnaire.sections[0].folders[5]).toMatchObject({
      id: expect.any(String),
      alias: "Fold2",
      pages: [secondFolderPages[3], secondFolderPages[4]],
      skipConditions,
    });
  });
});

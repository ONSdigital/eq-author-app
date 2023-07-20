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
        pageType,
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
        pageType,
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

  const getExpectedListCollectorFolderResult = (listCollectorPageNumber) => {
    return {
      id: `list-page-${listCollectorPageNumber}`,
      alias: `L${listCollectorPageNumber}`,
      title: `List ${listCollectorPageNumber}`,
      listId: `list-${listCollectorPageNumber}`,
      pages: [
        {
          id: expect.any(String),
          pageType: "ListCollectorQualifierPage",
          title: `Driving question ${listCollectorPageNumber}`,
          pageDescription: `Driving description ${listCollectorPageNumber}`,
          additionalGuidanceEnabled: true,
          additionalGuidanceContent: "Additional guidance",
          position: 0,
          answers: [
            {
              id: expect.any(String),
              type: "Radio",
              qCode: `driving-qcode-${listCollectorPageNumber}`,
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
          title: `Add item question ${listCollectorPageNumber}`,
          pageDescription: `Add item description ${listCollectorPageNumber}`,
          position: 1,
        },
        {
          id: expect.any(String),
          pageType: "ListCollectorConfirmationPage",
          title: `Another question ${listCollectorPageNumber}`,
          pageDescription: `Another description ${listCollectorPageNumber}`,
          position: 2,
          answers: [
            {
              id: expect.any(String),
              type: "Radio",
              qCode: `another-qcode-${listCollectorPageNumber}`,
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
    };
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

    expect(updatedQuestionnaire.sections[0].folders[0]).toMatchObject(
      getExpectedListCollectorFolderResult("1")
    );
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

    expect(updatedQuestionnaire.sections[0].folders[1]).toMatchObject(
      getExpectedListCollectorFolderResult("1")
    );

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

    expect(updatedQuestionnaire.sections[0].folders[4]).toMatchObject(
      getExpectedListCollectorFolderResult("2")
    );

    expect(updatedQuestionnaire.sections[0].folders[5]).toMatchObject({
      id: expect.any(String),
      alias: "Fold2",
      pages: [secondFolderPages[3], secondFolderPages[4]],
      skipConditions,
    });
  });

  it("should convert folders containing both standard pages and list collector pages in multiple sections", () => {
    const firstSectionPages = [
      generatePage("1", "QuestionPage"),
      generatePage("2", "QuestionPage"),
      generatePage("1", "ListCollectorPage"),
      generatePage("3", "QuestionPage"),
      generatePage("4", "QuestionPage"),
    ];

    const secondSectionPages = [
      generatePage("5", "QuestionPage"),
      generatePage("6", "QuestionPage"),
      generatePage("2", "ListCollectorPage"),
      generatePage("7", "QuestionPage"),
      generatePage("8", "QuestionPage"),
    ];

    const sections = [
      {
        id: "section-1",
        folders: [
          {
            id: "folder-1",
            alias: "Fold1",
            pages: [...firstSectionPages],
          },
        ],
      },
      {
        id: "section-2",
        folders: [
          {
            id: "folder-2",
            alias: "Fold2",
            pages: [...secondSectionPages],
          },
        ],
      },
    ];

    const questionnaire = createQuestionnaire(sections);

    const updatedQuestionnaire =
      convertListCollectorPageToFolder(questionnaire);

    expect(updatedQuestionnaire.sections[0].folders.length).toEqual(3);
    expect(updatedQuestionnaire.sections[1].folders.length).toEqual(3);

    expect(updatedQuestionnaire.sections[0].folders[0]).toMatchObject({
      id: expect.any(String),
      alias: "Fold1",
      pages: [firstSectionPages[0], firstSectionPages[1]],
    });

    expect(updatedQuestionnaire.sections[0].folders[1]).toMatchObject(
      getExpectedListCollectorFolderResult("1")
    );

    expect(updatedQuestionnaire.sections[0].folders[2]).toMatchObject({
      id: expect.any(String),
      alias: "Fold1",
      pages: [firstSectionPages[3], firstSectionPages[4]],
    });

    expect(updatedQuestionnaire.sections[1].folders[0]).toMatchObject({
      id: expect.any(String),
      alias: "Fold2",
      pages: [secondSectionPages[0], secondSectionPages[1]],
    });

    expect(updatedQuestionnaire.sections[1].folders[1]).toMatchObject(
      getExpectedListCollectorFolderResult("2")
    );

    expect(updatedQuestionnaire.sections[1].folders[2]).toMatchObject({
      id: expect.any(String),
      alias: "Fold2",
      pages: [secondSectionPages[3], secondSectionPages[4]],
    });
  });

  it("should convert list collector pages at first and last positions of folders", () => {
    const firstFolderPages = [
      generatePage("1", "ListCollectorPage"),
      generatePage("1", "QuestionPage"),
      generatePage("2", "QuestionPage"),
    ];

    const secondFolderPages = [
      generatePage("3", "QuestionPage"),
      generatePage("4", "QuestionPage"),
      generatePage("2", "ListCollectorPage"),
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
          },
        ],
      },
    ];

    const questionnaire = createQuestionnaire(sections);

    const updatedQuestionnaire =
      convertListCollectorPageToFolder(questionnaire);

    expect(updatedQuestionnaire.sections[0].folders.length).toEqual(4);

    expect(updatedQuestionnaire.sections[0].folders[0]).toMatchObject(
      getExpectedListCollectorFolderResult("1")
    );

    expect(updatedQuestionnaire.sections[0].folders[1]).toMatchObject({
      id: expect.any(String),
      alias: "Fold1",
      pages: [firstFolderPages[1], firstFolderPages[2]],
    });

    expect(updatedQuestionnaire.sections[0].folders[2]).toMatchObject({
      id: expect.any(String),
      alias: "Fold2",
      pages: [secondFolderPages[0], secondFolderPages[1]],
    });

    expect(updatedQuestionnaire.sections[0].folders[3]).toMatchObject(
      getExpectedListCollectorFolderResult("2")
    );
  });
});

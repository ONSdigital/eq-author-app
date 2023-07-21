const convertListCollectorPageToFolder = require("./convertListCollectorPageToFolder");

describe("convertListCollectorPageToFolder", () => {
  const createQuestionnaire = (sections) => {
    return {
      sections: [...sections],
    };
  };

  const generatePage = (pageNumber, pageType, withConfirmation) => {
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
    } else if (pageType === "CalculatedSummaryPage") {
      return {
        id: `calculated-summary-page-${pageNumber}`,
        pageType,
        title: `Calculated summary page ${pageNumber}`,
        pageDescription: `Calculated summary description ${pageNumber}`,
        totalTitle: `Calculated summary total ${pageNumber}`,
        type: "Number",
        alias: `Summary ${pageNumber}`,
        summaryAnswers: [
          `test-summary-answer-page-${pageNumber}-1`,
          `test-summary-answer-page-${pageNumber}-2`,
        ],
        answers: [
          {
            id: `calculated-summary-page-total-${pageNumber}`,
            label: `Total ${pageNumber}`,
            type: "Number",
          },
        ],
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
        confirmation: withConfirmation && {
          id: `confirmation-page-${pageNumber}`,
          title: `Confirmation page ${pageNumber}`,
          pageDescription: `Confirmation description ${pageNumber}`,
          positive: {
            id: `confirmation-page-positive-${pageNumber}`,
            label: "Yes",
            description: `Confirmation positive description ${pageNumber}`,
          },
          negative: {
            id: `confirmation-page-negative-${pageNumber}`,
            label: "No",
            description: `Confirmation negative description ${pageNumber}`,
          },
        },
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

  it("should convert folders containing both question pages and list collector pages in one section", () => {
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

  it("should convert folders containing question, calculated summary, confirmation and list collector pages in one section", () => {
    const firstFolderPages = [
      generatePage("1", "QuestionPage", true),
      generatePage("1", "CalculatedSummaryPage"),
      generatePage("2", "QuestionPage"),
      generatePage("1", "ListCollectorPage"),
      generatePage("3", "QuestionPage"),
      generatePage("4", "QuestionPage"),
    ];

    const secondFolderPages = [
      generatePage("5", "QuestionPage"),
      generatePage("6", "QuestionPage"),
      generatePage("2", "ListCollectorPage"),
      generatePage("7", "QuestionPage", true),
      generatePage("2", "CalculatedSummaryPage"),
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

    expect(updatedQuestionnaire.sections[0].folders.length).toEqual(6);

    expect(
      updatedQuestionnaire.sections[0].folders[0].pages[0].confirmation
    ).toHaveProperty("positive");
    expect(
      updatedQuestionnaire.sections[0].folders[0].pages[0].confirmation
    ).toHaveProperty("negative");
    expect(
      updatedQuestionnaire.sections[0].folders[0].pages[1].summaryAnswers
    ).toEqual(["test-summary-answer-page-1-1", "test-summary-answer-page-1-2"]);
    expect(updatedQuestionnaire.sections[0].folders[0]).toMatchObject({
      id: expect.any(String),
      alias: "Fold1",
      pages: [firstFolderPages[0], firstFolderPages[1], firstFolderPages[2]],
    });

    expect(updatedQuestionnaire.sections[0].folders[1]).toMatchObject(
      getExpectedListCollectorFolderResult("1")
    );

    expect(updatedQuestionnaire.sections[0].folders[2]).toMatchObject({
      id: expect.any(String),
      alias: "Fold1",
      pages: [firstFolderPages[4], firstFolderPages[5]],
    });

    expect(updatedQuestionnaire.sections[0].folders[3]).toMatchObject({
      id: expect.any(String),
      alias: "Fold2",
      pages: [secondFolderPages[0], secondFolderPages[1]],
    });

    expect(updatedQuestionnaire.sections[0].folders[4]).toMatchObject(
      getExpectedListCollectorFolderResult("2")
    );

    expect(
      updatedQuestionnaire.sections[0].folders[5].pages[0].confirmation
    ).toHaveProperty("positive");
    expect(
      updatedQuestionnaire.sections[0].folders[5].pages[0].confirmation
    ).toHaveProperty("negative");
    expect(
      updatedQuestionnaire.sections[0].folders[5].pages[1].summaryAnswers
    ).toEqual(["test-summary-answer-page-2-1", "test-summary-answer-page-2-2"]);
    expect(updatedQuestionnaire.sections[0].folders[5]).toMatchObject({
      id: expect.any(String),
      alias: "Fold2",
      pages: [secondFolderPages[3], secondFolderPages[4]],
    });
  });

  it("should convert folders containing multiple list collector pages in one section", () => {
    const firstFolderPages = [
      generatePage("1", "QuestionPage"),
      generatePage("2", "QuestionPage"),
      generatePage("1", "ListCollectorPage"),
      generatePage("3", "QuestionPage"),
      generatePage("2", "ListCollectorPage"),
    ];

    const secondFolderPages = [
      generatePage("3", "ListCollectorPage"),
      generatePage("4", "QuestionPage"),
      generatePage("5", "QuestionPage"),
      generatePage("4", "ListCollectorPage"),
      generatePage("1", "CalculatedSummaryPage"),
      generatePage("5", "ListCollectorPage"),
      generatePage("6", "QuestionPage", true),
    ];

    const thirdFolderPages = [
      generatePage("6", "ListCollectorPage"),
      generatePage("7", "ListCollectorPage"),
      generatePage("7", "QuestionPage"),
      generatePage("8", "QuestionPage"),
      generatePage("8", "ListCollectorPage"),
      generatePage("9", "ListCollectorPage"),
      generatePage("9", "QuestionPage"),
      generatePage("10", "QuestionPage"),
      generatePage("10", "ListCollectorPage"),
      generatePage("11", "ListCollectorPage"),
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
          {
            id: "folder-3",
            alias: "Fold3",
            pages: [...thirdFolderPages],
          },
        ],
      },
    ];

    const questionnaire = createQuestionnaire(sections);

    const updatedQuestionnaire =
      convertListCollectorPageToFolder(questionnaire);

    expect(updatedQuestionnaire.sections[0].folders.length).toEqual(18);

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
      pages: [firstFolderPages[3]],
      skipConditions: undefined,
    });

    expect(updatedQuestionnaire.sections[0].folders[3]).toMatchObject(
      getExpectedListCollectorFolderResult("2")
    );

    expect(updatedQuestionnaire.sections[0].folders[4]).toMatchObject(
      getExpectedListCollectorFolderResult("3")
    );

    expect(updatedQuestionnaire.sections[0].folders[5]).toMatchObject({
      id: expect.any(String),
      alias: "Fold2",
      pages: [secondFolderPages[1], secondFolderPages[2]],
      skipConditions,
    });

    expect(updatedQuestionnaire.sections[0].folders[6]).toMatchObject(
      getExpectedListCollectorFolderResult("4")
    );

    expect(
      updatedQuestionnaire.sections[0].folders[7].pages[0].summaryAnswers
    ).toEqual(["test-summary-answer-page-1-1", "test-summary-answer-page-1-2"]);
    expect(updatedQuestionnaire.sections[0].folders[7]).toMatchObject({
      id: expect.any(String),
      alias: "Fold2",
      pages: [secondFolderPages[4]],
      skipConditions,
    });

    expect(updatedQuestionnaire.sections[0].folders[8]).toMatchObject(
      getExpectedListCollectorFolderResult("5")
    );

    expect(
      updatedQuestionnaire.sections[0].folders[9].pages[0].confirmation
    ).toHaveProperty("positive");
    expect(
      updatedQuestionnaire.sections[0].folders[9].pages[0].confirmation
    ).toHaveProperty("negative");
    expect(updatedQuestionnaire.sections[0].folders[9]).toMatchObject({
      id: expect.any(String),
      alias: "Fold2",
      pages: [secondFolderPages[6]],
      skipConditions,
    });

    expect(updatedQuestionnaire.sections[0].folders[10]).toMatchObject(
      getExpectedListCollectorFolderResult("6")
    );

    expect(updatedQuestionnaire.sections[0].folders[11]).toMatchObject(
      getExpectedListCollectorFolderResult("7")
    );

    expect(updatedQuestionnaire.sections[0].folders[12]).toMatchObject({
      id: expect.any(String),
      alias: "Fold3",
      pages: [thirdFolderPages[2], thirdFolderPages[3]],
      skipConditions: undefined,
    });

    expect(updatedQuestionnaire.sections[0].folders[13]).toMatchObject(
      getExpectedListCollectorFolderResult("8")
    );

    expect(updatedQuestionnaire.sections[0].folders[14]).toMatchObject(
      getExpectedListCollectorFolderResult("9")
    );

    expect(updatedQuestionnaire.sections[0].folders[15]).toMatchObject({
      id: expect.any(String),
      alias: "Fold3",
      pages: [thirdFolderPages[6], thirdFolderPages[7]],
      skipConditions: undefined,
    });

    expect(updatedQuestionnaire.sections[0].folders[16]).toMatchObject(
      getExpectedListCollectorFolderResult("10")
    );

    expect(updatedQuestionnaire.sections[0].folders[17]).toMatchObject(
      getExpectedListCollectorFolderResult("11")
    );
  });
});

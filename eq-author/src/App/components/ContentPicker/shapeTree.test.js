import shapeTree, {
  shapePageTree
} from "App/components/ContentPicker/shapeTree";

const answerTree = [
  {
    id: "6",
    displayName: "Date 1",
    page: {
      id: "1",
      displayName: "Page (1.1)",
      section: {
        id: "1",
        displayName: "Section (1)"
      }
    }
  },
  {
    id: "7",
    displayName: "Date 2",
    page: {
      id: "6",
      displayName: "Page (1.2)",
      section: {
        id: "1",
        displayName: "Section (1)"
      }
    }
  },
  {
    id: "2",
    displayName: "Date 3",
    page: {
      id: "2",
      displayName: "Page (2.1)",
      section: {
        id: "2",
        displayName: "Section (2)"
      }
    }
  },
  {
    id: "3",
    displayName: "Date 4",
    page: {
      id: "5",
      displayName: "Page (3.1)",
      section: {
        id: "3",
        displayName: "Section (3)"
      }
    }
  },
  {
    id: "9",
    displayName: "Date 5",
    page: {
      id: "5",
      displayName: "Page (3.1)",
      section: {
        id: "3",
        displayName: "Section (3)"
      }
    }
  }
];

const expectedAnswerTree = [
  {
    displayName: "Section (1)",
    id: "1",
    pages: [
      {
        id: "1",
        displayName: "Page (1.1)",
        answers: [
          {
            id: "6",
            displayName: "Date 1"
          }
        ]
      },
      {
        id: "6",
        displayName: "Page (1.2)",
        answers: [
          {
            id: "7",
            displayName: "Date 2"
          }
        ]
      }
    ]
  },
  {
    id: "2",
    displayName: "Section (2)",
    pages: [
      {
        id: "2",
        displayName: "Page (2.1)",
        answers: [
          {
            id: "2",
            displayName: "Date 3"
          }
        ]
      }
    ]
  },
  {
    id: "3",
    displayName: "Section (3)",
    pages: [
      {
        id: "5",
        displayName: "Page (3.1)",
        answers: [
          {
            id: "3",
            displayName: "Date 4"
          },
          {
            id: "9",
            displayName: "Date 5"
          }
        ]
      }
    ]
  }
];

const questionTree = [
  {
    id: "1",
    displayName: "Page (1.1)",
    section: {
      id: "1",
      displayName: "Section (1)"
    }
  },
  {
    id: "6",
    displayName: "Page (1.2)",
    section: {
      id: "1",
      displayName: "Section (1)"
    }
  },
  {
    id: "2",
    displayName: "Page (2.1)",
    section: {
      id: "2",
      displayName: "Section (2)"
    }
  },
  {
    id: "5",
    displayName: "Page (3.1)",
    section: {
      id: "3",
      displayName: "Section (3)"
    }
  },
  {
    id: "5",
    displayName: "Page (3.1)",
    section: {
      id: "3",
      displayName: "Section (3)"
    }
  }
];

const expectedQuestionTree = [
  {
    displayName: "Section (1)",
    id: "1",
    pages: [
      {
        id: "1",
        displayName: "Page (1.1)"
      },
      {
        id: "6",
        displayName: "Page (1.2)"
      }
    ]
  },
  {
    id: "2",
    displayName: "Section (2)",
    pages: [
      {
        id: "2",
        displayName: "Page (2.1)"
      }
    ]
  },
  {
    id: "3",
    displayName: "Section (3)",
    pages: [
      {
        id: "5",
        displayName: "Page (3.1)"
      }
    ]
  }
];

describe("shapeTree", () => {
  it("should correctly reverse answer, page, section tree", () => {
    expect(shapeTree(answerTree)).toEqual(expectedAnswerTree);
  });

  it("should correctly reverse page, section tree", () => {
    expect(shapePageTree(questionTree)).toEqual(expectedQuestionTree);
  });
});

import searchByAnswerTitleQuestionTitleShortCode from "./searchByAnswerTitleQuestionTitleShortCode";

describe("Searching by answer title or question title or short code", () => {
  let data;

  beforeEach(() => {
    data = [
      {
        id: "section1",
        folders: [
          {
            id: "folder1",
            pages: [
              {
                id: "page1",
                title: "<p>Mr Carson</p>",
                displayName: "Butler",
                alias: "Butler",
                answers: [
                  {
                    id: "answer1.1",
                    title: "<p>Who plays Mr Carson?<p/>",
                    displayName: "Who plays Mr Carson?",
                  },
                ],
              },
              {
                id: "page2",
                title: "<p>Lady Mary</p>",
                displayName: "Lady Mary",
                answers: [
                  {
                    id: "answer2.1",
                    title: "<p>Who plays Lady Mary?</p>",
                    displayName: "Who plays Lady Mary?",
                  },
                ],
              },
              {
                id: "page3",
                title: "<p>Countess of Grantham</p>",
                displayName: "Cora",
                alias: "Cora",
                answers: [
                  {
                    id: "answer3.1",
                    title: "<p>Who plays the Countess of Grantham?</p>",
                    displayName: "Who plays the Countess of Grantham?",
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  });

  it("Can search by answer title", () => {
    const searchResult = searchByAnswerTitleQuestionTitleShortCode(
      data,
      "Mr Carson"
    );

    expect(searchResult).toMatchObject([
      {
        id: "section1",
        folders: [
          {
            id: "folder1",
            pages: [
              {
                id: "page1",
                title: "<p>Mr Carson</p>",
                displayName: "Butler",
                alias: "Butler",
                answers: [
                  {
                    id: "answer1.1",
                    title: "<p>Who plays Mr Carson?<p/>",
                    displayName: "Who plays Mr Carson?",
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);
  });

  it("Can search by page title", () => {
    const searchResult = searchByAnswerTitleQuestionTitleShortCode(
      data,
      "<p>Lady Mary</p>"
    );

    expect(searchResult).toMatchObject([
      {
        id: "section1",
        folders: [
          {
            id: "folder1",
            pages: [
              {
                id: "page2",
                title: "<p>Lady Mary</p>",
                displayName: "Lady Mary",
                answers: [
                  {
                    id: "answer2.1",
                    title: "<p>Who plays Lady Mary?</p>",
                    displayName: "Who plays Lady Mary?",
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);
  });

  it("Returns all the data if no search term is given", () => {
    const searchResults = searchByAnswerTitleQuestionTitleShortCode(data, null);

    expect(searchResults).toMatchObject(data);
  });
});

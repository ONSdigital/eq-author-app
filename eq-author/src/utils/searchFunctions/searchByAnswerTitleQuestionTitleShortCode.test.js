import searchByAnswerAndQuestionTitleShortCode from "./searchByAnswerTitleQuestionTitleShortCode";

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
                title: "<p>Butler</p>",
                displayName: "Butler",
                answers: [
                  {
                    id: "answer1.1",
                    title: "<p>Mr Carson<p/>",
                    displayName: "Mr Carson",
                  },
                ],
              },
              {
                id: "page2",
                title: "Mary Talbot (nee Crawley)",
                answers: [
                  {
                    id: "answer2.1",
                    title: "<p>Lady Mary</p>",
                    displayName: "Lady Mary",
                    alias: "Mary",
                  },
                ],
              },
              {
                id: "page3",
                title: "Countess of Grantham",
                answers: [
                  {
                    id: "answer3.1",
                    title: "<p>Lady Grantham</p>",
                    displayName: "Lady Grantham",
                    alias: "Cora",
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
    const searchResult = searchByAnswerAndQuestionTitleShortCode(
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
                answers: [
                  {
                    id: "answer1.1",
                    title: "<p>Mr Carson<p/>",
                    displayName: "Mr Carson",
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);
  });

  it("Can search by answer short code", () => {
    const searchResult = searchByAnswerAndQuestionTitleShortCode(data, "Cora");

    expect(searchResult).toMatchObject([
      {
        id: "section1",
        folders: [
          {
            id: "folder1",
            pages: [
              {
                id: "page3",
                answers: [
                  {
                    id: "answer3.1",
                    title: "<p>Lady Grantham</p>",
                    displayName: "Lady Grantham",
                    alias: "Cora",
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
    const searchResult = searchByAnswerAndQuestionTitleShortCode(
      data,
      "Butler"
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
                title: "<p>Butler</p>",
                displayName: "Butler",
                answers: [
                  {
                    id: "answer1.1",
                    title: "<p>Mr Carson<p/>",
                    displayName: "Mr Carson",
                  },
                ],
              },
            ],
          },
        ],
      },
    ]);
  });
});

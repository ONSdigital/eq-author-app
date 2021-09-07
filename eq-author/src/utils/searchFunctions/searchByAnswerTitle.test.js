import searchByAnswerTitle from "./searchByAnswerTitle";

describe("Searching by answer title or short code", () => {
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
                answers: [
                  { id: "answer1.1", title: "P!nk", displayName: "P!nk" },
                ],
              },
              {
                id: "page2",
                answers: [
                  {
                    id: "answer2.1",
                    title: "Lady Gaga",
                    displayName: "Lady Gaga",
                  },
                ],
              },
              {
                id: "page3",
                answers: [
                  {
                    id: "answer3.1",
                    title: "Miley Cyrus",
                    displayName: "Miley Cyrus",
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  });

  it("Returns all data if no search term is given", () => {
    const searchResult = searchByAnswerTitle(data, null);

    expect(searchResult).toMatchObject(data);
  });

  it("Can search by answer title", () => {
    const searchResult = searchByAnswerTitle(data, "Lady");

    expect(searchResult).toMatchObject([
      {
        id: "section1",
        folders: [
          {
            id: "folder1",
            pages: [
              {
                id: "page2",
                answers: [
                  {
                    id: "answer2.1",
                    title: "Lady Gaga",
                    displayName: "Lady Gaga",
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

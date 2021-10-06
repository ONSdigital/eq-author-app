import searchByQuestionTitleOrShortCode from "./searchByQuestionTitleShortCode";

describe("Search by question title or short code", () => {
  let data;

  beforeEach(() => {
    data = [
      {
        id: "section1",
        folders: [
          {
            id: "folder 1",
            pages: [
              {
                id: "page1",
                title: "Tones and I",
                displayName: "Tones and I",
                alias: "Tones",
              },
              { id: "page2", title: "Rhianna", displayName: "Rhianna" },
              {
                id: "page3",
                title: "Britney Spears",
                displayName: "Britney Spears",
                alias: "Britney",
              },
            ],
          },
        ],
      },
    ];
  });

  it("Returns all data if no search term is given", () => {
    const searchResult = searchByQuestionTitleOrShortCode(data, "");

    expect(searchResult).toMatchObject(data);
  });

  it("Can search by question title", () => {
    const searchResult = searchByQuestionTitleOrShortCode(data, "Tones and I");

    expect(searchResult).toMatchObject([
      {
        id: "section1",
        folders: [
          {
            id: "folder 1",
            pages: [
              {
                id: "page1",
                title: "Tones and I",
                displayName: "Tones and I",
                alias: "Tones",
              },
            ],
          },
        ],
      },
    ]);
  });

  it("Can search by short code", () => {
    const searchResult = searchByQuestionTitleOrShortCode(data, "Britney");

    expect(searchResult).toMatchObject([
      {
        id: "section1",
        folders: [
          {
            id: "folder 1",
            pages: [
              {
                id: "page3",
                title: "Britney Spears",
                displayName: "Britney Spears",
                alias: "Britney",
              },
            ],
          },
        ],
      },
    ]);
  });

  it("Returns all the data if no search term is given", () => {
    const searchResults = searchByQuestionTitleOrShortCode(data, null);

    expect(searchResults).toMatchObject(data);
  });
});

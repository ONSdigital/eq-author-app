import searchByFolderTitleOrShortCode from "./searchByFolderTitleOrShortCode";

describe("searchByFolderTitleOrShortCode", () => {
  let data;

  beforeEach(() => {
    data = [
      {
        folders: [
          {
            id: "folder-1",
            alias: "Folder 1",
          },
          {
            id: "folder-2",
            alias: "Folder 2",
          },
        ],
      },
      {
        folders: [
          {
            id: "list-folder-1",
            listId: "list-1",
            alias: "List 1",
            title: "List folder 1",
          },
          {
            id: "list-folder-2",
            listId: "list-2",
            title: "List folder 2",
          },
        ],
      },
    ];
  });

  it("should return data when searchTerm is empty string", () => {
    const searchResult = searchByFolderTitleOrShortCode(data, "");

    expect(searchResult).toEqual(data);
  });

  it("should return filtered data when searchTerm is not empty string", () => {
    const searchResult = searchByFolderTitleOrShortCode(data, "folder 1");

    expect(searchResult).toEqual([
      {
        folders: [
          {
            id: "folder-1",
            alias: "Folder 1",
          },
        ],
      },
      {
        folders: [
          {
            id: "list-folder-1",
            listId: "list-1",
            alias: "List 1",
            title: "List folder 1",
          },
        ],
      },
    ]);
  });
});

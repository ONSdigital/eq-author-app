const executeQuery = require("../../utils/executeQuery");
const mockRepository = require("../../utils/mockRepository");

describe("Page query", () => {
  const page = `
    query GetPage($id: ID!) {
      page(id: $id) {
        id
      }
    }
  `;

  const pageWithSection = `
    query GetPage($id: ID!) {
      page(id: $id) {
        id,
        section {
          id
        }
      }
    }
  `;

  const id = "1";
  const sectionId = "2";
  let repositories;

  beforeEach(() => {
    repositories = {
      Page: mockRepository({
        getById: {
          id,
          sectionId,
          pageType: "QuestionPage"
        }
      }),
      QuestionPage: mockRepository(),
      Section: mockRepository()
    };
  });

  it("should fetch page by id", async () => {
    const result = await executeQuery(page, { id }, { repositories });

    expect(result.errors).toBeUndefined();
    expect(repositories.Page.getById).toHaveBeenCalledWith(id);
    expect(repositories.QuestionPage.findAll).not.toHaveBeenCalled();
  });

  it("should have association with Section", async () => {
    const result = await executeQuery(
      pageWithSection,
      { id },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(repositories.Page.getById).toHaveBeenCalledWith(id);
    expect(repositories.Section.getById).toHaveBeenCalledWith(sectionId);
  });
});

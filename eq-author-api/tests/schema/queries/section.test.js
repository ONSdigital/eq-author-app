const executeQuery = require("../../utils/executeQuery");
const mockRepository = require("../../utils/mockRepository");

describe("Section query", () => {
  const section = `
    query GetSection($id: ID!) {
      section(id: $id) {
        id
      }
    }
  `;

  const sectionWithPages = `
    query GetSection($id: ID!) {
      section(id: $id) {
        id,
        pages {
          id
        }
      }
    }
  `;

  const sectionWithQuestionnaire = `
    query GetSection($id: ID!) {
      section(id: $id) {
        id,
        questionnaire {
          id
        }
      }
    }
  `;

  const id = "1";
  const questionnaireId = "2";

  let repositories;

  beforeEach(() => {
    repositories = {
      Section: mockRepository({
        getById: {
          id,
          questionnaireId
        }
      }),
      Page: mockRepository(),
      Questionnaire: mockRepository()
    };
  });

  it("should fetch page by id", async () => {
    const result = await executeQuery(section, { id }, { repositories });

    expect(result.errors).toBeUndefined();
    expect(repositories.Section.getById).toHaveBeenCalledWith(id);
    expect(repositories.Page.findAll).not.toHaveBeenCalled();
  });

  it("should have an association with Pages", async () => {
    const result = await executeQuery(
      sectionWithPages,
      { id },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(repositories.Section.getById).toHaveBeenCalledWith(id);
    expect(repositories.Page.findAll).toHaveBeenCalledWith({ sectionId: id });
  });

  it("should have an association with Questionnaire", async () => {
    const result = await executeQuery(
      sectionWithQuestionnaire,
      { id },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(repositories.Section.getById).toHaveBeenCalledWith(id);
    expect(repositories.Questionnaire.getById).toHaveBeenCalledWith(
      questionnaireId
    );
  });
});

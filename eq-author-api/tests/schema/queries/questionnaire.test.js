const executeQuery = require("../../utils/executeQuery");
const mockRepository = require("../../utils/mockRepository");

describe("questionnaire query", () => {
  const questionnaire = `
    query GetQuestionnaire($id : ID!) {
      questionnaire(id: $id) {
        id
      }
    }
  `;

  const questionnaireWithSections = `
    query GetQuestionnaireWithSections($id : ID!) {
      questionnaire(id: $id) {
        id,
        sections {
          id
        }
      }
    }
  `;

  const questionnaireWithCreatedBy = `
  query GetQuestionnaireWithSections($id : ID!) {
    questionnaire(id: $id) {
      id,
      createdBy {
        name
      }
    }
  }
`;

  const id = "1";
  let repositories;

  beforeEach(() => {
    repositories = {
      Questionnaire: mockRepository({
        getById: { id, createdBy: "foo" }
      }),
      Section: mockRepository()
    };
  });

  it("should fetch questionnaire by id", async () => {
    const result = await executeQuery(questionnaire, { id }, { repositories });

    expect(result.errors).toBeUndefined();
    expect(repositories.Questionnaire.getById).toHaveBeenCalledWith(id);
    expect(repositories.Section.findAll).not.toHaveBeenCalled();
  });

  it("should have an association with Sections", async () => {
    const result = await executeQuery(
      questionnaireWithSections,
      { id },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(repositories.Questionnaire.getById).toHaveBeenCalledWith(id);
    expect(repositories.Section.findAll).toHaveBeenCalledWith({
      questionnaireId: id
    });
  });

  it("should have an association with a User", async () => {
    const result = await executeQuery(
      questionnaireWithCreatedBy,
      { id },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(result.data.questionnaire).toMatchObject({
      createdBy: {
        name: "foo"
      }
    });
  });
});

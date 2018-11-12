const executeQuery = require("../../utils/executeQuery");
const mockRepository = require("../../utils/mockRepository");

describe("questionnaire query" , () => {

  const questionnaires = `
    query GetQuestionnaires {
      questionnaires {
        id,
        title,
        description,
        navigation,
        legalBasis,
        theme
      }
    }
  `;

  let repositories;

  beforeEach(() => {
    repositories = {
      Questionnaire : mockRepository()
    }
  });

  it("should fetch all Questionnaires", async () => {
    const result = await executeQuery(questionnaires, {}, { repositories });

    expect(result.errors).toBeUndefined();
    expect(repositories.Questionnaire.findAll).toHaveBeenCalled();
  });
});
const executeQuery = require("../../utils/executeQuery");
const mockRepository = require("../../utils/mockRepository");

describe("deleteQuestionnaire", () => {
  const deleteQuestionnaire = `
    mutation DeleteQuestionnaire($input:DeleteQuestionnaireInput!) {
      deleteQuestionnaire(input:$input){
        id
      }
    }
  `;

  let repositories;

  beforeEach(() => {
    repositories = {
      Questionnaire: mockRepository()
    };
  });

  it("should allow deletion of Questionnaire", async () => {
    const input = { id: "1" };
    const result = await executeQuery(
      deleteQuestionnaire,
      { input },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(repositories.Questionnaire.remove).toHaveBeenCalledWith(input.id);
  });
});

const executeQuery = require("../../utils/executeQuery");
const mockRepository = require("../../utils/mockRepository");

describe("updateQuestionnaire", () => {
  const updateQuestionnaire = `
    mutation UpdateQuestionnaire($input: UpdateQuestionnaireInput!) {
      updateQuestionnaire(input: $input) {
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

  it("should allow update of Questionnaire", async () => {
    const input = {
      id: "1",
      title: "Test questionnaire",
      description: "This is a test questionnaire",
      theme: "test theme",
      legalBasis: "Voluntary",
      navigation: false
    };

    const result = await executeQuery(
      updateQuestionnaire,
      { input },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(repositories.Questionnaire.update).toHaveBeenCalledWith(input);
  });
});

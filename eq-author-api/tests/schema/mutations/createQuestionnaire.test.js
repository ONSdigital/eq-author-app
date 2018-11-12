const executeQuery = require("../../utils/executeQuery");
const mockRepository = require("../../utils/mockRepository");

describe("createQuestionnaire", () => {
  const createQuestionnaire = `
    mutation CreateQuestionnaire($input: CreateQuestionnaireInput!) {
      createQuestionnaire(input: $input) {
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

  const QUESTIONNAIRE_ID = "123";
  const SECTION_ID = "456";

  beforeEach(() => {
    repositories = {
      Questionnaire: mockRepository({
        insert: { id: QUESTIONNAIRE_ID }
      }),
      Section: mockRepository({
        insert: { id: SECTION_ID }
      }),
      Page: mockRepository()
    };
  });

  it("should allow creation of Questionnaire", async () => {
    const input = {
      title: "Test questionnaire",
      description: "This is a test questionnaire",
      theme: "test theme",
      legalBasis: "Voluntary",
      navigation: true,
      surveyId: "abc",
      createdBy: "John Doe"
    };

    const result = await executeQuery(
      createQuestionnaire,
      { input },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(result.data.createQuestionnaire.id).toBe(QUESTIONNAIRE_ID);

    expect(repositories.Questionnaire.insert).toHaveBeenCalledWith(input);
    expect(repositories.Section.insert).toHaveBeenCalledWith(
      expect.objectContaining({ questionnaireId: QUESTIONNAIRE_ID })
    );
    expect(repositories.Page.insert).toHaveBeenCalledWith(
      expect.objectContaining({ sectionId: SECTION_ID })
    );
  });
});

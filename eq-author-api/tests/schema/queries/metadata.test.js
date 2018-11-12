const executeQuery = require("../../utils/executeQuery");
const mockRepository = require("../../utils/mockRepository");

describe("Metadata query", () => {
  const metadata = `
   query GetQuestionnaireWithMetadata($questionnaireId: ID!) {
      questionnaire(id: $questionnaireId) {
        id
        metadata {
          id
          type
          textValue
          languageValue
          regionValue
          dateValue
          displayName
        }
      }
    }
  `;

  const QUESTIONNAIRE_ID = "2";

  let repositories;

  beforeEach(() => {
    repositories = {
      Questionnaire: mockRepository({
        getById: {
          id: QUESTIONNAIRE_ID
        }
      }),
      Metadata: mockRepository({
        findAll: [
          {
            id: 1,
            type: "Text",
            value: "hello",
            alias: "Metadata1",
            key: "UnusedKey"
          },
          { id: 2, type: "Language", value: "en", key: "Metadata2" },
          { id: 3, type: "Region", value: "GB_ENG" },
          { id: 4, type: "Date", value: "2018-01-01" }
        ]
      })
    };
  });

  it("should fetch all metadata for a questionnaire", async () => {
    const result = await executeQuery(
      metadata,
      { questionnaireId: QUESTIONNAIRE_ID },
      { repositories }
    );
    expect(result.errors).toBeUndefined();
    expect(repositories.Metadata.findAll).toHaveBeenCalledWith({
      questionnaireId: QUESTIONNAIRE_ID
    });
    expect(result.data.questionnaire.metadata).toHaveLength(4);
    expect(result.data.questionnaire.metadata[0]).toMatchObject({
      textValue: "hello",
      displayName: "Metadata1"
    });
    expect(result.data.questionnaire.metadata[1]).toMatchObject({
      languageValue: "en",
      displayName: "Metadata2"
    });
    expect(result.data.questionnaire.metadata[2]).toMatchObject({
      regionValue: "GB_ENG",
      displayName: "Untitled Metadata"
    });
    expect(result.data.questionnaire.metadata[3]).toMatchObject({
      dateValue: "2018-01-01"
    });
  });
});

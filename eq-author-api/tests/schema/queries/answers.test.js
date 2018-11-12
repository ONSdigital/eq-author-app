const executeQuery = require("../../utils/executeQuery");
const mockRepository = require("../../utils/mockRepository");

describe("answers query", () => {
  const answer = `
    query GetAnswers($ids: [ID]!) {
      answers(ids: $ids) {
        label
        ... on BasicAnswer {
          secondaryLabel
        }
        id
      }
    }
  `;

  let repositories;
  const ids = ["1", "2", "3"];
  const answers = ids.map(id => ({
    id,
    label: `Label${1}`,
    secondaryLabel: `Label${1}`
  }));

  beforeEach(() => {
    repositories = {
      Answer: mockRepository({
        getAnswers: answers
      })
    };
  });

  it("should fetch answers by id", async () => {
    const result = await executeQuery(answer, { ids }, { repositories });
    const { getAnswers } = repositories.Answer;

    expect(result.errors).toBeUndefined();
    expect(result.data.answers).toEqual(answers);
    expect(getAnswers).toHaveBeenCalledWith(["1", "2", "3"]);
  });
});

const executeQuery = require("../../utils/executeQuery");
const mockRepository = require("../../utils/mockRepository");

describe("answer query", () => {
  const answer = `
    query GetAnswer($id: ID!) {
      answer(id: $id) {
        id
      }
    }
  `;

  const answerWithOption = `
    query GetAnswer($id: ID!) {
      answer(id: $id) {
        id,
        ... on MultipleChoiceAnswer {
          options {
            id
          }
        }
      }
    }
  `;

  const answerWithPage = `
    query GetAnswer($id: ID!) {
      answer(id: $id) {
        id,
        page {
          id
        }
      }
    }
  `;

  let repositories;
  const id = "1";
  const questionPageId = "2";

  beforeEach(() => {
    repositories = {
      Answer: mockRepository({
        getById: {
          id,
          questionPageId,
          type: "Checkbox"
        }
      }),
      Option: mockRepository(),
      QuestionPage: mockRepository()
    };
  });

  it("should fetch answer by id", async () => {
    const result = await executeQuery(answer, { id }, { repositories });

    expect(result.errors).toBeUndefined();
    expect(repositories.Answer.getById).toHaveBeenCalledWith(id);
  });

  it("should have an association with Option", async () => {
    const result = await executeQuery(
      answerWithOption,
      { id },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(repositories.Answer.getById).toHaveBeenCalledWith(id);
    expect(repositories.Option.findAll).toHaveBeenCalledWith({
      answerId: id,
      mutuallyExclusive: false
    });
  });

  it("should have an association with Page", async () => {
    const result = await executeQuery(answerWithPage, { id }, { repositories });

    expect(result.errors).toBeUndefined();
    expect(repositories.Answer.getById).toHaveBeenCalledWith(id);
    expect(repositories.QuestionPage.getById).toHaveBeenCalledWith(
      questionPageId
    );
  });
});

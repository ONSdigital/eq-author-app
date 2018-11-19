const executeQuery = require("../../utils/executeQuery");
const mockRepository = require("../../utils/mockRepository");

describe("QuestionPage query", () => {
  const questionPage = `
    query GetQuestionPage($id: ID!) {
      questionPage(id: $id) {
        id
        section {
          id
        }
      }
    }
  `;

  const questionPageWithAnswers = `
    query GetQuestionPageWithAnswers($id: ID!) {
      questionPage(id: $id) {
        id
        answers {
          id
        }
      }
    }
  `;

  const questionPageWithSection = `
  query GetQuestionPageWithSection($id: ID!) {
    questionPage(id: $id) {
      id
      section {
        id
      }
    }
  }
  `;

  const questionPageWithAvailablePipingAnswers = `
  query GetQuestionPageWithAvailablePipingAnswers($id: ID!) {
    questionPage(id: $id) {
      id
      availablePipingAnswers {
        id
      }
    }
  }
  `;

  const questionPageWithAvailablePipingMetadata = `
  query GetQuestionPageWithAvailablePipingMetadata($id: ID!) {
    questionPage(id: $id) {
      id
      availablePipingMetadata {
        id
      }
    }
  }
  `;

  const id = "1";
  const sectionId = "1";
  let repositories;

  beforeEach(() => {
    repositories = {
      QuestionPage: {
        ...mockRepository({
          getById: {
            id,
            sectionId
          }
        }),
        getPipingAnswersForQuestionPage: jest.fn(() => []),
        getPipingMetadataForQuestionPage: jest.fn(() => [])
      },
      Answer: mockRepository(),
      Section: mockRepository()
    };
  });

  it("should fetch QuestionPage by id", async () => {
    const result = await executeQuery(questionPage, { id }, { repositories });

    expect(result.errors).toBeUndefined();
    expect(repositories.QuestionPage.getById).toHaveBeenCalledWith(id);
  });

  it("should have an association with Answer", async () => {
    const result = await executeQuery(
      questionPageWithAnswers,
      { id },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(repositories.QuestionPage.getById).toHaveBeenCalledWith(id);
    expect(repositories.Answer.findAll).toHaveBeenCalledWith({
      questionPageId: id
    });
  });

  it("should have association with Section", async () => {
    const result = await executeQuery(
      questionPageWithSection,
      { id },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(repositories.QuestionPage.getById).toHaveBeenCalledWith(id);
    expect(repositories.Section.getById).toHaveBeenCalledWith(sectionId);
  });

  it("should fetch availablePipingAnswers", async () => {
    const result = await executeQuery(
      questionPageWithAvailablePipingAnswers,
      { id },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(
      repositories.QuestionPage.getPipingAnswersForQuestionPage
    ).toHaveBeenCalledWith(id);
  });

  it("should fetch availablePipingMetadata", async () => {
    const result = await executeQuery(
      questionPageWithAvailablePipingMetadata,
      { id },
      { repositories }
    );

    expect(result.errors).toBeUndefined();
    expect(
      repositories.QuestionPage.getPipingMetadataForQuestionPage
    ).toHaveBeenCalledWith(id);
  });
});

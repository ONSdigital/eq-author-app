const executeQuery = require("../../utils/executeQuery");

describe("QuestionConfirmation", () => {
  let repositories;

  beforeEach(() => {
    repositories = {
      Page: {
        getById: jest.fn().mockResolvedValue({
          id: "1",
          title: "page title",
          pageType: "QuestionPage"
        })
      },
      QuestionConfirmation: {
        findById: jest.fn().mockResolvedValue({
          id: "1",
          title: "My new title",
          positiveLabel: "pl",
          positiveDescription: "pd",
          negativeLabel: "nl",
          negativeDescription: "nd",
          pageId: "1"
        }),
        findByPageId: jest.fn().mockResolvedValue({
          id: "1",
          title: "My new title",
          positiveLabel: "pl",
          positiveDescription: "pd",
          negativeLabel: "nl",
          negativeDescription: "nd",
          pageId: "1"
        })
      }
    };
  });

  it("should retrieve a question confirmation by id", async () => {
    const query = `
      query getQuestionConfirmation($input: ID!) {
        questionConfirmation(id: $input) {
          id
          displayName
          title
          positive {
            label
          }
          negative {
            description
          }
        }
      }
    `;
    const result = await executeQuery(query, { input: "1" }, { repositories });
    expect(result.errors).toBeUndefined();
    expect(result.data).toMatchObject({
      questionConfirmation: {
        id: "1",
        displayName: "My new title",
        title: "My new title",
        positive: {
          label: "pl"
        },
        negative: {
          description: "nd"
        }
      }
    });
    expect(repositories.QuestionConfirmation.findById).toHaveBeenCalledWith(
      "1"
    );
  });

  it("should default the displayName to untitled", async () => {
    const query = `
      query getQuestionConfirmation($input: ID!) {
        questionConfirmation(id: $input) {
          id
          displayName
        }
      }
    `;
    repositories.QuestionConfirmation.findById = jest.fn().mockResolvedValue({
      id: "1",
      title: null
    });
    const result = await executeQuery(query, { input: "1" }, { repositories });
    expect(result.errors).toBeUndefined();
    expect(result.data).toMatchObject({
      questionConfirmation: {
        id: "1",
        displayName: "Untitled Confirmation"
      }
    });
  });

  it("should be able to be retrieved through a page", async () => {
    const query = `
      query getQuestionConfirmation($input: ID!) {
        page(id: $input) {
          id
          ...on QuestionPage {
            confirmation {
              id
              title
            }
          }
        }
      }
    `;

    const result = await executeQuery(query, { input: "1" }, { repositories });
    expect(result.errors).toBeUndefined();
    expect(result.data).toMatchObject({
      page: {
        id: "1",
        confirmation: {
          id: "1",
          title: "My new title"
        }
      }
    });
  });

  it("should be able to retrieve a page through it", async () => {
    const query = `
      query getQuestionConfirmation($input: ID!) {
        questionConfirmation(id: $input) {
          id
          page {
            id
            title
          }
        }
      }
    `;

    const result = await executeQuery(query, { input: "1" }, { repositories });

    expect(result.errors).toBeUndefined();
    expect(result.data).toMatchObject({
      questionConfirmation: {
        id: "1",
        page: {
          id: "1",
          title: "page title"
        }
      }
    });
  });
});

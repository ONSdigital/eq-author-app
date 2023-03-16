const executeQuery = require("../../tests/utils/executeQuery");

jest.mock("node-fetch");

const fetch = require("node-fetch");
const query = `
query GetPrepopSchemaVersions($id: ID!) {
    prepopSchemaVersions(id: $id) {
      surveyId
      versions {
        id
        version
        dateCreated
      }
    }
  }
`;

fetch.mockImplementation(() =>
  Promise.resolve({
    status: 200,
    json: () => ({
      surveyId: "123",
      versions: [
        {
          id: "123-111-789",
          version: "1",
          dateCreated: "2023-01-12T13:37:27+00:00",
        },
        {
          id: "123-222-789",
          version: "2",
          dateCreated: "2023-02-08T12:37:27+00:00",
        },
        {
          id: "123-333-789",
          version: "3",
          dateCreated: "2023-03-23T08:37:27+00:00",
        },
      ],
    }),
  })
);

describe("PrepopSchemaVersions", () => {
  it("should throw error if the ID is undefined", async () => {
    try {
      await executeQuery(query);
    } catch (error) {
      expect(error.message).toMatch(
        `Variable "$id" of required type "ID!" was not provided.`
      );
    }
  });

  it("should query prepop schema", async () => {
    const surveyId = "123";
    const expectedResponse = {
      data: {
        prepopSchemaVersions: {
          surveyId: "123",
          versions: [
            {
              id: "123-111-789",
              version: "1",
              dateCreated: "2023-01-12T13:37:27+00:00",
            },
            {
              id: "123-222-789",
              version: "2",
              dateCreated: "2023-02-08T12:37:27+00:00",
            },
            {
              id: "123-333-789",
              version: "3",
              dateCreated: "2023-03-23T08:37:27+00:00",
            },
          ],
        },
      },
    };

    const response = await executeQuery(query, { id: surveyId });
    expect(response).toMatchObject(expectedResponse);
  });
});

/* eslint-disable camelcase */
const executeQuery = require("../../tests/utils/executeQuery");

jest.mock("node-fetch");

const fetch = require("node-fetch");
const query = `
query GetSupplementaryDataVersions($id: ID!) {
    supplementaryDataVersions(id: $id) {
      surveyId
      versions {
        guid
        sds_schema_version
        sds_published_at
      }
    }
  }
`;

fetch.mockImplementation(() =>
  Promise.resolve({
    status: 200,
    json: () => [
      {
        guid: "123-111-789",
        sds_schema_version: "1",
        sds_published_at: "2023-01-12T13:37:27+00:00",
      },
      {
        guid: "123-222-789",
        sds_schema_version: "2",
        sds_published_at: "2023-02-08T12:37:27+00:00",
      },
      {
        guid: "123-333-789",
        sds_schema_version: "3",
        sds_published_at: "2023-03-23T08:37:27+00:00",
      },
    ],
  })
);

describe("SupplementaryDataVersions", () => {
  it("should query prepop schema", async () => {
    const surveyId = "123";
    const expectedResponse = {
      data: {
        supplementaryDataVersions: {
          surveyId: "123",
          versions: [
            {
              guid: "123-111-789",
              sds_schema_version: "1",
              sds_published_at: "2023-01-12T13:37:27+00:00",
            },
            {
              guid: "123-222-789",
              sds_schema_version: "2",
              sds_published_at: "2023-02-08T12:37:27+00:00",
            },
            {
              guid: "123-333-789",
              sds_schema_version: "3",
              sds_published_at: "2023-03-23T08:37:27+00:00",
            },
          ],
        },
      },
    };

    const response = await executeQuery(query, { id: surveyId });
    expect(response).toMatchObject(expectedResponse);
  });
});

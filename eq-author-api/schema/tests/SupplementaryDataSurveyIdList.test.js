/* eslint-disable camelcase */
const executeQuery = require("../../tests/utils/executeQuery");

jest.mock("node-fetch");

const fetch = require("node-fetch");
const query = `
query GetSupplementaryDataSurveyIdList {
    supplementaryDataSurveyIdList {
        surveyIdList
    }
 }`;

fetch.mockImplementation(() =>
  Promise.resolve({
    status: 200,
    json: () => ["121", "122", "123"],
  })
);

describe("SupplementaryDataSurveyIdList", () => {
  it("should query supplementary data survey id list schema", async () => {
    const expectedResponse = {
      data: {
        supplementaryDataSurveyIdList: {
          surveyIdList: ["121", "122", "123"],
        },
      },
    };

    const response = await executeQuery(query);
    expect(response).toMatchObject(expectedResponse);
  });
});

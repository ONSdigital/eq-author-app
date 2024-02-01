/* eslint-disable camelcase */
const executeQuery = require("../../tests/utils/executeQuery");

jest.mock("node-fetch");

const fetch = require("node-fetch");
const query = `
query GetSupplementaryDataSurveyIdList {
    supplementaryDataSurveyIdList {
        surveyId
        surveyName
    }
 }`;

fetch.mockImplementation(() =>
  Promise.resolve({
    status: 200,
    json: () => [
      { survey_id: "121", survey_name: "survey1" },
      { survey_id: "122", survey_name: "survey2" },
      { survey_id: "123", survey_name: "survey3" },
    ],
  })
);

describe("SupplementaryDataSurveyIdList", () => {
  it("should query supplementary data survey id list schema", async () => {
    const expectedResponse = {
      data: {
        supplementaryDataSurveyIdList: [
          { surveyId: "121", surveyName: "survey1" },
          { surveyId: "122", surveyName: "survey2" },
          { surveyId: "123", surveyName: "survey3" },
        ],
      },
    };

    const response = await executeQuery(query);
    expect(response).toMatchObject(expectedResponse);
  });
});

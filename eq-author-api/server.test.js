const { omit } = require("lodash");
const request = require("supertest");

const { NUMBER } = require("./constants/answerTypes");
const { buildQuestionnaire } = require("./tests/utils/questionnaireBuilder");

const server = require("./server");

describe("Server", () => {
  describe("export", () => {
    it("should dump the questionnaire", async () => {
      const questionnaire = await buildQuestionnaire({
        sections: [{ pages: [{ answers: [{ type: NUMBER }] }] }],
      });
      const response = await request(server).get(`/export/${questionnaire.id}`);

      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(JSON.stringify(questionnaire))).toMatchObject(
        JSON.parse(response.text)
      );
    });
    it("should return 404 when no questionnaire is found", async () => {
      const response = await request(server).get(`/export/not-a-questionnaire`);

      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.statusCode).toBe(404);
    });
  });

  describe("import", () => {
    it("should save a questionnaire from the json", async () => {
      const questionnaire = await buildQuestionnaire({
        sections: [{ pages: [{ answers: [{ type: NUMBER }] }] }],
      });

      const questionnaireJSON = JSON.parse(JSON.stringify(questionnaire));

      const response = await request(server)
        .post("/import")
        .send(questionnaireJSON);

      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.statusCode).toBe(200);

      const importResponseData = JSON.parse(response.text);
      expect(importResponseData).toEqual({ id: expect.any(String) });

      const dumpResponse = await request(server).get(
        `/export/${importResponseData.id}`
      );

      const overwrittenFields = ["id", "createdAt", "updatedAt"];
      expect(JSON.parse(dumpResponse.text)).toMatchObject(
        omit(questionnaireJSON, overwrittenFields)
      );
    });
  });
});

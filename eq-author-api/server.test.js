const { omit } = require("lodash");
const request = require("supertest");

const { NUMBER } = require("./constants/answerTypes");
const { buildQuestionnaire } = require("./tests/utils/questionnaireBuilder");

const { createApp } = require("./server");
const { introspectionQuery } = require("graphql");

const jwt = require("jsonwebtoken");
const uuid = require("uuid");

describe("Server", () => {
  describe("export", () => {
    let server;

    beforeEach(() => {
      server = createApp();
    });

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

      process.env.ENABLE_IMPORT = "true";
      const server = createApp();

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

  describe("tracing", () => {
    it("should construct a server with opentracing enabled", async () => {
      process.env.ENABLE_OPENTRACING = "true";
      process.env.JAEGER_SERVICE_NAME = "test_service_name";
      const server = createApp();
      const token = jwt.sign(
        {
          sub: "tracing_test",
          name: "tracing_test",
          email: "tracing_test",
          picture: "",
        },
        uuid.v4()
      );
      const response = await request(server)
        .post("/graphql")
        .set("authorization", `Bearer ${token}`)
        .send({ query: introspectionQuery });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.text)).toEqual(
        expect.objectContaining({
          data: expect.any(Object),
        })
      );
    });
  });
});

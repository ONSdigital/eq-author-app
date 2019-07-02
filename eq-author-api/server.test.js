const { omit } = require("lodash");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");

const { NUMBER } = require("./constants/answerTypes");
const { buildContext } = require("./tests/utils/contextBuilder");

const { createApp } = require("./server");
const { introspectionQuery } = require("graphql");
const { createUser } = require("./utils/datastore");

const tracer = require("./tracer");
const apolloOpenTracing = require("apollo-opentracing");

jest.mock("./tracer");
jest.mock("apollo-opentracing");

describe("Server", () => {
  describe("export", () => {
    let server;

    beforeEach(() => {
      server = createApp();
    });

    it("should dump the questionnaire", async () => {
      const ctx = await buildContext({
        sections: [{ pages: [{ answers: [{ type: NUMBER }] }] }],
      });
      const { questionnaire } = ctx;
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
      const ctx = await buildContext({
        sections: [{ pages: [{ answers: [{ type: NUMBER }] }] }],
      });
      const { questionnaire } = ctx;
      const questionnaireJSON = JSON.parse(JSON.stringify(questionnaire));
      ctx.user.sub = ctx.user.externalId;
      const token = jwt.sign(ctx.user, uuid.v4());
      process.env.ENABLE_IMPORT = "true";
      const server = createApp();

      const response = await request(server)
        .post("/import")
        .set("authorization", `Bearer ${token}`)
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
    const originalOpenTracing = process.env.ENABLE_OPENTRACING;
    afterEach(() => {
      process.env.ENABLE_OPENTRACING = originalOpenTracing;
    });

    it("should construct a server with opentracing enabled", async () => {
      process.env.ENABLE_OPENTRACING = "true";
      process.env.JAEGER_SERVICE_NAME = "test_service_name";

      tracer.tracer = jest.fn().mockReturnValue({
        localTracer: "localTracer",
        serverTracer: "serverTracer",
      });
      apolloOpenTracing.default = jest.fn();

      const server = createApp();
      const user = {
        sub: "1234",
        name: "tracing_test",
        externalId: "1234",
      };
      await createUser(user);
      const token = jwt.sign(user, uuid.v4());
      const response = await request(server)
        .post("/graphql")
        .set("authorization", `Bearer ${token}`)
        .send({ query: introspectionQuery });

      expect(apolloOpenTracing.default).toHaveBeenCalledWith({
        local: "localTracer",
        server: "serverTracer",
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.text)).toEqual(
        expect.objectContaining({
          data: expect.any(Object),
        })
      );
    });
  });
});

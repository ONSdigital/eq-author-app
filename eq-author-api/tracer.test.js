const { initTracerFromEnv } = require("jaeger-client");

const createTracer = require("./tracer").tracer;

jest.mock("jaeger-client");
jest.mock("prom-client");

describe("createTracer", () => {
  let logger;

  const SERVICE_NAME = "service_name";
  const API_VERSION = "api_version";

  beforeEach(() => {
    logger = {
      info: jest.fn(),
    };
    process.env.JAEGER_SERVICE_NAME = SERVICE_NAME;
    process.env.EQ_AUTHOR_API_VERSION = API_VERSION;
  });

  afterAll(() => {
    delete process.env.JAEGER_SERVICE_NAME;
    delete process.env.EQ_AUTHOR_API_VERSION;
  });

  it("should be a function", () => {
    expect(createTracer).toEqual(expect.any(Function));
  });

  it("should return a local tracer", () => {
    initTracerFromEnv.mockReturnValue("tracer");
    expect(createTracer(logger).localTracer).toEqual("tracer");
  });

  it("should return a server tracer", () => {
    initTracerFromEnv.mockReturnValue("tracer");
    expect(createTracer(logger).serverTracer).toEqual("tracer");
  });

  it("should reuse the same tracer instance", () => {
    expect(initTracerFromEnv).toHaveBeenCalledTimes(1);
  });

  it("should set the tracer service name", () => {
    expect(initTracerFromEnv).toHaveBeenCalledWith(
      expect.objectContaining({
        serviceName: SERVICE_NAME,
      }),
      expect.any(Object)
    );
  });

  it("should tag the trace with API version number", () => {
    expect(initTracerFromEnv).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        tags: {
          "eq_author_api.version": API_VERSION,
        },
      })
    );
  });
});

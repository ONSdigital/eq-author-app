const createTracer = require("./tracer");

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
    expect(createTracer(logger).localTracer).toEqual(expect.any(Object));
  });

  it("should return a server tracer", () => {
    expect(createTracer(logger).serverTracer).toEqual(expect.any(Object));
  });

  it("should reuse the same tracer instance", () => {
    expect(createTracer(logger).localTracer).toBe(
      createTracer(logger).serverTracer
    );
  });

  it("should set the tracer service name", () => {
    expect(createTracer(logger).localTracer).toHaveProperty(
      "_serviceName",
      SERVICE_NAME
    );
  });

  it("should tag the trace with API version number", () => {
    expect(createTracer(logger).localTracer).toHaveProperty(
      "_tags",
      expect.objectContaining({
        "eq_author_api.version": API_VERSION,
      })
    );
  });
});

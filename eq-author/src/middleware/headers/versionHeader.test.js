import versionHeader from "./versionHeader";

describe("versionHeader", () => {
  let env;
  beforeEach(() => {
    env = Object.assign({}, process.env);
  });
  afterEach(() => {
    process.env = env;
  });
  it("should append a clientVersion field to an incoming object", () => {
    process.env.REACT_APP_EQ_AUTHOR_VERSION = "theBest";

    const initialHeaders = {
      hello: "goodbye",
    };
    const newHeaders = versionHeader(initialHeaders);

    expect(newHeaders).toMatchObject({
      hello: "goodbye",
      clientVersion: "theBest",
    });
  });

  it("should not append a clientVersion field to the incoming object if author version not set", () => {
    const initialHeaders = {
      hello: "goodbye",
    };
    const newHeaders = versionHeader(initialHeaders);

    expect(newHeaders.clientVersion).toBeUndefined();
  });
});

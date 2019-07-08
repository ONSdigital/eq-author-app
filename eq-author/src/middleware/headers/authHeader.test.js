import appendAuthHeader from "./authHeader";

describe("appendAuthHeader", () => {
  let otherHeaders;

  beforeEach(() => {
    otherHeaders = {
      ContentType: "text/html",
    };

    localStorage.removeItem("accessToken");
  });

  describe("non-existent localStorage", () => {
    let tempLocalStorage = {};
    beforeEach(() => {
      Object.assign(tempLocalStorage, localStorage);
    });
    afterEach(() => {
      Object.defineProperty(window, "localStorage", {
        value: tempLocalStorage,
      });
    });

    it("should just return default headers if no localStorage exists", () => {
      expect(appendAuthHeader(otherHeaders)).toMatchObject({
        ContentType: "text/html",
      });
    });
  });

  it("should append auth header if token exists", () => {
    localStorage.setItem("accessToken", "abc.def.ghi");

    expect(appendAuthHeader(otherHeaders)).toMatchObject({
      ContentType: "text/html",
      authorization: "Bearer abc.def.ghi",
    });
  });

  it("should not append auth header if no access token exists", () => {
    expect(appendAuthHeader(otherHeaders)).not.toHaveProperty("authorization");
  });
});

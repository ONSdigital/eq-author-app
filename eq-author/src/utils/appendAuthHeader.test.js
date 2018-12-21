import appendAuthHeader from "utils/appendAuthHeader";

describe("appendAuthHeader", () => {
  let otherHeaders;

  beforeEach(() => {
    otherHeaders = {
      ContentType: "text/html"
    };

    localStorage.removeItem("accessToken");
  });

  it("should append auth header if token exists", () => {
    localStorage.setItem("accessToken", "abc.def.ghi");

    expect(appendAuthHeader(otherHeaders).headers).toMatchObject({
      ContentType: "text/html",
      authorization: "Bearer abc.def.ghi"
    });
  });

  it("should not append auth header if no access token exists", () => {
    expect(appendAuthHeader(otherHeaders).headers).not.toHaveProperty(
      "authorization"
    );
  });
});

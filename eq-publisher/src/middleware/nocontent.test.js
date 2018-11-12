const nocontent = require("./nocontent");

describe("nocontent middleware", () => {
  let req;
  let res;

  beforeEach(() => {
    req = jest.fn();
    res = {
      status: jest.fn()
    };
  });

  it("should return 204 status code", () => {
    nocontent(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
  });
});

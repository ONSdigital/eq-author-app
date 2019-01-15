/* eslint-disable camelcase */
import { createAccessToken } from "./index";
import jwt from "jsonwebtoken";
import { pick } from "lodash/fp";

describe("createAccessToken", () => {
  let payload;

  beforeEach(() => {
    payload = {
      user_id: "mock_user_id",
      name: "Author Integration Test",
      email: "eq-team@ons.gov.uk",
      picture: "file:///path/to/some/picture.jpg",
    };
  });

  it("should sign a JWT with a payload", () => {
    const result = createAccessToken(payload);
    expect(pick(Object.keys(payload), jwt.decode(result))).toEqual(payload);
  });
});

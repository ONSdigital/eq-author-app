const { verifyJwtToken } = require("./verifyJwtToken");
const mockJwt = require("jsonwebtoken");

const uuid = require("uuid");

jest.mock("firebase-admin", () => {
  return {
    initializeApp: jest.fn(),
    auth: () => {
      return {
        verifyIdToken: accessToken => {
          return accessToken !== "invalid.token"
            ? Promise.resolve(mockJwt.decode(accessToken))
            : Promise.reject({ error: true });
        },
      };
    },
  };
});

describe("Verify JWT Token", () => {
  it("should return decoded JWT token for valid access token", async () => {
    const payload = {
      name: "payloadName",
      field: "fieldName",
    };
    const accessToken = mockJwt.sign(payload, uuid.v4());

    const jwtToken = await verifyJwtToken(accessToken);

    expect(jwtToken).toMatchObject(payload);
  });

  it("should catch error for invalid access token", async () => {
    const expected = { error: { error: true } };
    const accessToken = "invalid.token";
    const jwtToken = await verifyJwtToken(accessToken);
    expect(jwtToken).toMatchObject(expected);
  });
});

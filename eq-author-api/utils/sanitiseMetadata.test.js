/* eslint-disable camelcase*/
const { sanitiseMetadata } = require("./sanitiseMetadata");
jest.mock("uuid/v1", () => () => 123);
describe("sanitise Metadata", () => {
  let defaultMetadata;

  beforeEach(() => {
    defaultMetadata = {
      tx_id: 123,
      jti: 123,
      iat: expect.any(Number),
      exp: expect.any(Number),
      user_id: "UNKNOWN",
      case_id: 123,
      ru_ref: "12346789012A",
      ru_name: "ESSENTIAL ENTERPRISE LTD",
      trad_as: "ESSENTIAL ENTERPRISE LTD",
      eq_id: 1,
      collection_exercise_sid: 123,
      period_id: "201605",
      form_type: 1,
      survey_url: expect.any(String)
    };
  });

  it("should add the correct defaults when no metadata is defined", () => {
    const sanitisedMetadata = sanitiseMetadata({}, 1);
    expect(sanitisedMetadata).toMatchObject(defaultMetadata);
  });

  it("should overwrite user defined metadata when it uses reserved keys", () => {
    const sanitisedMetadata = sanitiseMetadata(
      {
        iat: "foo",
        exp: "bar"
      },
      1
    );
    expect(sanitisedMetadata).toMatchObject(defaultMetadata);
  });

  it("should allow user defined metadata to overwrite the defaults where not reserved", () => {
    defaultMetadata.ru_name = "foo";
    defaultMetadata.trad_as = "bar";
    const sanitisedMetadata = sanitiseMetadata(
      {
        ru_name: "foo",
        trad_as: "bar"
      },
      1
    );
    expect(sanitisedMetadata).toMatchObject(defaultMetadata);
  });
});

/* eslint-disable camelcase*/
const { sanitiseMetadata } = require("./sanitiseMetadataV2");
jest.mock("uuid", () => ({
  v1: () => 123,
}));
describe("sanitise Metadata", () => {
  let defaultMetadata;

  describe("GCP", () => {
    beforeEach(() => {
      defaultMetadata = {
        tx_id: 123,
        jti: 123,
        iat: expect.any(Number),
        exp: expect.any(Number),
        case_id: 123,
        collection_exercise_sid: 123,
        schema_url: expect.any(String),
        survey_metadata: {
          data: {
            user_id: "UNKNOWN",
            ru_ref: "12346789012A",
            ru_name: "ESSENTIAL ENTERPRISE LTD",
            trad_as: "ESSENTIAL ENTERPRISE LTD",
            period_id: "201605",
          },
        },
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
          exp: "bar",
        },
        1
      );
      expect(sanitisedMetadata).toMatchObject(defaultMetadata);
    });

    it("should allow user defined metadata to overwrite the defaults where not reserved", () => {
      defaultMetadata.survey_metadata.data.ru_name = "foo";
      defaultMetadata.survey_metadata.data.trad_as = "bar";
      const sanitisedMetadata = sanitiseMetadata(
        {
          ru_name: "foo",
          trad_as: "bar",
        },
        1
      );
      console.log(sanitisedMetadata);
      expect(sanitisedMetadata).toMatchObject(defaultMetadata);
    });
  });
});

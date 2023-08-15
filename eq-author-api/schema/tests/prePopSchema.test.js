const { buildContext } = require("../../tests/utils/contextBuilder");
const {
  deleteQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");
const {
  queryPrepopSchema,
  updatePrepopSchema,
  unlinkPrepopSchema,
} = require("../../tests/utils/contextBuilder/prepopSchema");

const { BUSINESS } = require("../../constants/questionnaireTypes");

jest.mock("node-fetch");
const fetch = require("node-fetch");

describe("questionnaire", () => {
  let ctx, questionnaire;

  beforeEach(async () => {
    ctx = await buildContext({ type: BUSINESS });
    questionnaire = ctx.questionnaire;
  });

  afterEach(async () => {
    await deleteQuestionnaire(ctx, questionnaire.id);
  });

  let input = {
    id: "121-222-789",
    surveyId: "121",
    version: "1",
    dateCreated: "2023-01-12T13:37:27+00:00",
  };

  fetch.mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => ({
        $schema: "https://json-schema.org/draft/2020-12/schema",
        $id: "roofing_tiles_and_slate.json",
        title: "SDS schema for the Roofing Tiles + Slate survey",
        type: "object",
        properties: {
          identifier: {
            type: "string",
            description:
              "The unique top-level identifier. This is the reporting unit reference without the check letter appended",
            minLength: 11,
            pattern: "^[a-zA-Z0-9]+$",
            examples: ["34942807969"],
          },
          companyName: {
            type: "string",
            minLength: 1,
            examples: ["Joe Bloggs PLC"],
          },
          companyType: {
            type: "string",
            minLength: 1,
            examples: ["Public Limited Company"],
          },
          items: {
            type: "object",
            properties: {
              localUnits: {
                type: "array",
                description: "The data about each item",
                minItems: 1,
                uniqueItems: true,
                items: {
                  type: "object",
                  properties: {
                    identifier: {
                      type: "string",
                      minLength: 1,
                      description:
                        "The unique identifier for the items. This is the local unit reference.",
                      examples: ["3340224"],
                    },
                    luName: {
                      type: "string",
                      minLength: 1,
                      description: "Name of the local unit",
                      examples: ["STUBBS BUILDING PRODUCTS LTD"],
                    },
                    luAddress: {
                      type: "array",
                      description:
                        "The fields of the address for the local unit",
                      items: {
                        type: "string",
                        minLength: 1,
                      },
                      minItems: 1,
                      uniqueItems: true,
                      examples: [
                        [
                          "WELLINGTON ROAD",
                          "LOCHMABEN",
                          "SWINDON",
                          "BEDS",
                          "GLOS",
                          "DE41 2WA",
                        ],
                      ],
                    },
                  },
                  additionalProperties: false,
                  required: ["identifier", "lu_name", "lu_address"],
                },
              },
            },
            additionalProperties: false,
            required: ["local_units"],
          },
        },
        additionalProperties: false,
        required: ["schema_version", "identifier", "items"],
      }),
    })
  );

  const prepopSchemaData = {
    id: "121-222-789",
    surveyId: "121",
    version: "1",
    dateCreated: "2023-01-12T13:37:27+00:00",
    data: [
      {
        fieldName: "companyName",
        type: "string",
        id: expect.any(String),
        exampleValue: "Joe Bloggs PLC",
      },
      {
        type: "string",
        fieldName: "companyType",
        id: expect.any(String),
        exampleValue: "Public Limited Company",
      },
    ],
  };

  describe("should query the prepop schema", () => {
    it("should return the questionnaire prepopSchema", async () => {
      ctx.questionnaire.prepopSchema = prepopSchemaData;
      const prepopSchema = await queryPrepopSchema(ctx);
      expect(prepopSchema).toEqual(prepopSchemaData);
    });
  });

  describe("should update the prepop schema", () => {
    it("should update the prepopSchema", async () => {
      const updatedPrepopSchema = await updatePrepopSchema(ctx, input);
      expect(updatedPrepopSchema).toEqual(prepopSchemaData);
    });
  });

  describe("should unlink the prepop schema", () => {
    it("should unlink the prepop schema", async () => {
      const unlinkedPrepopSchema = await unlinkPrepopSchema(ctx);
      expect(unlinkedPrepopSchema.prepopSchema).toEqual(null);
    });
  });
});

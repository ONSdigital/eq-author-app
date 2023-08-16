const { buildContext } = require("../../tests/utils/contextBuilder");
const {
  deleteQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");
const {
  querySupplementaryData,
  updateSupplementaryData,
  unlinkSupplementaryData,
} = require("../../tests/utils/contextBuilder/supplementaryData");

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

  const supplementaryDataData = {
    id: "121-222-789",
    surveyId: "121",
    version: "1",
    dateCreated: "2023-01-12T13:37:27+00:00",
    data: [
      {
        identifier: "companyName",
        type: "string",
        id: expect.any(String),
        example: "Joe Bloggs PLC",
        list: "",
        selector: "",
      },
      {
        type: "string",
        identifier: "companyType",
        id: expect.any(String),
        example: "Public Limited Company",
        list: "",
        selector: "",
      },
      {
        description: "Name of the local unit",
        example: "STUBBS BUILDING PRODUCTS LTD",
        id: expect.any(String),
        identifier: "luName",
        list: "localUnits",
        selector: "",
        type: "string",
      },
      {
        description: "The fields of the address for the local unit",
        example: [
          "WELLINGTON ROAD",
          "LOCHMABEN",
          "SWINDON",
          "BEDS",
          "GLOS",
          "DE41 2WA",
        ],
        id: expect.any(String),
        identifier: "luAddress",
        list: "localUnits",
        selector: "",
        type: "array",
      },
    ],
  };

  describe("should query the prepop schema", () => {
    it("should return the questionnaire supplementaryData", async () => {
      ctx.questionnaire.supplementaryData = supplementaryDataData;
      const supplementaryData = await querySupplementaryData(ctx);
      expect(supplementaryData).toEqual(supplementaryDataData);
    });
  });

  describe("should update the prepop schema", () => {
    it("should update the supplementaryData", async () => {
      const updatedSupplementaryData = await updateSupplementaryData(
        ctx,
        input
      );
      expect(updatedSupplementaryData).toEqual(supplementaryDataData);
    });
  });

  describe("should unlink the prepop schema", () => {
    it("should unlink the prepop schema", async () => {
      const unlinkedSupplementaryData = await unlinkSupplementaryData(ctx);
      expect(unlinkedSupplementaryData.supplementaryData).toEqual(null);
    });
  });
});

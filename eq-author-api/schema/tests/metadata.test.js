const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");
const { get, last } = require("lodash");

const {
  buildQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder");

const {
  deleteQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder/questionnaire");
const {
  createMetadata,
  updateMetadata,
  queryMetadata,
  deleteMetadata,
} = require("../../tests/utils/questionnaireBuilder/metadata");

const {
  TEXT,
  REGION,
  DATE,
  LANGUAGE,
} = require("../../constants/metadataTypes");
const { CY, EN } = require("../../constants/metadataLanguages");
const { GB_ENG } = require("../../constants/metadataRegions");
const { defaultValues } = require("../../utils/defaultMetadata");

describe("metadata", () => {
  let questionnaire, metadata;
  let config = {
    metadata: [{}],
  };

  beforeAll(async () => {
    questionnaire = await buildQuestionnaire(config);
    metadata = last(questionnaire.metadata);
  });

  afterAll(async () => {
    await deleteQuestionnaire(questionnaire.id);
  });

  describe("create", () => {
    it("should create a metadata", () => {
      expect(metadata).toMatchObject({
        id: expect.any(String),
        alias: null,
        key: null,
        type: TEXT,
        value: null,
      });
    });
  });

  describe("mutate", () => {
    let createdMetadata, updatedMetadata;
    let update;
    beforeEach(async () => {
      createdMetadata = await createMetadata(questionnaire, {
        questionnaireId: questionnaire.id,
      });
      update = {
        id: createdMetadata.id,
        key: "key-updated",
        alias: "alias-updated",
        type: TEXT,
        dateValue: "2019-01-01",
        regionValue: GB_ENG,
        languageValue: CY,
        textValue: "textValue-updated",
      };
    });

    afterEach(async () => {
      await deleteMetadata(questionnaire, createdMetadata.id);
    });

    it("should mutate metadata key and alias", async () => {
      updatedMetadata = await updateMetadata(questionnaire, update);
      expect(updatedMetadata).toEqual(
        expect.objectContaining({
          id: createdMetadata.id,
          key: "key-updated",
          alias: "alias-updated",
        })
      );
    });

    it("should mutate metadata for region type and null other values", async () => {
      updatedMetadata = await updateMetadata(questionnaire, {
        ...update,
        type: REGION,
        regionValue: GB_ENG,
      });
      expect(updatedMetadata).toEqual(
        expect.objectContaining({
          id: createdMetadata.id,
          type: REGION,
          dateValue: null,
          regionValue: GB_ENG,
          languageValue: null,
          textValue: null,
        })
      );
    });

    it("should mutate metadata for text type and null other values", async () => {
      updatedMetadata = await updateMetadata(questionnaire, {
        ...update,
        type: TEXT,
        textValue: "updated-value",
      });
      expect(updatedMetadata).toEqual(
        expect.objectContaining({
          id: createdMetadata.id,
          type: TEXT,
          dateValue: null,
          regionValue: null,
          languageValue: null,
          textValue: "updated-value",
        })
      );
    });

    it("should mutate metadata for language type and null other values", async () => {
      updatedMetadata = await updateMetadata(questionnaire, {
        ...update,
        type: LANGUAGE,
        languageValue: CY,
      });
      expect(updatedMetadata).toEqual(
        expect.objectContaining({
          id: createdMetadata.id,
          type: LANGUAGE,
          dateValue: null,
          regionValue: null,
          languageValue: CY,
          textValue: null,
        })
      );
    });

    it("should mutate metadata for date type and null other values", async () => {
      updatedMetadata = await updateMetadata(questionnaire, {
        ...update,
        type: DATE,
        dateValue: "2019-01-01",
      });
      expect(updatedMetadata).toEqual(
        expect.objectContaining({
          id: createdMetadata.id,
          type: DATE,
          dateValue: "2019-01-01",
          regionValue: null,
          languageValue: null,
          textValue: null,
        })
      );
    });

    it("should default metadata regionValue when region type", async () => {
      updatedMetadata = await updateMetadata(questionnaire, {
        id: createdMetadata.id,
        type: REGION,
      });
      expect(updatedMetadata).toEqual(
        expect.objectContaining({
          id: createdMetadata.id,
          type: REGION,
          dateValue: null,
          regionValue: GB_ENG,
          languageValue: null,
          textValue: null,
        })
      );
    });

    it("should default metadata languageValue when language type", async () => {
      updatedMetadata = await updateMetadata(questionnaire, {
        id: createdMetadata.id,
        type: LANGUAGE,
      });
      expect(updatedMetadata).toEqual(
        expect.objectContaining({
          id: createdMetadata.id,
          type: LANGUAGE,
          dateValue: null,
          regionValue: null,
          languageValue: EN,
          textValue: null,
        })
      );
    });

    it("should default metadata for known keys", async () => {
      const promises = defaultValues.map(
        async ({ key, alias, type, value }) => {
          updatedMetadata = await updateMetadata(questionnaire, {
            id: createdMetadata.id,
            key,
            alias,
            type,
            dateValue: type === DATE ? value : null,
            regionValue: type === REGION ? value : null,
            languageValue: type === LANGUAGE ? value : null,
            textValue: type === TEXT ? value : null,
          });
          expect(updatedMetadata).toEqual(
            expect.objectContaining({
              id: createdMetadata.id,
              key,
              alias,
              type,
              dateValue: type === DATE ? value : null,
              regionValue: type === REGION ? value : null,
              languageValue: type === LANGUAGE ? value : null,
              textValue: type === TEXT ? value : null,
            })
          );
        }
      );

      return Promise.all(promises);
    });
  });

  describe("query", () => {
    let update, createdMetadata;

    beforeEach(async () => {
      createdMetadata = await createMetadata(questionnaire, {
        questionnaireId: questionnaire.id,
      });

      update = {
        id: createdMetadata.id,
        key: "key-updated",
        alias: "alias-updated",
      };
    });

    afterEach(async () => {
      await deleteMetadata(questionnaire, createdMetadata.id);
    });

    it("should resolve metadata fields for date", async () => {
      await updateMetadata(questionnaire, {
        ...update,
        type: DATE,
        dateValue: "2019-01-01",
      });
      const queriedMetadata = await queryMetadata(questionnaire);

      expect(last(queriedMetadata)).toMatchObject({
        id: expect.any(String),
        key: expect.any(String),
        alias: expect.any(String),
        type: expect.any(String),
        dateValue: expect.any(String),
        regionValue: null,
        languageValue: null,
        textValue: null,
        displayName: expect.any(String),
      });
    });

    it("should resolve metadata fields for region", async () => {
      await updateMetadata(questionnaire, {
        ...update,
        type: REGION,
        regionValue: GB_ENG,
      });
      const queriedMetadata = await queryMetadata(questionnaire);

      expect(last(queriedMetadata)).toMatchObject({
        id: expect.any(String),
        key: expect.any(String),
        alias: expect.any(String),
        type: expect.any(String),
        dateValue: null,
        regionValue: expect.any(String),
        languageValue: null,
        textValue: null,
        displayName: expect.any(String),
      });
    });

    it("should resolve metadata fields for language", async () => {
      await updateMetadata(questionnaire, {
        ...update,
        type: LANGUAGE,
        languageValue: EN,
      });
      const queriedMetadata = await queryMetadata(questionnaire);

      expect(last(queriedMetadata)).toMatchObject({
        id: expect.any(String),
        key: expect.any(String),
        alias: expect.any(String),
        type: expect.any(String),
        dateValue: null,
        regionValue: null,
        languageValue: expect.any(String),
        textValue: null,
        displayName: expect.any(String),
      });
    });

    it("should resolve metadata fields for text", async () => {
      await updateMetadata(questionnaire, {
        ...update,
        type: TEXT,
        textValue: "textValue",
      });
      const queriedMetadata = await queryMetadata(questionnaire);

      expect(last(queriedMetadata)).toMatchObject({
        id: expect.any(String),
        key: expect.any(String),
        alias: expect.any(String),
        type: expect.any(String),
        dateValue: null,
        regionValue: null,
        languageValue: null,
        textValue: expect.any(String),
        displayName: expect.any(String),
      });
    });
  });
});

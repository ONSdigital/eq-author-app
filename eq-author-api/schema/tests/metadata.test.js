const { last } = require("lodash");

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
  let questionnaire;

  afterEach(async () => {
    await deleteQuestionnaire(questionnaire.id);
    questionnaire = null;
  });

  describe("create", () => {
    it("should create a metadata", async () => {
      questionnaire = await buildQuestionnaire({});
      const createdMetadata = await createMetadata(questionnaire, {
        questionnaireId: questionnaire.id,
      });
      expect(createdMetadata).toMatchObject({
        id: expect.any(String),
        alias: null,
        key: null,
        type: TEXT,
        dateValue: null,
        regionValue: null,
        languageValue: null,
        textValue: null,
        displayName: "Untitled Metadata",
      });
    });
  });

  describe("mutate", () => {
    let metadata, updatedMetadata;
    let update;
    beforeEach(async () => {
      questionnaire = await buildQuestionnaire({
        metadata: [{}],
      });
      metadata = questionnaire.metadata[0];
      update = {
        id: metadata.id,
        key: "key-updated",
        alias: "alias-updated",
        type: TEXT,
        dateValue: "2019-01-01",
        regionValue: GB_ENG,
        languageValue: CY,
        textValue: "textValue-updated",
      };
    });

    it("should mutate metadata key and alias", async () => {
      updatedMetadata = await updateMetadata(questionnaire, update);
      expect(updatedMetadata).toEqual(
        expect.objectContaining({
          id: metadata.id,
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
          id: metadata.id,
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
          id: metadata.id,
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
          id: metadata.id,
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
          id: metadata.id,
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
        id: metadata.id,
        type: REGION,
      });
      expect(updatedMetadata).toEqual(
        expect.objectContaining({
          id: metadata.id,
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
        id: metadata.id,
        type: LANGUAGE,
      });
      expect(updatedMetadata).toEqual(
        expect.objectContaining({
          id: metadata.id,
          type: LANGUAGE,
          dateValue: null,
          regionValue: null,
          languageValue: EN,
          textValue: null,
        })
      );
    });

    it("should default metadata for known keys", async () => {
      for (let defaultValue of defaultValues) {
        const { key, alias, type, value } = defaultValue;
        updatedMetadata = await updateMetadata(questionnaire, {
          id: metadata.id,
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
            id: metadata.id,
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
    });
  });

  describe("query", () => {
    it("should resolve metadata fields for date", async () => {
      questionnaire = await buildQuestionnaire({
        metadata: [
          {
            type: DATE,
            dateValue: "2019-01-01",
          },
        ],
      });
      const queriedMetadata = await queryMetadata(questionnaire);

      expect(queriedMetadata[0]).toMatchObject({
        type: DATE,
        dateValue: "2019-01-01",
        regionValue: null,
        languageValue: null,
        textValue: null,
      });
    });

    it("should resolve metadata fields for region", async () => {
      questionnaire = await buildQuestionnaire({
        metadata: [
          {
            type: REGION,
            regionValue: GB_ENG,
          },
        ],
      });
      const queriedMetadata = await queryMetadata(questionnaire);

      expect(last(queriedMetadata)).toMatchObject({
        type: REGION,
        regionValue: GB_ENG,
        dateValue: null,
        languageValue: null,
        textValue: null,
      });
    });

    it("should resolve metadata fields for language", async () => {
      questionnaire = await buildQuestionnaire({
        metadata: [
          {
            type: LANGUAGE,
            languageValue: EN,
          },
        ],
      });
      const queriedMetadata = await queryMetadata(questionnaire);

      expect(last(queriedMetadata)).toMatchObject({
        type: LANGUAGE,
        languageValue: EN,
        dateValue: null,
        regionValue: null,
        textValue: null,
      });
    });

    it("should resolve metadata fields for text", async () => {
      questionnaire = await buildQuestionnaire({
        metadata: [
          {
            type: TEXT,
            textValue: "textValue",
          },
        ],
      });
      const queriedMetadata = await queryMetadata(questionnaire);

      expect(last(queriedMetadata)).toMatchObject({
        type: TEXT,
        textValue: "textValue",
        dateValue: null,
        regionValue: null,
        languageValue: null,
      });
    });
  });

  describe("delete", () => {
    it("should delete a metadata", async () => {
      questionnaire = await buildQuestionnaire({
        metadata: [{}],
      });
      await deleteMetadata(questionnaire, questionnaire.metadata[0].id);
      const deletedMetadata = await queryMetadata(questionnaire);
      expect(deletedMetadata).toEqual([]);
    });
  });
});

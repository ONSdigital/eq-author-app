const { last } = require("lodash");

const { buildContext } = require("../../tests/utils/contextBuilder");

const {
  deleteQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");
const {
  createMetadata,
  updateMetadata,
  queryMetadata,
  deleteMetadata,
} = require("../../tests/utils/contextBuilder/metadata");

const {
  TEXT,
  TEXT_OPTIONAL,
  REGION,
  DATE,
  LANGUAGE,
} = require("../../constants/metadataTypes");
const { CY, EN } = require("../../constants/metadataLanguages");
const { GB_ENG } = require("../../constants/metadataRegions");
const { defaultValues } = require("../../utils/defaultMetadata");

describe("metadata", () => {
  let ctx, questionnaire;

  afterEach(async () => {
    await deleteQuestionnaire(ctx, questionnaire.id);
    questionnaire = null;
  });

  describe("create", () => {
    it("should create a metadata", async () => {
      ctx = await buildContext({});
      questionnaire = ctx.questionnaire;
      const createdMetadata = await createMetadata(ctx, {
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
        displayName: "Untitled metadata",
      });
    });
  });

  describe("mutate", () => {
    let metadata, updatedMetadata;
    let update;
    beforeEach(async () => {
      ctx = await buildContext({
        metadata: [{}],
      });
      questionnaire = ctx.questionnaire;
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
      updatedMetadata = await updateMetadata(ctx, update);
      expect(updatedMetadata).toEqual(
        expect.objectContaining({
          id: metadata.id,
          key: "key-updated",
          alias: "alias-updated",
        })
      );
    });

    it("should mutate metadata for region type and null other values", async () => {
      updatedMetadata = await updateMetadata(ctx, {
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
      updatedMetadata = await updateMetadata(ctx, {
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
      updatedMetadata = await updateMetadata(ctx, {
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
      updatedMetadata = await updateMetadata(ctx, {
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
      updatedMetadata = await updateMetadata(ctx, {
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
      updatedMetadata = await updateMetadata(ctx, {
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
        const {
          key,
          alias,
          type,
          dateValue,
          regionValue,
          languageValue,
          textValue,
        } = defaultValue;

        const expected = {
          id: metadata.id,
          key,
          alias,
          type,
          dateValue: type === DATE ? dateValue : null,
          regionValue: type === REGION ? regionValue : null,
          languageValue: type === LANGUAGE ? languageValue : null,
          textValue: type === TEXT || type === TEXT_OPTIONAL ? textValue : null,
        };

        updatedMetadata = await updateMetadata(ctx, expected);
        expect(updatedMetadata).toMatchObject(expected);
      }
    });

    it("should clear fallback key when type changed", async () => {
      const fallbackKey = "my-fave-fallback";

      updatedMetadata = await updateMetadata(ctx, {
        ...update,
        fallbackKey,
      });

      expect(updatedMetadata).toMatchObject({ fallbackKey });

      updatedMetadata = await updateMetadata(ctx, {
        id: metadata.id,
        type: DATE,
        dateValue: "1066-10-14",
      });

      expect(updatedMetadata.fallbackKey).toBeNull();
    });
  });

  describe("query", () => {
    it("should resolve metadata fields for date", async () => {
      ctx = await buildContext({
        metadata: [
          {
            type: DATE,
            dateValue: "2019-01-01",
          },
        ],
      });
      questionnaire = ctx.questionnaire;

      const queriedMetadata = await queryMetadata(ctx);
      expect(last(queriedMetadata)).toMatchObject({
        type: DATE,
        dateValue: "2019-01-01",
        regionValue: null,
        languageValue: null,
        textValue: null,
      });
    });

    it("should resolve metadata fields for region", async () => {
      ctx = await buildContext({
        metadata: [
          {
            type: REGION,
            regionValue: GB_ENG,
          },
        ],
      });
      questionnaire = ctx.questionnaire;

      const queriedMetadata = await queryMetadata(ctx);

      expect(last(queriedMetadata)).toMatchObject({
        type: REGION,
        regionValue: GB_ENG,
        dateValue: null,
        languageValue: null,
        textValue: null,
      });
    });

    it("should resolve metadata fields for language", async () => {
      ctx = await buildContext({
        metadata: [
          {
            type: LANGUAGE,
            languageValue: EN,
          },
        ],
      });
      questionnaire = ctx.questionnaire;

      const queriedMetadata = await queryMetadata(ctx);

      expect(last(queriedMetadata)).toMatchObject({
        type: LANGUAGE,
        languageValue: EN,
        dateValue: null,
        regionValue: null,
        textValue: null,
      });
    });

    it("should resolve metadata fields for text", async () => {
      ctx = await buildContext({
        metadata: [
          {
            type: TEXT,
            textValue: "textValue",
          },
        ],
      });
      questionnaire = ctx.questionnaire;

      const queriedMetadata = await queryMetadata(ctx);

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
    beforeEach(async () => {
      ctx = await buildContext({
        metadata: [
          {
            key: "skeleton",
            type: TEXT,
            textValue: "Woo",
          },
          {
            key: "cruciform",
            type: TEXT,
            textValue: "Hoo",
          },
        ],
      });
      questionnaire = ctx.questionnaire;
    });

    it("should delete a metadata entry", async () => {
      expect(await queryMetadata(ctx)).toHaveLength(9);
      await deleteMetadata(ctx, questionnaire.metadata[0].id);
      const deletedMetadata = await queryMetadata(ctx);
      expect(deletedMetadata).toHaveLength(8);
    });

    it("should remove fallbackKey references to deleted metadata entries", async () => {
      ctx.questionnaire.metadata[8].fallbackKey = questionnaire.metadata[7].key;
      expect((await queryMetadata(ctx))[8].fallbackKey).toEqual("skeleton");
      await deleteMetadata(ctx, questionnaire.metadata[7].id);
      const deletedMetadata = await queryMetadata(ctx);
      expect(deletedMetadata[7].fallbackKey).toBeNull();
    });
  });
});

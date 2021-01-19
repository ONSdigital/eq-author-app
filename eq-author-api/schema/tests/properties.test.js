const { last } = require("lodash");

const { buildContext } = require("../../tests/utils/contextBuilder");

const {
  deleteQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");

const {
  createAnswer,
  queryAnswer,
  updateAnswer,
} = require("../../tests/utils/contextBuilder/answer");

const { CURRENCY, NUMBER, DATE } = require("../../constants/answerTypes");

describe("properties", () => {
  let ctx, questionnaire, section, folder, page;
  let config = {
    sections: [
      {
        folders: [
          {
            pages: [{}],
          },
        ],
      },
    ],
  };

  beforeAll(async () => {
    ctx = await buildContext(config);
    questionnaire = ctx.questionnaire;
    section = last(questionnaire.sections);
    folder = last(section.folders);
    page = last(folder.pages);
  });

  afterAll(async () => {
    await deleteQuestionnaire(ctx, questionnaire.id);
  });

  it("should set correct default properties for currency answer", async () => {
    const { id } = await createAnswer(ctx, {
      questionPageId: page.id,
      type: CURRENCY,
    });
    const { properties } = await queryAnswer(ctx, id);
    expect(properties).toMatchObject({ decimals: 0, required: false });
  });

  it("should set correct default properties for number answer", async () => {
    const { id } = await createAnswer(ctx, {
      questionPageId: page.id,
      type: NUMBER,
    });
    const { properties } = await queryAnswer(ctx, id);
    expect(properties).toMatchObject({ decimals: 0, required: false });
  });

  it("should set correct default properties for date answer", async () => {
    const { id } = await createAnswer(ctx, {
      questionPageId: page.id,
      type: DATE,
    });
    const { properties } = await queryAnswer(ctx, id);
    expect(properties).toMatchObject({ format: "dd/mm/yyyy", required: false });
  });

  it("should allow required property to be updated", async () => {
    const { id } = await createAnswer(ctx, {
      questionPageId: page.id,
      type: CURRENCY,
    });
    const properties = { required: true };
    await updateAnswer(ctx, { id, properties });
    const { properties: updatedProperties } = await queryAnswer(ctx, id);

    expect(updatedProperties).toMatchObject(properties);
  });

  it("should allow decimals property to be updated", async () => {
    const { id } = await createAnswer(ctx, {
      questionPageId: page.id,
      type: CURRENCY,
    });
    const properties = { decimals: 5 };
    await updateAnswer(ctx, { id, properties });
    const { properties: updatedProperties } = await queryAnswer(ctx, id);

    expect(updatedProperties).toMatchObject(properties);
  });

  it("should allow format property to be updated", async () => {
    const { id } = await createAnswer(ctx, {
      questionPageId: page.id,
      type: DATE,
    });
    const properties = { format: "mm/yy" };
    await updateAnswer(ctx, { id, properties });
    const { properties: updatedProperties } = await queryAnswer(ctx, id);

    expect(updatedProperties).toMatchObject(properties);
  });
});

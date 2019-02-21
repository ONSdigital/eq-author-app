const { last } = require("lodash");

const {
  buildQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder");

const {
  deleteQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder/questionnaire");

const {
  createAnswer,
  queryAnswer,
  updateAnswer,
} = require("../../tests/utils/questionnaireBuilder/answer");

const { CURRENCY, NUMBER, DATE } = require("../../constants/answerTypes");

describe("properties", () => {
  let questionnaire, section, page;
  let config = {
    sections: [
      {
        pages: [{}],
      },
    ],
  };

  beforeAll(async () => {
    questionnaire = await buildQuestionnaire(config);
    section = last(questionnaire.sections);
    page = last(section.pages);
  });

  afterAll(async () => {
    await deleteQuestionnaire(questionnaire.id);
  });

  it("should set correct default properties for currency answer", async () => {
    const { id } = await createAnswer(questionnaire, {
      questionPageId: page.id,
      type: CURRENCY,
    });
    const { properties } = await queryAnswer(questionnaire, id);
    expect(properties).toMatchObject({ decimals: 0, required: false });
  });

  it("should set correct default properties for number answer", async () => {
    const { id } = await createAnswer(questionnaire, {
      questionPageId: page.id,
      type: NUMBER,
    });
    const { properties } = await queryAnswer(questionnaire, id);
    expect(properties).toMatchObject({ decimals: 0, required: false });
  });

  it("should set correct default properties for date answer", async () => {
    const { id } = await createAnswer(questionnaire, {
      questionPageId: page.id,
      type: DATE,
    });
    const { properties } = await queryAnswer(questionnaire, id);
    expect(properties).toMatchObject({ format: "dd/mm/yyyy", required: false });
  });

  it("should allow required property to be updated", async () => {
    const { id } = await createAnswer(questionnaire, {
      questionPageId: page.id,
      type: CURRENCY,
    });
    const properties = { required: true };
    await updateAnswer(questionnaire, { id, properties });
    const { properties: updatedProperties } = await queryAnswer(
      questionnaire,
      id
    );

    expect(updatedProperties).toMatchObject(properties);
  });

  it("should allow decimals property to be updated", async () => {
    const { id } = await createAnswer(questionnaire, {
      questionPageId: page.id,
      type: CURRENCY,
    });
    const properties = { decimals: 5 };
    await updateAnswer(questionnaire, { id, properties });
    const { properties: updatedProperties } = await queryAnswer(
      questionnaire,
      id
    );

    expect(updatedProperties).toMatchObject(properties);
  });

  it("should allow format property to be updated", async () => {
    const { id } = await createAnswer(questionnaire, {
      questionPageId: page.id,
      type: DATE,
    });
    const properties = { format: "mm/yy" };
    await updateAnswer(questionnaire, { id, properties });
    const { properties: updatedProperties } = await queryAnswer(
      questionnaire,
      id
    );

    expect(updatedProperties).toMatchObject(properties);
  });
});

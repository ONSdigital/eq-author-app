const { first } = require("lodash");

const {
  createQuestionnaire,
  deleteQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder/questionnaire");

const {
  createAnswer,
  queryAnswer,
  updateAnswer,
} = require("../../tests/utils/questionnaireBuilder/answer");

describe("resolvers", () => {
  let questionnaire;
  let sections;
  let pages;
  let firstPage;

  beforeEach(async () => {
    questionnaire = await createQuestionnaire();
    sections = questionnaire.sections;
    pages = first(sections).pages;
    firstPage = first(pages);
  });

  afterEach(async () => {
    await deleteQuestionnaire(questionnaire.id);
  });

  it("should set correct default properties for currency answer", async () => {
    const { id } = await createAnswer(questionnaire, firstPage, "Currency");
    const { properties } = await queryAnswer(questionnaire, id);
    expect(properties).toMatchObject({ decimals: 0, required: false });
  });

  it("should set correct default properties for number answer", async () => {
    const { id } = await createAnswer(questionnaire, firstPage, "Number");
    const { properties } = await queryAnswer(questionnaire, id);
    expect(properties).toMatchObject({ decimals: 0, required: false });
  });

  it("should set correct default properties for date answer", async () => {
    const { id } = await createAnswer(questionnaire, firstPage, "Date");
    const { properties } = await queryAnswer(questionnaire, id);
    expect(properties).toMatchObject({ format: "dd/mm/yyyy", required: false });
  });

  it("should allow required property to be updated", async () => {
    const { id } = await createAnswer(questionnaire, firstPage, "Currency");
    const properties = { required: true };
    await updateAnswer(questionnaire, { id, properties });
    const { properties: updatedProperties } = await queryAnswer(
      questionnaire,
      id
    );

    expect(updatedProperties).toEqual(expect.objectContaining(properties));
  });

  it("should allow decimals property to be updated", async () => {
    const { id } = await createAnswer(questionnaire, firstPage, "Currency");
    const properties = { decimals: 5 };
    await updateAnswer(questionnaire, { id, properties });
    const { properties: updatedProperties } = await queryAnswer(
      questionnaire,
      id
    );

    expect(updatedProperties).toEqual(expect.objectContaining(properties));
  });

  it("should allow format property to be updated", async () => {
    const { id } = await createAnswer(questionnaire, firstPage, "Date");
    const properties = { format: "mm/yy" };
    await updateAnswer(questionnaire, { id, properties });
    const { properties: updatedProperties } = await queryAnswer(
      questionnaire,
      id
    );

    expect(updatedProperties).toEqual(expect.objectContaining(properties));
  });
});

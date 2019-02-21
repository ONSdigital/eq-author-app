const { first } = require("lodash");
const knex = require("knex")(require("../../knexfile"));
const repositories = require("../../repositories")(knex);
const modifiers = require("../../modifiers")(repositories);
const executeQuery = require("../../tests/utils/executeQuery");
const {
  createQuestionnaireMutation,
  createAnswerMutation,
  getAnswerQuery,
  updateAnswerMutation,
} = require("../../tests/utils/graphql");

describe("properties", () => {
  let questionnaire;
  let sections;
  let pages;
  let firstPage;

  let createNewQuestionnaire;
  let createNewAnswer;
  let queryAnswer;
  let updateAnswer;

  beforeAll(async () => {
    await knex.migrate.latest();

    let ctx = { repositories, modifiers };

    createNewQuestionnaire = async () => {
      const input = {
        title: "Test Questionnaire",
        description: "Questionnaire created by integration test.",
        theme: "default",
        legalBasis: "Voluntary",
        navigation: false,
        surveyId: "001",
        summary: true,
      };

      const result = await executeQuery(
        createQuestionnaireMutation,
        { input },
        ctx
      );
      return result.data.createQuestionnaire;
    };

    createNewAnswer = async ({ id: pageId }, type) => {
      const input = {
        description: "",
        guidance: "",
        label: `${type} answer`,
        qCode: null,
        type: `${type}`,
        questionPageId: pageId,
      };

      const result = await executeQuery(createAnswerMutation, { input }, ctx);
      return result.data.createAnswer;
    };

    queryAnswer = async id => {
      const result = await executeQuery(
        getAnswerQuery,
        {
          id,
        },
        ctx
      );
      return result.data.answer;
    };

    updateAnswer = async input => {
      const result = await executeQuery(
        updateAnswerMutation,
        {
          input,
        },
        ctx
      );

      return result.data;
    };
  });

  afterEach(() => knex("Questionnaires").delete());

  beforeEach(async () => {
    questionnaire = await createNewQuestionnaire();
    sections = questionnaire.sections;
    pages = first(sections).pages;
    firstPage = first(pages);
  });

  it("should set correct default properties for currency answer", async () => {
    const { id } = await createNewAnswer(firstPage, "Currency");
    const { properties } = await queryAnswer(id);
    expect(properties).toMatchObject({ decimals: 0, required: false });
  });

  it("should set correct default properties for number answer", async () => {
    const { id } = await createNewAnswer(firstPage, "Number");
    const { properties } = await queryAnswer(id);
    expect(properties).toMatchObject({ decimals: 0, required: false });
  });

  it("should set correct default properties for date answer", async () => {
    const { id } = await createNewAnswer(firstPage, "Date");
    const { properties } = await queryAnswer(id);
    expect(properties).toMatchObject({ format: "dd/mm/yyyy", required: false });
  });

  it("should allow required property to be updated", async () => {
    const { id } = await createNewAnswer(firstPage, "Currency");
    const properties = { required: true };
    await updateAnswer({ id, properties });
    const { properties: updatedProperties } = await queryAnswer(id);

    expect(updatedProperties).toEqual(expect.objectContaining(properties));
  });

  it("should allow decimals property to be updated", async () => {
    const { id } = await createNewAnswer(firstPage, "Currency");
    const properties = { decimals: 5 };
    await updateAnswer({ id, properties });
    const { properties: updatedProperties } = await queryAnswer(id);

    expect(updatedProperties).toEqual(expect.objectContaining(properties));
  });

  it("should allow format property to be updated", async () => {
    const { id } = await createNewAnswer(firstPage, "Date");
    const properties = { format: "mm/yy" };
    await updateAnswer({ id, properties });
    const { properties: updatedProperties } = await queryAnswer(id);

    expect(updatedProperties).toEqual(expect.objectContaining(properties));
  });
});

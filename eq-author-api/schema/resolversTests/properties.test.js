const { first } = require("lodash");
const repositories = require("../../repositories");
const db = require("../../db");
const executeQuery = require("../../tests/utils/executeQuery");
const {
  createQuestionnaireMutation,
  createAnswerMutation,
  getAnswerQuery,
  updateAnswerMutation
} = require("../../tests/utils/graphql");

const ctx = { repositories };

const createNewQuestionnaire = async () => {
  const input = {
    title: "Test Questionnaire",
    description: "Questionnaire created by integration test.",
    theme: "default",
    legalBasis: "Voluntary",
    navigation: false,
    surveyId: "001",
    summary: true,
    createdBy: "Integration test"
  };

  const result = await executeQuery(
    createQuestionnaireMutation,
    { input },
    ctx
  );
  return result.data.createQuestionnaire;
};

const createNewAnswer = async ({ id: pageId }, type) => {
  const input = {
    description: "",
    guidance: "",
    label: `${type} answer`,
    qCode: null,
    type: `${type}`,
    questionPageId: pageId
  };

  const result = await executeQuery(createAnswerMutation, { input }, ctx);
  return result.data.createAnswer;
};

const queryAnswer = async id => {
  const result = await executeQuery(
    getAnswerQuery,
    {
      id
    },
    ctx
  );
  return result.data.answer;
};

const updateAnswer = async input => {
  const result = await executeQuery(
    updateAnswerMutation,
    {
      input
    },
    ctx
  );

  return result.data;
};

describe("resolvers", () => {
  let questionnaire;
  let sections;
  let pages;
  let firstPage;

  beforeAll(() => db.migrate.latest());
  afterAll(() => db.destroy());
  afterEach(() => db("Questionnaires").delete());

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

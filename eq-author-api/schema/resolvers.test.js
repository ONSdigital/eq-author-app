const { first, get } = require("lodash");
const knex = require("knex")(require("../knexfile"));
const repositories = require("../repositories")(knex);
const modifiers = require("../modifiers")(repositories);
const executeQuery = require("../tests/utils/executeQuery");
const {
  createQuestionnaireMutation,
  getPipableAnswersQuery,
  createAnswerMutation,
  getAnswerQuery,
  updateAnswerMutation,
  createSectionMutation,
  createOptionMutation,
  moveSectionMutation,
  createExclusiveMutation,
} = require("../tests/utils/graphql");

describe("resolvers", () => {
  let questionnaire;
  let sections;
  let pages;
  let firstPage;
  let ctx;
  let createNewQuestionnaire;
  let createSection;
  let createNewAnswer;
  let createExclusive;
  let updateAnswer;
  let createOption;
  let refreshAnswerDetails;

  beforeAll(async () => {
    await knex.migrate.latest();
    ctx = { repositories, modifiers };

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

    createSection = async questionnaireId =>
      executeQuery(
        createSectionMutation,
        {
          input: {
            title: "Foo",
            questionnaireId: questionnaireId,
          },
        },
        ctx
      );

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

    createOption = async input =>
      executeQuery(createOptionMutation, { input }, ctx);

    createExclusive = async answer => {
      const result = await executeQuery(
        createExclusiveMutation,
        { input: { answerId: answer.id } },
        ctx
      );
      return result;
    };

    updateAnswer = async args =>
      executeQuery(
        updateAnswerMutation,
        {
          input: args,
        },
        ctx
      );

    refreshAnswerDetails = async ({ id }) => {
      const result = await executeQuery(getAnswerQuery, { id }, ctx);
      return result.data.answer;
    };
  });

  afterEach(() => knex("Questionnaires").delete());

  beforeEach(async () => {
    questionnaire = await createNewQuestionnaire();
    sections = questionnaire.sections;
    pages = first(sections).pages;
    firstPage = first(pages);
  });

  it("should automatically add properties to an answer", async () => {
    const numberAnswer = await createNewAnswer(firstPage, "Number");
    const result = await executeQuery(
      getAnswerQuery,
      { id: numberAnswer.id },
      ctx
    );
    expect(result.data.answer.properties).toMatchObject({
      decimals: 0,
      required: false,
    });
  });

  it("should split a date range answer into child answers on retrieval", async () => {
    const dateRangeAnswer = await createNewAnswer(firstPage, "DateRange");

    const result = await executeQuery(
      getAnswerQuery,
      { id: dateRangeAnswer.id },
      ctx
    );

    const childAnswers = get(result, "data.answer.childAnswers");

    expect(childAnswers).toEqual([
      { id: `${dateRangeAnswer.id}from`, label: "DateRange answer" },
      { id: `${dateRangeAnswer.id}to`, label: null },
    ]);
  });

  it("should return a composite and basic answer in the correct shapes", async () => {
    const dateRange = await createNewAnswer(firstPage, "DateRange");
    const textField = await createNewAnswer(firstPage, "TextField");

    const result = await executeQuery(
      getPipableAnswersQuery,
      { ids: [dateRange.id, textField.id] },
      ctx
    );

    const answers = get(result, "data.answers");

    expect(answers).toHaveLength(2);
    expect(answers[0]).toHaveProperty("childAnswers");
    expect(answers[1].childAnswers).toBeUndefined();
  });

  it("should re-combine a composite answer in the db", async () => {
    const dateRangeAnswer = await createNewAnswer(firstPage, "DateRange");

    await updateAnswer({
      id: `${dateRangeAnswer.id}from`,
      label: "This is the from",
    });
    await updateAnswer({
      id: `${dateRangeAnswer.id}to`,
      label: "This is the to",
    });

    const result = await executeQuery(
      getAnswerQuery,
      { id: dateRangeAnswer.id },
      ctx
    );

    const childAnswers = get(result, "data.answer.childAnswers");

    expect(childAnswers).toEqual([
      { id: `${dateRangeAnswer.id}from`, label: "This is the from" },
      { id: `${dateRangeAnswer.id}to`, label: "This is the to" },
    ]);
  });

  it("should create a regular checkbox option", async () => {
    const checkboxAnswer = await createNewAnswer(firstPage, "Checkbox");

    await createOption({
      answerId: checkboxAnswer.id,
    });

    const updatedCheckboxAnswer = await refreshAnswerDetails(checkboxAnswer);

    expect(updatedCheckboxAnswer.options[1].additionalAnswer).toBeNull();
    expect(updatedCheckboxAnswer.options).toHaveLength(2);
  });

  it("should create additionalAnswerOption for Checkbox answers", async () => {
    const checkboxAnswer = await createNewAnswer(firstPage, "Checkbox");

    const additionalAnswerOption = await createOption({
      answerId: checkboxAnswer.id,
      hasAdditionalAnswer: true,
    });

    expect(
      additionalAnswerOption.data.createOption.additionalAnswer
    ).toMatchObject({
      type: "TextField",
      description: "",
    });

    const updatedCheckboxAnswer = await refreshAnswerDetails(checkboxAnswer);
    expect(updatedCheckboxAnswer.options[1].additionalAnswer).toMatchObject(
      additionalAnswerOption.data.createOption.additionalAnswer
    );
  });

  it("can create exclusive option for checkbox answers", async () => {
    const checkboxAnswer = await createNewAnswer(firstPage, "Checkbox");
    const result = await createExclusive(checkboxAnswer);

    expect(result).not.toHaveProperty("errors");
  });

  it("fails when trying to create a second exclusive option", async () => {
    const checkboxAnswer = await createNewAnswer(firstPage, "Checkbox");
    await createExclusive(checkboxAnswer);
    const result = await createExclusive(checkboxAnswer);

    expect(result.errors).toHaveLength(1);
  });

  it("should create a regular radio option", async () => {
    const radioAnswer = await createNewAnswer(firstPage, "Radio");

    await createOption({
      answerId: radioAnswer.id,
    });

    const updatedRadioAnswer = await refreshAnswerDetails(radioAnswer);

    expect(updatedRadioAnswer.options[1].additionalAnswer).toBeNull();
    expect(updatedRadioAnswer.options).toHaveLength(3);
  });

  it("should create additionalAnswerOption on Radio answers", async () => {
    const radioAnswer = await createNewAnswer(firstPage, "Radio");

    const additionalAnswerOption = await createOption({
      answerId: radioAnswer.id,
      hasAdditionalAnswer: true,
    });
    expect(
      additionalAnswerOption.data.createOption.additionalAnswer
    ).toMatchObject({
      type: "TextField",
      description: "",
    });

    const updatedRadioAnswer = await refreshAnswerDetails(radioAnswer);
    expect(updatedRadioAnswer.options[2].additionalAnswer).toMatchObject(
      additionalAnswerOption.data.createOption.additionalAnswer
    );
  });

  it("should reorder section with correct position", async () => {
    const sectionOne = sections[0];
    const {
      data: { createSection: sectionTwo },
    } = await createSection(questionnaire.id);
    const {
      data: { createSection: sectionThree },
    } = await createSection(questionnaire.id);

    const getSectionsQuery = `
      query GetQuestionnaire($id: ID!) {
        questionnaire(id: $id) {
          id
          sections{
            id
            position
          }
        }
      }
      `;

    await executeQuery(
      moveSectionMutation,
      {
        input: {
          id: sectionOne.id,
          questionnaireId: questionnaire.id,
          position: 3,
        },
      },
      ctx
    );

    const result = await executeQuery(
      getSectionsQuery,
      {
        id: questionnaire.id,
      },
      ctx
    );

    const expected = {
      data: {
        questionnaire: {
          id: questionnaire.id,
          sections: [
            { id: sectionTwo.id, position: 0 },
            { id: sectionThree.id, position: 1 },
            { id: sectionOne.id, position: 2 },
          ],
        },
      },
    };

    expect(result).toMatchObject(expected);
  });

  it("should get total number of sections", async () => {
    const getTotalSectionCountQuery = `
     query GetTotalSectionCount($id: ID!) {
        questionnaire(id: $id) {
          questionnaireInfo {
            totalSectionCount
          }
        }
      }
      `;

    const result = await executeQuery(
      getTotalSectionCountQuery,
      {
        id: questionnaire.id,
      },
      ctx
    );

    const expected = {
      data: {
        questionnaire: {
          questionnaireInfo: {
            totalSectionCount: 1,
          },
        },
      },
    };
    expect(result).toMatchObject(expected);
  });

  it("should get metadata for questionnaire", async () => {
    const createMetadata = `
      mutation CreateMetadata($input: CreateMetadataInput!) {
        createMetadata(input: $input) {
          ...Metadata
          __typename
        }
      }
      
      fragment Metadata on Metadata {
        id
        key
        alias
        type
        textValue
        languageValue
        regionValue
        dateValue
        __typename
      }
    `;

    const {
      data: { createMetadata: metadata },
    } = await executeQuery(
      createMetadata,
      {
        input: { questionnaireId: questionnaire.id },
      },
      ctx
    );

    const getQuestionnaireWithMetadata = `
      query GetQuestionnaireWithMetadata($id: ID!) {
        questionnaire(id: $id) {
          id
          metadata {
            ...Metadata
            __typename
          }
          __typename
        }
      }
      
      fragment Metadata on Metadata {
        id
        key
        alias
        type
        textValue
        languageValue
        regionValue
        dateValue
        __typename
      }
      `;

    const result = await executeQuery(
      getQuestionnaireWithMetadata,
      {
        id: questionnaire.id,
      },
      ctx
    );

    const expected = {
      data: {
        questionnaire: {
          id: questionnaire.id,
          metadata: [metadata],
          __typename: "Questionnaire",
        },
      },
    };
    expect(result).toMatchObject(expected);
  });

  it("should resolve displayName for section", async () => {
    const getSectionWithDisplayName = `
      query GetSection($id: ID!) {
        section(id: $id) {
          id
          displayName
        }   
      }
      `;
    const {
      data: { section },
    } = await executeQuery(
      getSectionWithDisplayName,
      {
        id: first(sections).id,
      },
      ctx
    );

    expect(section).toHaveProperty("displayName");
  });

  it("should resolve displayName for question page", async () => {
    const getQuestionPageWithDisplayName = `
      query GetQuestionPage($id: ID!) {
        questionPage(id: $id) {
          id
          displayName
        }   
      }
      `;
    const {
      data: { questionPage },
    } = await executeQuery(
      getQuestionPageWithDisplayName,
      {
        id: firstPage.id,
      },
      ctx
    );

    expect(questionPage).toHaveProperty("displayName");
  });

  it("should resolve displayName for basic answer", async () => {
    const { id } = await createNewAnswer(firstPage, "Number");

    const getBasicAnswerWithDisplayName = `
      query GetAnswer($id: ID!) {
        answer(id: $id) {
          id
          displayName
        }   
      }
      `;

    const {
      data: { answer },
    } = await executeQuery(
      getBasicAnswerWithDisplayName,
      {
        id: id,
      },
      ctx
    );

    expect(answer).toHaveProperty("displayName");
  });

  it("should resolve displayName for composite answer", async () => {
    const { id } = await createNewAnswer(firstPage, "DateRange");

    const getBasicAnswerWithDisplayName = `
      query GetAnswer($id: ID!) {
        answer(id: $id) {
          id
          displayName
        }   
      }
      `;

    const {
      data: { answer },
    } = await executeQuery(
      getBasicAnswerWithDisplayName,
      {
        id: id,
      },
      ctx
    );

    expect(answer).toHaveProperty("displayName");
  });

  it("should resolve displayName for multiple choice answer", async () => {
    const { id } = await createNewAnswer(firstPage, "Radio");

    const getBasicAnswerWithDisplayName = `
      query GetAnswer($id: ID!) {
        answer(id: $id) {
          id
          displayName
          ... on MultipleChoiceAnswer {
            options {
              id
              displayName
            }
          }
        }   
      }
      `;

    const {
      data: { answer },
    } = await executeQuery(
      getBasicAnswerWithDisplayName,
      {
        id: id,
      },
      ctx
    );

    expect(answer).toHaveProperty("displayName");
    expect(first(answer.options)).toHaveProperty("displayName");
  });

  describe("authenticated user", () => {
    it("should be possible to query user details", () => {
      const getUserDetails = `
      query GetCurrentUser {
        me {
          id
          name
          email
          picture
        }
      }
      `;

      expect(executeQuery(getUserDetails)).resolves.toEqual({
        data: {
          me: {
            email: "eq-team@ons.gov.uk",
            id: "mock_user_id",
            name: "Author Integration Test",
            picture: "file:///path/to/some/picture.jpg",
          },
        },
      });
    });

    it("should be possible to query user details without user name", () => {
      const getUserDetails = `
      query GetCurrentUser {
        me {
          id
          name
          email
          picture
        }
      }
      `;

      const authWithoutName = {
        sub: "mock_user_id",
        email: "eq-team@ons.gov.uk",
        picture: "file:///path/to/some/picture.jpg",
      };

      expect(
        executeQuery(getUserDetails, {}, { auth: authWithoutName })
      ).resolves.toEqual({
        data: {
          me: {
            email: "eq-team@ons.gov.uk",
            id: "mock_user_id",
            name: "eq-team@ons.gov.uk",
            picture: "file:///path/to/some/picture.jpg",
          },
        },
      });
    });

    it("should be possible to query user details when name is empty string", () => {
      const getUserDetails = `
      query GetCurrentUser {
        me {
          id
          name
          email
          picture
        }
      }
      `;

      const authWithoutName = {
        sub: "mock_user_id",
        name: "",
        email: "eq-team@ons.gov.uk",
        picture: "file:///path/to/some/picture.jpg",
      };

      expect(
        executeQuery(getUserDetails, {}, { auth: authWithoutName })
      ).resolves.toEqual({
        data: {
          me: {
            email: "eq-team@ons.gov.uk",
            id: "mock_user_id",
            name: "eq-team@ons.gov.uk",
            picture: "file:///path/to/some/picture.jpg",
          },
        },
      });
    });

    it("should be possible to create questionnaire without user name", async () => {
      const input = {
        title: "Test Questionnaire",
        description: "Questionnaire created by integration test.",
        theme: "default",
        legalBasis: "Voluntary",
        navigation: false,
        surveyId: "001",
        summary: true,
      };

      const authWithoutName = {
        sub: "mock_user_id",
        name: "",
        email: "eq-team@ons.gov.uk",
        picture: "file:///path/to/some/picture.jpg",
      };

      const result = await executeQuery(
        createQuestionnaireMutation,
        { input },
        { ...ctx, auth: authWithoutName }
      );

      expect(result).toMatchObject({
        data: {
          createQuestionnaire: {
            createdBy: { name: "eq-team@ons.gov.uk" },
          },
        },
      });
    });

    it("should be possible to create questionnaire when name is empty string", async () => {
      const input = {
        title: "Test Questionnaire",
        description: "Questionnaire created by integration test.",
        theme: "default",
        legalBasis: "Voluntary",
        navigation: false,
        surveyId: "001",
        summary: true,
      };

      const authWithoutName = {
        sub: "mock_user_id",
        name: "",
        email: "eq-team@ons.gov.uk",
        picture: "file:///path/to/some/picture.jpg",
      };

      const result = await executeQuery(
        createQuestionnaireMutation,
        { input },
        { ...ctx, auth: authWithoutName }
      );

      expect(result).toMatchObject({
        data: {
          createQuestionnaire: {
            createdBy: { name: "eq-team@ons.gov.uk" },
          },
        },
      });
    });
  });
});

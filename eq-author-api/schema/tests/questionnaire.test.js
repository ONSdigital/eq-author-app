const {
  buildQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder");

const {
  queryQuestionnaire,
  updateQuestionnaire,
  deleteQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder/questionnaire");
const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");
const { last } = require("lodash");

describe("questionnaire", () => {
  let questionnaire;
  let config = {
    title: "Questionnaire",
    description: "Description",
    surveyId: "1",
    theme: "default",
    legalBasis: "Voluntary",
    navigation: false,
    summary: false,
    metadata: [{}],
  };

  beforeAll(async () => {
    questionnaire = await buildQuestionnaire(config);
  });

  afterAll(async () => {
    await deleteQuestionnaire(questionnaire.id);
  });

  describe("create", () => {
    it("should create a questionnaire", () => {
      expect(questionnaire).toEqual(
        expect.objectContaining(
          filter(
            gql`
              {
                title
                description
                theme
                legalBasis
                navigation
                surveyId
                summary
              }
            `,
            config
          )
        )
      );
    });

    it("should create one section and one page", () => {
      expect(questionnaire.sections).toHaveLength(1);
      expect(questionnaire.sections[0].pages).toHaveLength(1);
    });
  });

  describe("mutate", () => {
    let updatedQuestionnaire;
    let update;
    beforeEach(async () => {
      update = {
        id: questionnaire.id,
        title: "Questionnaire-updated",
        description: "Description-updated",
        theme: "census",
        legalBasis: "StatisticsOfTradeAct",
        navigation: true,
        surveyId: "2-updated",
        summary: true,
      };
      updatedQuestionnaire = await updateQuestionnaire(questionnaire, update);
    });

    it("should mutate a questionnaire", () => {
      expect(updatedQuestionnaire).toEqual(expect.objectContaining(update));
    });
  });

  describe("query", () => {
    let queriedQuestionnaire;

    beforeEach(async () => {
      queriedQuestionnaire = await queryQuestionnaire(questionnaire);
    });

    it("should resolve questionnaire fields", () => {
      expect(queriedQuestionnaire).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        theme: expect.any(String),
        legalBasis: expect.any(String),
        navigation: expect.any(Boolean),
        surveyId: expect.any(String),
        createdAt: expect.any(String),
        createdBy: expect.any(Object),
        sections: expect.any(Array),
        summary: expect.any(Boolean),
        questionnaireInfo: expect.any(Object),
        metadata: expect.any(Array),
      });
    });

    it("should resolve createdBy", () => {
      //@todo - doesn't work as expect doesn't always resolve correctly
    });

    it("should resolve section", () => {
      expect(last(queriedQuestionnaire.sections).id).toEqual(
        last(questionnaire.sections).id
      );
    });

    it("should resolve questionnaireInfo", () => {
      expect(queriedQuestionnaire.questionnaireInfo.id).toEqual(
        questionnaire.questionnaireInfo.id
      );
    });

    it("should resolve metadata", () => {
      expect(last(queriedQuestionnaire.metadata).id).toEqual(
        last(questionnaire.metadata).id
      );
    });
  });
});

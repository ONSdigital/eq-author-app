const {
  buildQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder");

const {
  createQuestionnaire,
  queryQuestionnaire,
  updateQuestionnaire,
  deleteQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder/questionnaire");
const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");
const { last } = require("lodash");

describe("questionnaire", () => {
  let questionnaire;

  afterEach(async () => {
    await deleteQuestionnaire(questionnaire.id);
  });

  describe("create", () => {
    let config;
    beforeEach(async () => {
      config = {
        title: "Questionnaire",
        description: "Description",
        surveyId: "1",
        theme: "default",
        legalBasis: "Voluntary",
        navigation: false,
        summary: false,
      };
      questionnaire = await createQuestionnaire(config);
    });

    it("should create a questionnaire with a section and page", async () => {
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
    it("should mutate a questionnaire", async () => {
      const questionnaire = await buildQuestionnaire({
        title: "Questionnaire",
        description: "Description",
        surveyId: "1",
        theme: "default",
        legalBasis: "Voluntary",
        navigation: false,
        summary: false,
        metadata: [{}],
      });
      const update = {
        id: questionnaire.id,
        title: "Questionnaire-updated",
        description: "Description-updated",
        theme: "census",
        legalBasis: "StatisticsOfTradeAct",
        navigation: true,
        surveyId: "2-updated",
        summary: true,
      };
      const updatedQuestionnaire = await updateQuestionnaire(
        questionnaire,
        update
      );

      expect(updatedQuestionnaire).toEqual(expect.objectContaining(update));
    });
  });

  describe("query", () => {
    let queriedQuestionnaire;

    beforeEach(async () => {
      questionnaire = await buildQuestionnaire({
        summary: false,
        description: "description",
        sections: [{}],
        metadata: [{}],
      });
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
      expect(queriedQuestionnaire.createdBy).toMatchObject({
        id: "author-integration-test",
      });
    });

    it("should resolve section", () => {
      expect(last(queriedQuestionnaire.sections).id).toEqual(
        last(questionnaire.sections).id
      );
    });

    it("should resolve questionnaireInfo", () => {
      expect(queriedQuestionnaire.questionnaireInfo.totalSectionCount).toEqual(
        1
      );
    });

    it("should resolve metadata", () => {
      expect(last(queriedQuestionnaire.metadata).id).toEqual(
        last(questionnaire.metadata).id
      );
    });
  });

  describe("delete", () => {
    it("should delete a questionnaire", async () => {
      const { id: questionnaireId } = await buildQuestionnaire({});
      await deleteQuestionnaire(questionnaireId);
      const deletedQuestionnaire = await queryQuestionnaire(questionnaireId);
      expect(deletedQuestionnaire).toBeNull();
    });
  });
});

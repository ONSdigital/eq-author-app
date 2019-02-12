const { get, last } = require("lodash");

const {
  buildQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder");

const {
  deleteQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder/questionnaire");
const {
  updateQuestionConfirmation,
  queryQuestionConfirmation,
  deleteQuestionConfirmation,
} = require("../../tests/utils/questionnaireBuilder/questionConfirmation");

const { NUMBER } = require("../../constants/answerTypes");

describe("questionConfirmation", () => {
  let questionnaire, section, page, questionConfirmation;
  let config = {
    metadata: [{}],
    sections: [
      {
        pages: [
          {
            answers: [
              {
                type: NUMBER,
              },
            ],
          },
          {
            confirmation: {},
          },
        ],
      },
    ],
  };

  beforeAll(async () => {
    questionnaire = await buildQuestionnaire(config);
    section = last(questionnaire.sections);
    page = last(section.pages);
    questionConfirmation = page.confirmation;
  });

  afterAll(async () => {
    await deleteQuestionnaire(questionnaire.id);
  });

  describe("create", () => {
    it("should create a question confirmation", () => {
      expect(questionConfirmation).toEqual(
        expect.objectContaining({
          title: "",
          negative: {
            description: null,
            label: null,
          },
          positive: {
            description: null,
            label: null,
          },
        })
      );
    });
  });

  describe("mutate", () => {
    let updatedQuestionConfirmation;
    let update;
    beforeEach(async () => {
      update = {
        id: questionConfirmation.id,
        title: "title-updated",
        negative: {
          label: "negative-label-updated",
          description: "negative-description-updated",
        },
        positive: {
          label: "positive-label-updated",
          description: "positive-description-updated",
        },
      };
      updatedQuestionConfirmation = await updateQuestionConfirmation(
        questionnaire,
        update
      );
    });

    it("should mutate a questionConfirmation", () => {
      expect(updatedQuestionConfirmation).toEqual(
        expect.objectContaining(update)
      );
    });
  });

  describe("query", () => {
    let queriedQuestionConfirmation;

    beforeEach(async () => {
      queriedQuestionConfirmation = await queryQuestionConfirmation(
        questionnaire,
        questionConfirmation.id
      );
    });

    it("should resolve questionConfirmation fields", () => {
      expect(queriedQuestionConfirmation).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        page: expect.any(Object),
        positive: expect.any(Object),
        negative: expect.any(Object),
        availablePipingAnswers: expect.any(Array),
        availablePipingMetadata: expect.any(Array),
      });
    });

    it("should resolve page", () => {
      expect(queriedQuestionConfirmation.page.id).toEqual(page.id);
    });

    it("should resolve positive", () => {
      expect(queriedQuestionConfirmation.positive).toMatchObject({
        label: "positive-label-updated",
        description: "positive-description-updated",
      });
    });

    it("should resolve negative", () => {
      expect(queriedQuestionConfirmation.negative).toMatchObject({
        label: "negative-label-updated",
        description: "negative-description-updated",
      });
    });

    it("should resolve availablePipingAnswers", () => {
      expect(
        last(queriedQuestionConfirmation.availablePipingAnswers).id
      ).toEqual(get(questionnaire, "sections[1].pages[1].answers[0].id"));
    });

    it("should resolve availablePipingMetadata", () => {
      expect(
        last(queriedQuestionConfirmation.availablePipingMetadata).id
      ).toEqual(last(questionnaire.metadata).id);
    });
  });

  describe("delete", () => {
    it("should delete a question confirmation", async () => {
      await deleteQuestionConfirmation(questionnaire, questionConfirmation.id);
      const deletedQuestionConfirmation = await queryQuestionConfirmation(
        questionnaire,
        questionConfirmation.id
      );
      expect(deletedQuestionConfirmation).toBeNull();
    });
  });
});

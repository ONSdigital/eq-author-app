const { get, last } = require("lodash");

const {
  buildQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder");

const {
  deleteQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder/questionnaire");
const {
  createQuestionConfirmation,
  updateQuestionConfirmation,
  queryQuestionConfirmation,
  deleteQuestionConfirmation,
} = require("../../tests/utils/questionnaireBuilder/questionConfirmation");

const { NUMBER } = require("../../constants/answerTypes");

describe("questionConfirmation", () => {
  let questionnaire;

  afterEach(async () => {
    await deleteQuestionnaire(questionnaire.id);
    questionnaire = null;
  });

  describe("create", () => {
    it("should create a question confirmation", async () => {
      questionnaire = await buildQuestionnaire({
        sections: [
          {
            pages: [{}],
          },
        ],
      });
      const questionConfirmation = await createQuestionConfirmation(
        questionnaire,
        {
          pageId: questionnaire.sections[0].pages[0].id,
        }
      );
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
    it("should mutate a questionConfirmation", async () => {
      questionnaire = await buildQuestionnaire({
        sections: [
          {
            pages: [
              {
                confirmation: {},
              },
            ],
          },
        ],
      });
      const update = {
        id: questionnaire.sections[0].pages[0].confirmation.id,
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
      const updatedQuestionConfirmation = await updateQuestionConfirmation(
        questionnaire,
        update
      );

      expect(updatedQuestionConfirmation).toMatchObject(update);
    });
  });

  describe("query", () => {
    let queriedQuestionConfirmation;

    beforeEach(async () => {
      questionnaire = await buildQuestionnaire({
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
                confirmation: {
                  positive: {
                    label: "pos label",
                    description: "pos desc",
                  },
                  negative: {
                    label: "neg label",
                    description: "neg desc",
                  },
                },
              },
            ],
          },
        ],
      });
      queriedQuestionConfirmation = await queryQuestionConfirmation(
        questionnaire,
        questionnaire.sections[0].pages[0].confirmation.id
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
      expect(queriedQuestionConfirmation.page.id).toEqual(
        questionnaire.sections[0].pages[0].id
      );
    });

    it("should resolve positive", () => {
      expect(queriedQuestionConfirmation.positive).toMatchObject({
        label: "pos label",
        description: "pos desc",
      });
    });

    it("should resolve negative", () => {
      expect(queriedQuestionConfirmation.negative).toMatchObject({
        label: "neg label",
        description: "neg desc",
      });
    });

    it("should resolve availablePipingAnswers", () => {
      expect(
        last(queriedQuestionConfirmation.availablePipingAnswers).id
      ).toEqual(get(questionnaire, "sections[0].pages[0].answers[0].id"));
    });

    it("should resolve availablePipingMetadata", () => {
      expect(
        last(queriedQuestionConfirmation.availablePipingMetadata).id
      ).toEqual(last(questionnaire.metadata).id);
    });
  });

  describe("delete", () => {
    it("should delete a question confirmation", async () => {
      questionnaire = await buildQuestionnaire({
        sections: [
          {
            pages: [
              {
                confirmation: {},
              },
            ],
          },
        ],
      });
      const confirmationId = questionnaire.sections[0].pages[0].confirmation.id;
      await deleteQuestionConfirmation(questionnaire, confirmationId);
      const deletedQuestionConfirmation = await queryQuestionConfirmation(
        questionnaire,
        confirmationId
      );
      expect(deletedQuestionConfirmation).toBeNull();
    });
  });
});

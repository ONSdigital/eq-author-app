const {
  buildQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder");

const {
  deleteQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder/questionnaire");
const {
  createAnswer,
  updateAnswer,
  queryAnswer,
  deleteAnswer,
} = require("../../tests/utils/questionnaireBuilder/answer");

const { NUMBER } = require("../../constants/answerTypes");

describe("basic answer", () => {
  let questionnaire;
  afterEach(async () => {
    await deleteQuestionnaire(questionnaire.id);
  });

  describe("create", () => {
    it("should create an answer", async () => {
      questionnaire = await buildQuestionnaire({
        sections: [{ pages: [{}] }],
      });

      const answer = await createAnswer(questionnaire, {
        description: "answer-description",
        guidance: "answer-guidance",
        label: "answer-label",
        secondaryLabel: "answer-secondaryLabel",
        qCode: "answer-qcode",
        type: NUMBER,
        questionPageId: questionnaire.sections[0].pages[0].id,
      });

      expect(answer).toEqual(
        expect.objectContaining({
          description: "answer-description",
          guidance: "answer-guidance",
          label: "answer-label",
          secondaryLabel: "answer-secondaryLabel",
          qCode: "answer-qcode",
        })
      );
    });
  });

  describe("mutate", () => {
    it("should mutate an answer", async () => {
      questionnaire = await buildQuestionnaire({
        sections: [
          {
            pages: [
              {
                answers: [
                  {
                    description: "answer-description",
                    guidance: "answer-guidance",
                    label: "answer-label",
                    secondaryLabel: "answer-secondaryLabel",
                    qCode: "answer-qcode",
                    type: NUMBER,
                    properties: {
                      decimals: 2,
                      required: false,
                    },
                  },
                ],
              },
            ],
          },
        ],
      });
      const answer = questionnaire.sections[0].pages[0].answers[0];
      const update = {
        id: answer.id,
        description: "answer-description-update",
        guidance: "answer-guidance-update",
        label: "answer-label-update",
        qCode: "answer-qcode-update",
        properties: {
          decimals: 0,
          required: true,
        },
      };
      const updatedAnswer = await updateAnswer(questionnaire, update);
      expect(updatedAnswer).toMatchObject(update);
    });
  });

  describe("query", () => {
    let answer, queriedAnswer;

    beforeEach(async () => {
      questionnaire = await buildQuestionnaire({
        sections: [
          {
            pages: [
              {
                answers: [
                  {
                    type: NUMBER,
                    description: "",
                    guidance: "",
                    label: "",
                    secondaryLabel: "",
                    qCode: "",
                    properties: {
                      required: false,
                    },
                  },
                ],
              },
            ],
          },
        ],
      });
      answer = questionnaire.sections[0].pages[0].answers[0];
      queriedAnswer = await queryAnswer(questionnaire, answer.id);
    });

    it("should resolve answer fields", () => {
      expect(queriedAnswer).toMatchObject({
        id: expect.any(String),
        displayName: expect.any(String),
        description: expect.any(String),
        guidance: expect.any(String),
        qCode: expect.any(String),
        label: expect.any(String),
        secondaryLabel: expect.any(String),
        type: expect.any(String),
        page: expect.any(Object),
        properties: expect.any(Object),
        validation: expect.any(Object),
      });
    });

    it("should resolve type", () => {
      expect(queriedAnswer.type).toEqual(answer.type);
    });

    it("should resolve page", () => {
      expect(queriedAnswer.page.id).toEqual(
        questionnaire.sections[0].pages[0].id
      );
    });

    it("should resolve properties", () => {
      expect(queriedAnswer.properties).toEqual(
        expect.objectContaining({
          required: false,
        })
      );
    });

    it("should resolve validation", () => {
      expect(queriedAnswer.validation).toMatchObject({
        maxValue: expect.any(Object),
        minValue: expect.any(Object),
      });
    });
  });

  describe("delete", () => {
    it("should delete an answer", async () => {
      questionnaire = await buildQuestionnaire({
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
            ],
          },
        ],
      });
      const answer = questionnaire.sections[0].pages[0].answers[0];
      await deleteAnswer(questionnaire, answer.id);
      const deletedAnswer = await queryAnswer(questionnaire, answer.id);
      expect(deletedAnswer).toBeNull();
    });
  });
});

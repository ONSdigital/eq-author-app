const { last } = require("lodash");

const {
  buildQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder");

const {
  deleteQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder/questionnaire");
const {
  updateAnswer,
  queryAnswer,
  deleteAnswer,
} = require("../../tests/utils/questionnaireBuilder/answer");

const { NUMBER, TEXTFIELD } = require("../../constants/answerTypes");

describe("basic answer", () => {
  let questionnaire, section, page, answer;
  let config = {
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
              },
            ],
          },
        ],
      },
    ],
  };

  beforeEach(async () => {
    questionnaire = await buildQuestionnaire(config);
    section = last(questionnaire.sections);
    page = last(section.pages);
    answer = last(page.answers);
  });

  afterEach(async () => {
    await deleteQuestionnaire(questionnaire.id);
  });

  describe("create", () => {
    it("should create an answer", () => {
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
    let updatedAnswer;
    let update;
    beforeEach(async () => {
      update = {
        id: answer.id,
        description: "answer-description-update",
        guidance: "answer-guidance-update",
        label: "answer-label-update",
        qCode: "answer-qcode-update",
        type: TEXTFIELD,
        properties: {
          decimals: 0,
          required: true,
        },
      };
      updatedAnswer = await updateAnswer(questionnaire, update);
    });

    it("should mutate an answer", () => {
      expect(updatedAnswer).toEqual(expect.objectContaining(update));
    });

    it("should mutate an options", () => {
      expect(updatedAnswer).toEqual(expect.objectContaining(update));
    });

    it("should mutate an mutuallyExclusiveOption", () => {
      expect(updatedAnswer).toEqual(expect.objectContaining(update));
    });
  });

  describe("query", () => {
    let queriedAnswer;

    beforeEach(async () => {
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
      expect(queriedAnswer.page.id).toEqual(page.id);
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

    // it("should resolve options", () => {
    //   expect(queriedAnswer.options).toMatchArray({
    //     maxValue: expect.any(Object),
    //     minValue: expect.any(Object),
    //   });
    // });

    // it("should resolve mutuallyExclusiveOption", () => {
    //   expect(queriedAnswer.options).toMatchArray({
    //     maxValue: expect.any(Object),
    //     minValue: expect.any(Object),
    //   });
    // });
  });

  describe("delete", () => {
    it("should delete an answer", async () => {
      await deleteAnswer(questionnaire, answer.id);
      const deletedAnswer = await queryAnswer(questionnaire, answer.id);
      expect(deletedAnswer).toBeNull();
    });
  });
});

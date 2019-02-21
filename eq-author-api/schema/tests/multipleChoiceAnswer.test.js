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

const {
  updateOption,
} = require("../../tests/utils/questionnaireBuilder/option");

const { RADIO, CHECKBOX } = require("../../constants/answerTypes");

describe("multiple choice answer", () => {
  let questionnaire, section, page, answer, option;
  beforeEach(async () => {
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
                  type: RADIO,
                  options: [
                    {
                      label: "option-label",
                      description: "option-description",
                      value: "option-value",
                      qCode: "option-qcode",
                      hasAdditionalAnswer: false,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    section = last(questionnaire.sections);
    page = last(section.pages);
    answer = last(page.answers);
    option = last(answer.options);
  });

  afterEach(async () => {
    await deleteQuestionnaire(questionnaire.id);
  });

  describe("create", () => {
    it("should create a multiple choice answer", () => {
      expect(answer).toEqual(
        expect.objectContaining({
          description: "answer-description",
          guidance: "answer-guidance",
          label: "answer-label",
          secondaryLabel: "answer-secondaryLabel",
          qCode: "answer-qcode",
          options: expect.arrayContaining([expect.any(Object)]),
        })
      );
    });

    it("should create an option", () => {
      //@todo - Fix
      // expect(option).toEqual(
      //   expect.objectContaining({
      //     label: "option-label",
      //     description: "option-description",
      //     value: "option-value",
      //     qCode: "option-qcode",
      //   })
      // );
    });

    it("should create a mutually exclusive option", () => {
      //@todo
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
        type: CHECKBOX,
        properties: {
          required: true,
        },
      };
      updatedAnswer = await updateAnswer(questionnaire, update);
    });

    it("should mutate an answer", () => {
      expect(updatedAnswer).toEqual(expect.objectContaining(update));
    });

    it("should mutate options", async () => {
      update = {
        id: option.id,
        label: "option-label-update",
        description: "option-description-update",
        value: "answer-value-update",
        qCode: "answer-qcode-update",
        additionalAnswer: {
          id: answer.id,
        },
      };
      updatedAnswer = await updateOption(questionnaire, update);
      expect(updatedAnswer).toEqual(expect.objectContaining(update));
    });
  });

  describe("query", () => {
    let queriedAnswer;

    beforeEach(async () => {
      queriedAnswer = await queryAnswer(questionnaire, answer.id);
    });

    it("should resolve multiple choice fields", () => {
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
        options: expect.any(Array),
        properties: expect.any(Object),
      });
    });

    it("should resolve type", () => {
      expect(queriedAnswer.type).toEqual(answer.type);
    });

    it("should resolve options", () => {
      expect(last(queriedAnswer.options).id).toEqual(last(answer.options).id);
    });

    it("should resolve mutuallyExclusiveOption", () => {
      expect(queriedAnswer.mutuallyExclusiveOption).toEqual(
        answer.mutuallyExclusiveOption
      );
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
  });

  describe("delete", () => {
    it("should delete an answer", async () => {
      await deleteAnswer(questionnaire, answer.id);
      const deletedAnswer = await queryAnswer(questionnaire, answer.id);
      expect(deletedAnswer).toBeNull();
    });
  });
});

const { get, flow, find } = require("lodash/fp");

const {
  buildQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder");

const {
  deleteQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder/questionnaire");

const {
  createAnswer,
  queryAnswer,
  deleteAnswer,
} = require("../../tests/utils/questionnaireBuilder/answer");

const {
  createOption,
  createMutuallyExclusiveOption,
  queryOption,
  updateOption,
  deleteOption,
} = require("../../tests/utils/questionnaireBuilder/option");

const { RADIO, CHECKBOX } = require("../../constants/answerTypes");

const getPage = get("sections[0].pages[0]");
const getAnswer = flow(
  getPage,
  get("answers[0]")
);
const getOption = flow(
  getAnswer,
  get("options[0]")
);
const getMutuallyExclusiveOption = find({ mutuallyExclusive: true });

describe("multiple choice answer", () => {
  let questionnaire;

  afterEach(async () => {
    await deleteQuestionnaire(questionnaire.id);
    questionnaire = null;
  });

  describe("multiple choice answer", () => {
    describe("create", () => {
      it("should create a radio answer with two options", async () => {
        questionnaire = await buildQuestionnaire({
          sections: [
            {
              pages: [
                {
                  answers: [],
                },
              ],
            },
          ],
        });
        const createdAnswer = await createAnswer(questionnaire, {
          type: RADIO,
          questionPageId: getPage(questionnaire).id,
        });

        expect(createdAnswer.options).toHaveLength(2);
        expect(createdAnswer.mutuallyExclusiveOption).toBeNull();

        expect(createdAnswer.options[0]).toMatchObject({
          id: expect.any(String),
          displayName: "Untitled Label",
          label: null,
          description: null,
          value: null,
          qCode: null,
          answer: {
            id: createdAnswer.id,
          },
          additionalAnswer: null,
        });
      });

      it("should create a checkbox answer with one option", async () => {
        questionnaire = await buildQuestionnaire({
          sections: [
            {
              pages: [{}],
            },
          ],
        });
        const createdAnswer = await createAnswer(questionnaire, {
          type: CHECKBOX,
          questionPageId: getPage(questionnaire).id,
        });

        expect(createdAnswer.options).toHaveLength(1);
        expect(createdAnswer.mutuallyExclusiveOption).toBeNull();
        expect(createdAnswer.options[0]).toMatchObject({
          id: expect.any(String),
          displayName: "Untitled Label",
          label: null,
          description: null,
          value: null,
          qCode: null,
          answer: {
            id: createdAnswer.id,
          },
          additionalAnswer: null,
        });
      });
    });

    describe("query", () => {
      it("should resolve multiple choice fields", async () => {
        questionnaire = await buildQuestionnaire({
          sections: [
            {
              pages: [
                {
                  answers: [
                    {
                      type: RADIO,
                    },
                  ],
                },
              ],
            },
          ],
        });
        const answer = getAnswer(questionnaire);
        const queriedAnswer = await queryAnswer(
          questionnaire,
          getAnswer(questionnaire).id
        );
        expect(queriedAnswer).toMatchObject({
          properties: expect.any(Object),
        });
        expect(queriedAnswer.options).toHaveLength(2);
        expect(queriedAnswer.options.map(o => o.id)).toEqual(
          answer.options.map(o => o.id)
        );
      });

      it("should resolve mutuallyExclusiveOption", async () => {
        questionnaire = await buildQuestionnaire({
          sections: [
            {
              pages: [
                {
                  answers: [
                    {
                      type: RADIO,
                      mutuallyExclusiveOption: {
                        label: "Exclusive",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        });

        const answer = getAnswer(questionnaire);
        const queriedAnswer = await queryAnswer(
          questionnaire,
          getAnswer(questionnaire).id
        );

        expect(queriedAnswer.options).toHaveLength(2);
        expect(queriedAnswer.mutuallyExclusiveOption.id).toEqual(
          getMutuallyExclusiveOption(answer.options).id
        );
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
                      type: RADIO,
                    },
                  ],
                },
              ],
            },
          ],
        });
        const answer = getAnswer(questionnaire);
        await deleteAnswer(questionnaire, answer.id);
        const deletedAnswer = await queryAnswer(questionnaire, answer.id);
        expect(deletedAnswer).toBeNull();
      });
    });
  });

  describe("option", () => {
    describe("create", () => {
      it("should create an option", async () => {
        questionnaire = await buildQuestionnaire({
          sections: [
            {
              pages: [
                {
                  answers: [
                    {
                      type: CHECKBOX,
                    },
                  ],
                },
              ],
            },
          ],
        });
        const answer = getAnswer(questionnaire);
        const createdOption = await createOption(questionnaire, {
          answerId: answer.id,
          label: "My label",
          description: "Description",
          value: "Value",
          qCode: "qCode",
        });
        expect(createdOption).toMatchObject({
          label: "My label",
          description: "Description",
          value: "Value",
          qCode: "qCode",
          additionalAnswer: null,
        });
      });

      it("should create an option with an additional answer", async () => {
        questionnaire = await buildQuestionnaire({
          sections: [
            {
              pages: [
                {
                  answers: [
                    {
                      type: CHECKBOX,
                    },
                  ],
                },
              ],
            },
          ],
        });
        const answer = getAnswer(questionnaire);
        const createdOption = await createOption(questionnaire, {
          answerId: answer.id,
          hasAdditionalAnswer: true,
        });
        expect(createdOption).toMatchObject({
          additionalAnswer: {
            id: expect.any(String),
          },
        });
      });

      it("should create a mutually exclusive option", async () => {
        questionnaire = await buildQuestionnaire({
          sections: [
            {
              pages: [
                {
                  answers: [
                    {
                      type: CHECKBOX,
                    },
                  ],
                },
              ],
            },
          ],
        });

        const answer = getAnswer(questionnaire);
        const createdOption = await createMutuallyExclusiveOption(
          questionnaire,
          {
            answerId: answer.id,
            label: "My exclusive option",
          }
        );
        expect(createdOption).toMatchObject({
          displayName: "My exclusive option",
        });
      });
    });

    describe("mutate", () => {
      it("should mutate options", async () => {
        questionnaire = await buildQuestionnaire({
          sections: [
            {
              pages: [
                {
                  answers: [
                    {
                      type: RADIO,
                      options: [
                        {
                          additionalAnswer: {},
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        });
        const option = getOption(questionnaire);
        const update = {
          id: option.id,
          label: "option-label-update",
          description: "option-description-update",
          value: "answer-value-update",
          qCode: "answer-qcode-update",
          additionalAnswer: {
            id: option.additionalAnswer.id,
            label: "additonal-answer-label",
          },
        };
        const updatedOption = await updateOption(questionnaire, update);
        expect(updatedOption).toEqual(expect.objectContaining(update));
      });
    });

    describe("delete", () => {
      it("should delete options", async () => {
        questionnaire = await buildQuestionnaire({
          sections: [
            {
              pages: [
                {
                  answers: [
                    {
                      type: CHECKBOX,
                      options: [{}],
                    },
                  ],
                },
              ],
            },
          ],
        });
        const option = getOption(questionnaire);
        await deleteOption(questionnaire, option);
        const queriedOption = await queryOption(questionnaire, option.id);
        expect(queriedOption).toBeNull();
      });
    });
  });
});

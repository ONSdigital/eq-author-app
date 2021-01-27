const { buildContext } = require("../../tests/utils/contextBuilder");

const {
  deleteQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");

const { createAnswer } = require("../../tests/utils/contextBuilder/answer");

const {
  queryGetAvailableAnswers,
} = require("../../tests/utils/contextBuilder/getAvailableAnswers");

const { NUMBER } = require("../../constants/answerTypes");

describe("get available answers", () => {
  let ctx, questionnaire;
  beforeEach(async () => {
    ctx = await buildContext({
      sections: [{ folders: [{ pages: [{}, {}] }] }],
    });
    questionnaire = ctx.questionnaire;

    await createAnswer(ctx, {
      description: "answer-description",
      guidance: "answer-guidance",
      label: "answer-label",
      secondaryLabel: "answer-secondaryLabel",
      qCode: "answer-qcode",
      type: NUMBER,
      questionPageId: questionnaire.sections[0].folders[0].pages[0].id,
    });
    await createAnswer(ctx, {
      description: "answer-description",
      guidance: "answer-guidance",
      label: "answer-label",
      secondaryLabel: "answer-secondaryLabel",
      qCode: "answer-qcode",
      type: NUMBER,
      questionPageId: questionnaire.sections[0].folders[0].pages[1].id,
    });
  });

  afterEach(async () => {
    await deleteQuestionnaire(ctx, questionnaire.id);
  });

  it(`should get a array of answers includeing the current`, async () => {
    const result = await queryGetAvailableAnswers(
      ctx,
      questionnaire.sections[0].folders[0].pages[1].id,
      true
    );
    expect(result.length).toEqual(2);
  });

  it(`should get a array of answers includeing the current`, async () => {
    const result = await queryGetAvailableAnswers(
      ctx,
      questionnaire.sections[0].folders[0].pages[1].id,
      false
    );
    expect(result.length).toEqual(1);
  });
});

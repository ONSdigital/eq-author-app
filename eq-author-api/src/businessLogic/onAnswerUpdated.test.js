const { buildContext } = require("../../tests/utils/contextBuilder");
const onAnswerUpdated = require("./onAnswerUpdated");

describe("onAnswerUpdated", () => {
  let ctx, updatedAnswer, pages;
  let config = {
    sections: [
      {
        folders: [
          {
            pages: [{}],
          },
        ],
      },
    ],
  };

  beforeAll(async () => {
    ctx = await buildContext(config);

    updatedAnswer = {
      id: "answer-1",
      label: "<p>Age</p>",
      type: "Number",
      questionPageId: "page-1",
    };

    ctx.questionnaire.sections[0].folders[0].pages[0] = {
      id: "page-1",
      title: "<p>How old are you?</p>",
      pageType: "QuestionPage",
      answers: [updatedAnswer],
    };
    pages = ctx.questionnaire.sections[0].folders[0].pages;
  });

  it("should update piping in answer title", async () => {
    ctx.questionnaire.sections[0].folders[0].pages[1] = {
      id: "page-2",
      title:
        '<p><span data-piped="answers" data-id="answer-1" data-type="Number">[Mock Pipe]</span></p>',
      pageType: "QuestionPage",
    };

    onAnswerUpdated(ctx, updatedAnswer, pages);
    const title = ctx.questionnaire.sections[0].folders[0].pages[1].title;

    expect(title.includes("[Age]")).toBeTruthy();
  });

  it("should update piping in answer label", async () => {
    ctx.questionnaire.sections[0].folders[0].pages[1] = {
      answers: [
        {
          id: "answer-2",
          label:
            '<p><span data-piped="answers" data-id="answer-1" data-type="Number">[Mock Pipe]</span></p>',
        },
      ],
    };

    onAnswerUpdated(ctx, updatedAnswer, pages);
    const { label } =
      ctx.questionnaire.sections[0].folders[0].pages[1].answers[0];

    expect(label.includes("[Age]")).toBeTruthy();
  });

  it("should update piping in question page description", async () => {
    ctx.questionnaire.sections[0].folders[0].pages[1] = {
      id: "page-2",
      title: "Answer 2",
      description:
        '<p><span data-piped="answers" data-id="answer-1" data-type="Number">[Mock Pipe]</span></p>',
    };

    onAnswerUpdated(ctx, updatedAnswer, pages);
    const { description } = ctx.questionnaire.sections[0].folders[0].pages[1];

    expect(description.includes("[Age]")).toBeTruthy();
  });
});

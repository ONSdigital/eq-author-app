const onListDeleted = require("./onListDeleted");
const onAnswerDeleted = require("./onAnswerDeleted");

jest.mock("./onAnswerDeleted");

describe("onListDeleted", () => {
  let ctx;
  const list = {
    id: "id-1",
    answers: [{ id: "answer-1", type: "TextField" }],
  };
  beforeEach(() => {
    ctx = {
      questionnaire: {
        id: "questionnaire-1",
        introduction: {
          id: "introduction-1",
          title: "introduction 1",
          disallowPreviewQuestions: true,
        },
        collectionLists: {
          id: "collectionList-1",
          lists: [list],
        },
        sections: [
          {
            repeatingSectionListId: "id-1",
            folders: [{ pages: [{}] }],
          },
        ],
      },
    };
  });

  afterEach(() => {
    onAnswerDeleted.mockClear();
  });

  it("should change the section's page.listId to null when it is the same as the list's id", () => {
    ctx.questionnaire.sections[0].folders[0].pages[0] = {
      id: "page-1",
      listId: "id-1",
    };
    onListDeleted(ctx, list);
    expect(ctx.questionnaire.sections[0].folders[0].pages[0].listId).toBeNull();
  });

  it("should change the introduction's disallowPreviewQuestion to false when there is no collection lists", () => {
    onListDeleted(ctx, {});

    expect(ctx.questionnaire.introduction.disallowPreviewQuestions).toBe(false);
  });

  it("should change the section's repeatingSectionListId to null when it is the same as the list's id", () => {
    onListDeleted(ctx, list);
    expect(ctx.questionnaire.sections[0].repeatingSectionListId).toBeNull();
  });

  it("should call onAnswerDeleted when list with answers is deleted", () => {
    onListDeleted(ctx, list);
    expect(ctx.questionnaire.sections[0].repeatingSectionListId).toBeNull();
  });

  it("should call onAnswerDeleted when list has answers", () => {
    onListDeleted(ctx, list);
    expect(onAnswerDeleted).toHaveBeenCalledTimes(1);
    expect(onAnswerDeleted).toHaveBeenCalledWith(
      ctx,
      list,
      list.answers[0],
      ctx.questionnaire.sections[0].folders[0].pages
    );
  });
});

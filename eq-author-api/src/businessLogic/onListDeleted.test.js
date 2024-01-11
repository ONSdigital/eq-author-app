const onListDeleted = require("./onListDeleted");

describe("onListDeleted", () => {
  let ctx;
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
          lists: [],
        },
        sections: [],
      },
    };
  });

  it("should change the introduction's disallowPreviewQuestion to false when there is no collection lists", () => {
    onListDeleted(ctx, {});

    expect(ctx.questionnaire.introduction.disallowPreviewQuestions).toBe(false);
  });
});

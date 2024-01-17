const createList = require("./createList");

describe("createList", () => {
  let ctx;
  beforeEach(() => {
    ctx = {
      questionnaire: {
        id: "questionnaire-1",
        introduction: {
          id: "introduction-1",
          title: "introduction 1",
          previewQuestions: true,
          disallowPreviewQuestions: false,
        },
        collectionLists: {
          id: "collection-list",
          lists: [
            {
              id: "list-1",
              ListName: "list 1",
              answers: [],
            },
          ],
        },
      },
    };
  });

  it("Should change the introduction's disallowPreviewQuestion to true when collection list is created", () => {
    createList(ctx);
    expect(ctx.questionnaire.introduction.disallowPreviewQuestions).toBe(true);
  });

  it("Should change the introduction's previewQuestions to false when the collection list is created", () => {
    createList(ctx);
    expect(ctx.questionnaire.introduction.previewQuestions).toBe(false);
  });
});

const { buildContext } = require("../../tests/utils/contextBuilder");
const {
  createQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");

const {
  createList,
  updateList,
  deleteList,
  createListAnswer,
  updateListAnswer,
  deleteListAnswer,
} = require("../../tests/utils/contextBuilder/list");

describe("Lists", () => {
  let ctx = {};
  let config = {};
  beforeAll(async () => {
    ctx = await buildContext(null);
    config = {
      title: "Ratchet and Clank",
      description: "A survey about an amazing game",
      surveyId: "015",
      theme: "default",
      navigation: false,
      summary: false,
      type: "Business",
      shortTitle: "",
    };
    await createQuestionnaire(ctx, config);
  });

  it("Can create an empty list", async () => {
    const list = await createList(ctx);
    expect(list.listName).toBeNull();
    expect(ctx.questionnaire.lists.length).toEqual(1);
  });

  it("Can update a list", async () => {
    let input = { id: ctx.questionnaire.lists[0].id, listName: "Test1" };
    const list = await updateList(ctx, input);
    expect(list.displayName).toBe("Test1");
    expect(list.listName).toBe("Test1");
  });

  it("Can delete a list", async () => {
    let input = { id: ctx.questionnaire.lists[0].id };
    await deleteList(ctx, input);
    expect(ctx.questionnaire.lists.length).toEqual(0);
  });

  it("Can add an answer to a list", async () => {
    const list = await createList(ctx);
    expect(list.listName).toBeNull();
    expect(ctx.questionnaire.lists.length).toEqual(1);
    expect(ctx.questionnaire.lists[0].answers.length).toBe(0);
    await createListAnswer(ctx, { listId: list.id, type: "Number" });
    expect(ctx.questionnaire.lists[0].answers.length).toBe(1);
  });

  it("Can update an answer in a list", async () => {
    let input = {
      id: ctx.questionnaire.lists[0].answers[0].id,
      label: "Answer1",
    };
    await updateListAnswer(ctx, input);
    expect(ctx.questionnaire.lists[0].answers[0].label).toBe("Answer1");
  });

  it("Can delete an answer in a list", async () => {
    let input = { id: ctx.questionnaire.lists[0].answers[0].id };
    expect(ctx.questionnaire.lists[0].answers.length).toBe(1);
    await deleteListAnswer(ctx, input);
    expect(ctx.questionnaire.lists[0].answers.length).toBe(0);
  });
});

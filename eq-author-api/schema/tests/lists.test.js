const { buildContext } = require("../../tests/utils/contextBuilder");
const {
  createQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");

const { createList } = require("../../tests/utils/contextBuilder/list");

describe("Lists", () => {
  let ctx = {};
  let config = {};
  beforeEach(async () => {
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

  describe("CreateList", () => {
    it("Can create an empty list", async () => {
      const list = await createList(ctx);
      expect(list.listName).toBeNull();
      expect(ctx.questionnaire.lists.length).toEqual(1);
    });
  });
});

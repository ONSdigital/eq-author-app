const addCollectionLists = require("./addCollectionLists");

describe("Migration: add collection list", () => {
  it("should add a collection list node", () => {
    const questionnaire = {};
    expect(addCollectionLists(questionnaire).collectionLists).toHaveProperty([
      "id",
    ]);
  });
});

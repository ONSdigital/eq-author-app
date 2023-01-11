const addDataVersion = require("./addDataVersion");

describe("addDataVersion", () => {
  it("should set dataVersion value to 3 when questionnaire has lists", () => {
    const questionnaire = {
      collectionLists: {
        lists: [{ id: "list-1" }],
      },
    };

    expect(addDataVersion(questionnaire).dataVersion).toBe("3");
  });

  it("should set dataVersion value to 1 when questionnaire lists are empty", () => {
    const questionnaire = { collectionLists: { lists: [] } };

    expect(addDataVersion(questionnaire).dataVersion).toBe("1");
  });
});

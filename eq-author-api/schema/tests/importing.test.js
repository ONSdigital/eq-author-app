const { buildContext } = require("../../tests/utils/contextBuilder");
const {
  importQuestions,
} = require("../../tests/utils/contextBuilder/importing");

describe("Importing content", () => {
  it("should throw an error if neither sectionId or folderId provided", async () => {
    const ctx = await buildContext({});
    expect(
      importQuestions(ctx, {
        questionnaireId: "questionnaire-1",
        questionIds: ["a", "b", "c"],
        position: {
          index: 0,
        },
      })
    ).rejects.toThrow("Target folder or section ID must be provided");
  });

  it("should throw an error if source questionnaireID doesn't exist", async () => {
    expect(
      importQuestions(await buildContext({}), {
        questionIds: ["a", "b", "c"],
        questionnaireId: "nope",
        position: {
          sectionId: "s1",
          index: 0,
        },
      })
    ).rejects.toThrow("Questionnaire with ID nope does not exist");
  });
});

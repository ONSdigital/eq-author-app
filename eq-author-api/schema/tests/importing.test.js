const { buildContext } = require("../../tests/utils/contextBuilder");
const {
  importQuestions,
} = require("../../tests/utils/contextBuilder/importing");

describe("Importing content", () => {
  describe("Error conditions", () => {
    const defaultInput = {
      questionnaireId: "questionnaire-id",
      questionIds: ["q1", "q2", "q3"],
      position: {
        index: 0,
        sectionId: "section-1",
      },
    };

    it("should throw if neither sectionId or folderId provided", async () => {
      expect(
        importQuestions(await buildContext({}), {
          ...defaultInput,
          position: { index: 0, sectionId: null, folderId: null },
        })
      ).rejects.toThrow("Target folder or section ID must be provided");
    });

    it("should throw if source questionnaireID doesn't exist", async () => {
      expect(
        importQuestions(await buildContext({}), defaultInput)
      ).rejects.toThrow(/Questionnaire with ID .+ does not exist/);
    });

    it("should throw if not all questions present in source questionnaire", async () => {
      const { questionnaire: source } = await buildContext({});
      const ctx = await buildContext({});

      expect(
        importQuestions(ctx, {
          ...defaultInput,
          questionnaireId: source.id,
        })
      ).rejects.toThrow(/Not all page IDs .+ exist in source questionnaire/);
    });
  });
});

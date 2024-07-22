const {
  createQuestionnaire,
} = require("../../../tests/utils/contextBuilder/questionnaire");
const {
  queryFilteredQuestionnaires,
  queryTotalPages,
} = require("../../../tests/utils/contextBuilder/homepage");

const { buildContext } = require("../../../tests/utils/contextBuilder");

describe("homepage", () => {
  let ctx;

  beforeAll(async () => {
    ctx = await buildContext();

    await createQuestionnaire(ctx, {
      title: "Test Questionnaire 1",
      theme: "business",
      surveyId: "",
    });
    await createQuestionnaire(ctx, {
      title: "Test Questionnaire 2",
      theme: "business",
      surveyId: "",
    });
    await createQuestionnaire(ctx, {
      title: "Test Questionnaire 10",
      theme: "business",
      surveyId: "",
    });
    await createQuestionnaire(ctx, {
      title: "Test Questionnaire 11",
      theme: "business",
      surveyId: "",
    });
  });

  describe("filteredQuestionnaires", () => {
    it("should return all questionnaires when input is not provided", async () => {
      const user = {
        id: "user-1",
      };

      const filteredQuestionnaires = await queryFilteredQuestionnaires(user);

      expect(filteredQuestionnaires).toEqual([
        expect.objectContaining({
          title: "Test Questionnaire 1",
        }),
        expect.objectContaining({
          title: "Test Questionnaire 2",
        }),
        expect.objectContaining({
          title: "Test Questionnaire 10",
        }),
        expect.objectContaining({
          title: "Test Questionnaire 11",
        }),
      ]);
    });

    it("should filter questionnaires when input is provided", async () => {
      const user = {
        id: "user-1",
      };

      const input = {
        search: "Test Questionnaire 1",
        owner: "",
      };

      const filteredQuestionnaires = await queryFilteredQuestionnaires(
        user,
        input
      );

      expect(filteredQuestionnaires).toEqual([
        expect.objectContaining({
          title: "Test Questionnaire 1",
        }),
        expect.objectContaining({
          title: "Test Questionnaire 10",
        }),
        expect.objectContaining({
          title: "Test Questionnaire 11",
        }),
      ]);
    });
  });

  describe("totalPages", () => {
    it("should return total pages", async () => {
      const user = {
        id: "user-1",
      };

      const input = {
        resultsPerPage: 2,
        search: "Test Questionnaire",
        owner: "",
      };

      const totalPages = await queryTotalPages(user, input);

      expect(totalPages).toEqual(2);
    });
  });
});

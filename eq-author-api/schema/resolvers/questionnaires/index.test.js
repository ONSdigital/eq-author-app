const {
  createQuestionnaire,
} = require("../../../tests/utils/contextBuilder/questionnaire");
const {
  queryFilteredQuestionnaires,
  queryTotalFilteredQuestionnaires,
  queryTotalPages,
} = require("../../../tests/utils/contextBuilder/questionnaires");

const { buildContext } = require("../../../tests/utils/contextBuilder");

describe("questionnaires", () => {
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
      title: "Test Questionnaire 3",
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

      // Sorted from newest created first to oldest created last as `listFilteredQuestionnaires` is sorted in this order by default
      expect(filteredQuestionnaires).toEqual([
        expect.objectContaining({
          title: "Test Questionnaire 11",
        }),
        expect.objectContaining({
          title: "Test Questionnaire 10",
        }),
        expect.objectContaining({
          title: "Test Questionnaire 3",
        }),
        expect.objectContaining({
          title: "Test Questionnaire 2",
        }),
        expect.objectContaining({
          title: "Test Questionnaire 1",
        }),
      ]);
    });

    it("should filter questionnaires when input is provided", async () => {
      const user = {
        id: "user-1",
      };

      const input = {
        searchByTitleOrShortCode: "Test Questionnaire 1",
        owner: "",
        access: "All",
      };

      const filteredQuestionnaires = await queryFilteredQuestionnaires(
        user,
        input
      );

      expect(filteredQuestionnaires).toEqual([
        // `filteredQuestionnaires` should contain `Test Questionnaire 11` and `Test Questionnaire 10` as these contain the string `Test Questionnaire 1`
        expect.objectContaining({
          title: "Test Questionnaire 11",
        }),
        expect.objectContaining({
          title: "Test Questionnaire 10",
        }),
        expect.objectContaining({
          title: "Test Questionnaire 1",
        }),
      ]);
      // `filteredQuestionnaires` should not contain `Test Questionnaire 2` and `Test Questionnaire 3` as these do not contain the string `Test Questionnaire 1`
      expect(filteredQuestionnaires).not.toContainEqual(
        expect.objectContaining({
          title: "Test Questionnaire 2",
        })
      );
      expect(filteredQuestionnaires).not.toContainEqual(
        expect.objectContaining({
          title: "Test Questionnaire 3",
        })
      );
    });
  });

  describe("totalFilteredQuestionnaires", () => {
    it("should return total questionnaires when input is not provided", async () => {
      const user = {
        id: "user-1",
      };

      const totalFilteredQuestionnaires =
        await queryTotalFilteredQuestionnaires(user);

      expect(totalFilteredQuestionnaires).toEqual(5);
    });

    it("should return total filtered questionnaires", async () => {
      const user = {
        id: "user-1",
      };

      const input = {
        searchByTitleOrShortCode: "Test Questionnaire 1",
        owner: "",
        access: "All",
      };

      const totalFilteredQuestionnaires =
        await queryTotalFilteredQuestionnaires(user, input);

      // `totalFilteredQuestionnaires` should be 3 as there are 3 questionnaires containing the string `Test Questionnaire 1`
      expect(totalFilteredQuestionnaires).toEqual(3);
    });
  });

  describe("totalPages", () => {
    it("should return total pages for all questionnaires when input is not provided", async () => {
      const user = {
        id: "user-1",
      };

      const totalPages = await queryTotalPages(user);

      // `totalPages` should be 1 as default resultsPerPage is 10
      expect(totalPages).toEqual(1);
    });

    it("should return total pages", async () => {
      const user = {
        id: "user-1",
      };

      const input = {
        resultsPerPage: 2,
        searchByTitleOrShortCode: "Test Questionnaire",
        owner: "",
        access: "All",
      };

      const totalPages = await queryTotalPages(user, input);

      // `totalPages` should be 3: (5 questionnaires) / (2 resultsPerPage) gives 3 total pages after rounding up
      expect(totalPages).toEqual(3);
    });
  });
});

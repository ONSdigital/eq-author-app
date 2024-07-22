const {
  createQuestionnaire,
} = require("../../../tests/utils/contextBuilder/questionnaire");
const {
  queryFilteredQuestionnaires,
} = require("../../../tests/utils/contextBuilder/homepage");

const { buildContext } = require("../../../tests/utils/contextBuilder");

describe("filteredQuestionnaires", () => {
  let ctx;

  beforeEach(async () => {
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

  it("should return filtered questionnaires", async () => {
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

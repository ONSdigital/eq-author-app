const updateHealthThemeToPandemicMonitoring = require("./updateHealthThemeToPandemicMonitoring");

describe("updateHealthTheme", () => {
  it("should update health theme", () => {
    const questionnaire = {
      theme: "health",
    };

    const updatedQuestionnaire =
      updateHealthThemeToPandemicMonitoring(questionnaire);
    expect(updatedQuestionnaire.theme).toBe("ukhsa-ons");
  });
});

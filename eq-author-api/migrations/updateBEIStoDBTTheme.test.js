const updateBEIStoDBTTheme = require("./updateBEIStoDBTTheme");

describe("updateBEISThemes", () => {
  it("should update BEIS theme", () => {
    const questionnaire = {
      theme: "beis",
    };

    const updatedQuestionnaire = updateBEIStoDBTTheme(questionnaire);
    expect(updatedQuestionnaire.theme).toBe("dbt-dsit");
  });

  it("should update BEIS NI theme", () => {
    const questionnaire = {
      theme: "beis_ni",
    };

    const updatedQuestionnaire = updateBEIStoDBTTheme(questionnaire);
    expect(updatedQuestionnaire.theme).toBe("dbt-dsit-ni");
  });
});

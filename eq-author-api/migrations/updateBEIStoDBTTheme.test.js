const updateBEIStoDBTTheme = require("./updateBEIStoDBTTheme");

describe("updateBEISThemes", () => {
  it("should update BEIS theme", () => {
    const questionnaire = {
      theme: "beis",
    };

    const updatedTheme = updateBEIStoDBTTheme(questionnaire);
    expect(updatedTheme.theme).toBe("dbt_dsit");
  });

  it("should update BEIS NI theme", () => {
    const questionnaire = {
      theme: "beis_ni",
    };

    const updatedTheme = updateBEIStoDBTTheme(questionnaire);
    expect(updatedTheme.theme).toBe("dbt_dsit_ni");
  });
});

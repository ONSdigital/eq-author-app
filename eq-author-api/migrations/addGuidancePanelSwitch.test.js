const addGuidancePanelSwitch = require("./addGuidancePanelSwitch");

describe("migrations: add additional guidance panel switch", () => {
  it("shouldn't modify a questionnaire which already has the switch", () => {
    const questionnaire = {
      introduction: {
        additionalGuidancePanelSwitch: true,
        additionalGuidancePanel: "Heed this guidance well...",
      },
    };

    expect(addGuidancePanelSwitch(questionnaire)).toMatchObject(questionnaire);
  });

  it("should add the additional guidance panel switch to questionnaires lacking it", () => {
    const questionnaire = {
      introduction: {},
    };

    expect(addGuidancePanelSwitch(questionnaire)).toMatchObject({
      introduction: {
        additionalGuidancePanel: "",
        additionalGuidancePanelSwitch: false,
      },
    });
  });
});

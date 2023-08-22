const onUnlinkSupplementaryData = require("./onUnlinkSupplementaryData");

describe("onUnlinkSupplementaryData", () => {
  let ctx, questionnaire, supplementaryData;

  beforeEach(() => {
    ctx = { questionnaire: {} };
    supplementaryData = [
      {
        id: "025a58d6",
        listName: "test",
        schemaFields: [
          {
            id: "65ed8557",
            type: "string",
            identifier: "note",
            selector: "title",
          },
        ],
      },
    ];
    questionnaire = {
      id: "456",
      sections: [
        {
          id: "123",
          introductionTitle: `<p><span data-piped="supplementary" data-id="65ed8557">[note - title]</span></p>`,
          repeatingSectionListId: "025a58d6",
        },
      ],
    };
  });

  it("Deletes any piping from supplementary data", () => {
    onUnlinkSupplementaryData(ctx, questionnaire, supplementaryData);
    expect(questionnaire.sections[0].introductionTitle).toBe(
      `<p><span data-piped="supplementary" data-id="65ed8557">[Deleted answer]</span></p>`
    );
  });

  it("sets repeating section  list id to emply string", () => {
    onUnlinkSupplementaryData(ctx, questionnaire, supplementaryData);
    expect(questionnaire.sections[0].repeatingSectionListId).toBe("");
  });
});

const Summary = require("./Summary");

describe("Summary", () => {
  it("should build valid runner Summary - non collapsible sections", () => {
    const summary = new Summary({ collapsible: false });
    expect(summary).toEqual({
      id: "summary-group",
      title: "Summary",
      blocks: [
        {
          type: "Summary",
          id: "summary-block",
        },
      ],
    });
  });
  it("should build valid runner Summary - collapsible sections", () => {
    const summary = new Summary({ collapsible: true });
    expect(summary).toEqual({
      id: "summary-group",
      title: "Summary",
      blocks: [
        {
          type: "Summary",
          id: "summary-block",
          collapsible: true,
        },
      ],
    });
  });
});

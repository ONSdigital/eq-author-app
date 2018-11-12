const Summary = require("./Summary");

describe("Summary", () => {
  it("should build valid runner Summary", () => {
    const summary = new Summary();
    expect(summary).toEqual({
      id: "summary-group",
      title: "Summary",
      blocks: [
        {
          type: "Summary",
          id: "summary-block"
        }
      ]
    });
  });
});

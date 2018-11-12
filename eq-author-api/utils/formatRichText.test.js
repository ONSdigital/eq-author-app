const formatRichText = require("./formatRichText");

describe("formatRichText", () => {
  let value;

  beforeEach(() => {
    value =
      "<h1>A heading with <strong>bold and <em>italic</em> text within</strong></h1>";
  });

  it("should return the HTML by default", () => {
    expect(formatRichText(value)).toEqual(value);
  });

  it("should return the Plaintext value", () => {
    expect(formatRichText(value, "Plaintext")).toEqual(
      "A heading with bold and italic text within"
    );
  });
});

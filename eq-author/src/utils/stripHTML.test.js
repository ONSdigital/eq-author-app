import { stripHtmlToText } from "./stripHTML";

describe("StripHTML", () => {
  it("should strip html tags from string", () => {
    const phrase = "Hello < > world";
    const testString = `<div><p>${phrase}</p><div>`;
    expect(stripHtmlToText(testString)).toEqual(phrase);
  });
});

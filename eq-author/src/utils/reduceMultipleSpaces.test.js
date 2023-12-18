import { reduceMultipleSpaces } from "./reduceMultipleSpaces";

describe("reduceMultipleSpaces function", () => {
  it("should replace multiple spaces with a single space", () => {
    const inputText = "   Hello    World    ";
    const expectedOutput = " Hello World ";
    const result = reduceMultipleSpaces(inputText);
    expect(result).toBe(expectedOutput);
  });
});

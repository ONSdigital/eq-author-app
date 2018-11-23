import { rteIsEmpty } from "./preview";

describe("rteIsEmpty", () => {
  it("should say it is empty when the field is falsy", () => {
    expect(rteIsEmpty("")).toBeTruthy();
    expect(rteIsEmpty(undefined)).toBeTruthy();
    expect(rteIsEmpty(null)).toBeTruthy();
  });

  it("should say it is empty when it is an empty p", () => {
    expect(rteIsEmpty("<p></p>")).toBeTruthy();
  });

  it("should say it is empty when it is an empty h2", () => {
    expect(rteIsEmpty("<h2></h2>")).toBeTruthy();
  });
});

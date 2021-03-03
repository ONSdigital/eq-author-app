const createRightSide = require("./createRightSide");
const { RADIO, NON_RADIO_ANSWERS } = require("../../constants/answerTypes");

describe("createRightSide", () => {
  it("should return undefined when there is no answer on the page", () => {
    expect(createRightSide(null)).toBeUndefined();
  });

  it("should return empty selected options array for radio answers", () => {
    expect(createRightSide({ type: RADIO })).toMatchObject({
      type: "SelectedOptions",
      optionIds: [],
    });
  });

  it("should return undefined for answer types other than RADIO", () => {
    NON_RADIO_ANSWERS.forEach((type) => {
      expect(createRightSide({ type })).toBeUndefined();
    });
  });
});

import * as ANSWER_TYPES from "constants/answer-types";

import isMultipleChoice from "./isMultipleChoice";

describe("isMultipleChoice", () => {
  const EXPECTED_MULTIPLE_CHOICE = [ANSWER_TYPES.RADIO, ANSWER_TYPES.CHECKBOX];

  it("should correctly determine if answer type is multiple choice", () => {
    Object.values(ANSWER_TYPES).forEach(type => {
      expect(isMultipleChoice(type)).toEqual(
        EXPECTED_MULTIPLE_CHOICE.includes(type)
      );
    });
  });
});

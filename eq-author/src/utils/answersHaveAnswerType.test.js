import { NUMBER, CURRENCY, MUTUALLY_EXCLUSIVE } from "constants/answer-types";

import answersHaveAnswerType from "./answersHaveAnswerType";

describe("answersHaveAnswerType", () => {
  it("should return true when answers array includes answer type", () => {
    const answers = [{ type: NUMBER }, { type: CURRENCY }];
    expect(answersHaveAnswerType(answers, NUMBER)).toBeTruthy();
  });

  it("should return false when answers array does not include answer type", () => {
    const answers = [{ type: NUMBER }, { type: CURRENCY }];
    expect(answersHaveAnswerType(answers, MUTUALLY_EXCLUSIVE)).toBeFalsy();
  });
});

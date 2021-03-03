import * as answerTypes from "constants/answer-types";

import isAnswerValidForRouting from "./isAnswerValidForRouting";

describe("isAnswerValidForRouting", () => {
  it("should correctly check answer for routability", () => {
    const ROUTABLE_TYPES = [
      answerTypes.NUMBER,
      answerTypes.CURRENCY,
      answerTypes.RADIO,
    ];
    Object.values(answerTypes).forEach((type) => {
      expect(isAnswerValidForRouting({ type })).toEqual(
        ROUTABLE_TYPES.includes(type)
      );
    });
  });
});

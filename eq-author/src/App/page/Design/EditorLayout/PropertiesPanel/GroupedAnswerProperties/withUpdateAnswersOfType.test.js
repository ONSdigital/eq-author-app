import { CURRENCY } from "constants/answer-types";

import { mapMutateToProps } from "./withUpdateAnswersOfType";

describe("withUpdateBinaryExpression", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;

    beforeEach(() => {
      mutate = jest.fn(() => Promise.resolve());
      props = mapMutateToProps({ mutate });
    });

    it("should have a updateAnswersOfType prop", () => {
      expect(props.updateAnswersOfType).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      const type = CURRENCY;
      const questionPageId = "2";
      const properties = { decimals: 5 };

      props.updateAnswersOfType(type, questionPageId, properties);
      expect(mutate).toHaveBeenCalledWith({
        variables: { input: { type, questionPageId, properties } },
      });
    });
  });
});

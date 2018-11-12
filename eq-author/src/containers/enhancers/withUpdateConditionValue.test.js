import { mapMutateToProps } from "./withUpdateConditionValue";

describe("enhancers > withUpdateConditionValue", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;
    let conditionValue;

    beforeEach(() => {
      mutate = jest.fn();
      props = mapMutateToProps({ mutate });
      conditionValue = jest.fn();
    });

    it("should have an onUpdateConditionValue prop", () => {
      expect(props.onUpdateConditionValue).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.onUpdateConditionValue(conditionValue);
      expect(mutate).toHaveBeenCalledWith({
        variables: { input: conditionValue }
      });
    });
  });
});

import { mapMutateToProps } from "./withUpdateRoutingRuleSet";

describe("enhancers > withUpdateRoutingRuleSet", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;
    let routingRuleSet;

    beforeEach(() => {
      mutate = jest.fn();
      props = mapMutateToProps({ mutate });
      routingRuleSet = jest.fn();
    });

    it("should have an onUpdateRoutingRuleSet prop", () => {
      expect(props.onUpdateRoutingRuleSet).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.onUpdateRoutingRuleSet(routingRuleSet);
      expect(mutate).toHaveBeenCalledWith({
        variables: { input: routingRuleSet }
      });
    });
  });
});

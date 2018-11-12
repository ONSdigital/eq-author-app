import { mapMutateToProps } from "./withUpdateRoutingRule";

describe("enhancers > withUpdateRoutingRule", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;
    let routingRule;

    beforeEach(() => {
      mutate = jest.fn();
      props = mapMutateToProps({ mutate });
      routingRule = jest.fn();
    });

    it("should have an onUpdateRoutingRule prop", () => {
      expect(props.onUpdateRoutingRule).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.onUpdateRoutingRule(routingRule);
      expect(mutate).toHaveBeenCalledWith({
        variables: { input: routingRule }
      });
    });
  });
});

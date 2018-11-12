import { mapMutateToProps } from "./withUpdateRoutingCondition";

describe("enhancers > withUpdateRoutingCondition", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;
    let routingCondition;

    beforeEach(() => {
      mutate = jest.fn();
      props = mapMutateToProps({ mutate });
      routingCondition = jest.fn();
    });

    it("should have an onUpdateRoutingCondition prop", () => {
      expect(props.onUpdateRoutingCondition).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.onUpdateRoutingCondition(routingCondition);
      expect(mutate).toHaveBeenCalledWith({
        variables: { input: routingCondition }
      });
    });
  });
});

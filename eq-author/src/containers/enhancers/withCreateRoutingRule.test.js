import { mapMutateToProps, createUpdater } from "./withCreateRoutingRule";
import fragment from "graphql/fragments/routing-rule-set.graphql";

describe("containers/enhancers/withCreateRoutingRule", () => {
  const routingRuleSet = {
    id: "1",
    routingRules: []
  };

  let mutate, ownProps, result, createRoutingRule;

  beforeEach(() => {
    createRoutingRule = {
      id: "1",
      operation: "And",
      conditions: [],
      goto: null
    };

    result = {
      data: {
        createRoutingRule
      }
    };

    mutate = jest.fn(() => Promise.resolve(result));
  });

  describe("createUpdater", () => {
    let id;
    let writeFragment;
    let readFragment;
    let updater;

    beforeEach(() => {
      id = `RoutingRuleSet${routingRuleSet.id}`;
      writeFragment = jest.fn();
      readFragment = jest.fn(() => routingRuleSet);
      updater = createUpdater(routingRuleSet.id);
    });

    it("should update the apollo cache", () => {
      updater({ readFragment, writeFragment }, result);
      expect(readFragment).toHaveBeenCalledWith({
        id,
        fragment,
        fragmentName: "RoutingRuleSet"
      });
      expect(writeFragment).toHaveBeenCalledWith({
        id,
        fragment,
        data: routingRuleSet,
        fragmentName: "RoutingRuleSet"
      });

      expect(routingRuleSet.routingRules).toContainEqual(createRoutingRule);
    });
  });

  describe("mapMutateToProps", () => {
    let props;

    beforeEach(() => {
      props = mapMutateToProps({ mutate, ownProps });
    });

    it("should have a onAddRoutingRule prop", () => {
      expect(props.onAddRoutingRule).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      expect.hasAssertions();

      return props.onAddRoutingRule(routingRuleSet.id).then(() => {
        expect(mutate).toHaveBeenCalledWith(
          expect.objectContaining({
            variables: {
              input: {
                operation: "And",
                routingRuleSetId: "1"
              }
            }
          })
        );
      });
    });
  });
});

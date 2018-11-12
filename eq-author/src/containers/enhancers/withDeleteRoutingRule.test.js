import { mapMutateToProps, createUpdater } from "./withDeleteRoutingRule";
import fragment from "graphql/fragments/routing-rule-set.graphql";

describe("components/QuestionnaireRoutingPage/withDeleteRoutingRule", () => {
  let mutate, result, deleteRoutingRule, routingRule, routingRuleSet;

  beforeEach(() => {
    deleteRoutingRule = {
      id: "2"
    };

    routingRule = {
      id: "2"
    };

    routingRuleSet = {
      id: "1",
      routingRules: [routingRule]
    };

    result = {
      data: {
        deleteRoutingRule
      }
    };

    mutate = jest.fn(() => Promise.resolve(result));
  });

  describe("createUpdater", () => {
    it("should remove the routing rule from the cache", () => {
      const id = `RoutingRuleSet${routingRuleSet.id}`;
      const readFragment = jest.fn(() => routingRuleSet);
      const writeFragment = jest.fn();

      const updater = createUpdater(routingRuleSet.id, routingRule.id);
      updater({ readFragment, writeFragment }, result);

      expect(readFragment).toHaveBeenCalledWith({
        id,
        fragment,
        fragmentName: "RoutingRuleSet"
      });
      expect(writeFragment).toHaveBeenCalledWith({
        id,
        fragment,
        fragmentName: "RoutingRuleSet",
        data: routingRuleSet
      });
      expect(routingRuleSet.routingRules).not.toContain(routingRule);
    });
  });

  describe("mapMutateToProps", () => {
    let props;

    beforeEach(() => {
      props = mapMutateToProps({ mutate });
    });

    it("should have a onDeleteRoutingRule prop", () => {
      expect(props.onDeleteRoutingRule).toBeInstanceOf(Function);
    });

    describe("onDeleteRoutingRule", () => {
      it("should call mutate", () => {
        return props
          .onDeleteRoutingRule(routingRuleSet.id, routingRule.id)
          .then(() => {
            expect(mutate).toHaveBeenCalledWith(
              expect.objectContaining({
                variables: {
                  input: { id: routingRule.id }
                }
              })
            );
          });
      });

      it("should return promise that resolves to deleteRoutingRule result", () => {
        return expect(
          props.onDeleteRoutingRule(routingRuleSet.id, routingRule.id)
        ).resolves.toBe(deleteRoutingRule);
      });
    });
  });
});

import { mapMutateToProps, createUpdater } from "./withDeleteRoutingCondition";
import fragment from "graphql/fragments/routing-rule.graphql";

describe("components/QuestionnaireRoutingPage/withDeleteRoutingCondition", () => {
  let mutate, result, deleteRoutingCondition, routingCondition, routingRule;

  beforeEach(() => {
    deleteRoutingCondition = {
      id: "2"
    };

    routingCondition = {
      id: "2"
    };

    routingRule = {
      id: "1",
      conditions: [routingCondition]
    };

    result = {
      data: {
        deleteRoutingCondition
      }
    };

    mutate = jest.fn(() => Promise.resolve(result));
  });

  describe("createUpdater", () => {
    it("should remove the routing condition from the cache", () => {
      const id = `RoutingRule${routingRule.id}`;
      const readFragment = jest.fn(() => routingRule);
      const writeFragment = jest.fn();

      const updater = createUpdater(routingRule.id, routingCondition.id);
      updater({ readFragment, writeFragment }, result);

      expect(readFragment).toHaveBeenCalledWith({
        id,
        fragment,
        fragmentName: "RoutingRule"
      });
      expect(writeFragment).toHaveBeenCalledWith({
        id,
        fragment,
        fragmentName: "RoutingRule",
        data: routingRule
      });
      expect(routingRule.conditions).not.toContain(routingCondition);
    });
  });

  describe("mapMutateToProps", () => {
    let props;

    beforeEach(() => {
      props = mapMutateToProps({ mutate });
    });

    it("should have a onDeleteRoutingCondition prop", () => {
      expect(props.onDeleteRoutingCondition).toBeInstanceOf(Function);
    });

    describe("onDeleteRoutingCondition", () => {
      it("should call mutate", () => {
        return props
          .onDeleteRoutingCondition(routingRule.id, routingCondition.id)
          .then(() => {
            expect(mutate).toHaveBeenCalledWith(
              expect.objectContaining({
                variables: {
                  input: { id: routingCondition.id }
                }
              })
            );
          });
      });

      it("should return promise that resolves to deleteRoutingRule result", () => {
        return expect(
          props.onDeleteRoutingCondition(routingRule.id, routingCondition.id)
        ).resolves.toBe(deleteRoutingCondition);
      });
    });
  });
});

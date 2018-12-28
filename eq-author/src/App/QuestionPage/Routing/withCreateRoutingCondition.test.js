import { mapMutateToProps, createUpdater } from "./withCreateRoutingCondition";
import fragment from "graphql/fragments/routing-rule.graphql";

describe("containers/enhancers/withCreateRoutingCondition", () => {
  const routingRule = {
    id: "1",
    conditions: []
  };

  let mutate, ownProps, result, createRoutingCondition;

  beforeEach(() => {
    ownProps = {
      match: {
        params: {
          pageId: "1"
        }
      }
    };

    createRoutingCondition = {
      id: "1",
      operation: "And",
      conditions: [],
      goto: null
    };

    result = {
      data: {
        createRoutingCondition
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
      id = `RoutingRule${routingRule.id}`;
      writeFragment = jest.fn();
      readFragment = jest.fn(() => routingRule);
      updater = createUpdater(routingRule.id);
    });

    it("should update the apollo cache", () => {
      updater({ readFragment, writeFragment }, result);
      expect(readFragment).toHaveBeenCalledWith({
        id,
        fragment,
        fragmentName: "RoutingRule"
      });
      expect(writeFragment).toHaveBeenCalledWith({
        id,
        fragment,
        data: routingRule,
        fragmentName: "RoutingRule"
      });

      expect(routingRule.conditions).toContainEqual(createRoutingCondition);
    });
  });

  describe("mapMutateToProps", () => {
    let props;

    beforeEach(() => {
      props = mapMutateToProps({ mutate, ownProps });
    });

    it("should have a onAddRoutingCondition prop", () => {
      expect(props.onAddRoutingCondition).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      expect.hasAssertions();
      const answerId = "1";

      return props.onAddRoutingCondition(routingRule.id, answerId).then(() => {
        expect(mutate).toHaveBeenCalledWith(
          expect.objectContaining({
            variables: {
              input: {
                comparator: "Equal",
                questionPageId: ownProps.match.params.pageId,
                routingRuleId: routingRule.id,
                answerId
              }
            }
          })
        );
      });
    });
  });
});

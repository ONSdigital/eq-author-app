import { mapMutateToProps, createUpdater } from "./withToggleConditionOption";
import fragment from "graphql/fragments/routing-rule.graphql";

describe("containers/enhancers/withToggleConditionOption", () => {
  const routingCondition = {
    id: "1"
  };

  const option = {
    id: "1"
  };

  const questionPage = {
    id: "1",
    routingRuleSet: null
  };

  let mutate, result, toggleConditionOption;

  beforeEach(() => {
    toggleConditionOption = {
      value: [option.id]
    };

    result = {
      data: {
        toggleConditionOption
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
      id = `RoutingCondition${questionPage.id}`;
      writeFragment = jest.fn();
      readFragment = jest.fn(() => routingCondition);
      updater = createUpdater(routingCondition.id);
    });

    it("should update the apollo cache", () => {
      updater({ readFragment, writeFragment }, result);
      expect(readFragment).toHaveBeenCalledWith({
        id,
        fragment,
        fragmentName: "RoutingCondition"
      });
      expect(writeFragment).toHaveBeenCalledWith({
        id,
        fragment,
        fragmentName: "RoutingCondition",
        data: routingCondition
      });

      expect(routingCondition.routingValue).toMatchObject(
        toggleConditionOption
      );
    });
  });

  describe("mapMutateToProps", () => {
    let props;

    beforeEach(() => {
      props = mapMutateToProps({ mutate });
    });

    it("should have a onToggleConditionOption prop", () => {
      expect(props.onToggleConditionOption).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      return props
        .onToggleConditionOption(routingCondition.id, option.id, true)
        .then(() => {
          expect(mutate).toHaveBeenCalledWith(
            expect.objectContaining({
              variables: {
                input: {
                  conditionId: routingCondition.id,
                  optionId: option.id,
                  checked: true
                }
              }
            })
          );
        });
    });
  });
});

import { graphql } from "react-apollo";
import toggleConditionOption from "graphql/toggleConditionOption.graphql";
import fragment from "graphql/fragments/routing-rule.graphql";

export const createUpdater = routingConditionId => (proxy, result) => {
  const id = `RoutingCondition${routingConditionId}`;
  const routingCondition = proxy.readFragment({
    id,
    fragment,
    fragmentName: "RoutingCondition"
  });

  routingCondition.routingValue = result.data.toggleConditionOption;

  proxy.writeFragment({
    id,
    fragment,
    fragmentName: "RoutingCondition",
    data: routingCondition
  });
};

export const mapMutateToProps = ({ mutate }) => ({
  onToggleConditionOption(conditionId, optionId, checked) {
    const input = {
      conditionId,
      optionId,
      checked
    };

    const update = createUpdater(conditionId);

    return mutate({
      variables: { input },
      update
    }).then(res => res.data.toggleConditionOption);
  }
});

export default graphql(toggleConditionOption, {
  props: mapMutateToProps
});

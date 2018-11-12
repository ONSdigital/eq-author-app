import { graphql } from "react-apollo";
import deleteRoutingCondition from "graphql/deleteRoutingCondition.graphql";
import fragment from "graphql/fragments/routing-rule.graphql";
import { remove } from "lodash";

export const createUpdater = (routingRuleId, routingConditionId) => proxy => {
  const id = `RoutingRule${routingRuleId}`;
  const routingRule = proxy.readFragment({
    id,
    fragment,
    fragmentName: "RoutingRule"
  });

  remove(routingRule.conditions, { id: routingConditionId });

  proxy.writeFragment({
    id,
    fragment,
    fragmentName: "RoutingRule",
    data: routingRule
  });
};

export const mapMutateToProps = ({ mutate }) => ({
  onDeleteRoutingCondition(routingRuleId, routingConditionId) {
    const input = {
      id: routingConditionId
    };

    const update = createUpdater(routingRuleId, routingConditionId);

    return mutate({
      variables: { input },
      update
    }).then(res => res.data.deleteRoutingCondition);
  }
});

export default graphql(deleteRoutingCondition, {
  props: mapMutateToProps
});

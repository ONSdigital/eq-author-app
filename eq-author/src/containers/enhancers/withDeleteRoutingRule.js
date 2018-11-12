import { graphql } from "react-apollo";
import deleteRoutingRule from "graphql/deleteRoutingRule.graphql";
import fragment from "graphql/fragments/routing-rule-set.graphql";
import { remove } from "lodash";

export const createUpdater = (routingRuleSetId, routingRuleId) => proxy => {
  const id = `RoutingRuleSet${routingRuleSetId}`;
  const routingRuleSet = proxy.readFragment({
    id,
    fragment,
    fragmentName: "RoutingRuleSet"
  });

  remove(routingRuleSet.routingRules, { id: routingRuleId });

  proxy.writeFragment({
    id,
    fragment,
    fragmentName: "RoutingRuleSet",
    data: routingRuleSet
  });
};

export const mapMutateToProps = ({ mutate }) => ({
  onDeleteRoutingRule(routingRuleSetId, routingRuleId) {
    const input = {
      id: routingRuleId
    };

    const update = createUpdater(routingRuleSetId, routingRuleId);

    return mutate({
      variables: { input },
      update
    }).then(res => res.data.deleteRoutingRule);
  }
});

export default graphql(deleteRoutingRule, {
  props: mapMutateToProps
});

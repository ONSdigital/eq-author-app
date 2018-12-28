import { graphql } from "react-apollo";
import createRoutingRule from "graphql/createRoutingRule.graphql";
import fragment from "graphql/fragments/routing-rule-set.graphql";

export const createUpdater = routingRuleSetId => (proxy, result) => {
  const id = `RoutingRuleSet${routingRuleSetId}`;
  const routingRuleSet = proxy.readFragment({
    id,
    fragment,
    fragmentName: "RoutingRuleSet"
  });

  routingRuleSet.routingRules.push(result.data.createRoutingRule);

  proxy.writeFragment({
    id,
    fragment,
    fragmentName: "RoutingRuleSet",
    data: routingRuleSet
  });
};

export const mapMutateToProps = ({ mutate }) => ({
  onAddRoutingRule(routingRuleSetId) {
    const input = {
      operation: "And",
      routingRuleSetId
    };

    const update = createUpdater(routingRuleSetId);

    return mutate({
      variables: { input },
      update
    }).then(res => res.data.createRoutingRule);
  }
});

export default graphql(createRoutingRule, {
  props: mapMutateToProps
});

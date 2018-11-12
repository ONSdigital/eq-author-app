import updateRoutingRuleSet from "graphql/updateRoutingRuleSet.graphql";
import { graphql } from "react-apollo";

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateRoutingRuleSet: routingRuleSet =>
    mutate({
      variables: { input: routingRuleSet }
    })
});

export default graphql(updateRoutingRuleSet, {
  props: mapMutateToProps
});

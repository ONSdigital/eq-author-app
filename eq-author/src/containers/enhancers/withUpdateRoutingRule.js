import updateRoutingRule from "graphql/updateRoutingRule.graphql";
import { graphql } from "react-apollo";

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateRoutingRule: routingRule =>
    mutate({
      variables: { input: routingRule }
    })
});

export default graphql(updateRoutingRule, {
  props: mapMutateToProps
});

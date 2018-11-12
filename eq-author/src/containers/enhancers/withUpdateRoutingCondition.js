import updateRoutingCondition from "graphql/updateRoutingCondition.graphql";
import { graphql } from "react-apollo";

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateRoutingCondition: routingCondition =>
    mutate({
      variables: { input: routingCondition }
    })
});

export default graphql(updateRoutingCondition, {
  props: mapMutateToProps
});

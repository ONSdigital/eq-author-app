import updateConditionValue from "graphql/updateConditionValue.graphql";
import { graphql } from "react-apollo";

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateConditionValue: routingConditionValue =>
    mutate({
      variables: { input: routingConditionValue }
    })
});

export default graphql(updateConditionValue, {
  props: mapMutateToProps
});

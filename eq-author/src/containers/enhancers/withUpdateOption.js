import updateOptionMutation from "graphql/updateOption.graphql";
import { graphql } from "react-apollo";

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateOption: option =>
    mutate({
      variables: { input: option }
    })
});

export default graphql(updateOptionMutation, {
  props: mapMutateToProps
});

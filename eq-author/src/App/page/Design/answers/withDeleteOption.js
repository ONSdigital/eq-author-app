import { graphql } from "react-apollo";
import deleteOptionMutation from "graphql/deleteOption.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  onDeleteOption(optionId) {
    const option = {
      id: optionId,
    };

    return mutate({
      variables: { input: option },
    });
  },
});

export default graphql(deleteOptionMutation, {
  props: mapMutateToProps,
});

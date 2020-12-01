import { graphql } from "react-apollo";
import movePageMutation from "graphql/movePage.graphql";

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onMovePage({ from, to }) {
    const mutation = mutate({
      variables: { input: to },
    });

    return mutation;
  },
});

export default graphql(movePageMutation, {
  props: mapMutateToProps,
});

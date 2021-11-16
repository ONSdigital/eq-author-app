import { graphql } from "react-apollo";
import movePageMutation from "graphql/movePage.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  onMovePage({ to }) {
    const options = { variables: { input: to } };

    return mutate(options);
  },
});

export default graphql(movePageMutation, {
  props: mapMutateToProps,
});

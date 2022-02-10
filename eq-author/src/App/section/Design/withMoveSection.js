import { graphql } from "react-apollo";
import moveSectionMutation from "graphql/moveSection.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  onMoveSection({ to }) {
    const input = {
      ...to,
    };
    return mutate({
      variables: { input: input },
    });
  },
});

export default graphql(moveSectionMutation, {
  props: mapMutateToProps,
});

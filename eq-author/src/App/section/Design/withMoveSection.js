import { graphql } from "react-apollo";
import moveSectionMutation from "graphql/moveSection.graphql";

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onMoveSection({ to }) {
    const {
      match: {
        params: { questionnaireId },
      },
    } = ownProps;
    const input = {
      ...to,
      questionnaireId,
    };
    const optimisticResponse = {
      moveSection: {
        ...input,
        __typename: "Section",
      },
    };

    return mutate({
      variables: { input: input },
      optimisticResponse,
    });
  },
});

export default graphql(moveSectionMutation, {
  props: mapMutateToProps,
});

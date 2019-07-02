import { graphql } from "react-apollo";
import updateAnswersOfTypeMutation from "./updateAnswersOfType.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  updateAnswersOfType: (type, questionPageId, properties) => {
    return mutate({
      variables: { input: { type, questionPageId, properties } },
    });
  },
});

export default graphql(updateAnswersOfTypeMutation, {
  props: mapMutateToProps,
});

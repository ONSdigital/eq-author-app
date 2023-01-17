import { graphql } from "react-apollo";
import createOptionMutation from "graphql/createOption.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  onAddOption(answerId, { hasAdditionalAnswer }) {
    const option = { answerId, hasAdditionalAnswer };

    return mutate({
      variables: { input: option },
    }).then((res) => res.data.createOption);
  },
});

export default graphql(createOptionMutation, {
  props: mapMutateToProps,
});

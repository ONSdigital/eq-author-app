import { graphql } from "react-apollo";

import moveOptionMutation from "graphql/moveOption.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  onMoveOption: ({ id, position }) =>
    mutate({
      variables: { input: { id, position } },
    }),
});

export default graphql(moveOptionMutation, {
  props: mapMutateToProps,
});

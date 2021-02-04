import { graphql } from "react-apollo";

import deleteBinaryExpression from "./deleteBinaryExpression.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  deleteBinaryExpression(id, onCompleted) {
    return mutate({
      variables: {
        input: {
          id,
        },
      },
      onCompleted
    });
  },
});

export default graphql(deleteBinaryExpression, {
  props: mapMutateToProps,
});

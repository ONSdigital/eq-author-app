import { graphql } from "react-apollo";

import deleteBinaryExpression from "./deleteBinaryExpression.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  deleteBinaryExpression(id) {
    return mutate({
      variables: {
        input: {
          id,
        },
      },
    });
  },
});

export default graphql(deleteBinaryExpression, {
  props: mapMutateToProps,
});

import { graphql } from "react-apollo";

import createBinaryExpression from "./createBinaryExpression.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  createBinaryExpression(expressionGroupId) {
    return mutate({
      variables: {
        input: {
          expressionGroupId,
        },
      },
    });
  },
});

export default graphql(createBinaryExpression, {
  props: mapMutateToProps,
});

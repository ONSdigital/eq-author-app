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
      refetchQueries: ["GetQuestionnaire"],
    });
  },
});

export default graphql(createBinaryExpression, {
  props: mapMutateToProps,
});

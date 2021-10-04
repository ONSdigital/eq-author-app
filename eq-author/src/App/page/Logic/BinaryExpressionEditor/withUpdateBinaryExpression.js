import { graphql } from "react-apollo";

import updateBinaryExpression from "./updateBinaryExpression.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  updateBinaryExpression(expression, condition) {
    return mutate({
      variables: {
        input: {
          id: expression.id,
          condition,
        },
      },
      refetchQueries: ["GetQuestionnaire"],
    });
  },
});

export default graphql(updateBinaryExpression, {
  props: mapMutateToProps,
});

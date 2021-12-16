import { graphql } from "react-apollo";

import updateBinaryExpression from "./updateBinaryExpression.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  updateBinaryExpression(expression, condition, secondaryCondition) {
    return mutate({
      variables: {
        input: {
          id: expression.id,
          condition,
          secondaryCondition,
        },
      },
      refetchQueries: ["GetQuestionnaire"],
    });
  },
});

export default graphql(updateBinaryExpression, {
  props: mapMutateToProps,
});

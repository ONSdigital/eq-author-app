import { graphql } from "react-apollo";

import updateRightSide from "./updateRightSide.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  updateRightSide(expression, updateField) {
    return mutate({
      variables: {
        input: {
          expressionId: expression.id,
          ...updateField,
        },
      },
    });
  },
});

export default graphql(updateRightSide, {
  props: mapMutateToProps,
});

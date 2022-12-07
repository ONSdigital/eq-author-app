import { graphql } from "react-apollo";

import updateLeftSide from "./updateLeftSide.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  updateLeftSide(expression, answerId, metadataId) {
    return mutate({
      variables: {
        input: {
          expressionId: expression.id,
          answerId,
          metadataId,
        },
      },
      refetchQueries: ["GetQuestionnaire"],
    });
  },
});

export default graphql(updateLeftSide, {
  props: mapMutateToProps,
});

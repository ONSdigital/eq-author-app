import { graphql } from "react-apollo";

import updateLeftSide from "./updateLeftSide.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  updateLeftSide(expression, contentId, contentType) {
    if (contentType === "answerId") {
      return mutate({
        variables: {
          input: {
            expressionId: expression.id,
            answerId: contentId,
          },
        },
        refetchQueries: ["GetQuestionnaire"],
      });
    }
    if (contentType === "metadataId") {
      return mutate({
        variables: {
          input: {
            expressionId: expression.id,
            metadataId: contentId,
          },
        },
        refetchQueries: ["GetQuestionnaire"],
      });
    }
  },
});

export default graphql(updateLeftSide, {
  props: mapMutateToProps,
});

import { graphql } from "react-apollo";

import updateExpressionGroup from "./updateExpressionGroup.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  updateExpressionGroup({ id, operator }) {
    return mutate({
      variables: {
        input: {
          id,
          operator,
        },
      },
      refetchQueries: ["GetQuestionnaire"],
    });
  },
});

export default graphql(updateExpressionGroup, {
  props: mapMutateToProps,
});

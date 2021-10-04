import { graphql } from "react-apollo";

import createRule from "./createRule.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  createRule(routingId) {
    return mutate({
      variables: {
        input: {
          routingId,
        },
      },
      refetchQueries: ["GetQuestionnaire"],
    });
  },
});

export default graphql(createRule, {
  props: mapMutateToProps,
});

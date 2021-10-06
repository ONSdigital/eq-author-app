import { graphql } from "react-apollo";

import updateRule from "./updateRule.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  updateRule(rule) {
    return mutate({
      variables: {
        input: {
          id: rule.id,
          operator: rule.operator,
          destination: rule.destination,
        },
      },
      refetchQueries: ["GetQuestionnaire"],
    });
  },
});

export default graphql(updateRule, {
  props: mapMutateToProps,
});

import { graphql } from "react-apollo";

import deleteRule from "./deleteRule.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  deleteRule(id) {
    return mutate({
      variables: {
        input: {
          id,
        },
      },
    });
  },
});

export default graphql(deleteRule, {
  props: mapMutateToProps,
});

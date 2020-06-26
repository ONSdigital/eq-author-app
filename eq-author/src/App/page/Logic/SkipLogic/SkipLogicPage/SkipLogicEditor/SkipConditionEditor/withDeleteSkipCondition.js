import { graphql } from "react-apollo";

import deleteSkipCondition from "./deleteSkipCondition.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  deleteSkipCondition(id) {
    return mutate({
      variables: {
        input: {
          id,
        },
      },
    });
  },
});

export default graphql(deleteSkipCondition, {
  props: mapMutateToProps,
});

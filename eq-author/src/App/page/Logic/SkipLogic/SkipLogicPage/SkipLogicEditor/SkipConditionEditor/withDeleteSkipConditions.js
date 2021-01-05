import { graphql } from "react-apollo";

import deleteSkipConditions from "./deleteSkipConditions.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  deleteSkipConditions(parentId) {
    return mutate({
      variables: {
        input: {
          parentId,
        },
      },
    });
  },
});

export default graphql(deleteSkipConditions, {
  props: mapMutateToProps,
});

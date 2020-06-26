import { graphql } from "react-apollo";

import deleteSkipConditions from "./deleteSkipConditions.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  deleteSkipConditions(pageId) {
    return mutate({
      variables: {
        input: {
          pageId,
        },
      },
    });
  },
});

export default graphql(deleteSkipConditions, {
  props: mapMutateToProps,
});

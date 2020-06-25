import { graphql } from "react-apollo";

import createSkipCondition from "./createSkipCondition.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  createSkipCondition(pageId) {
    return mutate({
      variables: {
        input: {
          pageId,
        },
      },
    });
  },
});

export default graphql(createSkipCondition, {
  props: mapMutateToProps,
});

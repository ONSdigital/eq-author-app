import { graphql } from "react-apollo";

import createSkipCondition from "./createSkipCondition.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  createSkipCondition(id) {
    return mutate({
      variables: { input: { parentId: id } },
    });
  },
});

export default graphql(createSkipCondition, {
  props: mapMutateToProps,
});

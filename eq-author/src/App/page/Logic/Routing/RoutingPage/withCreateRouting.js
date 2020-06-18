import { graphql } from "react-apollo";

import createRouting from "./createRouting.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  createRouting(pageId) {
    return mutate({
      variables: { input: { pageId } },
    });
  },
});

export default graphql(createRouting, {
  props: mapMutateToProps,
});

import { graphql } from "react-apollo";

import updateRouting from "./updateRouting.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  updateRouting(routing) {
    return mutate({
      variables: {
        input: {
          id: routing.id,
          else: routing.else,
        },
      },
      refetchQueries: ["GetQuestionnaire"],
    });
  },
});

export default graphql(updateRouting, {
  props: mapMutateToProps,
});

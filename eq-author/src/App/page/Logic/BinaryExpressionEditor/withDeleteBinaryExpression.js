import { graphql } from "react-apollo";

import deleteBinaryExpression from "./deleteBinaryExpression.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  deleteBinaryExpression(id, onCompleted) {
    return mutate({
      variables: {
        input: {
          id,
        },
      },
      update: (_, result) => onCompleted(result?.data?.deleteBinaryExpression2),
      refetchQueries: ["GetQuestionnaire"],
    });
  },
});

export default graphql(deleteBinaryExpression, {
  props: mapMutateToProps,
});

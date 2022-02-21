import { filter } from "graphql-anywhere";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

import updateListAnswerMutation from "./updateListAnswerMutation.graphql";

const input = gql`
  {
    id
    description
    guidance
    label
    secondaryLabel
    qCode
    properties
  }
`;

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateListAnswer: (answer) =>
    mutate({
      variables: { input: filter(input, answer) },
      refetchQueries: ["GetQuestionnaire"],
    }),
});

export default graphql(updateListAnswerMutation, {
  props: mapMutateToProps,
});

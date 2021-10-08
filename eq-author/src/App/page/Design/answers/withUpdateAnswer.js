import { filter } from "graphql-anywhere";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

import updateAnswerMutation from "graphql/updateAnswer.graphql";

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
  onUpdateAnswer: (answer) =>
    mutate({
      variables: { input: filter(input, answer) },
      refetchQueries: ["GetQuestionnaire"],
    }),
});

export default graphql(updateAnswerMutation, {
  props: mapMutateToProps,
});

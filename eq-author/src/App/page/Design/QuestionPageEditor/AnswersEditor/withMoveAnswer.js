import { filter } from "graphql-anywhere";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

import moveAnswerMutation from "./moveAnswer.graphql";

const input = gql`
  {
    id
    position
  }
`;

export const mapMutateToProps = ({ mutate }) => ({
  moveAnswer: (answer) =>
    mutate({
      variables: { input: filter(input, answer) },
    }),
});

export default graphql(moveAnswerMutation, {
  props: mapMutateToProps,
});

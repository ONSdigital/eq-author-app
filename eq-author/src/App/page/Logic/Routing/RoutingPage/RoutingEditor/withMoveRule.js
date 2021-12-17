import { filter } from "graphql-anywhere";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

import moveRuleMutation from "./moveRule.graphql";

const input = gql`
  {
    id
    position
  }
`;

export const mapMutateToProps = ({ mutate }) => ({
  moveRule: (rule) =>
    mutate({
      variables: { input: filter(input, rule) },
    }),
});

export default graphql(moveRuleMutation, {
  props: mapMutateToProps,
});

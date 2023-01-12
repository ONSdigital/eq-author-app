import { filter } from "graphql-anywhere";
import gql from "graphql-tag";
import { partial } from "lodash";
import { graphql } from "react-apollo";

import updateMutation from "graphql/questionConfirmation/update.graphql";

const inputStructure = gql`
  {
    id
    title
    positive {
      label
      description
    }
    negative {
      label
      description
    }
  }
`;

const filterToWrite = partial(filter, inputStructure);

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateQuestionConfirmation: (questionConfirmation) =>
    mutate({
      variables: {
        input: filterToWrite(questionConfirmation),
      },
    }),
});

export default graphql(updateMutation, {
  props: mapMutateToProps,
});

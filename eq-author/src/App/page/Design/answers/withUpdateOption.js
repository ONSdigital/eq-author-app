import updateOptionMutation from "graphql/updateOption.graphql";
import { graphql } from "react-apollo";
import { filter } from "graphql-anywhere";
import gql from "graphql-tag";

const updateOptionInput = gql`
  {
    id
    label
    description
    value
    qCode
    additionalAnswer {
      id
      description
      guidance
      label
      secondaryLabel
      qCode
      properties
    }
  }
`;

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateOption: (option) =>
    mutate({
      variables: { input: filter(updateOptionInput, option) },
    }),
});

export default graphql(updateOptionMutation, {
  props: mapMutateToProps,
});

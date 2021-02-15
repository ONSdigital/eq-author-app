import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { filter } from "graphql-anywhere";

const mutation = gql`
  mutation updateCollapsible($input: UpdateCollapsibleInput!) {
    updateCollapsible(input: $input) {
      id
      title
      description
    }
  }
`;
const inputFilter = gql`
  {
    id
    title
    description
  }
`;

export const mapMutateToProps = ({ mutate }) => ({
  updateCollapsible: (collapsible) => {
    const data = filter(inputFilter, collapsible);
    return mutate({
      variables: { input: data },
      optimisticResponse: {
        updateCollapsible: {
          ...collapsible,
          ...data,
          __typename: "Collapsible",
        },
      },
    });
  },
});

export default graphql(mutation, {
  props: mapMutateToProps,
});

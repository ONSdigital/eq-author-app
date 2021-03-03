import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { filter } from "graphql-anywhere";

const mutation = gql`
  mutation createCollapsible($input: CreateCollapsibleInput!) {
    createCollapsible(input: $input) {
      id
      title
      description
      introduction {
        id
        collapsibles {
          id
        }
      }
    }
  }
`;
const inputFilter = gql`
  {
    introductionId
    title
    description
  }
`;

export const mapMutateToProps = ({ mutate }) => ({
  createCollapsible: (collapsible) => {
    const data = filter(inputFilter, collapsible);
    return mutate({
      variables: { input: data },
    });
  },
});

export default graphql(mutation, {
  props: mapMutateToProps,
});

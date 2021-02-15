import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { filter } from "graphql-anywhere";

const mutation = gql`
  mutation deleteCollapsible($input: DeleteCollapsibleInput!) {
    deleteCollapsible(input: $input) {
      id
      collapsibles {
        id
      }
    }
  }
`;
const inputFilter = gql`
  {
    id
  }
`;

export const mapMutateToProps = ({ mutate }) => ({
  deleteCollapsible: (collapsible) => {
    const data = filter(inputFilter, collapsible);
    return mutate({
      variables: { input: data },
    });
  },
});

export default graphql(mutation, {
  props: mapMutateToProps,
});

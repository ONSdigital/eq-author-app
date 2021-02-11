import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { filter } from "graphql-anywhere";

const mutation = gql`
  mutation moveCollapsible($input: MoveCollapsibleInput!) {
    moveCollapsible(input: $input) {
      id
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
    id
    position
  }
`;

export const mapMutateToProps = ({ mutate }) => ({
  moveCollapsible: (collapsible) => {
    const data = filter(inputFilter, collapsible);
    return mutate({
      variables: { input: data },
    });
  },
});

export default graphql(mutation, {
  props: mapMutateToProps,
});

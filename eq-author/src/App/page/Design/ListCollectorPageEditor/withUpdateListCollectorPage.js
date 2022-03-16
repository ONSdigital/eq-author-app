import { graphql } from "react-apollo";
import updatePageMutation from "graphql/updateListCollector.graphql";
import { filter } from "graphql-anywhere";
import gql from "graphql-tag";

const inputFilter = gql`
  {
    id
    title
    listId
    anotherTitle
    anotherPositive
    anotherNegative
    addItemTitle
    alias
  }
`;

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateListCollectorPage: (page) => {
    const data = filter(inputFilter, page);
    return mutate({
      variables: { input: data },
    });
  },
});

export default graphql(updatePageMutation, {
  props: mapMutateToProps,
});

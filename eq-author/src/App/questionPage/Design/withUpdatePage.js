import updatePageMutation from "graphql/updatePage.graphql";
import { graphql } from "react-apollo";

export const mapMutateToProps = ({ mutate }) => ({
  onUpdatePage: page =>
    mutate({
      variables: { input: page }
    })
});

export default graphql(updatePageMutation, {
  props: mapMutateToProps
});

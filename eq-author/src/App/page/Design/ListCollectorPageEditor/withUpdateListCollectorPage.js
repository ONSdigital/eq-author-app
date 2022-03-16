import { graphql } from "react-apollo";
import updatePageMutation from "graphql/updatePage.graphql";
import pageFragment from "graphql/fragments/list-collector-page.graphql";
import { filter } from "graphql-anywhere";

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateListCollectorPage: (page) => {
    const data = filter(pageFragment, page);
    return mutate({
      variables: { input: data },
    });
  },
});

export default graphql(updatePageMutation, {
  props: mapMutateToProps,
});

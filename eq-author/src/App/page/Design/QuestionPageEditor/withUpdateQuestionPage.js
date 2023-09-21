import { graphql } from "react-apollo";
import updatePageMutation from "graphql/updateQuestionPage.graphql";
import pageFragment from "graphql/fragments/questionPage.graphql";
import { filter } from "graphql-anywhere";

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateQuestionPage: (page) => {
    const data = filter(pageFragment, page);
    return mutate({
      variables: { input: data },
      refetchQueries: ["GetPage"],
    });
  },
});

export default graphql(updatePageMutation, {
  props: mapMutateToProps,
});

import { graphql } from "react-apollo";
import updatePageMutation from "graphql/updatePage.graphql";
import pageFragment from "graphql/fragments/page.graphql";
import { filter } from "graphql-anywhere";

export const mapMutateToProps = ({ mutate }) => ({
  onUpdatePage: page => {
    const data = filter(pageFragment, page);
    return mutate({
      variables: { input: data },
      optimisticResponse: {
        updateQuestionPage: {
          ...data,
          displayName: "",
          __typename: "QuestionPage",
        },
      },
    });
  },
});

export default graphql(updatePageMutation, {
  props: mapMutateToProps,
});

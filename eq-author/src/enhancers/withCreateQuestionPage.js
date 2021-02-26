import { graphql } from "react-apollo";
import createQuestionPageMutation from "graphql/createQuestionPage.graphql";
import { buildPagePath } from "utils/UrlUtils";
import { get, tap } from "lodash/fp";

// TODO need to axe this
export const redirectToNewPage = ({ history, match: { params } }) => (page) => {
  const { id } = page;
  history.push(
    buildPagePath({
      questionnaireId: params.questionnaireId,
      pageId: id,
    })
  );
};

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onAddQuestionPage(folderId, position) {
    const page = {
      title: "",
      description: "",
      folderId,
      position,
    };

    return mutate({
      variables: { input: page },
    })
      .then(get("data.createQuestionPage"))
      .then(tap(redirectToNewPage(ownProps)));
  },
});

export default graphql(createQuestionPageMutation, {
  props: mapMutateToProps,
});

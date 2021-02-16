import { graphql } from "react-apollo";
import createQuestionPageMutation from "graphql/createQuestionPage.graphql";
import { buildPagePath } from "utils/UrlUtils";
import { get, tap } from "lodash/fp";

export const redirectToNewPage = ({ history, match: { params } }) => (page) => {
  const { id, section } = page;
  history.push(
    buildPagePath({
      questionnaireId: params.questionnaireId,
      sectionId: section.id,
      pageId: id,
    })
  );
};

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onAddQuestionPage(sectionId, position) {
    const page = {
      title: "",
      description: "",
      sectionId,
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

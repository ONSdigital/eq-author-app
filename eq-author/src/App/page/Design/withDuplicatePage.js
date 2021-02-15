import { graphql } from "react-apollo";
import duplicatePageMutation from "graphql/duplicatePage.graphql";
import { buildPagePath } from "utils/UrlUtils";
import { get, tap } from "lodash/fp";

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
  onDuplicatePage({ pageId, position }) {
    const input = {
      id: pageId,
      position,
    };

    return mutate({
      variables: { input },
    })
      .then(get("data.duplicatePage"))
      .then(tap(redirectToNewPage(ownProps)));
  },
});

export default graphql(duplicatePageMutation, {
  props: mapMutateToProps,
});

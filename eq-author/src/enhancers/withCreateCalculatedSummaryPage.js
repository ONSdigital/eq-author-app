import { graphql } from "react-apollo";
import createCalculatedSummaryPageMutation from "graphql/createCalculatedSummaryPage.graphql";
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
  onAddCalculatedSummaryPage(sectionId, position) {
    const page = {
      sectionId,
      position,
    };

    return mutate({
      variables: { input: page },
    })
      .then(get("data.createCalculatedSummaryPage"))
      .then(tap(redirectToNewPage(ownProps)));
  },
});

export default graphql(createCalculatedSummaryPageMutation, {
  props: mapMutateToProps,
});

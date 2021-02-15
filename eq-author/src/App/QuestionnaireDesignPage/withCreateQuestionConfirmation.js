import { graphql } from "react-apollo";
import { get } from "lodash/fp";

import createQuestionPageMutation from "graphql/questionConfirmation/create.graphql";

import { buildConfirmationPath } from "utils/UrlUtils";

export const redirectToNewPage = ({ history, match: { params } }) => (
  questionConfirmation
) => {
  const { id } = questionConfirmation;
  history.push(
    buildConfirmationPath({
      questionnaireId: params.questionnaireId,
      confirmationId: id,
      tab: "design",
    })
  );
};

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onCreateQuestionConfirmation(pageId) {
    return mutate({
      variables: { input: { pageId } },
    })
      .then(get("data.createQuestionConfirmation"))
      .then(redirectToNewPage(ownProps));
  },
});

export default graphql(createQuestionPageMutation, {
  props: mapMutateToProps,
});

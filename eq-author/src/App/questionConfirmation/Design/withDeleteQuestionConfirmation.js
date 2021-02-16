import { filter } from "graphql-anywhere";
import gql from "graphql-tag";
import { flowRight, partial } from "lodash";
import { graphql } from "react-apollo";
import { withRouter } from "react-router-dom";

import { withShowToast } from "components/Toasts";
import { buildPagePath } from "utils/UrlUtils";

import updateMutation from "graphql/questionConfirmation/delete.graphql";

const inputStructure = gql`
  {
    id
  }
`;
const filterToInput = partial(filter, inputStructure);

export const redirectToParentPage = (
  { history, match: { params } },
  questionConfirmation
) => {
  history.push(
    buildPagePath({
      questionnaireId: params.questionnaireId,
      pageId: questionConfirmation.page.id,
      tab: "design",
    })
  );
};

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onDeleteQuestionConfirmation: (questionConfirmation) =>
    mutate({
      variables: {
        input: filterToInput(questionConfirmation),
      },
    })
      .then(() => redirectToParentPage(ownProps, questionConfirmation))
      .then(() => ownProps.showToast("Confirmation deleted")),
});

export default flowRight(
  withRouter,
  withShowToast,
  graphql(updateMutation, {
    props: mapMutateToProps,
  })
);

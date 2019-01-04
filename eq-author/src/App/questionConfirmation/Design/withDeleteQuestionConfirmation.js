import { filter } from "graphql-anywhere";
import gql from "graphql-tag";
import { flowRight, partial } from "lodash";
import { graphql } from "react-apollo";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { raiseToast } from "redux/toast/actions";
import { buildPagePath } from "utils/UrlUtils";

import updateMutation from "graphql/questionConfirmation/delete.graphql";

const inputStructure = gql`
  {
    id
  }
`;
const filterToInput = partial(filter, inputStructure);

export const redirectToParentPage = ({ history, match: { params } }) => {
  history.push(buildPagePath(params));
};

export const displayToast = (
  { raiseToast, history, location },
  questionConfirmation
) => {
  raiseToast(
    `QuestionConfirmation${questionConfirmation.id}`,
    "Confirmation deleted",
    "undeleteQuestionConfirmation",
    {
      questionConfirmation,
      goBack: () => {
        history.push(location.pathname);
      }
    }
  );
};

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onDeleteQuestionConfirmation: questionConfirmation =>
    mutate({
      variables: {
        input: filterToInput(questionConfirmation)
      }
    })
      .then(() => redirectToParentPage(ownProps))
      .then(() => displayToast(ownProps, questionConfirmation))
});

export default flowRight(
  withRouter,
  connect(
    null,
    { raiseToast }
  ),
  graphql(updateMutation, {
    props: mapMutateToProps
  })
);

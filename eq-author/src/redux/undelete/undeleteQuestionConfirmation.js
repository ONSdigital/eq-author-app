import query from "graphql/questionConfirmation/undelete.graphql";
import createMutate from "utils/createMutate";

export const UNDELETE_QUESTION_CONFIRMATION_REQUEST =
  "UNDELETE_QUESTION_CONFIRMATION_REQUEST";
export const UNDELETE_QUESTION_CONFIRMATION_SUCCESS =
  "UNDELETE_QUESTION_CONFIRMATION_SUCCESS";
export const UNDELETE_QUESTION_CONFIRMATION_FAILURE =
  "UNDELETE_QUESTION_CONFIRMATION_FAILURE";

const undeleteRequest = () => {
  return {
    type: UNDELETE_QUESTION_CONFIRMATION_REQUEST
  };
};

const undeleteSuccess = () => {
  return {
    type: UNDELETE_QUESTION_CONFIRMATION_SUCCESS
  };
};

const undeleteFailure = () => {
  return {
    type: UNDELETE_QUESTION_CONFIRMATION_FAILURE
  };
};

const createUndelete = mutate => ({ id }) =>
  mutate({
    variables: { input: { id } }
  });

export const undeleteQuestionConfirmation = (
  cacheId,
  { goBack, questionConfirmation }
) => {
  return (dispatch, getState, { client }) => {
    const undelete = createUndelete(createMutate(client, query));
    dispatch(undeleteRequest());
    return undelete(questionConfirmation)
      .then(() => goBack())
      .then(() => dispatch(undeleteSuccess()))
      .catch(() => dispatch(undeleteFailure()));
  };
};

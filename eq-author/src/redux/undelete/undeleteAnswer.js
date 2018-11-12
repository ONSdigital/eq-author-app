import query from "graphql/undeleteAnswer.graphql";
import fragment from "graphql/pageFragment.graphql";
import { findUndeleteIndex } from "utils/findUndeleteIndex";
import createMutate from "utils/createMutate";

export const UNDELETE_ANSWER_REQUEST = "UNDELETE_ANSWER_REQUEST";
export const UNDELETE_ANSWER_SUCCESS = "UNDELETE_ANSWER_SUCCESS";
export const UNDELETE_ANSWER_FAILURE = "UNDELETE_ANSWER_FAILURE";

const undeleteRequest = () => {
  return {
    type: UNDELETE_ANSWER_REQUEST
  };
};

const undeleteSuccess = () => {
  return {
    type: UNDELETE_ANSWER_SUCCESS
  };
};

const undeleteFailure = () => {
  return {
    type: UNDELETE_ANSWER_FAILURE
  };
};

export const createUpdate = context => (proxy, result) => {
  const id = `QuestionPage${context.pageId}`;
  const page = proxy.readFragment({ id, fragment });

  const index = findUndeleteIndex(page.answers, context.answerId);
  page.answers.splice(index, 0, result.data.undeleteAnswer);

  proxy.writeFragment({
    id,
    fragment,
    data: page
  });
};

export const createUndelete = mutate => (id, context) =>
  mutate({
    variables: { input: { id } },
    update: createUpdate(context)
  });

export const undeleteAnswer = (id, context) => {
  return (dispatch, getState, { client }) => {
    const undelete = createUndelete(createMutate(client, query));

    dispatch(undeleteRequest());

    return undelete(context.answerId, context)
      .then(() => dispatch(undeleteSuccess()))
      .catch(() => dispatch(undeleteFailure()));
  };
};

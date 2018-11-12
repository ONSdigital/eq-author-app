import query from "graphql/undeleteQuestionnaire.graphql";
import GetQuestionnaireList from "graphql/getQuestionnaireList.graphql";
import createMutate from "utils/createMutate";

export const UNDELETE_QUESTIONNAIRE_REQUEST = "UNDELETE_QUESTIONNAIRE_REQUEST";
export const UNDELETE_QUESTIONNAIRE_SUCCESS = "UNDELETE_QUESTIONNAIRE_SUCCESS";
export const UNDELETE_QUESTIONNAIRE_FAILURE = "UNDELETE_QUESTIONNAIRE_FAILURE";

const orderCreatedAtDesc = (a, b) =>
  new Date(b.createdAt) - new Date(a.createdAt);

const undeleteRequest = () => {
  return {
    type: UNDELETE_QUESTIONNAIRE_REQUEST
  };
};

const undeleteSuccess = () => {
  return {
    type: UNDELETE_QUESTIONNAIRE_SUCCESS
  };
};

const undeleteFailure = () => {
  return {
    type: UNDELETE_QUESTIONNAIRE_FAILURE
  };
};

export const createUpdate = () => (proxy, result) => {
  const data = proxy.readQuery({ query: GetQuestionnaireList });

  data.questionnaires.push(result.data.undeleteQuestionnaire);
  data.questionnaires.sort(orderCreatedAtDesc);

  proxy.writeQuery({
    query: GetQuestionnaireList,
    data
  });
};

export const createUndelete = mutate => (id, context) =>
  mutate({
    variables: { input: { id } },
    update: createUpdate(context)
  });

export const undeleteQuestionnaire = (id, context) => {
  return (dispatch, getState, { client }) => {
    const undelete = createUndelete(createMutate(client, query));
    dispatch(undeleteRequest());

    return undelete(context.questionnaireId, context)
      .then(() => dispatch(undeleteSuccess()))
      .catch(() => dispatch(undeleteFailure()));
  };
};

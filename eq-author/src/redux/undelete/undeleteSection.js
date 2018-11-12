import query from "graphql/undeleteSection.graphql";
import fragment from "graphql/questionnaireFragment.graphql";
import { findUndeleteIndex } from "utils/findUndeleteIndex";
import createMutate from "utils/createMutate";

export const UNDELETE_SECTION_REQUEST = "UNDELETE_SECTION_REQUEST";
export const UNDELETE_SECTION_SUCCESS = "UNDELETE_SECTION_SUCCESS";
export const UNDELETE_SECTION_FAILURE = "UNDELETE_SECTION_FAILURE";

const undeleteRequest = () => {
  return {
    type: UNDELETE_SECTION_REQUEST
  };
};

const undeleteSuccess = () => {
  return {
    type: UNDELETE_SECTION_SUCCESS
  };
};

const undeleteFailure = () => {
  return {
    type: UNDELETE_SECTION_FAILURE
  };
};

export const createUpdate = context => (proxy, result) => {
  const id = `Questionnaire${context.questionnaireId}`;
  const questionnaire = proxy.readFragment({ id, fragment });

  const index = findUndeleteIndex(questionnaire.sections, context.sectionId);
  questionnaire.sections.splice(index, 0, result.data.undeleteSection);

  proxy.writeFragment({
    id,
    fragment,
    data: questionnaire
  });
};

export const createUndelete = mutate => (id, context) =>
  mutate({
    variables: { input: { id } },
    update: createUpdate(context)
  });

export const undeleteSection = (id, context) => {
  return (dispatch, getState, { client }) => {
    const undelete = createUndelete(createMutate(client, query));
    dispatch(undeleteRequest());
    return undelete(context.sectionId, context)
      .then(() => dispatch(undeleteSuccess()))
      .catch(() => dispatch(undeleteFailure()));
  };
};

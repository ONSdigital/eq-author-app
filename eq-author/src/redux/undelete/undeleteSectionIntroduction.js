import query from "graphql/updateSection.graphql";
import createMutate from "utils/createMutate";

import fragment from "graphql/fragments/section.graphql";

export const UNDELETE_SECTION_INTRODUCTION_REQUEST =
  "UNDELETE_SECTION_INTRODUCTION_REQUEST";
export const UNDELETE_SECTION_INTRODUCTION_SUCCESS =
  "UNDELETE_SECTION_INTRODUCTION_SUCCESS";
export const UNDELETE_SECTION_INTRODUCTION_FAILURE =
  "UNDELETE_SECTION_INTRODUCTION_FAILURE";

const undeleteRequest = () => {
  return {
    type: UNDELETE_SECTION_INTRODUCTION_REQUEST
  };
};

const undeleteSuccess = () => {
  return {
    type: UNDELETE_SECTION_INTRODUCTION_SUCCESS
  };
};

const undeleteFailure = () => {
  return {
    type: UNDELETE_SECTION_INTRODUCTION_FAILURE
  };
};

export const createUpdate = () => (proxy, result) => {
  const id = `Section${result.data.updateSection.id}`;
  const section = proxy.readFragment({ id, fragment });

  proxy.writeFragment({
    id,
    fragment,
    data: { ...section, ...result.data.updateSection }
  });
};

export const createUndelete = mutate => section =>
  mutate({
    variables: { input: section },
    update: createUpdate(section)
  });

export const undeleteSectionIntroduction = (id, section) => {
  return (dispatch, getState, { client }) => {
    const undelete = createUndelete(createMutate(client, query));
    dispatch(undeleteRequest());
    return undelete(section)
      .then(() => dispatch(undeleteSuccess()))
      .catch(() => dispatch(undeleteFailure()));
  };
};

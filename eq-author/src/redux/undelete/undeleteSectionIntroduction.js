import query from "App/section/Design/SectionEditor/SectionIntroduction/createSectionIntro.graphql";
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
    type: UNDELETE_SECTION_INTRODUCTION_REQUEST,
  };
};

const undeleteSuccess = () => {
  return {
    type: UNDELETE_SECTION_INTRODUCTION_SUCCESS,
  };
};

const undeleteFailure = () => {
  return {
    type: UNDELETE_SECTION_INTRODUCTION_FAILURE,
  };
};

export const createUpdate = () => (proxy, result) => {
  const id = `Section${result.data.createSectionIntroduction.id}`;
  const section = proxy.readFragment({ id, fragment });

  proxy.writeFragment({
    id,
    fragment,
    data: { ...section, introduction: result.data.createSectionIntroduction },
  });
};

export const createUndelete = mutate => ({
  id,
  introductionTitle,
  introductionContent,
}) =>
  mutate({
    variables: {
      input: { sectionId: id, introductionTitle, introductionContent },
    },
    update: createUpdate({ id, introductionTitle, introductionContent }),
  });

export const undeleteSectionIntroduction = (id, introduction) => {
  return (dispatch, getState, { client }) => {
    const undelete = createUndelete(createMutate(client, query));
    dispatch(undeleteRequest());
    return undelete(introduction)
      .then(() => dispatch(undeleteSuccess()))
      .catch(() => dispatch(undeleteFailure()));
  };
};

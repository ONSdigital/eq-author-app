import query from "graphql/undeletePage.graphql";
import fragment from "graphql/sectionFragment.graphql";
import createMutate from "utils/createMutate";

export const UNDELETE_PAGE_REQUEST = "UNDELETE_PAGE_REQUEST";
export const UNDELETE_PAGE_SUCCESS = "UNDELETE_PAGE_SUCCESS";
export const UNDELETE_PAGE_FAILURE = "UNDELETE_PAGE_FAILURE";

const undeleteRequest = () => {
  return {
    type: UNDELETE_PAGE_REQUEST
  };
};

const undeleteSuccess = () => {
  return {
    type: UNDELETE_PAGE_SUCCESS
  };
};

const undeleteFailure = () => {
  return {
    type: UNDELETE_PAGE_FAILURE
  };
};

export const createUpdate = context => (proxy, result) => {
  const page = result.data.undeleteQuestionPage;
  const id = `Section${context.sectionId}`;
  const section = proxy.readFragment({ id, fragment });

  section.pages.splice(page.position, 0, page);

  proxy.writeFragment({
    id,
    fragment,
    data: section
  });
};

export const createUndelete = mutate => (id, context) =>
  mutate({
    variables: { input: { id } },
    update: createUpdate(context)
  });

export const undeletePage = (id, context) => {
  return (dispatch, getState, { client }) => {
    const undelete = createUndelete(createMutate(client, query));
    dispatch(undeleteRequest());

    return undelete(context.pageId, context)
      .then(() => dispatch(undeleteSuccess()))
      .catch(() => dispatch(undeleteFailure()));
  };
};

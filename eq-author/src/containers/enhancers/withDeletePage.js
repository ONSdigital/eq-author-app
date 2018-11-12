import { graphql } from "react-apollo";
import deletePageMutation from "graphql/deletePage.graphql";
import { remove } from "lodash";
import fragment from "graphql/sectionFragment.graphql";
import getNextPage from "utils/getNextOnDelete";
import { buildPagePath } from "utils/UrlUtils";

export const handleDeletion = (
  { history, onAddPage, match: { params } },
  section
) => {
  const { pageId, sectionId, questionnaireId } = params;

  if (section.pages.length === 1) {
    return onAddPage(params.sectionId);
  }

  const page = getNextPage(section.pages, pageId);

  history.push(
    buildPagePath({
      questionnaireId,
      sectionId,
      pageId: page.id
    })
  );

  return Promise.resolve();
};

export const displayToast = (ownProps, sectionId, pageId) => {
  ownProps.raiseToast(`Page${pageId}`, "Page deleted", "undeletePage", {
    sectionId,
    pageId
  });
};

export const createUpdater = (sectionId, pageId) => proxy => {
  const id = `Section${sectionId}`;
  const section = proxy.readFragment({ id, fragment });

  remove(section.pages, { id: pageId });
  section.pages.forEach((page, i) => (page.position = i));

  proxy.writeFragment({
    id,
    fragment,
    data: section
  });
};

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onDeletePage(sectionId, pageId) {
    const { client } = ownProps;
    const page = { id: pageId };
    const update = createUpdater(sectionId, pageId);

    const section = client.readFragment({
      id: `Section${sectionId}`,
      fragment
    });

    const mutation = mutate({
      variables: { input: page },
      update
    });

    return mutation
      .then(() => handleDeletion(ownProps, section))
      .then(() => displayToast(ownProps, sectionId, pageId))
      .then(() => mutation);
  }
});

export default graphql(deletePageMutation, {
  props: mapMutateToProps
});

import { graphql } from "react-apollo";
import deletePageMutation from "graphql/deletePage.graphql";
import { remove } from "lodash";
import fragment from "graphql/sectionFragment.graphql";
import getNextPage from "utils/getNextOnDelete";
import { buildPagePath } from "utils/UrlUtils";

const getCachedSection = (client, id) =>
  client.readFragment({
    id: `Section${id}`,
    fragment,
  });

const handleDeletion = (
  { history, onAddPage, client, match: { params } },
  nextPage
) => {
  const { sectionId, questionnaireId } = params;
  const section = getCachedSection(client, sectionId);

  if (section.pages.length === 0) {
    return onAddPage(params.sectionId);
  }

  history.push(
    buildPagePath({
      questionnaireId,
      sectionId,
      pageId: nextPage.id,
    })
  );
};

const displayToast = (ownProps, sectionId, pageId) => {
  ownProps.raiseToast(`Page${pageId}`, "Page deleted", {
    sectionId,
    pageId,
  });
};

export const createUpdater = (sectionId, pageId) => client => {
  const section = getCachedSection(client, sectionId);

  remove(section.pages, { id: pageId });
  section.pages.forEach((page, i) => (page.position = i));

  client.writeFragment({
    id: `Section${sectionId}`,
    fragment,
    data: section,
  });
};

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onDeletePage(sectionId, pageId) {
    const { client } = ownProps;
    const page = { id: pageId };
    const update = createUpdater(sectionId, pageId);

    const section = getCachedSection(client, sectionId);
    const nextPage = getNextPage(section.pages, pageId);

    const mutation = mutate({
      variables: { input: page },
      update,
    });

    return mutation
      .then(() => handleDeletion(ownProps, nextPage))
      .then(() => displayToast(ownProps, sectionId, pageId));
  },
});

export default graphql(deletePageMutation, {
  props: mapMutateToProps,
});

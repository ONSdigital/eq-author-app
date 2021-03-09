import { graphql } from "react-apollo";
import { flowRight } from "lodash";

import { withShowToast } from "components/Toasts";
import deletePageMutation from "graphql/deletePage.graphql";
import fragment from "graphql/sectionFragment.graphql";
import getSectionQuery from "graphql/getSection.graphql";
import getNextPage from "utils/getNextOnDelete";
import { buildPagePath } from "utils/UrlUtils";

const getCachedSection = (client, id) =>
  client.readFragment({
    id: `Section${id}`,
    fragment,
  });

const handleDeletion = (
  {
    history,
    match: {
      params: { questionnaireId },
    },
  },
  { folders },
  nextPage,
  cachedFolder,
  cachedFolderIndex
) => {
  const newPageCreated =
    cachedFolder.pages.length === 1 && cachedFolder.enabled;

  const modifiedFolder = folders[cachedFolderIndex];

  history.push(
    buildPagePath({
      questionnaireId,
      pageId: newPageCreated ? modifiedFolder.pages[0].id : nextPage.id,
    })
  );
};

export const mapMutateToProps = (props) => ({
  onDeletePage(page) {
    const { ownProps, mutate } = props;
    const { client } = ownProps;

    const cachedSection = getCachedSection(client, page.section.id);
    const cachedFolderIndex = cachedSection.folders.findIndex((folder) =>
      folder.pages.find(({ id }) => id === page.id)
    );
    const cachedFolder = cachedSection.folders[cachedFolderIndex];
    const cachedPages = cachedSection.folders.flatMap(({ pages }) => pages);

    const nextPage = getNextPage(cachedPages, page.id);

    const mutation = mutate({
      variables: { input: { id: page.id } },
    });

    return mutation
      .then(({ data: { deletePage: section } }) =>
        handleDeletion(
          ownProps,
          section,
          nextPage,
          cachedFolder,
          cachedFolderIndex
        )
      )
      .then(() => ownProps.showToast("Page deleted"));
  },
});

export default flowRight(
  withShowToast,
  graphql(deletePageMutation, {
    props: mapMutateToProps,
  })
);

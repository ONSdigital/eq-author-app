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
  deletePageFolder,
  deletePageFolderIndex
) => {
  const deletePageIsFolder = deletePageFolder.enabled;
  const newPageCreated = folders.length === 1 && folders[0].pages.length === 1;

  history.push(
    deletePageIsFolder
      ? buildPagePath({
          questionnaireId,
          pageId: folders[deletePageFolderIndex].pages[0].id,
        })
      : buildPagePath({
          questionnaireId,
          pageId: newPageCreated ? folders[0].pages[0].id : nextPage.id,
        })
  );
};

export const mapMutateToProps = (props) => ({
  onDeletePage(page) {
    const { ownProps, mutate } = props;
    const { client } = ownProps;
    const cachedSection = getCachedSection(client, page.section.id);

    // const deletePageIndex = cachedSection.folders.findIndex((e) =>
    //   e.pages.findIndex((ee) => ee.id === page.id)
    // );

    const deletePageFolder = cachedSection.folders.find(
      (e) => e.pages[0].id === page.id
    );

    const deletePageFolderIndex = cachedSection.folders.findIndex(
      (e) => e.pages[0].id === page.id
    );

    const cachedPages = cachedSection.folders.flatMap(({ pages }) => pages);
    const nextPage = getNextPage(cachedPages, page.id);

    const mutation = mutate({
      variables: { input: { id: page.id } },
      refetchQueries: [
        {
          query: getSectionQuery,
          variables: { input: { sectionId: page.section.id } },
        },
      ],
    });

    return mutation
      .then(({ data: { deletePage: section } }) =>
        handleDeletion(
          ownProps,
          section,
          nextPage,
          deletePageFolder,
          deletePageFolderIndex
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

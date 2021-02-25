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
  nextPage
) => {
  const newPageCreated = folders.length === 1 && folders[0].pages.length === 1;

  history.push(
    buildPagePath({
      questionnaireId,
      pageId: newPageCreated ? folders[0].pages[0].id : nextPage.id,
    })
  );
};

export const mapMutateToProps = (props) => ({
  onDeletePage(page) {
    console.log("delete page props:::", props);

    const { ownProps, mutate } = props;
    const { client } = ownProps;
    const cachedSection = getCachedSection(client, page.section.id);
    console.log("cachedSection", cachedSection);

    const cachedPages = cachedSection.folders.flatMap(({ pages }) => pages);
    console.log("cachedPages", cachedPages);

    const nextPage = getNextPage(cachedPages, page.id);
    console.log("nextPage", nextPage);

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
        handleDeletion(ownProps, section, nextPage)
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

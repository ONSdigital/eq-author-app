import { graphql } from "react-apollo";
import deletePageMutation from "graphql/deletePage.graphql";
import fragment from "graphql/sectionFragment.graphql";
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
    onAddQuestionPage,
    match: {
      params: { questionnaireId },
    },
  },
  section,
  nextPage
) => {
  if (section.pages.length === 0) {
    return onAddQuestionPage(section.id);
  }

  history.push(
    buildPagePath({
      questionnaireId,
      pageId: nextPage.id,
    })
  );
};

const displayToast = (ownProps, page) => {
  ownProps.raiseToast(`Page${page.id}`, "Page deleted", {
    sectionId: page.section.id,
    pageId: page.id,
  });
};

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onDeletePage(page) {
    const { client } = ownProps;

    const cachedSection = getCachedSection(client, page.section.id);
    const nextPage = getNextPage(cachedSection.pages, page.id);

    const mutation = mutate({
      variables: { input: { id: page.id } },
    });

    return mutation
      .then(({ data: { deletePage: section } }) =>
        handleDeletion(ownProps, section, nextPage)
      )
      .then(() => displayToast(ownProps, page));
  },
});

export default graphql(deletePageMutation, {
  props: mapMutateToProps,
});

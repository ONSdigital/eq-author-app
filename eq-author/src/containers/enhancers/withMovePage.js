import { graphql } from "react-apollo";
import movePageMutation from "graphql/movePage.graphql";
import fragment from "graphql/fragments/movePage.graphql";
import { buildPagePath } from "utils/UrlUtils";
import { remove } from "lodash";

export const createUpdater = ({ from, to }) => (proxy, result) => {
  result = result.data.movePage;
  const fromSectionId = `Section${from.sectionId}`;
  const fromSection = proxy.readFragment({ id: fromSectionId, fragment });

  // remove page from previous section and update position values
  const [movedPage] = remove(fromSection.pages, { id: from.id });
  fromSection.pages.forEach((page, i) => (page.position = i));

  proxy.writeFragment({
    id: fromSectionId,
    fragment,
    data: fromSection
  });

  const toSectionId = `Section${to.sectionId}`;
  const toSection = proxy.readFragment({ id: toSectionId, fragment });

  // add page to new section and update position values
  toSection.pages.splice(result.position, 0, movedPage);
  toSection.pages.forEach((page, i) => (page.position = i));

  proxy.writeFragment({
    id: toSectionId,
    fragment,
    data: toSection
  });
};

const redirect = ({ history, match }, { from, to }) => {
  const movedToDifferentSection = from.sectionId !== to.sectionId;

  if (movedToDifferentSection) {
    history.replace(
      buildPagePath({
        questionnaireId: match.params.questionnaireId,
        sectionId: to.sectionId,
        pageId: to.id
      })
    );
  }
};

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onMovePage({ from, to }) {
    const optimisticResponse = {
      movePage: {
        id: to.id,
        section: {
          id: to.sectionId,
          __typename: "Section"
        },
        position: to.position,
        __typename: "QuestionPage"
      }
    };

    const mutation = mutate({
      update: createUpdater({ from, to }),
      variables: { input: to },
      optimisticResponse
    });

    return mutation
      .then(() => redirect(ownProps, { from, to }))
      .then(() => mutation);
  }
});

export default graphql(movePageMutation, {
  props: mapMutateToProps
});

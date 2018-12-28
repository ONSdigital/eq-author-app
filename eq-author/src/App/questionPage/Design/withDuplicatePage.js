import { graphql } from "react-apollo";
import fragment from "graphql/sectionFragment.graphql";
import duplicatePageMutation from "graphql/duplicatePage.graphql";
import { buildPagePath } from "utils/UrlUtils";
import { get, tap } from "lodash/fp";

export const redirectToNewPage = ({ history, match: { params } }) => page => {
  const { id, section } = page;
  history.push(
    buildPagePath({
      questionnaireId: params.questionnaireId,
      sectionId: section.id,
      pageId: id
    })
  );
};

export const createUpdater = ({ sectionId, position }) => (proxy, result) => {
  const id = `Section${sectionId}`;
  const section = proxy.readFragment({ id, fragment });

  section.pages.splice(position, 0, result.data.duplicatePage);
  section.pages.forEach((page, i) => (page.position = i));

  proxy.writeFragment({
    id,
    fragment,
    data: section
  });
};

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onDuplicatePage({ sectionId, pageId, position }) {
    const input = {
      id: pageId,
      position
    };

    const update = createUpdater({ sectionId, position });

    return mutate({
      variables: { input },
      update
    })
      .then(get("data.duplicatePage"))
      .then(tap(redirectToNewPage(ownProps)));
  }
});

export default graphql(duplicatePageMutation, {
  props: mapMutateToProps
});

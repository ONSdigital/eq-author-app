import { graphql } from "react-apollo";
import fragment from "graphql/sectionFragment.graphql";
import createQuestionPageMutation from "graphql/createQuestionPage.graphql";
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

export const createUpdater = (sectionId, position) => (proxy, result) => {
  const id = `Section${sectionId}`;
  const section = proxy.readFragment({ id, fragment });

  section.pages.splice(position, 0, result.data.createQuestionPage);
  section.pages.forEach((page, i) => (page.position = i));

  proxy.writeFragment({
    id,
    fragment,
    data: section
  });
};

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onAddPage(sectionId, position) {
    const page = {
      title: "",
      description: "",
      sectionId,
      position
    };

    const update = createUpdater(sectionId, position);

    return mutate({
      variables: { input: page },
      update
    })
      .then(get("data.createQuestionPage"))
      .then(tap(redirectToNewPage(ownProps)));
  }
});

export default graphql(createQuestionPageMutation, {
  props: mapMutateToProps
});

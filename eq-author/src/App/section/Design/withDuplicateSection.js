import { graphql } from "react-apollo";
import { get, tap } from "lodash/fp";

import duplicateSectionMutation from "graphql/duplicateSection.graphql";
import { buildSectionPath } from "utils/UrlUtils";

export const redirectToNewPage = ({ history, match: { params } }) => (
  section
) => {
  const { id } = section;
  history.push(
    buildSectionPath({
      questionnaireId: params.questionnaireId,
      sectionId: id,
    })
  );
};

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onDuplicateSection({ sectionId, position }) {
    const input = {
      id: sectionId,
      position,
    };

    return mutate({
      variables: { input },
    })
      .then(get("data.duplicateSection"))
      .then(tap(redirectToNewPage(ownProps)));
  },
});

export default graphql(duplicateSectionMutation, {
  props: mapMutateToProps,
});

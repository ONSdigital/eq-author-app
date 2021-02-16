import { graphql } from "react-apollo";
import createSectionMutation from "graphql/createSection.graphql";
import { buildSectionPath } from "utils/UrlUtils";
import { get, tap } from "lodash/fp";

export const redirectToNewSection = (ownProps) => (section) => {
  const {
    history,
    match: { params },
  } = ownProps;

  history.push(
    buildSectionPath({
      questionnaireId: params.questionnaireId,
      sectionId: section.id,
    })
  );
};

export const mapMutateToProps = ({ mutate, ownProps }) => ({
  onAddSection() {
    const {
      match: { params },
    } = ownProps;
    const section = {
      title: "",
      questionnaireId: params.questionnaireId,
    };

    return mutate({
      variables: { input: section },
    })
      .then(get("data.createSection"))
      .then(tap(redirectToNewSection(ownProps)));
  },
});

export default graphql(createSectionMutation, {
  props: mapMutateToProps,
});

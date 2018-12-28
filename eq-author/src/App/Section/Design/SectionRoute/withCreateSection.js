import { graphql } from "react-apollo";
import createSectionMutation from "graphql/createSection.graphql";
import fragment from "graphql/questionnaireFragment.graphql";
import { buildSectionPath } from "utils/UrlUtils";
import { get, tap } from "lodash/fp";

export const redirectToNewSection = ownProps => section => {
  const {
    history,
    match: { params }
  } = ownProps;

  history.push(
    buildSectionPath({
      questionnaireId: params.questionnaireId,
      sectionId: section.id
    })
  );
};

export const createUpdater = questionnaireId => (proxy, result) => {
  const id = `Questionnaire${questionnaireId}`;
  const questionnaire = proxy.readFragment({ id, fragment });

  questionnaire.sections.push(result.data.createSection);

  const sections = questionnaire.sections.map(section => ({
    ...section,
    questionnaire: result.data.createSection.questionnaire
  }));

  proxy.writeFragment({
    id,
    fragment,
    data: {
      ...questionnaire,
      sections
    }
  });
};

export const mapMutateToProps = ({ mutate, ownProps }) => ({
  onAddSection() {
    const {
      match: { params }
    } = ownProps;
    const section = {
      title: "",
      questionnaireId: params.questionnaireId
    };

    const update = createUpdater(params.questionnaireId);

    return mutate({
      variables: { input: section },
      update
    })
      .then(get("data.createSection"))
      .then(tap(redirectToNewSection(ownProps)));
  }
});

export default graphql(createSectionMutation, {
  props: mapMutateToProps
});

import { graphql } from "react-apollo";
import moveSectionMutation from "graphql/moveSection.graphql";
import fragment from "graphql/fragments/moveSection.graphql";
import { remove } from "lodash";

export const createUpdater = ({ questionnaireId }) => (proxy, result) => {
  const {
    data: {
      moveSection: { id, position }
    }
  } = result;
  const questionnaireFragmentId = `Questionnaire${questionnaireId}`;

  const questionnaire = proxy.readFragment({
    id: questionnaireFragmentId,
    fragment
  });

  const [movedSection] = remove(questionnaire.sections, { id: id });
  questionnaire.sections.splice(position, 0, movedSection);
  questionnaire.sections.forEach((section, i) => (section.position = i));

  proxy.writeFragment({
    id: questionnaireFragmentId,
    fragment,
    data: questionnaire
  });
};

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onMoveSection({ from, to }) {
    const {
      match: {
        params: { questionnaireId }
      }
    } = ownProps;
    const input = {
      ...to,
      questionnaireId
    };
    const optimisticResponse = {
      moveSection: {
        ...input,
        __typename: "Section"
      }
    };

    const mutation = mutate({
      variables: { input: input },
      optimisticResponse,
      update: createUpdater({ from, to, questionnaireId })
    });

    return mutation.then(() => mutation);
  }
});

export default graphql(moveSectionMutation, {
  props: mapMutateToProps
});

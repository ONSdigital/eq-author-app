import { graphql } from "react-apollo";
import deleteSectionMutation from "graphql/deleteSection.graphql";
import { remove, find } from "lodash";
import fragment from "graphql/questionnaireFragment.graphql";
import getNextSection from "utils/getNextOnDelete";
import { buildPagePath } from "utils/UrlUtils";
import gql from "graphql-tag";

const questionnaireFragment = gql`
  fragment DeleteSectionFragment on Questionnaire {
    sections {
      id
      pages {
        id
      }
    }
  }
`;

const pluralize = (count, word, plural = word + "s") => {
  return count === 1 ? word : plural;
};

export const handleDeletion = (
  { history, onAddSection, match: { params } },
  questionnaire
) => {
  const { sectionId, questionnaireId } = params;

  if (questionnaire.sections.length === 1) {
    return onAddSection();
  }

  const nextSection = getNextSection(questionnaire.sections, sectionId);
  const nextPage = nextSection.pages[0];

  history.push(
    buildPagePath({
      questionnaireId,
      sectionId: nextSection.id,
      pageId: nextPage.id
    })
  );
};

export const deleteUpdater = (questionnaireId, sectionId) => (
  proxy,
  result
) => {
  const id = `Questionnaire${questionnaireId}`;
  const questionnaire = proxy.readFragment({ id, fragment });

  remove(questionnaire.sections, { id: sectionId });

  const sections = questionnaire.sections.map(section => ({
    ...section,
    questionnaire: result.data.deleteSection.questionnaire
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

export const displayToast = (ownProps, questionnaire) => {
  const {
    match: { params }
  } = ownProps;
  const { sectionId, questionnaireId } = params;

  const numberOfDeletedPages = find(questionnaire.sections, {
    id: params.sectionId
  }).pages.length;

  ownProps.raiseToast(
    `Section${sectionId}`,
    `Section + ${numberOfDeletedPages} ${pluralize(
      numberOfDeletedPages,
      "page"
    )} deleted`,
    "undeleteSection",
    {
      questionnaireId,
      sectionId
    }
  );
};

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onDeleteSection(sectionId) {
    const {
      match: { params },
      client
    } = ownProps;
    const section = { id: sectionId };
    const update = deleteUpdater(params.questionnaireId, sectionId);

    const questionnaire = client.readFragment({
      id: `Questionnaire${params.questionnaireId}`,
      fragment: questionnaireFragment
    });

    const mutation = mutate({
      variables: { input: section },
      update
    });

    return mutation
      .then(() => handleDeletion(ownProps, questionnaire))
      .then(() => displayToast(ownProps, questionnaire))
      .then(() => mutation);
  }
});

export default graphql(deleteSectionMutation, {
  props: mapMutateToProps
});

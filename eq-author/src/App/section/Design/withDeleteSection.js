import { graphql } from "react-apollo";
import { find, flowRight } from "lodash";
import gql from "graphql-tag";

import { withShowToast } from "components/Toasts";

import deleteSectionMutation from "graphql/deleteSection.graphql";

import getNextSection from "utils/getNextOnDelete";
import { buildPagePath } from "utils/UrlUtils";

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
  { data },
  oldQuestionnaire
) => {
  const questionnaire = data.deleteSection;
  const { sectionId, questionnaireId } = params;

  if (questionnaire.sections.length === 0) {
    return onAddSection();
  }

  const nextSection = getNextSection(oldQuestionnaire.sections, sectionId);
  const nextPage = nextSection.pages[0];

  history.push(
    buildPagePath({
      questionnaireId,
      sectionId: nextSection.id,
      pageId: nextPage.id,
    })
  );
};

export const displayToast = (ownProps, questionnaire) => {
  const {
    match: { params },
  } = ownProps;
  const numberOfDeletedPages = find(questionnaire.sections, {
    id: params.sectionId,
  }).pages.length;

  ownProps.showToast(
    `Section + ${numberOfDeletedPages} ${pluralize(
      numberOfDeletedPages,
      "page"
    )} deleted`
  );
};

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onDeleteSection(sectionId) {
    const {
      match: { params },
      client,
    } = ownProps;
    const section = { id: sectionId };

    const questionnaire = client.readFragment({
      id: `Questionnaire${params.questionnaireId}`,
      fragment: questionnaireFragment,
    });

    const mutation = mutate({
      variables: { input: section },
    });

    return mutation
      .then(data => handleDeletion(ownProps, data, questionnaire))
      .then(() => displayToast(ownProps, questionnaire))
      .then(() => mutation);
  },
});

export default flowRight(
  withShowToast,
  graphql(deleteSectionMutation, {
    props: mapMutateToProps,
  })
);

import { graphql } from "react-apollo";
import { find, flowRight } from "lodash";
import gql from "graphql-tag";
import { withShowToast } from "components/Toasts";

import deleteSectionMutation from "graphql/deleteSection.graphql";

import getNextSection from "utils/getNextOnDelete";
import { buildSectionPath } from "utils/UrlUtils";

const questionnaireFragment = gql`
  fragment DeleteSectionFragment on Questionnaire {
    sections {
      id
      folders {
        id
        pages {
          id
        }
      }
    }
  }
`;

const pluralize = (count, word, plural = word + "s") => {
  return count === 1 ? word : plural;
};

export const handleDeletion = (
  { history, match: { params } },
  { data },
  oldQuestionnaire
) => {
  const questionnaire = data.deleteSection;
  const { sectionId, questionnaireId } = params;
  const nextSection = getNextSection(oldQuestionnaire.sections, sectionId);

  const newSectionCreated = oldQuestionnaire.sections.length === 1;

  history.push(
    buildSectionPath({
      questionnaireId,
      sectionId: newSectionCreated
        ? questionnaire.sections[0].id
        : nextSection.id,
    })
  );
};

export const displayToast = (ownProps, questionnaire) => {
  const {
    match: { params },
  } = ownProps;

  const deletedSection = find(questionnaire.sections, {
    id: params.sectionId,
  });

  const numberOfDeletedPages = deletedSection.folders
    .flatMap(({ pages }) => pages.length)
    .reduce((acc, value) => acc + value);

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

    const options = {
      variables: { input: section },
    };

    options.refetchQueries = ["GetQuestionnaire"];

    const mutation = mutate(options);

    return mutation
      .then((data) => handleDeletion(ownProps, data, questionnaire))
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

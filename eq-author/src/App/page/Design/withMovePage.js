import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { buildPagePath } from "utils/UrlUtils";
import movePageMutation from "graphql/movePage.graphql";

const redirect = ({ history, match }, { from, to }) => {
  history.replace(
    buildPagePath({
      questionnaireId: match.params.questionnaireId,
      sectionId: to.sectionId,
      pageId: to.id,
    })
  );
};

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onMovePage({ from, to }) {
    const mutation = mutate({
      variables: { input: to },
      update: (proxy, { data = {} }) => {
        const newQuestionnaire =
          data.movePage &&
          data.movePage.section &&
          data.movePage.section.questionnaire;
        const newSections = newQuestionnaire && newQuestionnaire.sections;

        const updatedFromSection = newSections.find(
          section => section.id === from.sectionId
        );
        const updatedToSection = newSections.find(
          section => section.id === to.sectionId
        );

        console.log(
          "Updated from:",
          updatedFromSection,
          "updated to: ",
          updatedToSection
        );

        window.client = ownProps.client;

        ownProps.client.writeData({
          id: `Section:${from.sectionId}`,
          data: updatedFromSection,
        });

        ownProps.client.writeData({
          id: `Section:${to.sectionId}`,
          data: updatedToSection,
        });
      },
    });

    return mutation
      .then(() => redirect(ownProps, { from, to }))
      .then(() => mutation);
  },
});

export default graphql(movePageMutation, {
  props: mapMutateToProps,
});

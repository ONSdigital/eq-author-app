import { graphql } from "react-apollo";
import createQuestionnaireQuery from "graphql/createQuestionnaire.graphql";
import getQuestionnaireList from "graphql/getQuestionnaireList.graphql";
import { buildPagePath, buildIntroductionPath } from "utils/UrlUtils";

export const redirectToDesigner = (history) => ({ data }) => {
  const questionnaire = data.createQuestionnaire;

  if (questionnaire.introduction) {
    history.push(
      buildIntroductionPath({
        questionnaireId: questionnaire.id,
        introductionId: questionnaire.introduction.id,
      })
    );
    return;
  }

  const section = questionnaire.sections[0];
  const page = section.folders[0].pages[0];

  history.push(
    buildPagePath({
      questionnaireId: questionnaire.id,
      pageId: page.id,
    })
  );
};

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onCreateQuestionnaire: (questionnaire) => {
    const input = {
      ...questionnaire,
    };

    return mutate({
      variables: { input },
    }).then(redirectToDesigner(ownProps.history));
  },
});

export const updateQuestionnaireList = (
  proxy,
  { data: { createQuestionnaire } }
) => {
  const data = proxy.readQuery({ query: getQuestionnaireList });
  data.questionnaires.unshift(createQuestionnaire);
  proxy.writeQuery({ query: getQuestionnaireList, data });
};

export default graphql(createQuestionnaireQuery, {
  props: mapMutateToProps,
  options: {
    update: updateQuestionnaireList,
  },
});

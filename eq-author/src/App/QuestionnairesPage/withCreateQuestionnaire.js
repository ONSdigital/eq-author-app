import { graphql } from "react-apollo";
import createQuestionnaireQuery from "graphql/createQuestionnaire.graphql";
import getQuestionnaireList from "graphql/getQuestionnaireList.graphql";
import { buildSectionPath, buildQuestionnaireIntroPath } from "utils/UrlUtils";

export const redirectToDesigner = history => ({ data }) => {
  const questionnaire = data.createQuestionnaire;
  const section = questionnaire.sections[0];
  const page = section.pages[0];
  let path;

  if (questionnaire.theme === "default") {
    path = buildQuestionnaireIntroPath({
      questionnaireId: questionnaire.id,
      introductionId: "introduction",
      tab: "design"
    });
  } else {
    path = buildSectionPath({
      questionnaireId: questionnaire.id,
      sectionId: section.id
    });
  }

  history.push(path);
  return questionnaire;
};

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onCreateQuestionnaire: questionnaire => {
    const input = {
      ...questionnaire
    };

    return mutate({
      variables: { input }
    }).then(redirectToDesigner(ownProps.history));
  }
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
    update: updateQuestionnaireList
  }
});

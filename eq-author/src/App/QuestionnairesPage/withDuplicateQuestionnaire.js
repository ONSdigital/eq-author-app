import { graphql } from "react-apollo";
import { get, flowRight } from "lodash/fp";
import { withRouter } from "react-router-dom";

import { buildPagePath, buildIntroductionPath } from "utils/UrlUtils";

import duplicateQuestionnaireMutation from "graphql/duplicateQuestionnaire.graphql";
import getQuestionnaireList from "graphql/getQuestionnaireList.graphql";

export const mapMutateToProps = ({ mutate, ownProps }) => ({
  onDuplicateQuestionnaire({ id }) {
    console.log('\nonDuplicateQuestionnaire................\n');
    const modifier = "settings";
    return mutate({
      variables: { input: { id } },
    })
      .then(get("data.duplicateQuestionnaire"))
      .then(questionnaire => {
        if (questionnaire.introduction) {
          ownProps.history.push(
            buildIntroductionPath({
              questionnaireId: questionnaire.id,
              introductionId: questionnaire.introduction.id,
              modifier,
            })
          );
          return;
        }

        const section = questionnaire.sections[0];
        const page = section.pages[0];

        ownProps.history.push(
          buildPagePath({
            questionnaireId: questionnaire.id,
            pageId: page.id,
            modifier,
          })
        );
      });
  },
});

export const handleUpdate = (proxy, { data: { duplicateQuestionnaire } }) => {
  
  console.log('\handleUpdate................\n');

  const data = proxy.readQuery({ query: getQuestionnaireList });
  data.questionnaires = [duplicateQuestionnaire, ...data.questionnaires];
  proxy.writeQuery({
    query: getQuestionnaireList,
    data,
  });
};

const withDuplicateQuestionnaire = graphql(duplicateQuestionnaireMutation, {
  props: mapMutateToProps,
  options: {
    update: handleUpdate,
  },
});
export default flowRight(withRouter, withDuplicateQuestionnaire);

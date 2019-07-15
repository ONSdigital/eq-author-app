import { graphql } from "react-apollo";
import { remove, flowRight } from "lodash";

import { withShowToast } from "components/Toasts";
import deleteQuestionnaire from "graphql/deleteQuestionnaire.graphql";
import getQuestionnaireList from "graphql/getQuestionnaireList.graphql";

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onDeleteQuestionnaire(questionnaireId) {
    const mutation = mutate({
      variables: {
        input: { id: questionnaireId },
      },
      optimisticResponse: {
        deleteQuestionnaire: {
          id: questionnaireId,
          __typename: "Questionnaire",
        },
      },
      context: {
        headers: {
          questionnaireId,
        },
      },
    });

    return mutation
      .then(() => {
        ownProps.showToast("Questionnaire deleted");
      })
      .then(() => mutation);
  },
});

export const handleUpdate = (proxy, { data: { deleteQuestionnaire } }) => {
  const data = proxy.readQuery({ query: getQuestionnaireList });
  remove(data.questionnaires, { id: deleteQuestionnaire.id });
  proxy.writeQuery({ query: getQuestionnaireList, data });
};

export default flowRight(
  withShowToast,
  graphql(deleteQuestionnaire, {
    props: mapMutateToProps,
    options: {
      update: handleUpdate,
    },
  })
);

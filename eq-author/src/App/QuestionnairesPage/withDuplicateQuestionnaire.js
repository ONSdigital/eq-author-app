import { graphql } from "react-apollo";
import { get } from "lodash/fp";

import duplicateQuestionnaireMutation from "graphql/duplicateQuestionnaire.graphql";
import getQuestionnaireList from "graphql/getQuestionnaireList.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  onDuplicateQuestionnaire({ id, displayName, createdBy }) {
    return mutate({
      variables: { input: { id } },
      optimisticResponse: {
        duplicateQuestionnaire: {
          id: `dupe-${id}`,
          displayName: `Copy of ${displayName}`,
          createdAt: new Date(Date.now()).toISOString(),
          createdBy,
          __typename: "Questionnaire",
        },
      },
    }).then(get("data.duplicateQuestionnaire"));
  },
});

export const handleUpdate = (proxy, { data: { duplicateQuestionnaire } }) => {
  const data = proxy.readQuery({ query: getQuestionnaireList });
  data.questionnaires = [duplicateQuestionnaire, ...data.questionnaires];
  proxy.writeQuery({
    query: getQuestionnaireList,
    data,
  });
};

export default graphql(duplicateQuestionnaireMutation, {
  props: mapMutateToProps,
  options: {
    update: handleUpdate,
  },
});

import { graphql } from "react-apollo";
import { get } from "lodash/fp";

import duplicateQuestionnaireMutation from "graphql/duplicateQuestionnaire.graphql";
import getQuestionnaireList from "graphql/getQuestionnaireList.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  onDuplicateQuestionnaire({ id, title }, user) {
    return mutate({
      variables: { input: { id, createdBy: user.displayName } },
      optimisticResponse: {
        duplicateQuestionnaire: {
          id: `dupe-${id}`,
          title: `Copy of ${title}`,
          createdAt: new Date(Date.now()).toISOString(),
          createdBy: {
            name: user.displayName,
            __typename: "User"
          },
          __typename: "Questionnaire"
        }
      }
    }).then(get("data.duplicateQuestionnaire"));
  }
});

export const handleUpdate = (proxy, { data: { duplicateQuestionnaire } }) => {
  const data = proxy.readQuery({ query: getQuestionnaireList });
  data.questionnaires = [duplicateQuestionnaire, ...data.questionnaires];
  proxy.writeQuery({
    query: getQuestionnaireList,
    data
  });
};

export default graphql(duplicateQuestionnaireMutation, {
  props: mapMutateToProps,
  options: {
    update: handleUpdate
  }
});

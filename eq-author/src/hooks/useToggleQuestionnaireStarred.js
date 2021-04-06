import { useMutation } from "@apollo/react-hooks";

import TOGGLE_QUESTIONNAIRE_STARRED_MUTATION from "graphql/toggleQuestionnaireStarred.graphql";

const useToggleQuestionnaireStarred = () => {
  const [toggleQuestionnaireStarred] = useMutation(
    TOGGLE_QUESTIONNAIRE_STARRED_MUTATION
  );

  return (questionnaireId) =>
    toggleQuestionnaireStarred({
      variables: {
        input: {
          questionnaireId,
        },
      },
    });
};

export default useToggleQuestionnaireStarred;

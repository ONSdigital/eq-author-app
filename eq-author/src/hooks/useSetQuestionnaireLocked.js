import { useMutation } from "@apollo/react-hooks";

import SET_QUESTIONNAIRE_LOCKED_MUTATION from "graphql/setQuestionnaireLocked.graphql";

export const useSetQuestionnaireLocked = () => {
  const [setQuestionnaireLocked] = useMutation(
    SET_QUESTIONNAIRE_LOCKED_MUTATION
  );
  return (input) => setQuestionnaireLocked({ variables: { input } });
};

// useLockUnlockQuestionnaire :: void -> [ id -> void, id -> void ]
// Returns pair of functions: [ lockQuestionnaire, unlockQuestionnaire ]
export const useLockUnlockQuestionnaire = () => {
  const setQuestionnaireLocked = useSetQuestionnaireLocked();
  const wrapper = (id, locked) =>
    setQuestionnaireLocked({ questionnaireId: id, locked: locked });
  return [(id) => wrapper(id, true), (id) => wrapper(id, false)];
};

import { useLockUnlockQuestionnaire } from "hooks/useSetQuestionnaireLocked";
import { useConfirmationModal } from "components/modals/ConfirmationModal";
import { ReactComponent as LockIcon } from "assets/icon-locked.svg";
import { ReactComponent as UnlockIcon } from "assets/icon-unlocked.svg";

export const useQuestionnaireLockingModal = ({ id, locked }) => {
  const [lockQuestionnaire, unlockQuestionnaire] = useLockUnlockQuestionnaire();
  const operation = locked ? unlockQuestionnaire : lockQuestionnaire;

  return useConfirmationModal({
    action: () => operation(id),
    icon: locked ? UnlockIcon : LockIcon,
    title: `${locked ? "Unlock" : "Lock"} questionnaire`,
    message:
      "When locked any changes made to the questionnaire will not be saved.",
    confirmText: locked ? "Unlock" : "Lock",
  });
};

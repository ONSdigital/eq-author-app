import { useLockUnlockQuestionnaire } from "./useSetQuestionnaireLocked";
import { useMutation } from "@apollo/react-hooks";

jest.mock("@apollo/react-hooks", () => ({
  useMutation: jest.fn(),
}));

describe("useLockUnlockQuestionnaire", () => {
  it("should provide locking and unlocking wrapper functions", () => {
    const questionnaireId = "borris";
    const setQuestionnaireLocked = jest.fn();
    useMutation.mockImplementation(() => [setQuestionnaireLocked]);

    const [
      lockQuestionnaire,
      unlockQuestionnaire,
    ] = useLockUnlockQuestionnaire();

    lockQuestionnaire(questionnaireId);

    expect(setQuestionnaireLocked).toHaveBeenCalledWith({
      variables: { input: { questionnaireId, locked: true } },
    });

    unlockQuestionnaire(questionnaireId);

    expect(setQuestionnaireLocked).toHaveBeenCalledWith({
      variables: { input: { questionnaireId, locked: false } },
    });
  });
});
